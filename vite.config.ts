import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Remove the tempo imports and configurations
export default defineConfig({
  base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx"],
  },
  plugins: [
    react()
  ] as any[],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // Binding server to all network interfaces
    port: parseInt(process.env.PORT) || 5173, // Use PORT from environment or default to 5173
  }
});
