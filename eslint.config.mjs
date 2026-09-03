import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // La regla set-state-in-effect de eslint-plugin-react-hooks v6 es
      // demasiado estricta y marca como error el patron estandar de cargar
      // datos asincronos en useEffect (setPage(1) al cambiar busqueda,
      // setLoading(true) al llamar cargarDatos(), etc). Desactivada para
      // permitir esos patrones legitimios que son comunes en esta app.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
