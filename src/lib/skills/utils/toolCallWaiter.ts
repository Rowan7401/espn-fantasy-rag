// Simple waiting logic so the `getToolLabel` has time to be read by user
export const wait = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));