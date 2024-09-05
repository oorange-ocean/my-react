import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import replace from "@rollup/plugin-replace";
import { resolvePkgPath } from "../rollup/utils";
import path from "path";

// Vite 配置文件
// Vite 是一个现代前端构建工具，它利用 ES 模块的特性来提供快速的开发体验
export default defineConfig({
    // 插件配置
    // 插件是 Vite 的核心特性之一，用于扩展 Vite 的功能
    plugins: [
        // React 插件：用于处理 JSX 和提供 React 特定的优化
        react(),
        // replace 插件：用于在构建过程中替换代码中的变量
        // 这里设置 __DEV__ 为 true，通常用于条件编译
        replace({ __DEV__: true, preventAssignment: true }),
    ],
    // 解析配置
    resolve: {
        // 别名配置：用于简化导入路径
        // 在前端开发中，别名可以帮助我们避免复杂的相对路径
        alias: [
            {
                // 将 'react' 导入重定向到本地实现
                find: "react",
                replacement: resolvePkgPath("react"),
            },
            {
                // 将 'react-dom' 导入重定向到本地实现
                find: "react-dom",
                replacement: resolvePkgPath("react-dom"),
            },
            {
                // 配置 'hostConfig' 的路径
                // hostConfig 通常包含平台特定的渲染逻辑
                find: "hostConfig",
                replacement: path.resolve(
                    resolvePkgPath("react-dom"),
                    "./src/hostConfig.ts"
                ),
            },
        ],
    },
});
