export const wait = (numMs: number | undefined) =>
  new Promise<void>((res) => setTimeout(() => res(), numMs));
