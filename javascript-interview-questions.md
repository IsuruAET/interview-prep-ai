# 25 JavaScript Interview Questions & Answers

## 1. Explain Closures in JavaScript with Examples

**Answer:**
A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

```javascript
function outerFunction(x) {
  // Outer function's variable
  const outerVariable = x;

  // Inner function (closure)
  function innerFunction(y) {
    console.log(outerVariable + y); // Accesses outerVariable
  }

  return innerFunction;
}

const closure = outerFunction(10);
closure(5); // Output: 15

// Real-world example: Module pattern
const counter = (function () {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
})();

counter.increment(); // 1
counter.increment(); // 2
console.log(counter.getCount()); // 2
```

## 2. What is the Event Loop and How Does It Work?

**Answer:**
The event loop is JavaScript's mechanism for handling asynchronous operations. It continuously checks the call stack and task queues.

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Output: 1, 4, 3, 2
// Explanation:
// 1. '1' and '4' are synchronous
// 2. Promise microtask runs before setTimeout (macrotask)
// 3. setTimeout callback runs last

// Event loop phases:
// 1. Call stack (synchronous code)
// 2. Microtask queue (Promises, queueMicrotask)
// 3. Macrotask queue (setTimeout, setInterval, I/O)
```

## 3. Explain `this` Binding in JavaScript

**Answer:**
`this` refers to the execution context. Its value depends on how a function is called.

```javascript
// Global context
console.log(this); // Window (browser) or global (Node)

// Object method
const obj = {
  name: "John",
  greet: function () {
    return `Hello, ${this.name}`;
  },
};
obj.greet(); // "Hello, John"

// Arrow functions (lexical this)
const obj2 = {
  name: "Jane",
  greet: () => {
    return `Hello, ${this.name}`; // this refers to global
  },
  greetRegular: function () {
    const arrow = () => {
      return `Hello, ${this.name}`; // this refers to obj2
    };
    return arrow();
  },
};

// Explicit binding
function greet() {
  return `Hello, ${this.name}`;
}
const person = { name: "Alice" };
greet.call(person); // "Hello, Alice"
greet.apply(person); // "Hello, Alice"
const boundGreet = greet.bind(person);
boundGreet(); // "Hello, Alice"

// Constructor
function Person(name) {
  this.name = name;
}
const p = new Person("Bob");
console.log(p.name); // "Bob"
```

## 4. What is Hoisting? Explain with Examples

**Answer:**
Hoisting moves variable and function declarations to the top of their scope before code execution.

```javascript
// Variable hoisting (var)
console.log(x); // undefined (not ReferenceError)
var x = 5;

// Equivalent to:
var x;
console.log(x);
x = 5;

// Function hoisting
sayHello(); // "Hello" (works!)

function sayHello() {
  console.log("Hello");
}

// let/const hoisting (Temporal Dead Zone)
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// Function expression (not hoisted)
sayHi(); // TypeError: sayHi is not a function
var sayHi = function () {
  console.log("Hi");
};
```

## 5. Explain Prototypes and Prototypal Inheritance

**Answer:**
JavaScript uses prototypal inheritance where objects inherit properties from their prototype chain.

```javascript
// Constructor function
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function () {
  return `${this.name} barks`;
};

const dog = new Dog("Max", "Labrador");
console.log(dog.speak()); // "Max barks"
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true

// ES6 Classes (syntactic sugar)
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  speak() {
    return `${this.name} barks`;
  }
}
```

## 6. What are Promises and How Do They Work?

**Answer:**
Promises represent the eventual completion (or failure) of an asynchronous operation.

```javascript
// Creating a Promise
const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("Operation succeeded");
  } else {
    reject("Operation failed");
  }
});

// Consuming a Promise
promise
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => console.log("Done"));

// Promise.all - wait for all
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3]).then((values) => console.log(values)); // [1, 2, 3]

// Promise.allSettled - wait for all (even if rejected)
Promise.allSettled([p1, Promise.reject("error"), p3]).then((results) =>
  console.log(results)
);

// Promise.race - first to settle
Promise.race([p1, p2]).then((value) => console.log(value)); // 1

// Async/await
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
```

## 7. Explain Call, Apply, and Bind

**Answer:**
These methods allow you to set the `this` context explicitly.

```javascript
const person = {
  firstName: "John",
  lastName: "Doe",
};

function greet(greeting, punctuation) {
  return `${greeting}, ${this.firstName} ${this.lastName}${punctuation}`;
}

// call - arguments passed individually
greet.call(person, "Hello", "!"); // "Hello, John Doe!"

// apply - arguments passed as array
greet.apply(person, ["Hi", "."]); // "Hi, John Doe."

// bind - returns new function with bound this
const boundGreet = greet.bind(person);
boundGreet("Hey", "?"); // "Hey, John Doe?"

// Practical example: Borrowing methods
const numbers = [1, 2, 3, 4, 5];
const max = Math.max.apply(null, numbers); // 5
const maxES6 = Math.max(...numbers); // 5 (modern way)
```

## 8. What is the Difference Between `==` and `===`?

**Answer:**
`==` performs type coercion, `===` checks both value and type.

```javascript
// == (loose equality with coercion)
5 == "5"; // true (string converted to number)
0 == false; // true (false converted to 0)
"" == false; // true (both converted to 0)
null == undefined; // true (special case)

// === (strict equality, no coercion)
5 === "5"; // false (different types)
0 === false; // false (different types)
"" === false; // false (different types)
null === undefined; // false (different types)

// Best practice: Always use ===
// Object comparison
const obj1 = { a: 1 };
const obj2 = { a: 1 };
obj1 === obj2; // false (different references)
obj1 === obj1; // true (same reference)
```

## 9. Explain Debouncing and Throttling

**Answer:**
Debouncing delays execution until after a pause, throttling limits execution frequency.

```javascript
// Debounce - execute after delay when user stops
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Example: Search input
const searchInput = document.getElementById("search");
const debouncedSearch = debounce((query) => {
  console.log("Searching for:", query);
}, 300);

searchInput.addEventListener("input", (e) => {
  debouncedSearch(e.target.value);
});

// Throttle - execute at most once per interval
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Example: Scroll handler
const throttledScroll = throttle(() => {
  console.log("Scroll event");
}, 100);

window.addEventListener("scroll", throttledScroll);
```

## 10. What are Generators and How Do They Work?

**Answer:**
Generators are functions that can be paused and resumed, yielding multiple values.

```javascript
// Generator function
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Infinite generator
function* infiniteCounter() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const counter = infiniteCounter();
console.log(counter.next().value); // 0
console.log(counter.next().value); // 1

// Generator with parameters
function* fibonacci() {
  let [prev, curr] = [0, 1];
  while (true) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

const fib = fibonacci();
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3
```

## 11. Explain the Spread Operator and Rest Parameters

**Answer:**
Spread expands iterables, rest collects remaining arguments.

```javascript
// Spread operator (...)
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Copying arrays
const original = [1, 2, 3];
const copy = [...original]; // Shallow copy

// Spreading objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, ...obj1 }; // { c: 3, a: 1, b: 2 }
const obj3 = { ...obj1, b: 4 }; // { a: 1, b: 4 } (overwrites)

// Function arguments
Math.max(...[1, 5, 3, 2]); // 5

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}
sum(1, 2, 3, 4); // 10

// Destructuring with rest
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

const { a, ...others } = { a: 1, b: 2, c: 3 };
// a = 1, others = { b: 2, c: 3 }
```

## 12. What is Currying? Provide Examples

**Answer:**
Currying transforms a function with multiple arguments into a sequence of functions with single arguments.

```javascript
// Regular function
function add(a, b, c) {
  return a + b + c;
}

// Curried version
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

// Arrow function version
const curriedAddArrow = (a) => (b) => (c) => a + b + c;

curriedAdd(1)(2)(3); // 6
curriedAddArrow(1)(2)(3); // 6

// Generic curry function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

const curriedMultiply = curry((a, b, c) => a * b * c);
curriedMultiply(2)(3)(4); // 24
curriedMultiply(2, 3)(4); // 24
curriedMultiply(2, 3, 4); // 24

// Practical example: Partial application
const multiplyBy2 = curriedMultiply(2);
const multiplyBy2And3 = multiplyBy2(3);
multiplyBy2And3(4); // 24
```

## 13. Explain Memory Leaks in JavaScript

**Answer:**
Memory leaks occur when memory is allocated but never released.

```javascript
// 1. Global variables
function leak() {
  globalVar = "This creates a global variable"; // Missing var/let/const
}

// 2. Closures holding references
function outer() {
  const largeData = new Array(1000000).fill("data");
  return function inner() {
    // inner holds reference to largeData even if unused
    return "inner";
  };
}

// 3. Event listeners not removed
const button = document.getElementById("button");
button.addEventListener("click", handleClick);
// If button is removed, listener still holds reference

// Fix: Remove listeners
button.removeEventListener("click", handleClick);

// 4. Timers not cleared
const intervalId = setInterval(() => {
  // Some code
}, 1000);
// Fix:
clearInterval(intervalId);

// 5. DOM references
const elements = [];
function addElement() {
  const div = document.createElement("div");
  elements.push(div); // Holds reference even if removed from DOM
}

// Fix: Clear references
elements.length = 0;
```

## 14. What is the Difference Between `var`, `let`, and `const`?

**Answer:**
Different scoping and hoisting behaviors.

```javascript
// var - function scoped, hoisted, can be redeclared
function example() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 (accessible outside block)
}

// let - block scoped, hoisted but in TDZ, cannot be redeclared
function example2() {
  if (true) {
    let y = 2;
  }
  console.log(y); // ReferenceError: y is not defined
}

// const - block scoped, must be initialized, cannot be reassigned
const z = 3;
z = 4; // TypeError: Assignment to constant variable

// const with objects (reference is constant, properties can change)
const obj = { a: 1 };
obj.a = 2; // OK
obj = {}; // TypeError

// Loop behavior
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100); // 0, 1, 2
}
```

## 15. Explain Async/Await and Error Handling

**Answer:**
Async/await provides synchronous-looking syntax for asynchronous code.

```javascript
// Basic async/await
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return user;
}

// Error handling with try/catch
async function fetchUserSafe(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Multiple async operations
async function fetchMultiple() {
  try {
    const [user, posts, comments] = await Promise.all([
      fetch("/api/user").then((r) => r.json()),
      fetch("/api/posts").then((r) => r.json()),
      fetch("/api/comments").then((r) => r.json()),
    ]);
    return { user, posts, comments };
  } catch (error) {
    console.error("One or more requests failed:", error);
  }
}

// Sequential vs parallel
async function sequential() {
  const user = await fetchUser(1); // Wait
  const posts = await fetchPosts(user.id); // Wait
  // Total: time1 + time2
}

async function parallel() {
  const [user, allPosts] = await Promise.all([fetchUser(1), fetchPosts()]);
  // Total: max(time1, time2)
}
```

## 16. What are WeakMap and WeakSet?

**Answer:**
WeakMap and WeakSet hold weak references, allowing garbage collection of keys.

```javascript
// WeakMap - keys must be objects, no iteration, weak references
const weakMap = new WeakMap();
const obj = { id: 1 };
weakMap.set(obj, "value");
console.log(weakMap.get(obj)); // 'value'

// When obj is garbage collected, entry is removed
obj = null; // Entry can be garbage collected

// WeakSet - only objects, no iteration, weak references
const weakSet = new WeakSet();
const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);
console.log(weakSet.has(obj1)); // true

// Use cases: Private data, DOM node metadata
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}

const user = new User("John");
console.log(user.getName()); // 'John'
// No way to access privateData directly
```

## 17. Explain the Module Pattern

**Answer:**
The module pattern encapsulates code and provides public/private interfaces.

```javascript
// IIFE Module Pattern
const Calculator = (function () {
  // Private variables
  let result = 0;

  // Private functions
  function validate(num) {
    return typeof num === "number" && !isNaN(num);
  }

  // Public API
  return {
    add: function (num) {
      if (validate(num)) result += num;
      return this;
    },
    subtract: function (num) {
      if (validate(num)) result -= num;
      return this;
    },
    getResult: function () {
      return result;
    },
    reset: function () {
      result = 0;
      return this;
    },
  };
})();

Calculator.add(5).subtract(2).getResult(); // 3

// ES6 Modules
// math.js
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export default function multiply(a, b) {
  return a * b;
}

// main.js
import multiply, { PI, add } from "./math.js";
// or
import * as math from "./math.js";
```

## 18. What is the Difference Between `null` and `undefined`?

**Answer:**
`undefined` means a variable hasn't been assigned, `null` is an intentional absence of value.

```javascript
// undefined
let x;
console.log(x); // undefined

function test(param) {
  console.log(param); // undefined if not passed
}
test();

// null - explicitly set
let y = null;
console.log(y); // null

// Type checking
typeof undefined; // "undefined"
typeof null; // "object" (historical bug)

// Equality
null == undefined; // true (loose equality)
null === undefined; // false (strict equality)

// Practical usage
function getUser(id) {
  if (id) {
    return { id, name: "John" };
  }
  return null; // Explicitly no user
}

const user = getUser(123);
if (user === null) {
  console.log("No user found");
}
```

## 19. Explain Function Composition

**Answer:**
Function composition combines functions to create new functions.

```javascript
// Simple composition
const add = (x) => x + 1;
const multiply = (x) => x * 2;
const subtract = (x) => x - 3;

// Manual composition
const result = subtract(multiply(add(5))); // ((5 + 1) * 2) - 3 = 9

// Generic compose (right to left)
function compose(...fns) {
  return function (value) {
    return fns.reduceRight((acc, fn) => fn(acc), value);
  };
}

const composed = compose(subtract, multiply, add);
composed(5); // 9

// Generic pipe (left to right, more readable)
function pipe(...fns) {
  return function (value) {
    return fns.reduce((acc, fn) => fn(acc), value);
  };
}

const piped = pipe(add, multiply, subtract);
piped(5); // 9

// Arrow function versions
const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value);
const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value);

// Practical example
const users = [
  { name: "John", age: 25 },
  { name: "Jane", age: 30 },
  { name: "Bob", age: 20 },
];

const getAdults = (users) => users.filter((u) => u.age >= 18);
const getNames = (users) => users.map((u) => u.name);
const sortNames = (names) => names.sort();

const getAdultNames = pipe(getAdults, getNames, sortNames);
console.log(getAdultNames(users)); // ['Bob', 'Jane', 'John']
```

## 20. What are Proxy and Reflect?

**Answer:**
Proxy intercepts operations on objects, Reflect provides methods for these operations.

```javascript
// Proxy - intercept object operations
const target = {
  name: "John",
  age: 30,
};

const handler = {
  get(target, prop) {
    if (prop === "age") {
      return `Age is ${target[prop]}`;
    }
    return target[prop];
  },
  set(target, prop, value) {
    if (prop === "age" && value < 0) {
      throw new Error("Age cannot be negative");
    }
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    return prop in target;
  },
};

const proxy = new Proxy(target, handler);
console.log(proxy.name); // 'John'
console.log(proxy.age); // 'Age is 30'
proxy.age = 25; // OK
proxy.age = -5; // Error

// Reflect - provides methods for proxy operations
const obj = { a: 1 };
Reflect.get(obj, "a"); // 1
Reflect.set(obj, "b", 2); // true
Reflect.has(obj, "a"); // true
Reflect.deleteProperty(obj, "a"); // true

// Practical: Validation proxy
function createValidator(target) {
  return new Proxy(target, {
    set(target, prop, value) {
      if (prop === "email" && !value.includes("@")) {
        throw new Error("Invalid email");
      }
      return Reflect.set(target, prop, value);
    },
  });
}

const user = createValidator({});
user.email = "test@example.com"; // OK
user.email = "invalid"; // Error
```

## 21. Explain the Difference Between `forEach`, `map`, `filter`, and `reduce`

**Answer:**
Different array methods for iteration and transformation.

```javascript
const numbers = [1, 2, 3, 4, 5];

// forEach - executes function for each element, returns undefined
numbers.forEach((num) => console.log(num * 2));
// No return value, used for side effects

// map - transforms each element, returns new array
const doubled = numbers.map((num) => num * 2);
// [2, 4, 6, 8, 10]

// filter - selects elements, returns new array
const evens = numbers.filter((num) => num % 2 === 0);
// [2, 4]

// reduce - reduces array to single value
const sum = numbers.reduce((acc, num) => acc + num, 0);
// 15

// Chaining
const result = numbers
  .filter((n) => n % 2 === 0) // [2, 4]
  .map((n) => n * 2) // [4, 8]
  .reduce((acc, n) => acc + n, 0); // 12

// Practical example
const users = [
  { name: "John", age: 25, active: true },
  { name: "Jane", age: 30, active: false },
  { name: "Bob", age: 20, active: true },
];

const activeUserNames = users
  .filter((user) => user.active)
  .map((user) => user.name);
// ['John', 'Bob']

const totalAge = users.reduce((sum, user) => sum + user.age, 0);
// 75
```

## 22. What is the Temporal Dead Zone (TDZ)?

**Answer:**
The TDZ is the period between entering scope and initialization where variables cannot be accessed.

```javascript
// Temporal Dead Zone for let/const
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

// TDZ exists from start of block until initialization
{
  // TDZ starts here
  console.log(y); // ReferenceError
  let y = 10; // TDZ ends here
}

// Function in TDZ
{
  console.log(typeof func); // ReferenceError (not 'undefined')
  let func = function () {};
}

// var doesn't have TDZ (but has hoisting issues)
console.log(z); // undefined (not ReferenceError)
var z = 5;

// Practical impact
function example() {
  console.log(typeof value); // ReferenceError
  let value = "test";
}
```

## 23. Explain Memoization

**Answer:**
Memoization caches function results to avoid redundant calculations.

```javascript
// Simple memoization
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Fibonacci without memoization (slow)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Fibonacci with memoization (fast)
const memoizedFibonacci = memoize(function (n) {
  if (n <= 1) return n;
  return memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
});

// Manual memoization
const factorialCache = new Map();
function factorial(n) {
  if (n <= 1) return 1;
  if (factorialCache.has(n)) {
    return factorialCache.get(n);
  }
  const result = n * factorial(n - 1);
  factorialCache.set(n, result);
  return result;
}

// React useMemo equivalent
function useMemo(fn, deps) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(deps);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

## 24. What are Symbols and Their Use Cases?

**Answer:**
Symbols are unique, immutable primitive values used as unique property keys.

```javascript
// Creating symbols
const sym1 = Symbol();
const sym2 = Symbol("description");
const sym3 = Symbol("description");

console.log(sym2 === sym3); // false (always unique)

// Using as object keys
const obj = {
  [sym1]: "value1",
  [sym2]: "value2",
  regular: "regular property",
};

console.log(obj[sym1]); // 'value1'
console.log(Object.keys(obj)); // ['regular'] (symbols not enumerable)

// Well-known symbols
const arr = [1, 2, 3];
arr[Symbol.iterator]; // Iterator symbol

// Custom iterator
const collection = {
  items: [1, 2, 3],
  [Symbol.iterator]: function* () {
    for (let item of this.items) {
      yield item;
    }
  },
};

for (let item of collection) {
  console.log(item); // 1, 2, 3
}

// Symbol.for - global symbol registry
const globalSym = Symbol.for("key");
const sameGlobalSym = Symbol.for("key");
console.log(globalSym === sameGlobalSym); // true

// Use case: Private properties
const PRIVATE_KEY = Symbol("private");
class MyClass {
  constructor() {
    this[PRIVATE_KEY] = "secret";
  }
  getSecret() {
    return this[PRIVATE_KEY];
  }
}
```

## 25. Explain the Difference Between Shallow and Deep Copy

**Answer:**
Shallow copy copies references, deep copy creates new objects recursively.

```javascript
// Shallow copy
const original = {
  name: "John",
  address: {
    city: "NYC",
    zip: "10001",
  },
};

// Shallow copy methods
const shallow1 = Object.assign({}, original);
const shallow2 = { ...original };

shallow1.address.city = "LA";
console.log(original.address.city); // 'LA' (changed!)

// Deep copy methods
// 1. JSON (limitations: no functions, dates, undefined, etc.)
const deep1 = JSON.parse(JSON.stringify(original));
deep1.address.city = "Chicago";
console.log(original.address.city); // 'NYC' (unchanged)

// 2. Recursive deep copy
function deepCopy(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (obj instanceof Array) {
    return obj.map((item) => deepCopy(item));
  }
  const copy = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }
  return copy;
}

const deep2 = deepCopy(original);
deep2.address.city = "Boston";
console.log(original.address.city); // 'NYC' (unchanged)

// 3. Structured cloning (modern browsers)
const deep3 = structuredClone(original);

// Array shallow copy
const arr = [1, 2, [3, 4]];
const arrShallow = [...arr];
arrShallow[2][0] = 99;
console.log(arr[2][0]); // 99 (changed!)

// Array deep copy
const arrDeep = JSON.parse(JSON.stringify(arr));
arrDeep[2][0] = 88;
console.log(arr[2][0]); // 99 (unchanged)
```
