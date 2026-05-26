import type { Metadata } from 'next';

import { KuaiziWorkflowConsole } from '@/components/KuaiziWorkflowConsole';
import { ManageOperationsConsoleClient } from '@/components/ManageOperationsConsoleClient';
import { getAssetPermissionSnapshot } from '@/lib/asset-permission-ledger';
import { normalizeFactoryUiVariantId } from '@/lib/factory-readiness-view';
import { getIndustrializationSnapshot } from '@/lib/industrial-chain-store';

export const metadata: Metadata = {
  title: '交付管理工作台 | Wenai',
  description: '把客户审核、交付权限、安全策略、操作记录和表现回流串成可验证的管理工作台。',
};

export default async function ManageFactoryPage({
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
  const selectedVariantId = normalizeFactoryUiVariantId(params.variant);

  if (selectedVariantId === 'friend_trial') {
    return (
      <KuaiziWorkflowConsole
        active="manage"
        initialAssetReady={params.assetReady === '1' ? true : params.generated === '1' ? false : undefined}
        initialAudienceGoal={params.audienceGoal || undefined}
        initialGenerated={params.generated === '1'}
        initialPlatform={params.platform || undefined}
        initialProductName={params.productName || undefined}
      />
    );
  }

  const [industrialSnapshot, permissionSnapshot] = await Promise.all([
    getIndustrializationSnapshot('anon', projectId),
    getAssetPermissionSnapshot('anon', projectId),
  ]);

  return (
    <ManageOperationsConsoleClient
      initialProjectId={projectId}
      initialIndustrialSnapshot={industrialSnapshot}
      initialPermissionSnapshot={permissionSnapshot}
      selectedVariantId={selectedVariantId}
    />
  );
}
