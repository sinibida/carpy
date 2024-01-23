import { writable, type Unsubscriber, get } from "svelte/store";

// Will use raw HTML (for content)
// TODO: need sanitizing
type ModalContent = {
    content: string,
    header: string,
    submitText?: string | number | undefined,
}

type ModalResultType = 'sumbitted' | 'closed'
type ModalResult = {
    type: ModalResultType,
    value: any,
}

export const currentModal = writable<ModalContent | null>(null)
export const modalResults = writable<ModalResult | null>(null)

export async function showModal(content: ModalContent): Promise<ModalResult> {
    currentModal.set(content)

    return await new Promise<ModalResult>((resolve) => {
        let unsub: Unsubscriber | undefined;
        unsub = modalResults.subscribe((res) => {
            if (res) {
                resolve(res)
                modalResults.set(null);
                if (unsub) unsub();
            }
        })
    })
} 