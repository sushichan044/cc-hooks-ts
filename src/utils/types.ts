export type Awaitable<T> = Promise<T> | T;

export type AssertFalse<T extends false> = T;

export type AutoComplete<T extends string> = Record<string, never> & T;
