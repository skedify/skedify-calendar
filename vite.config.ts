import reactRefresh from "@vitejs/plugin-react-refresh";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/skedify-calendar.tsx"),
      name: "SkedifyCalendar",
      formats: ["es"],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "uuid", "date-fns", "date-fns/locale", "tiny-invariant"],
    },
  },
  plugins: [tsconfigPaths(), reactRefresh()],
});
