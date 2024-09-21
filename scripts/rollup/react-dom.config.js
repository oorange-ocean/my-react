// scripts/rollup/react-dom.config.js
import { getPackageJSON, resolvePkgPath, getBaseRollupPlugins } from "./utils";
import generatePackageJson from "rollup-plugin-generate-package-json";
import alias from "@rollup/plugin-alias";

const { name, module, peerDependencies = {} } = getPackageJSON("react-dom");
// react-dom 包的路径
const pkgPath = resolvePkgPath(name);
// react-dom 包的产物路径
const pkgDistPath = resolvePkgPath(name, true);

console.log("react-dom package.json:", { name, module, peerDependencies });
console.log("pkgPath:", pkgPath);
console.log("pkgDistPath:", pkgDistPath);

if (!module) {
    throw new Error("module field is missing in react-dom's package.json");
}

export default [
    // react-dom
    {
        input: `${pkgPath}/${module}`,
        output: [
            {
                file: `${pkgDistPath}/index.js`,
                name: "ReactDOM",
                format: "umd",
            },
            {
                file: `${pkgDistPath}/client.js`,
                name: "client",
                format: "umd",
            },
        ],
        external: [...Object.keys(peerDependencies)],
        plugins: [
            ...getBaseRollupPlugins(),
            // webpack resolve alias
            alias({
                entries: {
                    hostConfig: `${pkgPath}/src/hostConfig.ts`,
                },
            }),
            generatePackageJson({
                inputFolder: pkgPath,
                outputFolder: pkgDistPath,
                baseContents: ({ name, description, version }) => ({
                    name,
                    description,
                    version,
                    peerDependencies: {
                        react: version,
                    },
                    main: "index.js",
                }),
            }),
        ],
    },
];
