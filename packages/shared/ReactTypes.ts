// 定义React元素的基本类型

// 'any' 类型表示可以是任何值,但通常应避免过度使用,因为它会失去TypeScript的类型检查优势
export type Type = any;
export type Key = any;
export type Props = any;
export type Ref = any;
export type ElementType = any;

// 使用 interface 定义对象的结构,这是TypeScript中描述对象形状的常用方式
export interface ReactElementType {
    // '$$typeof' 是React用于内部标识元素类型的属性
    $$typeof: symbol | number; // 使用联合类型,表示可以是symbol或number

    key: Key; // 元素的唯一标识符
    props: Props; // 元素的属性
    ref: Ref; // 引用,用于访问DOM节点或React元素
    type: ElementType; // 指定元素的类型(如'div', 'span'等)

    __mark: string; // 可能用于内部标记或调试
}
