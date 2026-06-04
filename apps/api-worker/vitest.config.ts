import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@xiaohebao/contracts": fileURLToPath(
        new URL("../../packages/contracts/src/index.ts", import.meta.url)
      ),
      "@xiaohebao/domain": fileURLToPath(
        new URL("../../packages/domain/src/index.ts", import.meta.url)
      ),
      "@xiaohebao/ui-tokens": fileURLToPath(
        new URL("../../packages/ui-tokens/src/index.ts", import.meta.url)
      )
    }
  }
});
