export function isWindowed() {
    if (window.__TAURI_METADATA__) return true;
    else return false;
}