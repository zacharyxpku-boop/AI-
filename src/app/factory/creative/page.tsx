import type { Metadata } from 'next';

import { CreativeMonitoringConsoleClient } from '@/components/CreativeMonitoringConsoleClient';

export const metadata: Metadata = {
  title: '创意情报台 | Wenai',
  description: '把竞品账号、榜单趋势和视频关键词拆解沉淀为可复用的创意洞察账本。',
};

export default async function CreativeFactoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ projectId?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  return <CreativeMonitoringConsoleClient initialProjectId={params.projectId || 'default-project'} />;
}
