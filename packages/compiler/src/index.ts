import type { CompileRequest, CompileResult } from "@msf/contracts";

/**
 * Compiler scaffold (Milestone 1). Real parsing/IR/codegen will be implemented
 * after the reactive runtime and supported syntax subset are stabilized.
 */
export function compile(_request: CompileRequest): CompileResult {
  return {
    code: "",
    diagnostics: [
      {
        code: "MSF_COMPILER_NOT_IMPLEMENTED",
        message:
          "MSF compiler subset is not implemented yet. This package is a Milestone 1 scaffold.",
      },
    ],
  };
}
