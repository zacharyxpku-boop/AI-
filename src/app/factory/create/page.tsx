import type { Metadata } from 'next';

import { CreateAssetConsoleClient } from '@/components/CreateAssetConsoleClient';
import { KuaiziWorkflowConsole } from '@/components/KuaiziWorkflowConsole';
import { normalizeFactoryUiVariantId } from '@/lib/factory-readiness-view';
import { getIndustrializationSnapshot } from '@/lib/industrial-chain-store';

export const metadata: Metadata = {
  title: '素材生产工作台 | Wenai',
  description: '把商品资料、参考案例、脚本、图片素材、授权和客户验收串成可验证的素材工作台。',
};

export default async function CreateFactoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ projectId?: string; variant?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const projectId = params.projectId || 'default-project';
  const selectedVariantId = normalizeFactoryUiVariantId(params.variant);

  if (selectedVariantId === 'friend_trial') {
    return <KuaiziWorkflowConsole active="create" />;
  }

  const snapshot = await getIndustrializationSnapshot('anon', projectId);

  return (
    <CreateAssetConsoleClient
      initialProjectId={projectId}
      initialSnapshot={snapshot}
      selectedVariantId={selectedVariantId}
    />
  );
}
