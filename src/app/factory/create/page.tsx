import type { Metadata } from 'next';

import { CreateAssetConsoleClient } from '@/components/CreateAssetConsoleClient';
import { normalizeFactoryUiVariantId } from '@/lib/factory-readiness-view';
import { getIndustrializationSnapshot } from '@/lib/industrial-chain-store';

export const metadata: Metadata = {
  title: '资产生产控制台 | Wenai',
  description: '把 brief、benchmark、script、visual asset、生产交接、版权审批和客户验收串成可验证的 Create 工作台。',
};

export default async function CreateFactoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ projectId?: string; variant?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const projectId = params.projectId || 'default-project';
  const selectedVariantId = normalizeFactoryUiVariantId(params.variant);
  const snapshot = await getIndustrializationSnapshot('anon', projectId);

  return (
    <CreateAssetConsoleClient
      initialProjectId={projectId}
      initialSnapshot={snapshot}
      selectedVariantId={selectedVariantId}
    />
  );
}
