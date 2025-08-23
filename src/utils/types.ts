export type Awaitable<T> = Promise<T> | T;

export type IsNever<T> = [T] extends [never] ? true : false;

export type AssertFalse<T extends false> = T;

export type EmptyRecord = Record<PropertyKey, never>;

export type AutoComplete<T extends string> = Record<string, never> & T;
