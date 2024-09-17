这个项目的 reconciler 实现是 React 的核心部分，它负责协调虚拟 DOM 和实际 DOM 之间的差异。

1. Fiber 结构：
   reconciler 的核心是 Fiber 结构，定义在 `fiber.ts` 文件中。每个 Fiber 节点代表一个组件或 DOM 元素。

```6:45:packages/react-reconciler/src/fiber.ts
export class FiberNode {
    tag: WorkTag;
    key: Key;
    stateNode: any;
    type: any;
    return: FiberNode | null;
    sibling: FiberNode | null;
    child: FiberNode | null;
    index: number;
    ref: Ref;
    pendingProps: Props;
    memorizedProps: Props | null;
    memorizedState: any;
    alternate: FiberNode | null;
    flag: Flags;
    updateQueue: unknown;

    constructor(tag: WorkTag, pendingProps: Props, key: Key) {
        // 类型
        this.tag = tag;
        this.key = key;
        this.ref = null;
        this.stateNode = null; // 节点对应的实际 DOM 节点或组件实例
        this.type = null; // 节点的类型，可以是原生 DOM 元素、函数组件或类组件等

        // 构成树状结构
        this.return = null; // 指向节点的父节点
        this.sibling = null; // 指向节点的下一个兄弟节点
        this.child = null; // 指向节点的第一个子节点
        this.index = 0; // 索引

        // 作为工作单元
        this.pendingProps = pendingProps; // 表示节点的新属性，用于在协调过程中进行更新
        this.memorizedProps = null; // 已经更新完的属性
        this.memorizedState = null; // 更新完成后新的 State
        this.updateQueue = null; // 更新计划队列
        this.alternate = null; // 指向节点的备份节点，用于在协调过程中进行比较
        this.flag = NoFlags; // 表示节点的副作用类型，如更新、插入、删除等
    }
}
```

这个结构包含了节点的类型、属性、状态、子节点、兄弟节点等信息，是构建 Fiber 树的基础。

2. 工作循环：
   `workLoop.ts` 文件定义了 reconciler 的主要工作流程：

```47:51:packages/react-reconciler/src/workLoop.ts
function workLoop() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }
}
```

这个循环会遍历 Fiber 树，对每个节点执行工作单元。

3. 工作单元：
   每个工作单元的处理在 `performUnitOfWork` 函数中：

```53:65:packages/react-reconciler/src/workLoop.ts
function performUnitOfWork(fiber: FiberNode) {
    // 比较并返回子 FiberNode
    const next = beginWork(fiber);
    fiber.memorizedProps = fiber.pendingProps;

    if (next == null) {
        // 没有子节点，则遍历兄弟节点或父节点
        completeUnitOfWork(fiber);
    } else {
        // 有子节点，继续向下深度遍历
        workInProgress = next;
    }
}
```

这个函数首先调用 `beginWork` 处理当前节点，然后决定是继续处理子节点还是完成当前节点的工作。

4. beginWork：
   `beginWork` 函数定义在 `beginWork.ts` 文件中，它根据节点类型执行不同的更新逻辑：

```8:22:packages/react-reconciler/src/beginWork.ts
export const beginWork = (workInProgress: FiberNode) => {
    switch (workInProgress.tag) {
        case HostRoot:
            return updateHostRoot(workInProgress);
        case HostComponent:
            return updateHostComponent(workInProgress);
        case HostText:
            return updateHostText();
        default:
            if (__DEV__) {
                console.warn("beginWork 未实现的类型", workInProgress.tag);
            }
            break;
    }
};
```

5. 子节点协调：
   子节点的协调过程在 `childFiber.ts` 文件中定义：

```7:82:packages/react-reconciler/src/childFiber.ts
function ChildReconciler(shouldTrackSideEffects: boolean) {
    function reconcileSingleElement(
        returnFiber: FiberNode,
        currentFiber: FiberNode | null,
        element: ReactElementType
    ) {
        const fiber = createFiberFromElement(element);
        fiber.return = returnFiber;
        return fiber;
    }

    function reconcileSingleTextNode(
        returnFiber: FiberNode,
        currentFiber: FiberNode | null,
        content: string | number
    ) {
        const fiber = new FiberNode(HostText, { content }, null);
        fiber.return = returnFiber;
        return fiber;
    }

    function placeSingleChild(fiber: FiberNode) {
        // 首屏渲染且追踪副作用时，才添加标记
        if (shouldTrackSideEffects && fiber.alternate == null) {
            fiber.flag |= Placement;
        }
        return fiber;
    }

    // 闭包，根绝 shouldTrackSideEffects 返回不同 reconcileChildFibers 的实现
    return function reconcileChildFibers(
        returnFiber: FiberNode,
        currentFiber: FiberNode | null,
        newChild?: ReactElementType
    ) {
        // 判断当前 fiber 的类型
        // 单个 Fragment 节点
        if (typeof newChild == "object" && newChild !== null) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return placeSingleChild(
                        reconcileSingleElement(
                            returnFiber,
                            currentFiber,
                            newChild
                        )
                    );

                default:
                    if (__DEV__) {
                        console.warn("未实现的 reconcile 类型", newChild);
                    }
                    break;
            }
        }

        // 多个 Fragment 节点
        if (Array.isArray(newChild)) {
            // TODO: 暂时不处理
            if (__DEV__) {
                console.warn("未实现的 reconcile 类型", newChild);
            }
        }

        // 文本节点
        if (typeof newChild == "string" || typeof newChild == "number") {
            return placeSingleChild(
                reconcileSingleTextNode(returnFiber, currentFiber, newChild)
            );
        }

        if (__DEV__) {
            console.warn("未实现的 reconcile 类型", newChild);
        }
        return null;
    };
```

这个过程会比较新旧子节点，决定如何更新 DOM。

6. 完成工作：
   当一个节点的所有子节点都处理完毕后，会调用 `completeUnitOfWork` 函数：

```68:82:packages/react-reconciler/src/workLoop.ts
function completeUnitOfWork(fiber: FiberNode) {
    let node: FiberNode | null = fiber;
    do {
        completeWork(node);
        // 有兄弟节点，则遍历兄弟节点
        const sibling = node.sibling;
        if (sibling !== null) {
            workInProgress = sibling;
            return;
        }
        // 否则向上返回，遍历父节点
        node = node.return;
        workInProgress = node;
    } while (node !== null);
}
```

这个函数会调用 `completeWork` 处理当前节点，然后决定是处理兄弟节点还是返回父节点。

7. 更新队列：
   更新的管理通过 `updateQueue.ts` 中的结构实现：

```10:15:packages/react-reconciler/src/updateQueue.ts
// 定义 UpdateQueue 数据结构
export interface UpdateQueue<State> {
    shared: {
        pending: Update<State> | null;
    };
}
```

这个队列存储了待处理的更新，并在适当的时候进行处理。

8. 调度更新：
   更新的调度通过 `scheduleUpdateOnFiber` 函数实现：

```9:12:packages/react-reconciler/src/workLoop.ts
export function scheduleUpdateOnFiber(fiber: FiberNode) {
    const root = markUpdateFromFiberToRoot(fiber);
    renderRoot(root);
}
```

这个函数会触发整个更新过程。

总的来说，这个 reconciler 实现了一个基本的 Fiber 架构，包括工作循环、任务分割、更新调度等核心功能。它能够处理基本的组件渲染和更新，但相比完整的 React 实现，还缺少一些高级特性，如优先级调度、并发模式等。这个实现为理解 React 的核心工作原理提供了一个很好的起点。
