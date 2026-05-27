import type { Metadata } from 'next';

import { CastDistributionConsoleClient } from '@/components/CastDistributionConsoleClient';
import { KuaiziWorkflowConsole } from '@/components/KuaiziWorkflowConsole';
import { normalizeFactoryUiVariantId } from '@/lib/factory-readiness-view';
import { getChannelAccountSnapshot } from '@/lib/channel-account-ledger';

export const metadata: Metadata = {
  title: '分发投放工作台 | Wenai',
  description: '把账号安排、发布槽位、广告计划、平台证据和表现回流串成可验证的发布工作台。',
};

export default async function CastFactoryPage({
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
  }>;
}) {
  const params = searchParams ? await searchParams : {};
  const projectId = params.projectId || 'default-project';
  const selectedVariantId = params.variant ? normalizeFactoryUiVariantId(params.variant) : 'friend_trial';

  if (selectedVariantId === 'friend_trial') {
    return (
      <KuaiziWorkflowConsole
        active="cast"
        initialAssetReady={params.assetReady === '1' ? true : params.generated === '1' ? false : undefined}
        initialAudienceGoal={params.audienceGoal || undefined}
        initialGenerated={params.generated === '1'}
        initialPlatform={params.platform || undefined}
        initialProductName={params.productName || undefined}
      />
    );
  }

  const snapshot = await getChannelAccountSnapshot('anon', projectId);

  return (
    <CastDistributionConsoleClient
      initialProjectId={projectId}
      initialSnapshot={snapshot}
      selectedVariantId={selectedVariantId}
    />
  );
}
