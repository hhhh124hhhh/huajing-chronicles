/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_PROVIDER: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_ERNIE_API_KEY: string;
  readonly VITE_QWEN_API_KEY: string;
  readonly VITE_DOUBAO_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
