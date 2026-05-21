'use client';

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import { Box, Text, Collapse } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { useDevMode } from './DevModeContext';

const useStyles = createStyles(() => ({
  wrapper: {
    width: '100%',
    maxWidth: 800,
    margin: '60px auto 0',
    padding: '50px 20px',
    fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
  },
  terminalWindow: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid #333',
  },
  titleBar: {
    backgroundColor: '#323232',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  titleBarButton: {
    width: 12,
    height: 12,
    borderRadius: '50%',
  },
  closeButton: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#ff5f56',
    cursor: 'pointer',
  },
  minimizeButton: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#ffbd2e',
  },
  maximizeButton: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#27ca40',
  },
  titleText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#888',
  },
  terminalContent: {
    padding: 16,
    height: 300,
    overflowY: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    cursor: 'text',
  },
  terminalContentCode: {
    padding: 16,
    height: 300,
    overflowY: 'auto',
    backgroundColor: 'rgba(0, 10, 0, 0.95)',
    cursor: 'text',
  },
  historyLine: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    color: '#e0e0e0',
  },
  historyLineCommand: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    color: '#27ca40',
  },
  historyLineHack: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    color: '#00ff00',
  },
  historyLineFact: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    color: '#ffbd2e',
  },
  developerCode: {
    color: '#00ff00',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.4,
    textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
    fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
    fontSize: 12,
  },
  cursor: {
    backgroundColor: '#00ff00',
    color: '#000',
    animation: 'blink 1s infinite',
  },
  '@keyframes blink': {
    '0%, 50%': { opacity: 1 },
    '51%, 100%': { opacity: 0 },
  },
  developerArea: {
    outline: 'none',
    minHeight: '100%',
  },
  inputLine: {
    display: 'flex',
    alignItems: 'center',
  },
  prompt: {
    color: '#27ca40',
    marginRight: 8,
  },
  input: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e0e0e0',
    fontFamily: 'inherit',
    fontSize: 14,
    flex: 1,
    caretColor: '#27ca40',
  },
}));

const funFacts = [
  "I knew I wanted to get into technology when I was gifted an iPod Nano in 2007.",
  "I firmly believe Windows Phone was too ahead for its time.",
  "I have a collection of over 200 Blu Ray movies",
  "I have 3 sphinx cats and 2 of them are dwarves",
];

const developerCodeBlocks = [
  `type DeepReadonly<T> = T extends (infer U)[]
  ? DeepReadonlyArray<U>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T;
type PickByValue<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] };
type Flatten<T extends unknown[]> = T extends [infer H, ...infer R]
  ? H extends unknown[] ? [...H, ...Flatten<R>] : [H, ...Flatten<R>]
  : [];`,
  `async function* streamWithBackpressure<T>(
  source: AsyncIterable<T>,
  bufferSize: number
): AsyncGenerator<T> {
  const buffer: T[] = [];
  let done = false;
  const fill = async () => {
    for await (const item of source) {
      buffer.push(item);
      if (buffer.length >= bufferSize) await new Promise(r => setTimeout(r, 0));
    }
    done = true;
  };
  void fill();
  while (!done || buffer.length > 0) {
    if (buffer.length === 0) await new Promise(r => setTimeout(r, 1));
    else yield buffer.shift()!;
  }
}`,
  `class EventEmitter<Events extends Record<string, unknown>> {
  private listeners = new Map<keyof Events, Set<(payload: unknown) => void>>();

  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    const set = this.listeners.get(event)!;
    set.add(handler as (p: unknown) => void);
    return () => set.delete(handler as (p: unknown) => void);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners.get(event)?.forEach(h => h(payload));
  }
}`,
  `function memoize<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  keyFn: (...args: Args) => string = (...args) => JSON.stringify(args)
): (...args: Args) => R {
  const cache = new Map<string, R>();
  return (...args: Args): R => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
const fib = memoize((n: number): number => n <= 1 ? n : fib(n - 1) + fib(n - 2));`,
  `type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
const Ok = <T>(value: T): Result<T> => ({ ok: true, value });
const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) return Err(new Error(\`HTTP \${res.status}\`));
    return Ok(await res.json() as User);
  } catch (e) {
    return Err(e instanceof Error ? e : new Error(String(e)));
  }
}`,
  `type Middleware<S> = (state: S, next: (state: S) => S) => S;
function compose<S>(...middlewares: Middleware<S>[]): Middleware<S> {
  return (state, next) =>
    middlewares.reduceRight(
      (acc, mw) => (s: S) => mw(s, acc),
      next
    )(state);
}

const logger: Middleware<AppState> = (state, next) => {
  console.log('before:', state);
  const result = next(state);
  console.log('after:', result);
  return result;
};`,
  `function useDebounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): [T, () => void] {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const debounced = useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  ) as T;
  const flush = useCallback(() => clearTimeout(timer.current), []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [debounced, flush];
}`,
  `class ObservableMap<K, V> extends Map<K, V> {
  private subscribers = new Set<(map: this) => void>();

  subscribe(fn: (map: this) => void): () => void {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  private notify() { this.subscribers.forEach(fn => fn(this)); }

  override set(key: K, value: V): this {
    super.set(key, value);
    this.notify();
    return this;
  }
  override delete(key: K): boolean {
    const result = super.delete(key);
    if (result) this.notify();
    return result;
  }
}`,
  `type Builder<T, Required extends keyof T = never> = {
  [K in keyof T]-?: (value: T[K]) => Builder<T, Required | K>;
} & (Required extends keyof T ? { build(): T } : object);

function createBuilder<T>(): Builder<T> {
  const data: Partial<T> = {};
  return new Proxy({} as Builder<T>, {
    get(_, key: string) {
      if (key === 'build') return () => data as T;
      return (value: unknown) => { (data as Record<string, unknown>)[key] = value; return proxy; };
    },
  });
}`,
  `function createStateMachine<S extends string, E extends string>(config: {
  initial: S;
  transitions: Partial<Record<S, Partial<Record<E, S>>>>;
}) {
  let current = config.initial;
  return {
    get state() { return current; },
    send(event: E): boolean {
      const next = config.transitions[current]?.[event];
      if (!next) return false;
      current = next;
      return true;
    },
    matches(...states: S[]): boolean { return states.includes(current); },
  };
}`,
  `type PathsToLeaves<T, P extends string = ""> = T extends object
  ? { [K in keyof T]: PathsToLeaves<T[K], \`\${P}\${P extends "" ? "" : "."}\${K & string}\`> }[keyof T]
  : P;
type GetAtPath<T, Path extends string> =
  Path extends \`\${infer Head}.\${infer Tail}\`
    ? Head extends keyof T ? GetAtPath<T[Head], Tail> : never
    : Path extends keyof T ? T[Path] : never;

function getByPath<T, P extends PathsToLeaves<T>>(obj: T, path: P): GetAtPath<T, P> {
  return path.split('.').reduce((acc: unknown, k) => (acc as Record<string, unknown>)[k], obj) as GetAtPath<T, P>;
}`,
  `class TaskQueue {
  private running = 0;
  private queue: Array<() => Promise<void>> = [];

  constructor(private readonly concurrency: number) {}

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try { resolve(await task()); } catch (e) { reject(e); } finally { this.dequeue(); }
      });
      this.dequeue();
    });
  }

  private dequeue() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      this.running++;
      this.queue.shift()!();
    }
    if (this.queue.length === 0) this.running = Math.max(0, this.running - 1);
  }
}`,
];

const welcomeMessage = `
Welcome to RonShell v1.0.0
Type 'help' to see available commands.
`;

const helpMessage = `
Available commands:
  help      - Show this help message
  dev       - Enter developer mode (press any key to "code")
  fact      - Get a random fun fact about Ron
  clear     - Clear the terminal
  exit      - Exit developer mode
`;

export function Terminal() {
  const { classes } = useStyles();
  const { devMode, setDevMode } = useDevMode();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([welcomeMessage, helpMessage]);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [codeBuffer, setCodeBuffer] = useState('');
  const [codeFullText, setCodeFullText] = useState('');
  const [codeCharIndex, setCodeCharIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const developerDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (devMode && inputRef.current && !isCodeMode) {
      inputRef.current.focus();
    }
  }, [devMode, isCodeMode]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, codeBuffer]);

  useEffect(() => {
    if (isCodeMode && developerDivRef.current) {
      developerDivRef.current.focus();
    }
  }, [isCodeMode]);

  const addToHistory = useCallback((text: string) => {
    setHistory((prev) => [...prev, text]);
  }, []);

  const generateCodeBlock = useCallback((): string => {
    const shuffled = [...developerCodeBlocks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6).join('\n\n// ========== NEXT MODULE ==========\n\n');
  }, []);

  const startCodeMode = useCallback(() => {
    setIsCodeMode(true);
    setCodeBuffer('');
    setCodeCharIndex(0);
    const code = generateCodeBlock();
    setCodeFullText(code);
    addToHistory('\n[CODE MODE ACTIVATED] - Press any key to type... (ESC to exit)\n');
  }, [generateCodeBlock, addToHistory]);

  const exitCodeMode = useCallback(() => {
    setIsCodeMode(false);
    setHistory((prev) => [...prev, codeBuffer, '\n[CODE MODE DEACTIVATED]\n']);
    setCodeBuffer('');
    setCodeFullText('');
    setCodeCharIndex(0);
  }, [codeBuffer]);

  const handleCodeKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      exitCodeMode();
      return;
    }

    e.preventDefault();

    const charsPerKeypress = Math.floor(Math.random() * 3) + 2;
    const nextIndex = Math.min(codeCharIndex + charsPerKeypress, codeFullText.length);
    const newBuffer = codeFullText.slice(0, nextIndex);

    setCodeBuffer(newBuffer);
    setCodeCharIndex(nextIndex);

    if (nextIndex >= codeFullText.length) {
      const moreCode = '\n\n// ========== BUILD SUCCESSFUL ==========\n\n' + generateCodeBlock();
      setCodeFullText((prev) => prev + moreCode);
    }
  }, [codeFullText, codeCharIndex, exitCodeMode, generateCodeBlock]);

  const getRandomFact = useCallback(() => {
    const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
    addToHistory(`\n💡 Fun Fact: ${fact}\n`);
  }, [addToHistory]);

  const handleCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    addToHistory(`$ ${cmd}`);

    switch (trimmedCmd) {
      case 'help':
        addToHistory(helpMessage);
        break;
      case 'dev':
      case 'code':
        startCodeMode();
        break;
      case 'fact':
        getRandomFact();
        break;
      case 'clear':
        setHistory([welcomeMessage]);
        break;
      case 'exit':
      case 'quit':
        setDevMode(false);
        break;
      default:
        if (trimmedCmd) {
          addToHistory(`Command not found: ${cmd}. Type 'help' for available commands.`);
        }
    }
    setInput('');
  }, [addToHistory, startCodeMode, getRandomFact, setDevMode]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isCodeMode) {
      handleCommand(input);
    }
  }, [isCodeMode, handleCommand, input]);

  const handleTerminalClick = useCallback(() => {
    if (isCodeMode && developerDivRef.current) {
      developerDivRef.current.focus();
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCodeMode]);

  const getLineClassName = useCallback((line: string) => {
    if (line.startsWith('$')) return classes.historyLineCommand;
    if (line.startsWith('>')) return classes.historyLineHack;
    if (line.includes('Fun Fact')) return classes.historyLineFact;
    return classes.historyLine;
  }, [classes]);

  return (
    <Collapse in={devMode} transitionDuration={300}>
      <Box className={classes.wrapper}>
        <Box className={classes.terminalWindow}>
          <Box className={classes.titleBar}>
            <Box className={classes.closeButton} onClick={() => setDevMode(false)} />
            <Box className={classes.minimizeButton} />
            <Box className={classes.maximizeButton} />
            <Text size="xs" className={classes.titleText}>
              {isCodeMode ? 'ron@portfolio ~ tsx' : 'ron@portfolio ~ zsh'}
            </Text>
          </Box>

          <Box
            ref={terminalRef}
            onClick={handleTerminalClick}
            className={isCodeMode ? classes.terminalContentCode : classes.terminalContent}
          >
            {isCodeMode ? (
              <Box
                ref={developerDivRef}
                tabIndex={0}
                onKeyDown={handleCodeKeyDown}
                className={classes.developerArea}
              >
                {history.map((line, index) => (
                  <Text key={index} size="sm" className={getLineClassName(line)}>
                    {line}
                  </Text>
                ))}
                <Text size="xs" className={classes.developerCode}>
                  {codeBuffer}
                  <span className={classes.cursor}>▊</span>
                </Text>
              </Box>
            ) : (
              <>
                {history.map((line, index) => (
                  <Text key={index} size="sm" className={getLineClassName(line)}>
                    {line}
                  </Text>
                ))}

                <Box className={classes.inputLine}>
                  <Text size="sm" className={classes.prompt}>$</Text>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={classes.input}
                    autoFocus
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Collapse>
  );
}
