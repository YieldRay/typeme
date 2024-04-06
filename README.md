# typing-node

[![npm](https://img.shields.io/npm/v/typing-node)](https://www.npmjs.com/package/typing-node)
[![install size](https://packagephobia.com/badge?p=typing-node)](https://packagephobia.com/result?p=typing-node)

Attach typing effect to any `Node`! (Based on [`Node.textContent`](https://developer.mozilla.org/docs/Web/API/Node/textContent))

```ts
import { withNode } from "typing-node";

const stop = withNode(document.querySelector("#target"))
    .wait(500)
    .text("Hello...")
    .wait(1000)
    .text("Hello, world!")
    .wait(500)
    .text("你好，世界！")
    .start(Infinity);
```
