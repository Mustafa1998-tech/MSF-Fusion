export const DEV_SCAFFOLD = true;

/**
 * Dev tooling scaffold (Milestone 1). CLI/dev-server/HMR integration will be
 * implemented after compiler and runtime foundations land.
 */
export function getDevStatus(): { ready: boolean; message: string } {
  return {
    ready: false,
    message:
      "MSF dev tooling is not implemented yet. Runtime/kernel work is in progress.",
  };
}
