/*
 * MSF Fusion reactive runtime kernel (Milestone 1).
 *
 * Real implementation of a fine-grained reactive graph with:
 * - signals (state), memos/computeds (derived), effects (side effects)
 * - deterministic ownership/disposal
 * - synchronous propagation with explicit batching
 * - dynamic dependency tracking and cleanup
 *
 * This is framework-owned code (no third-party reactive runtime dependency).
 */

export type Accessor<T> = () => T;
export type Setter<T> = (value: T | ((prev: T) => T)) => T;
export type Dispose = () => void;

type Equals<T> = (prev: T, next: T) => boolean;

const STATE_CLEAN = 0;
const STATE_CHECK = 1; // may be stale (upstream memo might not have changed)
const STATE_DIRTY = 2;

interface ReactiveNode {
  // computation fields
  fn: (() => unknown) | null;
  sources: ReactiveNode[] | null;
  sourceSlots: number[] | null;
  owned: ReactiveNode[] | null;
  cleanups: Array<() => void> | null;
  owner: ReactiveNode | null;
  state: number;
  disposed: boolean;
  running: boolean;
  // memo/signal-as-source fields
  value: unknown;
  observers: ReactiveNode[] | null;
  observerSlots: number[] | null;
  // flags/options
  isEffect: boolean;
  isMemo: boolean;
  equals: Equals<unknown>;
}

let Owner: ReactiveNode | null = null;
let Listener: ReactiveNode | null = null;
let BatchDepth = 0;
let Effects: ReactiveNode[] = [];
let NotifiedEffects = false;

function defaultEquals(a: unknown, b: unknown): boolean {
  return Object.is(a, b);
}

function createNode(
  fn: (() => unknown) | null,
  flags: Partial<Pick<ReactiveNode, "isEffect" | "isMemo" | "value" | "equals">>,
): ReactiveNode {
  const node: ReactiveNode = {
    fn,
    sources: null,
    sourceSlots: null,
    owned: null,
    cleanups: null,
    owner: Owner,
    state: STATE_CLEAN,
    disposed: false,
    running: false,
    value: flags.value,
    observers: flags.isMemo ? [] : null,
    observerSlots: flags.isMemo ? [] : null,
    isEffect: flags.isEffect ?? false,
    isMemo: flags.isMemo ?? false,
    equals: flags.equals ?? defaultEquals,
  };
  if (Owner) {
    (Owner.owned ??= []).push(node);
  }
  return node;
}

function runCleanups(node: ReactiveNode): void {
  const cleanups = node.cleanups;
  if (!cleanups) return;
  for (let i = cleanups.length - 1; i >= 0; i--) {
    try {
      cleanups[i]!();
    } catch (err) {
      handleError(node, err);
    }
  }
  node.cleanups = null;
}

function cleanupSources(node: ReactiveNode, fromIndex = 0): void {
  const sources = node.sources;
  const sourceSlots = node.sourceSlots;
  if (!sources || !sourceSlots) return;
  for (let i = fromIndex; i < sources.length; i++) {
    const source = sources[i]!;
    const slot = sourceSlots[i]!;
    const observers = source.observers;
    const observerSlots = source.observerSlots;
    if (!observers || !observerSlots) continue;
    const last = observers.length - 1;
    if (slot < last) {
      const lastObserver = observers[last]!;
    const lastObserverSlot = observerSlots[last]!;
      observers[slot] = lastObserver;
      observerSlots[slot] = lastObserverSlot;
      if (lastObserver.sourceSlots) {
        lastObserver.sourceSlots[lastObserverSlot] = slot;
      }
    }
    observers.pop();
    observerSlots.pop();
  }
  if (fromIndex === 0) {
    node.sources = null;
    node.sourceSlots = null;
  } else {
    sources.length = fromIndex;
    sourceSlots.length = fromIndex;
  }
}

function disposeNode(node: ReactiveNode): void {
  if (node.disposed) return;
  node.disposed = true;

  if (node.owned) {
    for (let i = node.owned.length - 1; i >= 0; i--) {
      disposeNode(node.owned[i]!);
    }
    node.owned = null;
  }
  runCleanups(node);
  cleanupSources(node);
  node.fn = null;
  node.observers = null;
  node.observerSlots = null;

  if (node.owner?.owned) {
    const idx = node.owner.owned.indexOf(node);
    if (idx >= 0) node.owner.owned.splice(idx, 1);
  }
  node.owner = null;
}

function readSignal(node: ReactiveNode): void {
  if (!Listener || Listener.disposed) return;
  // track
  const sources = Listener.sources;
  const len = sources ? sources.length : 0;
  // de-dupe consecutive read in same run
  if (sources && len > 0 && sources[len - 1] === node) return;
  const sIndex = node.observers ? node.observers.length : 0;
  if (!node.observers) node.observers = [];
  if (!node.observerSlots) node.observerSlots = [];
  node.observers.push(Listener);
  node.observerSlots.push(len);
  if (!Listener.sources || !Listener.sourceSlots) {
    Listener.sources = [node];
    Listener.sourceSlots = [sIndex];
  } else {
    Listener.sources.push(node);
    Listener.sourceSlots.push(sIndex);
  }
}

function writeSignal(node: ReactiveNode, value: unknown): void {
  if (node.equals(node.value, value)) return;
  node.value = value;
  const observers = node.observers;
  if (!observers || observers.length === 0) return;

  for (let i = 0; i < observers.length; i++) {
    const obs = observers[i]!;
    if (obs.disposed) continue;
    if (obs.state === STATE_CLEAN) {
      if (obs.isEffect) scheduleEffect(obs);
      // mark downstream of memos as CHECK so they can be pulled if needed;
      // but to be safe/correct for effects depending on memos, mark DIRTY? actually mark DIRTY for direct observers.
      obs.state = STATE_DIRTY;
      markDownstream(obs);
    } else if (obs.state === STATE_CHECK) {
      obs.state = STATE_DIRTY;
    }
  }
  if (BatchDepth === 0) runEffects();
}

function markDownstream(node: ReactiveNode): void {
  const observers = node.observers;
  if (!observers) return;
  for (let i = 0; i < observers.length; i++) {
    const obs = observers[i]!;
    if (obs.disposed) continue;
    if (obs.state === STATE_CLEAN) {
      obs.state = STATE_CHECK;
      if (obs.isEffect) scheduleEffect(obs);
      markDownstream(obs);
    }
    // if already CHECK or DIRTY, no need to propagate further in that form
  }
}

function scheduleEffect(node: ReactiveNode): void {
  Effects.push(node);
}

function runEffects(): void {
  if (NotifiedEffects) return;
  NotifiedEffects = true;
  try {
    while (Effects.length > 0) {
      const queue = Effects;
      Effects = [];
      for (let i = 0; i < queue.length; i++) {
        const e = queue[i]!;
        if (!e.disposed && e.isEffect) {
          updateIfNecessary(e);
        }
      }
    }
  } finally {
    NotifiedEffects = false;
  }
}

function updateIfNecessary(node: ReactiveNode): void {
  if (node.disposed) return;
  if (node.state === STATE_CLEAN) return;

  if (node.state === STATE_CHECK) {
    // verify upstream memos
    const sources = node.sources;
    if (sources) {
      for (let i = 0; i < sources.length; i++) {
        const src = sources[i]!;
        if (src.isMemo) {
          updateIfNecessary(src);
          if ((node.state as number) === STATE_DIRTY) break;
        }
      }
    }
  }

  if (node.state === STATE_DIRTY) {
    execute(node);
  } else {
    node.state = STATE_CLEAN;
  }
}

function execute(node: ReactiveNode): void {
  if (node.disposed || !node.fn || node.running) return;

  // dispose owned children and cleanups, then reset sources
  if (node.owned) {
    for (let i = node.owned.length - 1; i >= 0; i--) disposeNode(node.owned[i]!);
    node.owned = null;
  }
  runCleanups(node);
  cleanupSources(node);

  const prevOwner = Owner;
  const prevListener = Listener;
  Owner = node;
  Listener = node;
  node.running = true;
  try {
    const nextValue = node.fn();
    if (node.isMemo) {
      const prevValue = node.value;
      node.value = nextValue;
      if (!node.equals(prevValue, nextValue) && node.observers && node.observers.length > 0) {
        // Memo value actually changed: promote downstream CHECK to DIRTY? they were marked CHECK on upstream write;
        // but to ensure dependents update, mark observers dirty.
        for (let i = 0; i < node.observers.length; i++) {
          const obs = node.observers[i]!;
          if (obs.state === STATE_CHECK) obs.state = STATE_DIRTY;
          else if (obs.state === STATE_CLEAN) {
            obs.state = STATE_DIRTY;
            if (obs.isEffect) scheduleEffect(obs);
          }
        }
      }
    }
  } catch (err) {
    handleError(node, err);
  } finally {
    node.running = false;
    Listener = prevListener;
    Owner = prevOwner;
    node.state = STATE_CLEAN;
  }
}

function handleError(_node: ReactiveNode, err: unknown): never {
  throw err;
}

export function createRoot<T>(fn: (dispose: Dispose) => T): T {
  const root = createNode(null, {});
  const dispose: Dispose = () => disposeNode(root);
  const prevOwner = Owner;
  const prevListener = Listener;
  Owner = root;
  Listener = null;
  try {
    return fn(dispose);
  } finally {
    Listener = prevListener;
    Owner = prevOwner;
  }
}

export interface SignalOptions<T> {
  equals?: Equals<T>;
}

export function createSignal<T>(
  initial: T,
  options?: SignalOptions<T>,
): [Accessor<T>, Setter<T>] {
  const node = createNode(null, {
    value: initial,
    equals: (options?.equals as Equals<unknown> | undefined) ?? defaultEquals,
  });
  node.observers = [];
  node.observerSlots = [];

  const read: Accessor<T> = () => {
    if (Listener) readSignal(node);
    return node.value as T;
  };
  const write: Setter<T> = (next) => {
    const nextValue =
      typeof next === "function"
        ? (next as (prev: T) => T)(node.value as T)
        : next;
    writeSignal(node, nextValue);
    return nextValue;
  };
  return [read, write];
}

export interface MemoOptions<T> {
  equals?: Equals<T>;
}

export function createMemo<T>(fn: () => T, options?: MemoOptions<T>): Accessor<T> {
  const node = createNode(fn as () => unknown, {
    isMemo: true,
    equals: (options?.equals as Equals<unknown> | undefined) ?? defaultEquals,
  });
  node.state = STATE_DIRTY; // compute lazily on first read
  // first compute happens on demand; but we must be in owner context - it's fine.

  return () => {
    if (node.disposed) return node.value as T;
    if (Listener) readSignal(node);
    updateIfNecessary(node);
    return node.value as T;
  };
}

export function createEffect(fn: () => void | (() => void)): Dispose {
  const node = createNode(null, { isEffect: true });
  node.fn = () => {
    const cleanup = fn();
    if (typeof cleanup === "function") onCleanup(cleanup);
    return undefined;
  };
  // initial run
  execute(node);
  return () => disposeNode(node);
}

export function batch<T>(fn: () => T): T {
  if (BatchDepth > 0) return fn();
  BatchDepth++;
  try {
    return fn();
  } finally {
    BatchDepth--;
    if (BatchDepth === 0) runEffects();
  }
}

export function untrack<T>(fn: () => T): T {
  const prev = Listener;
  Listener = null;
  try {
    return fn();
  } finally {
    Listener = prev;
  }
}

export function onCleanup(fn: () => void): void {
  if (Owner) {
    (Owner.cleanups ??= []).push(fn);
  }
}

export function getOwner(): unknown {
  return Owner;
}

export function runWithOwner<T>(owner: unknown, fn: () => T): T {
  const prevOwner = Owner;
  const prevListener = Listener;
  Owner = owner as ReactiveNode | null;
  Listener = null;
  try {
    return fn();
  } finally {
    Listener = prevListener;
    Owner = prevOwner;
  }
}

// Test/advanced utility
export function flushSync(): void {
  if (BatchDepth === 0) runEffects();
}
