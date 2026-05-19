import type { Metadata } from 'next';

import { CastDistributionConsoleClient } from '@/components/CastDistributionConsoleClient';
import { normalizeFactoryUiVariantId } from '@/lib/factory-readiness-view';
import { getChannelAccountSnapshot } from '@/lib/channel-account-ledger';

export const metadata: Metadata = {
  title: '分发投放控制台 | Wenai',
  description: '把账号矩阵、发布槽位、广告 campaign、平台证据和表现回流串成可验证的 Cast 工作台。',
};

export default async function CastFactoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ projectId?: string; variant?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const projectId = params.projectId || 'default-project';
  const selectedVariantId = normalizeFactoryUiVariantId(params.variant);
  const snapshot = await getChannelAccountSnapshot('anon', projectId);

  return (
    <CastDistributionConsoleClient
      initialProjectId={projectId}
      initialSnapshot={snapshot}
      selectedVariantId={selectedVariantId}
    />
  );
}
