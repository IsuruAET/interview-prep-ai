# 25 React Interview Questions & Answers

## 1. Explain React Components: Functional vs Class Components

**Answer:**
React components are reusable UI pieces. Functional components (with hooks) are now the standard, while class components are legacy.

```typescript
// Functional Component (Modern - Recommended)
import React from "react";

interface Props {
  name: string;
  age: number;
}

const UserProfile: React.FC<Props> = ({ name, age }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
    </div>
  );
};

// Or without React.FC
const UserProfile = ({ name, age }: Props) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
    </div>
  );
};

// Class Component (Legacy)
class UserProfileClass extends React.Component<Props> {
  render() {
    const { name, age } = this.props;
    return (
      <div>
        <h1>{name}</h1>
        <p>Age: {age}</p>
      </div>
    );
  }
}

// When to use:
// - Functional components: Always (modern React)
// - Class components: Only for legacy codebases or error boundaries
```

## 2. Explain useState Hook and Its Behavior

**Answer:**
`useState` manages component state. It returns the current state and a setter function.

```typescript
import { useState } from "react";

// Basic usage
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment (Functional)
      </button>
    </div>
  );
};

// Object state
const UserForm = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const updateName = (name: string) => {
    setUser((prev) => ({ ...prev, name })); // Preserve other fields
  };

  return (
    <input value={user.name} onChange={(e) => updateName(e.target.value)} />
  );
};

// Lazy initialization
const ExpensiveComponent = () => {
  // Only runs once on mount
  const [data, setData] = useState(() => {
    return expensiveCalculation();
  });

  return <div>{data}</div>;
};

// Multiple state variables
const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);

  // Better: Use single state object for related data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: 0,
  });
};
```

## 3. Explain useEffect Hook and Dependency Array

**Answer:**
`useEffect` handles side effects (API calls, subscriptions, DOM manipulation).

```typescript
import { useEffect, useState } from "react";

// Run on every render (no dependency array)
const Component1 = () => {
  useEffect(() => {
    console.log("Runs on every render");
  });
};

// Run only on mount (empty dependency array)
const Component2 = () => {
  useEffect(() => {
    console.log("Runs once on mount");
    // Cleanup function
    return () => {
      console.log("Cleanup on unmount");
    };
  }, []);
};

// Run when dependencies change
const UserProfile = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // Re-runs when userId changes

  return <div>{user?.name}</div>;
};

// Cleanup example: Subscription
const ChatRoom = ({ roomId }: { roomId: string }) => {
  useEffect(() => {
    const subscription = subscribe(roomId);

    return () => {
      subscription.unsubscribe(); // Cleanup on unmount or roomId change
    };
  }, [roomId]);
};

// Multiple effects
const Component = () => {
  useEffect(() => {
    // Effect 1
  }, []);

  useEffect(() => {
    // Effect 2
  }, []);
};

// Async operations in useEffect
useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    const data = await api.getData();
    if (!cancelled) {
      setData(data);
    }
  }

  fetchData();

  return () => {
    cancelled = true;
  };
}, []);
```

## 4. Explain useCallback and useMemo Hooks

**Answer:**
`useCallback` memoizes functions, `useMemo` memoizes computed values to prevent unnecessary recalculations.

```typescript
import { useCallback, useMemo, useState } from "react";

// useCallback - Memoize functions
const Parent = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  // Without useCallback: New function on every render
  const handleClick = () => {
    console.log("Clicked");
  };

  // With useCallback: Same function reference
  const memoizedHandleClick = useCallback(() => {
    console.log("Clicked");
  }, []); // Empty deps = never changes

  // With dependencies
  const handleSubmit = useCallback(
    (value: string) => {
      console.log(name, value);
    },
    [name]
  ); // Recreates when name changes

  return <Child onClick={memoizedHandleClick} />;
};

// useMemo - Memoize computed values
const ExpensiveComponent = ({ items }: { items: number[] }) => {
  const [filter, setFilter] = useState("");

  // Expensive calculation - only runs when items or filter changes
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.toString().includes(filter));
  }, [items, filter]);

  // Another example: Derived state
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a - b);
  }, [items]);

  return (
    <div>
      {filteredItems.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

// When NOT to use
const SimpleComponent = ({ value }: { value: number }) => {
  // Don't memoize simple calculations
  const doubled = value * 2; // OK - simple calculation

  // Don't memoize primitives
  const memoized = useMemo(() => value * 2, [value]); // Unnecessary
};
```

## 5. Explain React.memo and When to Use It

**Answer:**
`React.memo` prevents re-renders when props haven't changed (shallow comparison).

```typescript
import { memo } from "react";

// Without memo: Re-renders on every parent render
const UserCard = ({ name, email }: { name: string; email: string }) => {
  console.log("UserCard rendered");
  return (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
};

// With memo: Only re-renders when props change
const MemoizedUserCard = memo(
  ({ name, email }: { name: string; email: string }) => {
    console.log("MemoizedUserCard rendered");
    return (
      <div>
        <h3>{name}</h3>
        <p>{email}</p>
      </div>
    );
  }
);

// Custom comparison function
const CustomMemoized = memo(
  ({ user }: { user: User }) => {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip render)
    return prevProps.user.id === nextProps.user.id;
  }
);

// Parent component
const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState("");

  // MemoizedUserCard won't re-render when filter changes
  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      {users.map((user) => (
        <MemoizedUserCard key={user.id} name={user.name} email={user.email} />
      ))}
    </div>
  );
};

// When to use:
// - Component receives same props frequently
// - Component is expensive to render
// - Component is in a list with many items
```

## 6. Explain useContext Hook and Context API

**Answer:**
Context provides a way to pass data through the component tree without prop drilling.

```typescript
import { createContext, useContext, useState, ReactNode } from "react";

// Create context
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook with error handling
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

// Consumer component
const ThemedButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
      }}
    >
      Current theme: {theme}
    </button>
  );
};

// App setup
const App = () => {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
};

// Multiple contexts
const UserContext = createContext<User | null>(null);
const SettingsContext = createContext<Settings | null>(null);

const App = () => {
  return (
    <UserContext.Provider value={user}>
      <SettingsContext.Provider value={settings}>
        <Components />
      </SettingsContext.Provider>
    </UserContext.Provider>
  );
};
```

## 7. Explain useRef Hook and Its Use Cases

**Answer:**
`useRef` returns a mutable ref object that persists across renders without causing re-renders.

```typescript
import { useRef, useEffect } from "react";

// DOM reference
const InputFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
};

// Storing mutable values (doesn't trigger re-render)
const Timer = () => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
};

// Previous value tracking
const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

const Component = ({ count }: { count: number }) => {
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
    </div>
  );
};

// Imperative handle (exposing methods to parent)
const FancyInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    getValue: () => inputRef.current?.value,
  }));

  return <input ref={inputRef} />;
});
```

## 8. Explain Custom Hooks

**Answer:**
Custom hooks extract component logic into reusable functions.

```typescript
import { useState, useEffect } from "react";

// Custom hook: API data fetching
const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();

        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
};

// Usage
const UserProfile = ({ userId }: { userId: number }) => {
  const { data: user, loading, error } = useFetch<User>(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return null;

  return <div>{user.name}</div>;
};

// Custom hook: Local storage
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};

// Custom hook: Debounce
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // API call with debounced value
    searchAPI(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
  );
};
```

## 9. Explain React Router and Navigation

**Answer:**
React Router enables client-side routing and navigation in React applications.

```typescript
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

// Basic routing setup
const App = () => {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail /> />
        <Route path="*" element={<NotFound />} /> {/* 404 */}
      </Routes>
    </BrowserRouter>
  );
};

// Dynamic routes with useParams
const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user } = useFetch<User>(`/api/users/${id}`);

  return <div>User: {user?.name}</div>;
};

// Programmatic navigation
const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate('/dashboard'); // Navigate programmatically
  };

  return <button onClick={handleLogin}>Login</button>;
};

// Protected routes
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Nested routes
const App = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

const Dashboard = () => {
  return (
    <div>
      <Outlet /> {/* Renders nested routes */}
    </div>
  );
};
```

## 10. Explain Error Boundaries

**Answer:**
Error boundaries catch JavaScript errors in child components and display fallback UI.

```typescript
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            <h2>Something went wrong.</h2>
            <p>{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Usage
const App = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ComponentThatMightError />
    </ErrorBoundary>
  );
};

// Hook-based error boundary (using react-error-boundary library)
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // Log error
      }}
      onReset={() => {
        // Reset app state
      }}
    >
      <App />
    </ErrorBoundary>
  );
};
```

## 11. Explain React Portals

**Answer:**
Portals render children into a DOM node outside the parent component hierarchy.

```typescript
import { createPortal } from "react-dom";

// Modal component using portal
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body // Render to body instead of parent
  );
};

// Tooltip using portal
const Tooltip = ({ children, text }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
      setIsVisible(true);
    }
  };

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            className="tooltip"
            style={{
              position: "fixed",
              left: position.x,
              top: position.y,
              zIndex: 1000,
            }}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
};

// Toast notifications
const ToastContainer = () => {
  return createPortal(
    <div className="toast-container">{/* Toasts rendered here */}</div>,
    document.getElementById("toast-root")!
  );
};
```

## 12. Explain Code Splitting and Lazy Loading

**Answer:**
Code splitting loads components only when needed, reducing initial bundle size.

```typescript
import { lazy, Suspense } from "react";

// Lazy load component
const LazyComponent = lazy(() => import("./HeavyComponent"));

// With default export
const Dashboard = lazy(() => import("./Dashboard"));

// With named export
const UserProfile = lazy(() =>
  import("./UserProfile").then((module) => ({
    default: module.UserProfile,
  }))
);

// Usage with Suspense
const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
};

// Route-based code splitting
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Suspense>
  );
};

// Multiple lazy components
const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/dashboard/*"
          element={
            <Suspense fallback={<DashboardLoader />}>
              <Dashboard />
            </Suspense>
          }
        />
      </Routes>
    </Suspense>
  );
};

// Preloading
const preloadComponent = () => {
  const component = import("./HeavyComponent");
  return component;
};

const Button = () => {
  const handleMouseEnter = () => {
    preloadComponent(); // Preload on hover
  };

  return <button onMouseEnter={handleMouseEnter}>Click me</button>;
};
```

## 13. Explain React Performance Optimization Techniques

**Answer:**
Multiple techniques optimize React app performance.

```typescript
// 1. React.memo for component memoization
const ExpensiveComponent = memo(({ data }: Props) => {
  return <div>{/* Expensive rendering */}</div>;
});

// 2. useMemo for expensive calculations
const Component = ({ items }: { items: Item[] }) => {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.value - b.value);
  }, [items]);

  return (
    <div>
      {sortedItems.map((item) => (
        <Item key={item.id} {...item} />
      ))}
    </div>
  );
};

// 3. useCallback for function memoization
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("Clicked");
  }, []);

  return <Child onClick={handleClick} />;
};

// 4. Virtualization for long lists
import { FixedSizeList } from "react-window";

const VirtualizedList = ({ items }: { items: Item[] }) => {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => <div style={style}>{items[index].name}</div>}
    </FixedSizeList>
  );
};

// 5. Image lazy loading
const LazyImage = ({ src, alt }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsLoaded(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : undefined}
      alt={alt}
      loading="lazy"
    />
  );
};

// 6. Debouncing expensive operations
const SearchInput = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Expensive search operation
    performSearch(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
};
```

## 14. Explain Controlled vs Uncontrolled Components

**Answer:**
Controlled components use React state, uncontrolled components use DOM refs.

```typescript
// Controlled component
const ControlledInput = () => {
  const [value, setValue] = useState("");

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
};

// Controlled form
const ControlledForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <input name="age" value={formData.age} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

// Uncontrolled component
const UncontrolledInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    console.log(inputRef.current?.value);
  };

  return (
    <>
      <input ref={inputRef} defaultValue="initial" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
};

// Uncontrolled form
const UncontrolledForm = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    const data = Object.fromEntries(formData);
    console.log(data);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="name" defaultValue="" />
      <input name="email" defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
};

// When to use:
// Controlled: Need validation, conditional rendering, form state management
// Uncontrolled: Simple forms, file inputs, third-party integrations
```

## 15. Explain React State Management Patterns

**Answer:**
Various patterns manage state in React applications.

```typescript
// 1. Local state (useState)
const Component = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};

// 2. Lifted state (sharing between siblings)
const Parent = () => {
  const [sharedState, setSharedState] = useState("");

  return (
    <>
      <ChildA value={sharedState} onChange={setSharedState} />
      <ChildB value={sharedState} />
    </>
  );
};

// 3. Context API (global state)
const StateContext = createContext<{
  state: AppState;
  setState: (state: AppState) => void;
} | null>(null);

const App = () => {
  const [state, setState] = useState<AppState>(initialState);

  return (
    <StateContext.Provider value={{ state, setState }}>
      <Components />
    </StateContext.Provider>
  );
};

// 4. useReducer (complex state logic)
type Action = { type: "increment" } | { type: "decrement" } | { type: "reset" };

const reducer = (state: number, action: Action): number => {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    case "reset":
      return 0;
    default:
      return state;
  }
};

const Counter = () => {
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
};

// 5. Custom hook for state management
const useAppState = () => {
  const [state, setState] = useState(initialState);

  const updateUser = (user: User) => {
    setState((prev) => ({ ...prev, user }));
  };

  const updateSettings = (settings: Settings) => {
    setState((prev) => ({ ...prev, settings }));
  };

  return { state, updateUser, updateSettings };
};

// 6. External state management (Zustand example)
import create from "zustand";

interface Store {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

const Component = () => {
  const { count, increment, decrement } = useStore();
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};
```

## 16. Explain useReducer Hook

**Answer:**
`useReducer` manages complex state logic with actions and reducers.

```typescript
import { useReducer } from "react";

// Basic reducer
type State = { count: number };
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "set"; payload: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    case "set":
      return { count: action.payload };
    default:
      return state;
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "set", payload: 10 })}>
        Set to 10
      </button>
    </div>
  );
};

// Complex state with useReducer
interface TodoState {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  searchTerm: string;
}

type TodoAction =
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "TOGGLE_TODO"; payload: number }
  | { type: "DELETE_TODO"; payload: number }
  | { type: "SET_FILTER"; payload: "all" | "active" | "completed" }
  | { type: "SET_SEARCH"; payload: string };

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
};

const TodoApp = () => {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: "all",
    searchTerm: "",
  });

  const filteredTodos = state.todos
    .filter((todo) => {
      if (state.filter === "active") return !todo.completed;
      if (state.filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.text.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

  return (
    <div>
      <input
        value={state.searchTerm}
        onChange={(e) =>
          dispatch({ type: "SET_SEARCH", payload: e.target.value })
        }
      />
      {/* Render todos */}
    </div>
  );
};

// Lazy initialization
const init = (initialCount: number) => ({ count: initialCount });

const Counter = ({ initialCount }: { initialCount: number }) => {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  // ...
};
```

## 17. Explain React Hooks Rules and Best Practices

**Answer:**
Hooks have rules that must be followed for correct behavior.

```typescript
// Rules:
// 1. Only call hooks at the top level (not in loops, conditions, nested functions)
// 2. Only call hooks from React functions (components or custom hooks)

// ❌ Wrong: Conditional hook
const Component = ({ condition }: { condition: boolean }) => {
  if (condition) {
    const [state, setState] = useState(0); // Error!
  }
  return <div />;
};

// ✅ Correct: Always call hooks
const Component = ({ condition }: { condition: boolean }) => {
  const [state, setState] = useState(0);

  if (condition) {
    // Use state here
  }
  return <div />;
};

// ❌ Wrong: Hook in loop
const Component = ({ items }: { items: Item[] }) => {
  items.forEach((item) => {
    const [state, setState] = useState(0); // Error!
  });
  return <div />;
};

// ✅ Correct: Extract to custom hook
const useItemState = (item: Item) => {
  return useState(0);
};

const Component = ({ items }: { items: Item[] }) => {
  return (
    <>
      {items.map((item) => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </>
  );
};

// ❌ Wrong: Hook in callback
const Component = () => {
  const handleClick = () => {
    const [state, setState] = useState(0); // Error!
  };
  return <button onClick={handleClick}>Click</button>;
};

// ✅ Correct: Call hook at top level
const Component = () => {
  const [state, setState] = useState(0);

  const handleClick = () => {
    setState(state + 1);
  };

  return <button onClick={handleClick}>Click</button>;
};

// Best practices:
// 1. Use ESLint plugin for hooks
// 2. Extract complex logic to custom hooks
// 3. Keep hooks focused and single-purpose
// 4. Use dependency arrays correctly
// 5. Clean up effects properly

// Custom hook best practices
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
};
```

## 18. Explain React Server Components (RSC)

**Answer:**
Server Components render on the server, reducing client bundle size and enabling direct database access.

```typescript
// Server Component (Next.js 13+ App Router)
// app/users/page.tsx
async function UsersPage() {
  // This runs on the server
  const users = await fetch("https://api.example.com/users").then((r) =>
    r.json()
  );

  return (
    <div>
      <h1>Users</h1>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// Client Component (when interactivity needed)
("use client");

import { useState } from "react";

const InteractiveButton = () => {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
};

// Mixing Server and Client Components
// Server Component
async function ProductPage({ id }: { id: string }) {
  const product = await getProduct(id);

  return (
    <div>
      <h1>{product.name}</h1>
      <ProductDetails product={product} />
      <AddToCartButton productId={id} /> {/* Client Component */}
    </div>
  );
}

// Benefits:
// - Smaller client bundle
// - Direct database/API access
// - Better security (secrets stay on server)
// - Improved performance

// Limitations:
// - No useState, useEffect, event handlers
// - No browser-only APIs
// - Must use 'use client' for interactivity
```

## 19. Explain React Suspense and Concurrent Features

**Answer:**
Suspense enables declarative loading states, and Concurrent React allows interruptible rendering.

```typescript
import { Suspense, startTransition, useDeferredValue } from "react";

// Basic Suspense
const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AsyncComponent />
    </Suspense>
  );
};

// Multiple Suspense boundaries
const App = () => {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <Suspense fallback={<ContentSkeleton />}>
        <Content />
      </Suspense>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
    </div>
  );
};

// useTransition for non-urgent updates
const SearchResults = ({ query }: { query: string }) => {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    startTransition(() => {
      // Non-urgent update
      fetchResults(query).then(setResults);
    });
  }, [query]);

  return (
    <div>
      {isPending && <div>Searching...</div>}
      {results.map((result) => (
        <ResultItem key={result.id} result={result} />
      ))}
    </div>
  );
};

// useDeferredValue for deferring values
const SearchInput = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </div>
  );
};

// Concurrent rendering benefits:
// - Interruptible rendering
// - Automatic batching
// - Prioritized updates
// - Better user experience
```

## 20. Explain React Testing Patterns

**Answer:**
Testing React components requires specific patterns and tools.

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";

// Component testing
const Button = ({ onClick, children }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>;
};

test("renders button and handles click", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  const button = screen.getByText("Click me");
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Testing with hooks
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

test("increments count", () => {
  render(<Counter />);

  const button = screen.getByText("Increment");
  const count = screen.getByText("0");

  fireEvent.click(button);

  expect(screen.getByText("1")).toBeInTheDocument();
});

// Testing async operations
const UserProfile = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return <div>{user.name}</div>;
};

test("loads and displays user", async () => {
  const mockUser = { id: 1, name: "John" };
  jest.spyOn(global, "fetch").mockResolvedValue({
    json: async () => mockUser,
  } as Response);

  render(<UserProfile userId={1} />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("John")).toBeInTheDocument();
  });
});

// Testing custom hooks
const useCounter = (initial = 0) => {
  const [count, setCount] = useState(initial);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return { count, increment, decrement };
};

test("useCounter hook", () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);

  act(() => {
    result.current.decrement();
  });

  expect(result.current.count).toBe(0);
});

// Testing with context
const ThemeContext = createContext<"light" | "dark">("light");

const ThemedComponent = () => {
  const theme = useContext(ThemeContext);
  return <div data-theme={theme}>Content</div>;
};

test("renders with theme context", () => {
  render(
    <ThemeContext.Provider value="dark">
      <ThemedComponent />
    </ThemeContext.Provider>
  );

  expect(screen.getByText("Content")).toHaveAttribute("data-theme", "dark");
});
```

## 21. Explain React Forms and Validation

**Answer:**
Forms in React can be handled with validation libraries or custom logic.

```typescript
import { useState } from "react";

// Basic form with validation
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      // Submit form
      console.log("Form submitted:", formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <button type="submit">Login</button>
    </form>
  );
};

// Using React Hook Form (popular library)
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

const LoginFormRHF = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Email is invalid",
          },
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
      />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
};
```

## 22. Explain React Component Patterns

**Answer:**
Various patterns solve common React problems.

```typescript
// 1. Compound Components
const Tabs = ({ children }: { children: ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </TabsContext.Provider>
  );
};

const TabsList = ({ children }: { children: ReactNode }) => {
  return <div className="tabs-list">{children}</div>;
};

const TabsTrigger = ({ index, children }: TabsTriggerProps) => {
  const { activeIndex, setActiveIndex } = useTabsContext();

  return (
    <button
      className={activeIndex === index ? "active" : ""}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ index, children }: TabsContentProps) => {
  const { activeIndex } = useTabsContext();

  if (activeIndex !== index) return null;
  return <div>{children}</div>;
};

// Usage
<Tabs>
  <TabsList>
    <TabsTrigger index={0}>Tab 1</TabsTrigger>
    <TabsTrigger index={1}>Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent index={0}>Content 1</TabsContent>
  <TabsContent index={1}>Content 2</TabsContent>
</Tabs>;

// 2. Render Props
interface DataFetcherProps<T> {
  url: string;
  children: (
    data: T | null,
    loading: boolean,
    error: Error | null
  ) => ReactNode;
}

const DataFetcher = <T>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return <>{children(data, loading, error)}</>;
};

// Usage
<DataFetcher<User> url="/api/user">
  {(user, loading, error) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return <div>{user?.name}</div>;
  }}
</DataFetcher>;

// 3. Higher-Order Component (HOC)
const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { user } = useAuth();

    if (!user) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} />;
  };
};

const ProtectedComponent = withAuth(MyComponent);

// 4. Children as Function
interface ToggleProps {
  children: (isOpen: boolean, toggle: () => void) => ReactNode;
}

const Toggle = ({ children }: ToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return <>{children(isOpen, () => setIsOpen(!isOpen))}</>;
};

// Usage
<Toggle>
  {(isOpen, toggle) => (
    <div>
      <button onClick={toggle}>Toggle</button>
      {isOpen && <div>Content</div>}
    </div>
  )}
</Toggle>;
```

## 23. Explain React Virtual DOM and Reconciliation

**Answer:**
Virtual DOM is a JavaScript representation of the real DOM. Reconciliation is React's diffing algorithm.

```typescript
// Virtual DOM concept
// React creates a virtual representation:
const virtualElement = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: { children: 'Hello' }
      }
    ]
  }
};

// Reconciliation process:
// 1. React creates new virtual DOM tree
// 2. Compares with previous tree (diffing)
// 3. Calculates minimal changes
// 4. Updates only changed DOM nodes

// Keys are crucial for reconciliation
const List = ({ items }: { items: Item[] }) => {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
        // Key helps React identify which items changed
      ))}
    </ul>
  );
};

// Without keys, React can't efficiently update
// With keys, React can:
// - Identify moved items
// - Preserve component state
// - Avoid unnecessary re-renders

// Reconciliation rules:
// 1. Elements of different types → Replace
<div>
  <Counter />
</div>
// Changes to:
<span>
  <Counter />
</span>
// Counter is unmounted and remounted

// 2. Same element type → Update props
<div className="before" />
// Changes to:
<div className="after" />
// Only className is updated

// 3. Component type changes → Unmount old, mount new
<Button />
// Changes to:
<Input />
// Button unmounts, Input mounts

// 4. Keys help identify elements
<ul>
  <li key="1">First</li>
  <li key="2">Second</li>
</ul>
// Changes to:
<ul>
  <li key="2">Second</li>
  <li key="1">First</li>
</ul>
// React knows items moved, doesn't recreate them
```

## 24. Explain React Fiber Architecture

**Answer:**
Fiber is React's reconciliation algorithm that enables incremental rendering and prioritization.

```typescript
// Fiber architecture benefits:
// 1. Incremental rendering (can pause/resume work)
// 2. Priority-based updates
// 3. Better error boundaries
// 4. Concurrent features

// How it works:
// - Each component has a Fiber node
// - Fiber nodes form a tree
// - Work can be split into units
// - High-priority updates interrupt low-priority

// Example: Priority-based updates
const App = () => {
  const [urgent, setUrgent] = useState("");
  const [nonUrgent, setNonUrgent] = useState("");

  // Urgent update (user input)
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrgent(e.target.value); // High priority
  };

  // Non-urgent update (search results)
  const handleSearch = (query: string) => {
    startTransition(() => {
      setNonUrgent(query); // Low priority, can be interrupted
    });
  };

  return (
    <div>
      <input onChange={handleInput} />
      <SearchResults query={nonUrgent} />
    </div>
  );
};

// Fiber enables:
// - Time slicing (split work across frames)
// - Suspense (pause rendering for async)
// - Concurrent rendering
// - Automatic batching
```

## 25. Explain React Best Practices and Patterns

**Answer:**
Best practices improve code quality, performance, and maintainability.

```typescript
// 1. Component composition over inheritance
// ❌ Bad: Inheritance
class Button extends BaseComponent {}

// ✅ Good: Composition
const Button = ({ children, ...props }: ButtonProps) => {
  return <BaseComponent {...props}>{children}</BaseComponent>;
};

// 2. Single Responsibility Principle
// ❌ Bad: Component does too much
const UserDashboard = () => {
  // User profile, settings, posts, comments all in one
};

// ✅ Good: Split into smaller components
const UserDashboard = () => {
  return (
    <div>
      <UserProfile />
      <UserSettings />
      <UserPosts />
    </div>
  );
};

// 3. Extract custom hooks for reusable logic
// ❌ Bad: Logic in component
const Component1 = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then(setData);
  }, []);
};

const Component2 = () => {
  // Duplicate logic
};

// ✅ Good: Custom hook
const useData = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then(setData);
  }, []);
  return data;
};

// 4. Use TypeScript for type safety
interface UserProps {
  name: string;
  age: number;
  email?: string;
}

const User = ({ name, age, email }: UserProps) => {
  // Type-safe props
};

// 5. Memoization when needed
const ExpensiveList = memo(({ items }: { items: Item[] }) => {
  const sorted = useMemo(() => items.sort(), [items]);
  return (
    <div>
      {sorted.map((item) => (
        <Item key={item.id} {...item} />
      ))}
    </div>
  );
});

// 6. Proper key usage
// ✅ Good: Stable, unique keys
{
  users.map((user) => <UserCard key={user.id} user={user} />);
}

// ❌ Bad: Index as key (unless list is static)
{
  users.map((user, index) => <UserCard key={index} user={user} />);
}

// 7. Error boundaries for error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught:", error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <UserDashboard />
    </ErrorBoundary>
  );
};

// 8. Code splitting and lazy loading
const LazyComponent = React.lazy(() => import("./HeavyComponent"));

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
};

// 9. Proper prop destructuring
// ❌ Bad: Accessing props directly
const User = (props: UserProps) => {
  return <div>{props.name}</div>;
};

// ✅ Good: Destructure props
const User = ({ name, age, email }: UserProps) => {
  return <div>{name}</div>;
};

// 10. Avoid inline object/function creation in render
// ❌ Bad: Creates new object/function on every render
const Component = ({ items }: { items: Item[] }) => {
  return <Child style={{ color: "red" }} onClick={() => {}} items={items} />;
};

// ✅ Good: Extract or memoize
const Component = ({ items }: { items: Item[] }) => {
  const style = useMemo(() => ({ color: "red" }), []);
  const handleClick = useCallback(() => {}, []);
  return <Child style={style} onClick={handleClick} items={items} />;
};

// 11. Use proper event handlers
const Button = ({ onClick, children }: ButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick?.(e);
  };
  return <button onClick={handleClick}>{children}</button>;
};

// 12. Controlled vs Uncontrolled components
// Controlled (recommended for forms)
const ControlledInput = () => {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
};

// Uncontrolled (for simple cases)
const UncontrolledInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = () => {
    console.log(inputRef.current?.value);
  };
  return <input ref={inputRef} />;
};

// 13. Use React DevTools for debugging
// - Component tree inspection
// - Props and state inspection
// - Performance profiling
// - Hook inspection

// 14. Follow naming conventions
// Components: PascalCase (UserProfile)
// Hooks: camelCase starting with 'use' (useUserData)
// Props interfaces: ComponentNameProps (UserProfileProps)
// Constants: UPPER_SNAKE_CASE (API_BASE_URL)

// 15. Keep components small and focused
// Each component should do one thing well
// Extract complex logic into custom hooks
// Use composition to build complex UIs
```
