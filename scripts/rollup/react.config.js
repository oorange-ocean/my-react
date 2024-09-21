// scripts/rollup/react.config.js
//这个配置文件定义了如何使用 Rollup 构建 React 库。
//它包括两个主要部分:一个用于构建主 React 包,另一个用于构建 JSX 运行时。
//配置文件利用了多个 Rollup 特性和插件来自定义构建过程,确保输出的包可以在各种环境中使用。

import { getPackageJSON, resolvePkgPath, getBaseRollupPlugins } from "./utils";
import generatePackageJson from "rollup-plugin-generate-package-json";

// 获取 react 包的 package.json 信息
const { name, module } = getPackageJSON("react");
// react 包的路径
const pkgPath = resolvePkgPath(name);
// react 包的产物路径
const pkgDistPath = resolvePkgPath(name, true);

// 导出 Rollup 配置数组
export default [
    // react 包的配置
    {
        // Rollup 的 input 选项指定入口文件
        input: `${pkgPath}/${module}`,
        output: {
            // output.file 指定输出文件路径
            file: `${pkgDistPath}/index.js`,
            // output.name 指定 UMD 模块的名称
            name: "React",
            // output.format 指定输出格式,UMD 可以在多种环境中使用
            format: "umd",
        },
        plugins: [
            ...getBaseRollupPlugins(),
            //Rollup 插件用于扩展构建过程
            generatePackageJson({
                inputFolder: pkgPath,
                outputFolder: pkgDistPath,
                baseContents: ({ name, description, version }) => ({
                    name,
                    description,
                    version,
                    //main 字段指定包的主入口文件
                    main: "index.js",
                }),
            }),
        ],
    },
    // jsx-runtime 配置
    {
        // 使用相对路径指定 TypeScript 文件
        input: `${pkgPath}/src/jsx.ts`,
        output: [
            // jsx-runtime
            {
                file: `${pkgDistPath}/jsx-runtime.js`,
                name: "jsx-runtime",
                format: "umd",
            },
            // jsx-dev-runtime
            {
                file: `${pkgDistPath}/jsx-dev-runtime.js`,
                name: "jsx-dev-runtime",
                format: "umd",
            },
        ],
        //复用基础插件配置
        plugins: getBaseRollupPlugins(),
    },
];
