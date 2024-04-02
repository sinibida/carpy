// https://svelte.dev/repl/c6a402704224403f96a3db56c2f48dfc?version=4.2.9

import type { ActionReturn } from "svelte/action";

let resizeObserver: ResizeObserver;

function ensureResizeObserver() {
    if (resizeObserver) return;

  resizeObserver = new ResizeObserver(
        (entries) => {
            entries.forEach(entry => {
                const eventName = 'sizeChanged';
                entry.target.dispatchEvent(new CustomEvent(eventName));
            });
        }
    );
}

// https://svelte.dev/docs/svelte-action

type Attributes = {
    'on:sizeChanged'?: (e: CustomEvent<unknown>) => void;
}

export default function resize(element: HTMLElement): ActionReturn<undefined, Attributes> {
    ensureResizeObserver();

    resizeObserver.observe(element);

    return {
        destroy() {
            resizeObserver.unobserve(element);
        }
    }
}