# 25 TypeScript Interview Questions & Answers

## 1. What is TypeScript and Why Use It?

**Answer:**
TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds static type checking, better tooling, and improved code maintainability.

```typescript
// JavaScript
function add(a, b) {
  return a + b;
}
add("5", 3); // '53' (runtime error potential)

// TypeScript
function add(a: number, b: number): number {
  return a + b;
}
add("5", 3); // Compile-time error: Argument of type 'string' is not assignable to parameter of type 'number'

// Benefits:
// 1. Type safety at compile time
// 2. Better IDE support (autocomplete, refactoring)
// 3. Self-documenting code
// 4. Catch errors before runtime
// 5. Easier refactoring
```

## 2. Explain Type Inference in TypeScript

**Answer:**
TypeScript automatically infers types when they're not explicitly provided.

```typescript
// Type inference
let x = 5; // TypeScript infers: number
let y = "hello"; // TypeScript infers: string
let z = [1, 2, 3]; // TypeScript infers: number[]

// Function return type inference
function multiply(a: number, b: number) {
  return a * b; // Return type inferred as number
}

// Array inference
const numbers = [1, 2, 3]; // number[]
const mixed = [1, "two", 3]; // (string | number)[]

// Object inference
const user = {
  name: "John",
  age: 30,
}; // { name: string; age: number }

// Explicit types when needed
let value: string | number;
value = "hello"; // OK
value = 42; // OK
value = true; // Error

// Best practice: Let TypeScript infer when possible
const items = [1, 2, 3]; // Good
const items: number[] = [1, 2, 3]; // Also good, but redundant
```

## 3. What's the Difference Between `interface` and `type`?

**Answer:**
Both define object shapes, but have different capabilities and use cases.

```typescript
// Interface - can be extended and merged
interface User {
  name: string;
  age: number;
}

interface Admin extends User {
  role: "admin";
}

// Declaration merging
interface User {
  email: string; // Merges with previous User interface
}

// Type - more flexible, can represent unions, intersections, primitives
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

type UserType = {
  name: string;
  age: number;
};

// Intersection types
type AdminType = UserType & {
  role: "admin";
};

// Union types
type Result = Success | Error;

// When to use interface:
// - Object shapes that might be extended
// - Public APIs (can be augmented via declaration merging)
// - React component props

// When to use type:
// - Unions, intersections, primitives
// - Mapped types, conditional types
// - Tuple types
// - When you need computed properties
```

## 4. Explain Generics in TypeScript

**Answer:**
Generics allow creating reusable components that work with multiple types.

```typescript
// Basic generic function
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(5);
const str = identity<string>("hello");
const inferred = identity(42); // Type inferred as number

// Generic interface
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 5 };
const stringBox: Box<string> = { value: "hello" };

// Generic class
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }
}

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);

// Multiple generics
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair<string, number>("age", 30);

// Generic constraints
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello"); // OK
logLength([1, 2, 3]); // OK
logLength(5); // Error: number doesn't have length

// React example
function useState<T>(initial: T): [T, (value: T) => void] {
  let state = initial;
  const setState = (value: T) => {
    state = value;
  };
  return [state, setState];
}
```

## 5. What are Utility Types and Provide Examples

**Answer:**
Utility types are built-in generic types that transform existing types.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
}

// Partial<T> - makes all properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; ... }

// Required<T> - makes all properties required
type RequiredUser = Required<PartialUser>;

// Pick<T, K> - select specific properties
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string; }

// Omit<T, K> - exclude specific properties
type UserWithoutId = Omit<User, "id">;
// { name: string; email: string; age: number; active: boolean; }

// Readonly<T> - makes all properties readonly
type ReadonlyUser = Readonly<User>;
// All properties become readonly

// Record<K, T> - create object type with keys K and values T
type UserRoles = Record<string, "admin" | "user" | "guest">;
// { [key: string]: 'admin' | 'user' | 'guest' }

// Exclude<T, U> - exclude types from union
type NonNullable<T> = Exclude<T, null | undefined>;

// Extract<T, U> - extract types from union
type StringOrNumber = Extract<string | number | boolean, string | number>;

// NonNullable<T> - exclude null and undefined
type SafeString = NonNullable<string | null | undefined>; // string

// ReturnType<T> - get return type of function
type Fn = () => string;
type Return = ReturnType<Fn>; // string

// Parameters<T> - get parameters as tuple
type Fn2 = (a: number, b: string) => void;
type Params = Parameters<Fn2>; // [number, string]

// Practical example
function updateUser(id: number, updates: Partial<User>): User {
  // Implementation
  return {} as User;
}

updateUser(1, { name: "John" }); // Only update name
```

## 6. Explain Type Guards and Type Narrowing

**Answer:**
Type guards narrow types within conditional blocks.

```typescript
// typeof type guard
function processValue(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    return value.toUpperCase();
  }
  // TypeScript knows value is number here
  return value.toFixed(2);
}

// instanceof type guard
class Dog {
  bark() {
    return "woof";
  }
}
class Cat {
  meow() {
    return "meow";
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    return animal.bark(); // TypeScript knows it's Dog
  }
  return animal.meow(); // TypeScript knows it's Cat
}

// in operator type guard
interface Bird {
  fly(): void;
}
interface Fish {
  swim(): void;
}

function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly(); // TypeScript knows it's Bird
  } else {
    animal.swim(); // TypeScript knows it's Fish
  }
}

// Custom type guard function
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string
    return value.length;
  }
}

// Discriminated unions
type Success = {
  status: "success";
  data: string;
};
type Error = {
  status: "error";
  message: string;
};

type Result = Success | Error;

function handleResult(result: Result) {
  if (result.status === "success") {
    console.log(result.data); // TypeScript knows it's Success
  } else {
    console.log(result.message); // TypeScript knows it's Error
  }
}
```

## 7. What are Conditional Types?

**Answer:**
Conditional types select types based on conditions, similar to ternary operators.

```typescript
// Basic conditional type
type IsArray<T> = T extends any[] ? true : false;
type Test1 = IsArray<number[]>; // true
type Test2 = IsArray<string>; // false

// Extract array element type
type ArrayElement<T> = T extends (infer U)[] ? U : never;
type Element = ArrayElement<string[]>; // string
type Element2 = ArrayElement<number[]>; // number

// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type FnReturn = ReturnType<() => string>; // string

// Extract function parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;
type FnParams = Parameters<(a: number, b: string) => void>; // [number, string]

// NonNullable
type NonNullable<T> = T extends null | undefined ? never : T;
type Safe = NonNullable<string | null>; // string

// Flatten array type
type Flatten<T> = T extends (infer U)[] ? U : T;
type Flat = Flatten<string[][]>; // string[]
type Flat2 = Flatten<number>; // number

// Deep flatten
type DeepFlatten<T> = T extends (infer U)[]
  ? U extends any[]
    ? DeepFlatten<U>
    : U
  : T;
type Deep = DeepFlatten<string[][][]>; // string

// React component props example
type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;
type ButtonProps = ComponentProps<typeof Button>;
```

## 8. Explain Mapped Types

**Answer:**
Mapped types create new types by transforming properties of existing types.

```typescript
// Basic mapped type
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; readonly email: string; }

// Modifier mapping
type MakeOptional<T> = {
  [P in keyof T]?: T[P];
};

type MakeRequired<T> = {
  [P in keyof T]-?: T[P];
};

// Key remapping (TypeScript 4.1+)
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string; getEmail: () => string; }

// Filter properties
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface Mixed {
  name: string;
  age: number;
  email: string;
}
type StringProps = OnlyStrings<Mixed>; // { name: string; email: string; }

// Practical: API response transformation
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type ApiError = {
  error: string;
  code: number;
};

type ApiResult<T> = ApiResponse<T> | ApiError;
```

## 9. What is the `as` Keyword and When to Use It?

**Answer:**
The `as` keyword performs type assertions, telling TypeScript to treat a value as a specific type.

```typescript
// Type assertion
const value: unknown = "hello";
const str = value as string;
str.toUpperCase(); // OK

// Angle bracket syntax (not in JSX)
const str2 = <string>value;

// Asserting to more specific type
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

const animal: Animal = { name: "Max" };
const dog = animal as Dog; // Assertion (unsafe if wrong)
dog.breed; // TypeScript allows, but runtime error possible

// Double assertion
const num = "123" as unknown as number; // Avoid when possible

// const assertion
const colors = ["red", "green", "blue"] as const;
// Type: readonly ["red", "green", "blue"]

const user = {
  name: "John",
  age: 30,
} as const;
// All properties become readonly literals

// When to use:
// 1. Working with DOM elements
const button = document.getElementById("btn") as HTMLButtonElement;

// 2. Narrowing union types (after type guard)
function process(value: string | number) {
  if (typeof value === "string") {
    return (value as string).toUpperCase();
  }
}

// 3. Working with third-party libraries
const data = apiResponse as ApiResponse<User>;

// Best practice: Use type guards instead when possible
```

## 10. Explain `keyof` and `typeof` Operators

**Answer:**
`keyof` gets keys of a type, `typeof` gets the type of a value.

```typescript
// keyof operator
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKeys = keyof User; // 'id' | 'name' | 'email'

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: "John", email: "john@example.com" };
const name = getProperty(user, "name"); // Type-safe property access
const invalid = getProperty(user, "age"); // Error: 'age' not in User

// typeof operator
const colors = ["red", "green", "blue"];
type Colors = typeof colors; // string[]

const userObj = {
  name: "John",
  age: 30,
  active: true,
};
type UserObj = typeof userObj;
// { name: string; age: number; active: boolean; }

// Combining keyof and typeof
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
} as const;

type ConfigKeys = keyof typeof config; // 'apiUrl' | 'timeout' | 'retries'
type ConfigValues = (typeof config)[ConfigKeys]; // 'https://api.example.com' | 5000 | 3

// Practical: Type-safe event handlers
const handlers = {
  onClick: (e: MouseEvent) => {},
  onChange: (e: Event) => {},
  onSubmit: (e: SubmitEvent) => {},
};

type HandlerKeys = keyof typeof handlers;
type HandlerType<K extends HandlerKeys> = (typeof handlers)[K];
```

## 11. What are Tuple Types?

**Answer:**
Tuples are arrays with fixed length and known types at each position.

```typescript
// Basic tuple
type Point = [number, number];
const point: Point = [10, 20];

// Named tuple (TypeScript 4.0+)
type Point2 = [x: number, y: number];

// Tuple with different types
type UserInfo = [string, number, boolean];
const user: UserInfo = ["John", 30, true];

// Optional tuple elements
type OptionalTuple = [string, number?];
const t1: OptionalTuple = ["hello"];
const t2: OptionalTuple = ["hello", 42];

// Rest elements in tuple
type StringNumberBooleans = [string, number, ...boolean[]];
const snb: StringNumberBooleans = ["hello", 1, true, false];

// Readonly tuple
type ReadonlyPoint = readonly [number, number];
const rp: ReadonlyPoint = [1, 2];
// rp[0] = 3; // Error: readonly

// Destructuring tuples
const [x, y] = point;
const [name, age, active] = user;

// React useState example
type UseStateReturn<T> = [T, (value: T) => void];
function useState<T>(initial: T): UseStateReturn<T> {
  // Implementation
  return [initial, () => {}];
}

// Function parameters as tuple
type Fn = (...args: [string, number]) => void;
const fn: Fn = (name, age) => {
  console.log(name, age);
};
```

## 12. Explain Declaration Merging

**Answer:**
Declaration merging allows multiple declarations with the same name to be combined.

```typescript
// Interface merging
interface User {
  name: string;
}

interface User {
  age: number;
}

// Merged: { name: string; age: number; }
const user: User = {
  name: "John",
  age: 30,
};

// Namespace merging
namespace MyLib {
  export function helper() {}
}

namespace MyLib {
  export const version = "1.0.0";
}

// Merged namespace
MyLib.helper();
MyLib.version;

// Module augmentation
// In a library file
declare module "./types" {
  interface User {
    email: string;
  }
}

// Global augmentation
declare global {
  interface Window {
    myCustomProperty: string;
  }
}

window.myCustomProperty; // Available

// Enum merging
enum Colors {
  Red = "red",
}

enum Colors {
  Blue = "blue",
}

// Merged enum
Colors.Red; // 'red'
Colors.Blue; // 'blue'
```

## 13. What are Template Literal Types?

**Answer:**
Template literal types create string literal types using template literal syntax.

```typescript
// Basic template literal type
type Greeting = `Hello, ${string}`;
const greet: Greeting = "Hello, World"; // OK
const invalid: Greeting = "Hi"; // Error

// With union types
type EventName = "click" | "change" | "submit";
type HandlerName = `on${Capitalize<EventName>}`;
// 'onClick' | 'onChange' | 'onSubmit'

// Uppercase, Lowercase, Capitalize, Uncapitalize
type UppercaseExample = Uppercase<"hello">; // 'HELLO'
type LowercaseExample = Lowercase<"HELLO">; // 'hello'
type CapitalizeExample = Capitalize<"hello">; // 'Hello'
type UncapitalizeExample = Uncapitalize<"Hello">; // 'hello'

// Complex example: API routes
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiRoute = `/api/${string}`;
type ApiEndpoint = `${HttpMethod} ${ApiRoute}`;

const endpoint: ApiEndpoint = "GET /api/users"; // OK
const endpoint2: ApiEndpoint = "POST /api/posts"; // OK

// CSS property names
type CssProperty = "margin" | "padding" | "border";
type CssPropertyWithSide = `${CssProperty}-${
  | "top"
  | "right"
  | "bottom"
  | "left"}`;
// 'margin-top' | 'margin-right' | 'margin-bottom' | 'margin-left' | ...

// React component props
type ComponentName = "Button" | "Input" | "Card";
type PropsName = `${ComponentName}Props`;
```

## 14. Explain `never` Type and Its Use Cases

**Answer:**
`never` represents values that never occur - functions that never return or unreachable code.

```typescript
// Function that never returns
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}

// Exhaustive checking
type Status = "pending" | "success" | "error";

function handleStatus(status: Status) {
  switch (status) {
    case "pending":
      return "Loading...";
    case "success":
      return "Done";
    case "error":
      return "Failed";
    default:
      const exhaustive: never = status; // Ensures all cases handled
      return exhaustive;
  }
}

// Removing types from unions
type NonNullable<T> = T extends null | undefined ? never : T;
type Safe = NonNullable<string | null | undefined>; // string

// Empty arrays
const empty: never[] = [];
// empty.push(1); // Error: Argument of type 'number' is not assignable to parameter of type 'never'

// Type narrowing to never
function process(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  // value is never here
  const check: never = value; // OK - exhaustive check
}

// Discriminated union exhaustiveness
type Result =
  | { type: "success"; data: string }
  | { type: "error"; message: string };

function handle(result: Result) {
  switch (result.type) {
    case "success":
      return result.data;
    case "error":
      return result.message;
    default:
      const _exhaustive: never = result; // Compile-time check
  }
}
```

## 15. What are Index Signatures?

**Answer:**
Index signatures define types for dynamic property access on objects.

```typescript
// String index signature
interface StringDictionary {
  [key: string]: string;
}

const dict: StringDictionary = {
  name: "John",
  city: "NYC",
};
dict["age"] = "30"; // OK

// Number index signature
interface NumberDictionary {
  [index: number]: string;
}

const arr: NumberDictionary = ["a", "b", "c"];
arr[0]; // 'a'

// Both string and number
interface MixedDictionary {
  [key: string]: string | number;
  [index: number]: string; // Must be subtype of string index
}

// Readonly index signature
interface ReadonlyDict {
  readonly [key: string]: string;
}

const readonly: ReadonlyDict = { name: "John" };
// readonly['age'] = '30'; // Error: readonly

// Practical: API responses
interface ApiResponse {
  [key: string]: any;
  status: number;
  message: string;
}

// Record utility type (alternative)
type StringDict = Record<string, string>;
type NumberDict = Record<number, string>;

// React component props with index signature
interface ComponentProps {
  [key: string]: any;
  className?: string;
  id?: string;
}
```

## 16. Explain Function Overloads

**Answer:**
Function overloads provide multiple type signatures for a single function.

```typescript
// Function overloads
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;
function format(value: string | number | boolean): string {
  return String(value);
}

format("hello"); // OK
format(42); // OK
format(true); // OK

// Different return types
function parse(value: string): number;
function parse(value: number): string;
function parse(value: string | number): number | string {
  if (typeof value === "string") {
    return parseInt(value);
  }
  return String(value);
}

// Method overloads
class Calculator {
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number | string, b: number | string): number | string {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    }
    return String(a) + String(b);
  }
}

// React event handler example
function handleEvent(event: MouseEvent, handler: (e: MouseEvent) => void): void;
function handleEvent(
  event: KeyboardEvent,
  handler: (e: KeyboardEvent) => void
): void;
function handleEvent(
  event: MouseEvent | KeyboardEvent,
  handler: (e: MouseEvent | KeyboardEvent) => void
): void {
  handler(event);
}
```

## 17. What are Branded Types and Nominal Typing?

**Answer:**
Branded types create distinct types from the same underlying type, preventing accidental mixing.

```typescript
// Branded type pattern
type UserId = string & { __brand: 'UserId' };
type ProductId = string & { __brand: 'ProductId' };

function createUserId(id: string): UserId {
  return id as UserId;
function createProductId(id: string): ProductId {
  return id as ProductId;
}

const userId = createUserId('123');
const productId = createProductId('456');

// userId === productId; // Type error (even if same string value)
// function getUser(id: UserId) { ... }
// getUser(productId); // Error: Type 'ProductId' is not assignable to type 'UserId'

// Using unique symbol (better approach)
declare const UserIdBrand: unique symbol;
type UserId = string & { [UserIdBrand]: true };

declare const ProductIdBrand: unique symbol;
type ProductId = string & { [ProductIdBrand]: true };

// Practical: Money type
declare const MoneyBrand: unique symbol;
type Money = number & { [MoneyBrand]: true };

function createMoney(amount: number): Money {
  if (amount < 0) throw new Error('Amount cannot be negative');
  return amount as Money;
}

function addMoney(a: Money, b: Money): Money {
  return (a + b) as Money;
}

const salary = createMoney(5000);
const bonus = createMoney(1000);
const total = addMoney(salary, bonus); // OK
// const invalid = addMoney(salary, 1000); // Error

// Email type
declare const EmailBrand: unique symbol;
type Email = string & { [EmailBrand]: true };

function createEmail(email: string): Email {
  if (!email.includes('@')) throw new Error('Invalid email');
  return email as Email;
}
```

## 18. Explain `satisfies` Operator (TypeScript 4.9+)

**Answer:**
The `satisfies` operator ensures a value matches a type without changing the inferred type.

```typescript
// Without satisfies - loses specific types
const config: Record<string, string | number> = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
};
// config.apiUrl is string | number (too broad)

// With satisfies - preserves specific types
const config2 = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
} satisfies Record<string, string | number>;
// config2.apiUrl is string (preserved)

// Ensures type safety while preserving inference
type Theme = "light" | "dark";
type Config = {
  theme: Theme;
  apiUrl: string;
};

const appConfig = {
  theme: "light",
  apiUrl: "https://api.example.com",
} satisfies Config;
// appConfig.theme is 'light' (not Theme union)

// Error detection
const invalid = {
  theme: "blue", // Error: 'blue' not assignable to Theme
  apiUrl: 123, // Error: number not assignable to string
} satisfies Config;

// React component props example
type ButtonProps = {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
};

const buttonProps = {
  variant: "primary",
  size: "md",
} satisfies ButtonProps;
// buttonProps.variant is 'primary' (literal), not union
```

## 19. What are Assertion Functions?

**Answer:**
Assertion functions narrow types and throw if conditions aren't met.

```typescript
// Assertion function
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value is not a string");
  }
}

function process(value: unknown) {
  assertIsString(value);
  // TypeScript knows value is string here
  return value.toUpperCase();
}

// Assertion with condition
function assert(condition: unknown): asserts condition {
  if (!condition) {
    throw new Error("Assertion failed");
  }
}

function divide(a: number, b: number): number {
  assert(b !== 0); // TypeScript knows b !== 0 after this
  return a / b;
}

// Assert non-null
function assertNotNull<T>(value: T | null): asserts value is T {
  if (value === null) {
    throw new Error("Value is null");
  }
}

function processUser(user: User | null) {
  assertNotNull(user);
  // TypeScript knows user is User here
  return user.name;
}

// Assert array element type
function assertIsArray<T>(
  value: unknown,
  check: (item: unknown) => item is T
): asserts value is T[] {
  if (!Array.isArray(value) || !value.every(check)) {
    throw new Error("Value is not an array of expected type");
  }
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function processNumbers(values: unknown) {
  assertIsArray(values, isNumber);
  // TypeScript knows values is number[]
  return values.reduce((a, b) => a + b, 0);
}
```

## 20. Explain Module Resolution and Path Mapping

**Answer:**
TypeScript resolves module imports using various strategies and path aliases.

```typescript
// tsconfig.json path mapping
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}

// Usage
import { Button } from '@components/Button';
import { formatDate } from '@utils/date';
import { User } from '@/types/User';

// Module resolution strategies
// 1. "node" - Node.js style (default for most projects)
// 2. "classic" - TypeScript classic (legacy)

// Resolution order (node strategy):
// 1. Check package.json "types" or "typings"
// 2. Look for .d.ts files
// 3. Look for .ts/.tsx files
// 4. Check node_modules

// Type-only imports
import type { User } from './types';
import { type User, type Post } from './types';
import type * as Types from './types';

// Re-exporting
export { User, Post } from './types';
export type { UserType, PostType } from './types';

// Namespace imports
import * as Utils from './utils';
Utils.formatDate(new Date());
```

## 21. What are Decorators and How Do They Work?

**Answer:**
Decorators are special declarations that can be attached to classes, methods, properties, etc. (experimental feature).

```typescript
// Enable decorators in tsconfig.json
// "experimentalDecorators": true

// Class decorator
function Logger(target: Function) {
  console.log("Class created:", target.name);
}

@Logger
class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

// Method decorator
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    return original.apply(this, args);
  };
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
}

// Property decorator
function ReadOnly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
  });
}

class Product {
  @ReadOnly
  id: string = "123";
}

// Parameter decorator
function Required(target: any, propertyKey: string, parameterIndex: number) {
  // Metadata storage
}

class Service {
  create(@Required name: string) {
    // Implementation
  }
}

// Decorator factory
function Log(prefix: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.log(`[${prefix}] ${propertyKey}`, args);
      return original.apply(this, args);
    };
  };
}

class ApiService {
  @Log("API")
  fetchData(url: string) {
    // Implementation
  }
}
```

## 22. Explain Type Narrowing with Discriminated Unions

**Answer:**
Discriminated unions use a common property to narrow types safely.

```typescript
// Discriminated union
type Success = {
  status: "success";
  data: string;
};

type Error = {
  status: "error";
  message: string;
};

type Loading = {
  status: "loading";
};

type Result = Success | Error | Loading;

function handleResult(result: Result) {
  switch (result.status) {
    case "success":
      // TypeScript knows result is Success
      console.log(result.data);
      break;
    case "error":
      // TypeScript knows result is Error
      console.log(result.message);
      break;
    case "loading":
      // TypeScript knows result is Loading
      console.log("Loading...");
      break;
    default:
      const exhaustive: never = result; // Ensures all cases handled
  }
}

// Multiple discriminators
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function handleResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    // TypeScript knows response.data exists
    return response.data;
  } else {
    // TypeScript knows response.error exists
    return response.error;
  }
}

// Tagged union with multiple properties
type Event =
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; key: string }
  | { type: "scroll"; position: number };

function handleEvent(event: Event) {
  switch (event.type) {
    case "click":
      console.log(`Clicked at (${event.x}, ${event.y})`);
      break;
    case "keypress":
      console.log(`Key pressed: ${event.key}`);
      break;
    case "scroll":
      console.log(`Scrolled to ${event.position}`);
      break;
  }
}
```

## 23. What are Recursive Types?

**Answer:**
Recursive types reference themselves in their definition.

```typescript
// Recursive type
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const json: JsonValue = {
  name: "John",
  age: 30,
  tags: ["developer", "typescript"],
  metadata: {
    created: "2024-01-01",
    nested: {
      value: 123,
    },
  },
};

// Tree structure
type TreeNode<T> = {
  value: T;
  children: TreeNode<T>[];
};

const tree: TreeNode<string> = {
  value: "root",
  children: [
    {
      value: "child1",
      children: [],
    },
    {
      value: "child2",
      children: [{ value: "grandchild", children: [] }],
    },
  ],
};

// Linked list
type ListNode<T> = {
  value: T;
  next: ListNode<T> | null;
};

const list: ListNode<number> = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: null,
    },
  },
};

// Recursive utility type: DeepReadonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type User = {
  name: string;
  address: {
    street: string;
    city: string;
  };
};

type ReadonlyUser = DeepReadonly<User>;
// All properties recursively readonly

// Recursive Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

## 24. Explain Type Predicates and Custom Type Guards

**Answer:**
Type predicates are functions that return type assertions, enabling custom type narrowing.

```typescript
// Type predicate function
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string
    return value.toUpperCase();
  }
  // TypeScript knows value is not string
  return String(value);
}

// Multiple type predicates
function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "email" in value
  );
}

// Array type guard
function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

// Discriminated union guard
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function isSuccess<T>(
  response: ApiResponse<T>
): response is { success: true; data: T } {
  return response.success === true;
}

function handleResponse<T>(response: ApiResponse<T>) {
  if (isSuccess(response)) {
    // TypeScript knows response is success type
    return response.data;
  }
  // TypeScript knows response is error type
  return response.error;
}

// Complex type guard
interface Admin {
  role: "admin";
  permissions: string[];
}

interface User {
  role: "user";
  name: string;
}

type Person = Admin | User;

function isAdmin(person: Person): person is Admin {
  return person.role === "admin";
}

function checkAccess(person: Person) {
  if (isAdmin(person)) {
    // TypeScript knows person is Admin
    return person.permissions;
  }
  // TypeScript knows person is User
  return person.name;
}
```

## 25. Explain Advanced Generic Patterns

**Answer:**
Advanced generic patterns enable powerful type transformations and reusable type-safe code.

```typescript
// Constraint with keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "John", age: 30 };
const name = getProperty(user, "name"); // string
const age = getProperty(user, "age"); // number

// Conditional generic constraints
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface Example {
  name: string;
  age: number;
  getName: () => string;
}

type DataOnly = NonFunctionProperties<Example>; // { name: string; age: number; }

// Higher-order generic functions
function createGetter<T>() {
  return function <K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  };
}

const getUserProperty = createGetter<User>();
const name = getUserProperty(user, "name");

// Generic defaults
interface ApiResponse<T = any> {
  data: T;
  status: number;
}

type StringResponse = ApiResponse<string>;
type DefaultResponse = ApiResponse; // T defaults to any

// Mapped types with generics
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserUpdate = Optional<User, "id">; // id required, others optional

// Recursive generic
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Generic type extraction
type ExtractReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = (a: number) => string;
type Return = ExtractReturnType<Fn>; // string

// Flatten generic
type Flatten<T> = T extends (infer U)[] ? U : T;
type Nested = string[][];
type Flat = Flatten<Nested>; // string[]
```
