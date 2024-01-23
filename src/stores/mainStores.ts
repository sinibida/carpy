import { writable } from "svelte/store";

export const title = writable<string|null>(null)
export const loggedUser = writable<string|null>(null)