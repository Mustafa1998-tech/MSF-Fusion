export interface FeatureReport {
  exportCount: number;
  features: Record<string, string>;
}

export interface TypeScriptApiReport {
  available: boolean;
  error: string | null;
  projects: number;
  sourceFiles: number;
  semanticDiagnostics: number;
  diagnosticElapsedMs: number | null;
  notes: string[];
}

export interface OxcVariantReport {
  name: string;
  fatal: boolean;
  errorCount: number;
  codeBytes: number;
  sourceMap: boolean;
  codeSample: string;
  checks: Record<string, boolean>;
  elapsedMs: number;
}

export interface ToolchainProbeResult {
  schemaVersion: 1;
  generatedAt: string;
  environment: {
    node: string;
    platform: string;
    arch: string;
    os: string;
  };
  typescript: {
    version: string;
    rootExports: string[];
    unstable: Record<string, FeatureReport>;
    scanner: {
      tokenCount: number;
      tokens: string[];
      endOfFileConstantDefined: boolean;
    };
    api: TypeScriptApiReport;
  };
  oxc: {
    bindingTarget: string;
    variants: OxcVariantReport[];
  };
  notes: string[];
}
