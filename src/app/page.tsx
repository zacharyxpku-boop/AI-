import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Wenai | 客户试用工作台',
  description: '面向客户试用的电商内容生产工作台，从商品任务开始，按步骤完成卖点、素材、内容、发布与跟进。',
};

export default function HomePage() {
  redirect('/factory?variant=friend_trial');
}
