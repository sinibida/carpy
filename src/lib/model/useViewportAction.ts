// https://svelte.dev/repl/c6a402704224403f96a3db56c2f48dfc?version=4.2.9

import type { ActionReturn } from "svelte/action";

let intersectionObserver: IntersectionObserver;

function ensureIntersectionObserver() {
    if (intersectionObserver) return;

  intersectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const eventName = entry.isIntersecting ? 'enterViewport' : 'exitViewport';
                entry.target.dispatchEvent(new CustomEvent(eventName));
            });
        }
    );
}

// https://svelte.dev/docs/svelte-action

type Attributes = {
    'on:enterViewport'?: (e: CustomEvent<unknown>) => void;
    'on:exitViewport'?: (e: CustomEvent<unknown>) => void;
}

export default function viewport(element: HTMLElement): ActionReturn<undefined, Attributes> {
    ensureIntersectionObserver();

    intersectionObserver.observe(element);

    return {
        destroy() {
            intersectionObserver.unobserve(element);
        }
    }
}