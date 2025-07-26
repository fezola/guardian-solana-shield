// Polyfills for Node.js globals in browser environment

// Simple Buffer polyfill for basic functionality
if (typeof window !== 'undefined' && !window.Buffer) {
  // Create a minimal Buffer implementation
  class BufferPolyfill {
    private data: Uint8Array;

    constructor(input: any, encoding?: string) {
      if (typeof input === 'string') {
        if (encoding === 'hex') {
          const bytes = [];
          for (let i = 0; i < input.length; i += 2) {
            bytes.push(parseInt(input.substr(i, 2), 16));
          }
          this.data = new Uint8Array(bytes);
        } else if (encoding === 'base64') {
          const binaryString = atob(input);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          this.data = bytes;
        } else {
          // Default to UTF-8
          const encoder = new TextEncoder();
          this.data = encoder.encode(input);
        }
      } else if (input instanceof Uint8Array) {
        this.data = input;
      } else if (Array.isArray(input)) {
        this.data = new Uint8Array(input);
      } else if (typeof input === 'number') {
        this.data = new Uint8Array(input);
      } else {
        this.data = new Uint8Array(0);
      }
    }

    static from(input: any, encoding?: string): BufferPolyfill {
      return new BufferPolyfill(input, encoding);
    }

    static alloc(size: number): BufferPolyfill {
      return new BufferPolyfill(size);
    }

    static isBuffer(obj: any): boolean {
      return obj instanceof BufferPolyfill;
    }

    toString(encoding?: string): string {
      if (encoding === 'hex') {
        return Array.from(this.data)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      } else if (encoding === 'base64') {
        const binaryString = String.fromCharCode(...this.data);
        return btoa(binaryString);
      } else {
        // Default to UTF-8
        const decoder = new TextDecoder();
        return decoder.decode(this.data);
      }
    }

    get length(): number {
      return this.data.length;
    }

    slice(start?: number, end?: number): BufferPolyfill {
      return new BufferPolyfill(this.data.slice(start, end));
    }

    [Symbol.iterator]() {
      return this.data[Symbol.iterator]();
    }

    // Make it array-like
    [index: number]: number;
  }

  // Add array-like indexing
  Object.defineProperty(BufferPolyfill.prototype, Symbol.iterator, {
    value: function* () {
      for (let i = 0; i < this.data.length; i++) {
        yield this.data[i];
      }
    }
  });

  // Set up proxy for array-like access
  const BufferProxy = new Proxy(BufferPolyfill, {
    construct(target, args) {
      const instance = new target(...args);
      return new Proxy(instance, {
        get(obj, prop) {
          if (typeof prop === 'string' && /^\d+$/.test(prop)) {
            return obj.data[parseInt(prop)];
          }
          return (obj as any)[prop];
        },
        set(obj, prop, value) {
          if (typeof prop === 'string' && /^\d+$/.test(prop)) {
            obj.data[parseInt(prop)] = value;
            return true;
          }
          (obj as any)[prop] = value;
          return true;
        }
      });
    }
  });

  (window as any).Buffer = BufferProxy;
}

// Set up global
if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).process = {
    env: {},
    nextTick: (fn: Function) => setTimeout(fn, 0),
    version: 'v16.0.0',
    versions: { node: '16.0.0' }
  };
}

export {};
