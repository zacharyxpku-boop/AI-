import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((href: string) => {
    throw new Error(`redirect:${href}`);
  }),
}));

import { redirect } from 'next/navigation';
import HomePage from '@/app/page';

describe('home page', () => {
  it('sends friend deployment visitors directly to the customer workspace', () => {
    expect(() => HomePage()).toThrow('redirect:/factory?variant=friend_trial');
    expect(redirect).toHaveBeenCalledWith('/factory?variant=friend_trial');
  });
});
