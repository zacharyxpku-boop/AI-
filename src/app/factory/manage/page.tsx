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
  searchParams?: Promise<{ projectId?: string; variant?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const projectId = params.projectId || 'default-project';
  const selectedVariantId = normalizeFactoryUiVariantId(params.variant);

  if (selectedVariantId === 'friend_trial') {
    return <KuaiziWorkflowConsole active="manage" />;
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
