export function hasFileExtension(str: string): boolean {
    const extensionRegex = /\.[a-zA-Z0-9]+$/;
    return extensionRegex.test(str);
}
