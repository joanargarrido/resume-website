import { vi } from "vitest";

/**
 * Minimal chainable stand-in for the Supabase query builder. Every chained call
 * returns the builder; awaiting it resolves to `result`. `calls` records the chain.
 */
export function fakeSupabase(
  result: { data?: unknown; error?: unknown; count?: number } = {},
) {
  const calls: { table: string; method: string; args: unknown[] }[] = [];
  let table = "";
  const resolved = { data: null, error: null, count: null, ...result };

  const builder: Record<string, unknown> = {};
  const chain = new Proxy(builder, {
    get(_target, prop: string) {
      if (prop === "then") {
        return (resolve: (v: unknown) => void) => resolve(resolved);
      }
      return (...args: unknown[]) => {
        calls.push({ table, method: prop, args });
        return chain;
      };
    },
  });

  const client = {
    from: vi.fn((name: string) => {
      table = name;
      return chain;
    }),
    rpc: vi.fn(async () => ({ data: true, error: null })),
  };
  return { client, calls };
}
