// vite.config.ts
import { defineConfig } from "file:///C:/UNIVERSIDAD/Quinto%20Semestre/Desarrollo%20Web%20Avanzado%2030716/AWD-30716-BYTECLUB/06Code/BiconoirsRestaurantFront/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/UNIVERSIDAD/Quinto%20Semestre/Desarrollo%20Web%20Avanzado%2030716/AWD-30716-BYTECLUB/06Code/BiconoirsRestaurantFront/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\UNIVERSIDAD\\Quinto Semestre\\Desarrollo Web Avanzado 30716\\AWD-30716-BYTECLUB\\06Code\\BiconoirsRestaurantFront";
var vite_config_default = defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@api": path.resolve(__vite_injected_original_dirname, "./src/api"),
      "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@stores": path.resolve(__vite_injected_original_dirname, "./src/stores"),
      "@utils": path.resolve(__vite_injected_original_dirname, "./src/utils"),
      "@types": path.resolve(__vite_injected_original_dirname, "./src/types"),
      "@config": path.resolve(__vite_injected_original_dirname, "./src/config")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVTklWRVJTSURBRFxcXFxRdWludG8gU2VtZXN0cmVcXFxcRGVzYXJyb2xsbyBXZWIgQXZhbnphZG8gMzA3MTZcXFxcQVdELTMwNzE2LUJZVEVDTFVCXFxcXDA2Q29kZVxcXFxCaWNvbm9pcnNSZXN0YXVyYW50RnJvbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVOSVZFUlNJREFEXFxcXFF1aW50byBTZW1lc3RyZVxcXFxEZXNhcnJvbGxvIFdlYiBBdmFuemFkbyAzMDcxNlxcXFxBV0QtMzA3MTYtQllURUNMVUJcXFxcMDZDb2RlXFxcXEJpY29ub2lyc1Jlc3RhdXJhbnRGcm9udFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVU5JVkVSU0lEQUQvUXVpbnRvJTIwU2VtZXN0cmUvRGVzYXJyb2xsbyUyMFdlYiUyMEF2YW56YWRvJTIwMzA3MTYvQVdELTMwNzE2LUJZVEVDTFVCLzA2Q29kZS9CaWNvbm9pcnNSZXN0YXVyYW50RnJvbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3Z1ZSgpXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDUxNzMsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICBzb3VyY2VtYXA6IHRydWVcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcbiAgICAgICdAYXBpJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2FwaScpLFxyXG4gICAgICAnQGNvbXBvbmVudHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9uZW50cycpLFxyXG4gICAgICAnQHN0b3Jlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zdG9yZXMnKSxcclxuICAgICAgJ0B1dGlscyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscycpLFxyXG4gICAgICAnQHR5cGVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3R5cGVzJyksXHJcbiAgICAgICdAY29uZmlnJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbmZpZycpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFoQixTQUFTLG9CQUFvQjtBQUNsakIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFDZixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNwQyxRQUFRLEtBQUssUUFBUSxrQ0FBVyxXQUFXO0FBQUEsTUFDM0MsZUFBZSxLQUFLLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsTUFDekQsV0FBVyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ2pELFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUMvQyxVQUFVLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDL0MsV0FBVyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLElBQ25EO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
