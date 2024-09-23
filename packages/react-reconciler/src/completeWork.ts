// 生成更新计划，计算和收集更新 flags
import { FiberNode } from "./fiber";
import { HostRoot, FunctionComponent } from "./workTags";

function bubbleProperties(workInProgress: FiberNode) {}

export const completeWork = (workInProgress: FiberNode) => {
    const newProps = workInProgress.pendingProps;
    const current = workInProgress.alternate;
    switch (workInProgress.tag) {
        case HostRoot:
        case FunctionComponent:
            bubbleProperties(workInProgress);
            return null;
    }
};
