import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';

function request(pathname: string) {
  return new NextRequest(`http://localhost${pathname}`);
}

describe('proxy public review portal access', () => {
  it('allows no-login client review pages through the proxy', async () => {
    const response = await proxy(request('/review/wrv_browser_smoke'));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });

  it('allows token-scoped review API calls without exposing the review-link admin API', async () => {
    const publicReviewResponse = await proxy(request('/api/industrial-chain/review/wrv_browser_smoke'));
    const publicFeedbackResponse = await proxy(request('/api/industrial-chain/review/wrv_browser_smoke/feedback'));
    const adminReviewLinksResponse = await proxy(request('/api/industrial-chain/review-links'));

    expect(publicReviewResponse.status).toBe(200);
    expect(publicReviewResponse.headers.get('location')).toBeNull();
    expect(publicFeedbackResponse.status).toBe(200);
    expect(publicFeedbackResponse.headers.get('location')).toBeNull();
    expect(adminReviewLinksResponse.status).toBe(307);
    expect(adminReviewLinksResponse.headers.get('location')).toBe('http://localhost/login');
  });
});
