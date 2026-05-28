import type { Metadata } from 'next';

import { KuaiziWorkflowConsole } from '@/components/KuaiziWorkflowConsole';
import { VideoProductionQueueClient } from '@/components/VideoProductionQueueClient';
import { normalizeFactoryUiVariantId } from '@/lib/factory-readiness-view';
import { getIndustrialVideoProductionQueue } from '@/lib/industrial-video-workflow';

export const metadata: Metadata = {
  title: '视频生产队列 | Wenai',
  description: '把视频脚本、素材任务、生成队列、发布计划和表现回流串成可执行队列。',
};

export default async function VideoFactoryPage({
  searchParams,
}: {
  searchParams?: Promise<{
    audienceGoal?: string;
    assetReady?: string;
    generated?: string;
    platform?: string;
    productName?: string;
    projectId?: string;
    variant?: string;
    mode?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : {};
  const projectId = params.projectId || 'default-project';
  const selectedVariantId = params.variant ? normalizeFactoryUiVariantId(params.variant) : 'friend_trial';

  if (selectedVariantId === 'friend_trial' || params.mode !== 'internal') {
    return (
      <KuaiziWorkflowConsole
        active="video"
        initialAssetReady={params.assetReady === '1' ? true : params.generated === '1' ? false : undefined}
        initialAudienceGoal={params.audienceGoal || undefined}
        initialGenerated={params.generated === '1'}
        initialPlatform={params.platform || undefined}
        initialProductName={params.productName || undefined}
      />
    );
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
