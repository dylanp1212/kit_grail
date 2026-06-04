import '@testing-library/jest-dom/vitest';
import {expect, afterEach, beforeEach, vi} from 'vitest';
import {cleanup} from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = vi.fn(async (input: Parameters<typeof fetch>[0]) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.includes('/api/v0/auth/profile/picture')) {
      return new Response(JSON.stringify({picture: undefined}), {status: 200});
    }
    return new Response('{}', {status: 401});
  }) as typeof fetch;
});

afterEach(() => {
  cleanup();
  globalThis.fetch = originalFetch;
});
