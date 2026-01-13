import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  root: "./client",
  plugins: [react()],
  server: {
    host: true,
    port: 5173, // explicitly set port
    // add routes here!!
    proxy:  {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
    },
  },
}
});
