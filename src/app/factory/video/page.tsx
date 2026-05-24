import type { Metadata } from 'next';

import { KuaiziWorkflowConsole } from '@/components/KuaiziWorkflowConsole';
import { VideoProductionQueueClient } from '@/components/VideoProductionQueueClient';
import { normalizeFactoryUiVariantId } from '@/lib/factory-readiness-view';
import { getIndustrialVideoProductionQueue } from '@/lib/industrial-video-workflow';

export const metadata: Metadata = {
  title: '视频生产队列 | Wenai',
  description: '把视频 brief、provider 门禁、生产交接、分发计划和表现回流串成可执行队列。',
};

export default async function VideoFactoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ projectId?: string; variant?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const projectId = params.projectId || 'default-project';
  const selectedVariantId = normalizeFactoryUiVariantId(params.variant);

  if (selectedVariantId === 'friend_trial') {
    return <KuaiziWorkflowConsole active="video" />;
  }

  const queue = await getIndustrialVideoProductionQueue('anon', projectId);
  return (
    <VideoProductionQueueClient
      initialProjectId={projectId}
      initialQueue={queue}
      selectedVariantId={selectedVariantId}
    />
  );
}
