import { describe, expect, it } from 'vitest';
import { ApiError, parseApiResponse } from './api';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('parseApiResponse', () => {
  it('returns payload on 2xx', async () => {
    const data = await parseApiResponse<{ ok: boolean }>(jsonResponse({ ok: true }));
    expect(data).toEqual({ ok: true });
  });

  it('maps error envelope to ApiError', async () => {
    await expect(
      parseApiResponse(jsonResponse({ error: { code: 'bad_input', message: 'Nope' } }, 400)),
    ).rejects.toMatchObject({ code: 'bad_input', message: 'Nope', status: 400 });
  });

  it('provides safe default for 401 without envelope', async () => {
    try {
      await parseApiResponse(jsonResponse({}, 401));
      throw new Error('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).code).toBe('unauthorized');
    }
  });

  it('provides safe default for 429', async () => {
    await expect(parseApiResponse(jsonResponse({}, 429))).rejects.toMatchObject({
      code: 'rate_limited',
    });
  });
});
