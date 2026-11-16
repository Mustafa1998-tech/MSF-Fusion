/**
 * Shared contracts for MSF Fusion (Milestone 1 scaffolding).
 * Runtime/compiler packages must depend on stable interfaces, not each other's internals.
 */

export type Disposable = () => void;

export interface Diagnostic {
  code: string;
  message: string;
  file?: string;
  line?: number;
  column?: number;
}

export interface CompileRequest {
  filename: string;
  source: string;
}

export interface CompileResult {
  code: string;
  map?: unknown;
  diagnostics: Diagnostic[];
  meta?: Record<string, unknown>;
}

export const MSF_CONTRACTS_VERSION = "0.0.0-m1-dev" as const;
