export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface Chain {
    text: (text: string) => Chain;
    wait: (ms: number) => Chain;
    /**
     * await for any callback
     */
    then: (callback: () => unknown | Promise<unknown>) => Chain;
    /**
     * start type effect by `n` time(s), returns a function to stop
     *
     * @param n by default `1`, set to `Infinity` to loop forever
     */
    start: (n?: number) => VoidFunction;
}

export function withNode(node: Node) {
    const ops: Array<() => unknown | Promise<unknown>> = [];
    let isStopped = false;
    let repeatTimes = 1;

    const start = (n = 1) => {
        repeatTimes = n;
        requestAnimationFrame(async () => {
            const loop = async () => {
                if (--repeatTimes < 0) return;
                for (const op of ops) if (!isStopped) await op();
                if (!isStopped) if (repeatTimes > 0) await loop();
            };
            await loop();
        });
        const stop = () => {
            isStopped = true;
        };
        return stop;
    };

    const chain: Chain = {
        text: (text: string) => {
            ops.push(async () => {
                await edit(node, text);
            });
            return chain;
        },
        wait: (ms: number) => {
            ops.push(() => sleep(ms));
            return chain;
        },
        then: (callback: () => unknown | Promise<unknown>) => {
            ops.push(callback);
            return chain;
        },
        start,
    };
    return chain;
}

export { withNode as default };

/**
 * Based on camwiegert's [typical](https://github.com/camwiegert/typical) library
 *
 * MIT LICENSE
 */
export async function edit(node: Node, next: string, speed = 60) {
    const curr = node.textContent || "";
    const overlap = getOverlap(curr, next);

    for (const textContent of [...deleter(curr, overlap), ...writer(next, overlap)]) {
        requestAnimationFrame(() => (node.textContent = textContent)); // this is unstoppable for now
        await sleep(speed + speed * (Math.random() - 0.5)); // sleep for single char type
    }
}

export function* writer([...text]: string, startIndex = 0, endIndex = text.length) {
    while (startIndex < endIndex) {
        yield text.slice(0, ++startIndex).join("");
    }
}

export function* deleter([...text]: string, startIndex = 0, endIndex = text.length) {
    while (endIndex > startIndex) {
        yield text.slice(0, --endIndex).join("");
    }
}

export function getOverlap([...start]: string, [...end]: string) {
    start.push("\0");
    return start.findIndex((char, i) => end[i] !== char);
}
