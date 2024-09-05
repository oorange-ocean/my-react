// 导入 React 元素类型标识符
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
// 导入 React 元素相关的类型定义
import {
    Type,
    Ref,
    Key,
    Props,
    ReactElementType,
    ElementType,
} from "shared/ReactTypes";

/**
 * 创建 React 元素的函数
 * @param type 元素的类型（如 div、span 或自定义组件）
 * @param key 用于列表渲染的唯一标识符
 * @param ref 引用对象
 * @param props 元素的属性
 * @returns ReactElementType 返回创建的 React 元素对象
 */
// 注意：这个 ReactElement 函数是 React 内部用来创建元素的基础方法。
// 当我们在 JSX 中写组件时，它们最终会被转换成对这个函数的调用。
// 这个实现简化了 React 的内部工作原理，用于创建可以被 React 识别和处理的元素结构。
const ReactElement = function (
    type: Type,
    key: Key,
    ref: Ref,
    props: Props
): ReactElementType {
    // 创建 React 元素对象
    const element = {
        // $$typeof 用于标识这是一个 React 元素
        // 使用 $$ 前缀表示这是一个特殊的内部属性
        $$typeof: REACT_ELEMENT_TYPE,
        // type 使用对象字面量的简写语法，等同于 type: type
        type,
        key,
        ref,
        props,
        // 自定义标记，可能用于调试或特殊用途
        __mark: "gary",
    };
    // 返回创建的 React 元素对象
    return element;
};

// jsx 函数用于创建 React 元素这个 jsx 函数是 React 的核心部分
//它负责将 JSX 语法转换为 React 元素。它处理了属性的提取、子元素的处理
//并最终调用 ReactElement 函数创建 React 元素。
//这个实现展示了 React 如何在内部处理 JSX 转换,是理解 React 工作原理的重要部分。
export const jsx = (type: ElementType, config: any, ...children: any) => {
    // 初始化 key 和 ref
    let key: Key = null;
    let ref: Ref = null;
    // 创建一个空的 props 对象
    const props: Props = {};

    // 遍历 config 对象的所有属性
    for (const prop in config) {
        const val = config[prop];
        // 特殊处理 key 属性
        if (prop === "key") {
            if (val !== undefined) {
                // 将 key 转换为字符串
                key = "" + val;
            }
            continue; // 跳过后续处理
        }
        // 特殊处理 ref 属性
        if (prop === "ref") {
            if (val !== undefined) {
                ref = val;
            }
            continue; // 跳过后续处理
        }
        // 检查属性是否直接属于 config 对象（非原型链上的属性）
        if ({}.hasOwnProperty.call(config, prop)) {
            // 将属性添加到 props 对象
            props[prop] = val;
        }
    }

    // 处理子元素
    const childrenLength = children.length;
    if (childrenLength) {
        if (childrenLength === 1) {
            // 如果只有一个子元素,直接赋值
            props.children = children[0];
        } else {
            // 如果有多个子元素,将它们作为数组赋值
            props.children = children;
        }
    }

    // 调用 ReactElement 函数创建 React 元素
    return ReactElement(type, key, ref, props);
};

export const jsxDEV = (type: ElementType, config: any) => {
    let key: Key = null;
    let ref: Ref = null;
    const props: Props = {};
    for (const prop in config) {
        const val = config[prop];
        if (prop === "key") {
            if (val !== undefined) {
                key = "" + val;
            }
            continue;
        }
        if (prop === "ref") {
            if (val !== undefined) {
                ref = val;
            }
            continue;
        }
        if ({}.hasOwnProperty.call(config, prop)) {
            props[prop] = val;
        }
    }
    return ReactElement(type, key, ref, props);
};
