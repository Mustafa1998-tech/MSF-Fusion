export interface User {
  id: number;
  name: string;
}

export function greet(user: User): string {
  return `Hello ${user.name}`;
}

// Deliberate type errors so the probe can prove semantic diagnostics work.
export const brokenString: string = 42;
export const brokenNumber: number = greet({ id: 1, name: "Ada" });
