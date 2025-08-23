# Vitest Type Testing: API Reference

This document provides a minimal API reference for writing type tests using Vitest.

## Core APIs

Vitest offers two main APIs for asserting types: `expectTypeOf` and `assertType`.

### `expectTypeOf`

The `expectTypeOf` function provides a fluent, chainable interface for making assertions about types.

**Basic Usage:**

```typescript
import { expectTypeOf } from 'vitest';
import { someFunction } from './my-code';

test('my types work correctly', () => {
  // Assert that a value is a specific type
  expectTypeOf(someFunction).toBeFunction();

  // Assert function parameter types
  expectTypeOf(someFunction).parameter(0).toMatchTypeOf<{ id: string }>();

  // Assert a value's type against another type
  expectTypeOf<{ a: number }>().toEqualTypeOf<{ a: number }>();
});
```

**Common Matchers:**

- `.toBeFunction()`: Asserts the type is a function.
- `.toBe...()`: Asserts a primitive type (e.g., `.toBeString()`, `.toBeNumber()`, `.toBeBoolean()`).
- `.toEqualTypeOf<T>()`: Asserts the type is exactly equal to `T`.
- `.toMatchTypeOf<T>()`: Asserts the type is assignable to `T`.
- `.parameter(index)`: Selects a function parameter for further assertions.
- `.returns`: Selects a function's return type for further assertions.

### `assertType`

The `assertType` function provides a simpler, more direct way to check types. It's particularly useful with `// @ts-expect-error` to verify that a type error occurs where expected.

**Basic Usage:**

```typescript
import { assertType } from 'vitest';
import { createUser } from './user-service';

test('type assertions', () => {
  const user = { name: 'test' };

  // This passes because the type is correct.
  assertType<{ name: string }>(user);

  // Use with @ts-expect-error to assert that a type error *should* happen.
  // This test will pass because `name: 123` is not assignable to `{ name: string }`.
  // @ts-expect-error
  assertType<{ name: string }>({ name: 123 });
});
```

By combining `assertType` with `// @ts-expect-error`, you can create robust tests that confirm both valid and invalid type assignments, preventing regressions in your type definitions.
