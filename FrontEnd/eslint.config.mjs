import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// ESLint 9 only reads flat config. eslint-config-next 16 ships flat configs directly,
// so they are spread in as-is — going through FlatCompat instead throws on a circular
// reference inside the react plugin. This file replaces the old .eslintrc.json, which
// ESLint 9 ignored outright, so `npm run lint` was erroring instead of linting.
const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // Flags `useEffect(() => setMounted(true), [])`, which is how Next.js documents
      // deferring client-only output until after hydration — without it the server and
      // client markup disagree. Kept visible as a warning rather than silenced, so a
      // genuine cascading-render bug still shows up in the output.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
