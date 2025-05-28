import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { viteMockServe } from "vite-plugin-mock";
import viteSvgIcons from "vite-plugin-svg-icons";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { loadEnv } from "vite";
import viteCompression from "vite-plugin-compression";
import {
  createStyleImportPlugin,
  VxeTableResolve,
} from "vite-plugin-style-import";

const Timestamp = new Date().getTime(); //随机时间戳

export default (env) => {
  const systemEnv = loadEnv(env.mode, process.cwd());
  console.log(systemEnv);
  const http = systemEnv.VITE_BASE_URL;

  return defineConfig({
    // define: { __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false" },
    transpileDependencies: true,
    define: {
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    plugins: [
      vue(),
      createStyleImportPlugin({
        resolves: [VxeTableResolve()],
      }),
      //添加jsx/tsx支持
      vueJsx({}),
      viteMockServe({
        ignore: /^_/, // 忽略以下划线`_`开头的文件
        mockPath: "mock", // 指定mock目录中的文件全部是mock接口
        supportTs: false, // mockPath目录中的文件是否支持ts文件，现在我们不使用ts，所以设为false
        localEnabled: env.mode === "mock", // 开发环境是否开启mock功能（可以在package.json的启动命令中指定mode为mock）
        prodEnabled: env.mode === "mock", // 生产环境是否开启mock功能
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';
          setupProdMockServer();
        `,
      }),
      viteSvgIcons({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(__dirname, "src/assets/svg")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
      viteCompression({
        verbose: true,
        disable: false,
        deleteOriginFile: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      }),
    ],
    optimizeDeps: {
      include: [
        "quill",
        "@/core/components/VForm/lib/vuedraggable/dist/vuedraggable.umd.js",
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 全局变量
          // element-plus升级到v2需要改成以下写法
          additionalData: `@use "./src/assets/style/global-variables.scss" as *;`,
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        extensions: [".js", ".vue", ".json", ".ts"], // 使用路径别名时想要省略的后缀名
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
        //解决antv-x6vue组件问题
        "@antv/x6": "@antv/x6/lib",
        "@antv/x6-vue-shape": "@antv/x6-vue-shape",
      },
    },

    server: {
      host: "0.0.0.0",
      port: 3003,
      open: true,
      proxy: {
        "/api": {
          target: http, // 后端接口的域名--服务器
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/static": {
          target: http,
          ws: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/static/, "/static"),
        },

        "/ureport": {
          target: http,
          ws: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ureport/, "/ureport"),
        },
        "/project": {
          target: http,
          ws: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/project/, "/project"),
        },
        "/tool": {
          target: http,
          ws: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tool/, "/tool"),
        },
      },
    },
    esbuild: false,
    build: {
      minify: "terser",
      commonjsOptions: {
        exclude: [
          "utils/lib/vuedraggable/dist/vuedraggable.umd.js,", //引号前的逗号不能删，不知何故？？
        ],
        include: [],
      },
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 删除console
          drop_console: true,
        },
      },
      // 禁用该功能可能会提高大型项目的构建性能
      brotliSize: false,
      rollupOptions: {
        output: {
          entryFileNames: `assets/js/[name].[hash].${Timestamp}.js`,
          assetFileNames: `assets/[ext]/[name].[hash].${Timestamp}.[ext]`,
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split("/")
              : [];
            const fileName =
              facadeModuleId[facadeModuleId.length - 2] || "[name]";
            return `assets/js/${fileName}/[name].[hash].${Timestamp}.js`;
          },
        },
      },
    },
  });
};
