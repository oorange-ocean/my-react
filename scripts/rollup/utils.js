// scripts/rollup/utils.js
import path from "path"; // Node.js 的路径处理模块
import fs from "fs"; // Node.js 的文件系统模块
import ts from "rollup-plugin-typescript2"; // TypeScript 编译插件
import cjs from "@rollup/plugin-commonjs"; // CommonJS 转换插件

// 知识点: path.resolve() 方法用于解析绝对路径
// __dirname 是 Node.js 中表示当前脚本所在目录的变量
const pkgPath = path.resolve(__dirname, "../../packages");
const distPath = path.resolve(__dirname, "../../dist/node_modules");

// 解析包路径的函数
export function resolvePkgPath(pkgName, isDist) {
    // 知识点: 模板字符串用于字符串插值
    if (isDist) {
        return `${distPath}/${pkgName}`;
    }
    return `${pkgPath}/${pkgName}`;
}

// 获取 package.json 内容的函数
export function getPackageJSON(pkgName) {
    const path = `${resolvePkgPath(pkgName)}/package.json`;
    // 知识点: fs.readFileSync() 用于同步读取文件内容
    const str = fs.readFileSync(path, { encoding: "utf-8" });
    // 知识点: JSON.parse() 用于将 JSON 字符串转换为 JavaScript 对象
    return JSON.parse(str);
}

// 获取基础 Rollup 插件的函数
export function getBaseRollupPlugins({ typescript = {} } = {}) {
    // cjs() 是 CommonJS 转换插件。
    //ts(typescript) 是TypeScript编译插件,使用传入的或默认的配置。
    return [cjs(), ts(typescript)];
}

// 补充知识:
// 1. Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。
// 2. CommonJS 是 Node.js 使用的模块系统,而 ES 模块是 ECMAScript 标准的模块系统。
// 3. Rollup 插件可以扩展和自定义构建过程,如转换代码、引入依赖等。
// 4. package.json 文件包含了项目的元数据,如名称、版本、依赖等。
// 5. 解构赋值是 ES6 的特性,允许从数组或对象中提取值,赋给独立的变量。
