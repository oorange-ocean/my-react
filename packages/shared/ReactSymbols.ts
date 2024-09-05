// packages/shared/ReactSymbols.ts
// 这段代码的主要目的是为 React 元素定义一个唯一的标识符。
//它优先使用 Symbol 以获得更好的唯一性和性能，但也为不支持 Symbol 的环境提供了一个后备方案。
//这种方法确保了 React 可以在各种 JavaScript 环境中正常工作。

// 检查环境是否支持 Symbol 和 Symbol.for
// typeof Symbol === "function" 检查 Symbol 是否可用
// Symbol.for 是一个用于创建共享符号的方法
const supportSymbol = typeof Symbol === "function" && Symbol.for;

// 定义 REACT_ELEMENT_TYPE 常量
// 这个常量用于标识 React 元素的类型
export const REACT_ELEMENT_TYPE = supportSymbol
    ? Symbol.for("react.element") // 如果支持 Symbol，使用 Symbol.for 创建一个唯一的共享符号
    : 0xeac7; // 如果不支持 Symbol，使用一个特定的数值作为后备方案

// 0xeac7 是一个十六进制数，等于十进制的 60103
// 这个数字被选作 React 元素类型的标识符，当环境不支持 Symbol 时使用
