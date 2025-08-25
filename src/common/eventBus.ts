// eventBus.ts
import { Subject } from 'rxjs';

// 1️⃣ 创建一个泛型事件总线（可传入任何类型的事件数据）
const eventBus$ = new Subject<{ type: string; payload?: any }>();

// 2️⃣ 发送事件
export const emitEvent = (type: string, payload?: any) => {
  eventBus$.next({ type, payload });
};

// 3️⃣ 订阅事件（按事件类型过滤）
export const onEvent = (type: string, callback: (payload: any) => void) => {
  const sub = eventBus$.subscribe(event => {
    if (event.type === type) {
      callback(event.payload);
    }
  });
  return sub; // 调用方负责 unsubscribe
};
