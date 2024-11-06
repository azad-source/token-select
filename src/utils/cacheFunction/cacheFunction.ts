export function cached<Args extends unknown[], ReturnType>(
  fn: (...args: Args) => ReturnType
): (...args: Args) => ReturnType {
  const cache = new Map<string, ReturnType>();

  return function cachedFn(...args: Args): ReturnType {
    const key = JSON.stringify(args);

    if (!cache.has(key)) {
      const result = fn(...args);
      cache.set(key, result);
    }

    return cache.get(key) as ReturnType;
  };
}
