import type { Metadata } from 'next';
import { IndustrialReviewPortalClient } from '@/components/IndustrialReviewPortalClient';
import {
  evaluateAssetPermissionAccess,
  recordAssetPermissionAccessAudit,
} from '@/lib/asset-permission-ledger';
import {
  getIndustrialReviewLink,
  getIndustrialReviewPortalView,
} from '@/lib/industrial-review-portal';

export const metadata: Metadata = {
  title: '客户审核 | Wenai',
  description: '客户通过审核链接查看交付物、提交反馈并批准交付。',
};

export default async function IndustrialReviewTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!token || token.length > 80) {
    return <IndustrialReviewPortalClient token={token || ''} initialError="bad_token" />;
  }
  const link = await getIndustrialReviewLink(token);
  if (!link) {
    return <IndustrialReviewPortalClient token={token} initialError="not_found" />;
  }
  const review = getIndustrialReviewPortalView(link);
  if (review.status === 'expired') {
    return <IndustrialReviewPortalClient token={token} initialError="review_expired" initialPayload={{ review: { ...review, assetTitle: '审核链接已过期', deliverableUrl: undefined }, feedback: [] }} />;
  }
  if (review.status === 'revoked') {
    return <IndustrialReviewPortalClient token={token} initialError="review_revoked" initialPayload={{ review: { ...review, assetTitle: '审核链接已撤销', deliverableUrl: undefined }, feedback: [] }} />;
  }
  const access = await evaluateAssetPermissionAccess(link.orgId, {
    projectId: link.projectId,
    assetId: link.assetId,
    action: 'view',
    role: 'client',
  });
  await recordAssetPermissionAccessAudit(link.orgId, {
    projectId: link.projectId,
    assetId: link.assetId,
    action: 'view',
    role: 'client',
    actor: 'client-review-page',
    operation: 'client_review_page_render',
    allowed: access.allowed,
    reason: access.reason,
    record: access.record,
  });
  if (!access.allowed) {
    return <IndustrialReviewPortalClient token={token} initialError="asset_view_permission_denied" />;
  }
  return (
    <IndustrialReviewPortalClient
      token={token}
      initialPayload={{
        review,
        feedback: link.feedback,
      }}
    />
  );
}
