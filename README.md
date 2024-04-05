# typeme

Attach typing effect to any `Node`! (Based on [`Node.textContent`](https://developer.mozilla.org/docs/Web/API/Node/textContent))

```ts
import withNode from "./dist/index.mjs";

const stop = withNode(document.querySelector("#target"))
    .wait(500)
    .text("Hello...")
    .wait(1000)
    .text("Hello, world!")
    .wait(500)
    .text("你好，世界！")
    .start(Infinity);
```
