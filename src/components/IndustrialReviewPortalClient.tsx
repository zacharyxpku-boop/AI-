'use client';

import { useMemo, useState, type FormEvent } from 'react';

type ReviewStatus = 'active' | 'expired' | 'revoked' | 'approved';
type FeedbackType = 'comment' | 'question' | 'change';

export interface ReviewPayload {
  review: {
    token: string;
    projectId: string;
    assetId: string;
    assetTitle: string;
    deliverableUrl?: string;
    expiresAt: string;
    status: ReviewStatus;
    statusLabel?: string;
    clientHeadline?: string;
    clientRisk?: string;
    supportAction?: string;
    nextAction?: string;
    clientChecklist?: Array<{
      label: string;
      state: 'ok' | 'warn' | 'locked';
      detail: string;
    }>;
    clientDecision?: {
      primaryActionLabel: string;
      primaryActionState: 'feedback' | 'approve' | 'wait' | 'locked';
      disabledReason?: string;
      operatorNextStep: string;
      evidenceToCheck: string[];
    };
    escalationMessage?: string;
    canSubmitFeedback?: boolean;
    canApprove?: boolean;
    interactionLockedReason?: string;
    feedbackCount: number;
    approvedAt?: string;
    approvalName?: string;
  };
  feedback: Array<{
    id: string;
    authorName: string;
    type: FeedbackType | 'approval';
    body: string;
    createdAt: string;
  }>;
}

function statusLabel(status: ReviewStatus) {
  if (status === 'active') return '待审核';
  if (status === 'approved') return '已批准';
  if (status === 'expired') return '已过期';
  return '已撤销';
}

function displayStatusLabel(review?: ReviewPayload['review']) {
  return review?.statusLabel || (review ? statusLabel(review.status) : '加载中');
}

function statusClass(status: ReviewStatus) {
  if (status === 'active') return 'border-amber-300/40 bg-amber-300/10 text-amber-100';
  if (status === 'approved') return 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100';
  return 'border-red-300/40 bg-red-300/10 text-red-100';
}

function lockMessage(status: ReviewStatus) {
  if (status === 'approved') return '该交付物已经批准，并已写回生产链路。';
  if (status === 'expired') return '该审核链接已经过期，请联系运营重新生成链接。';
  if (status === 'revoked') return '该审核链接已被运营撤销。';
  return '';
}

function errorMessage(error: string) {
  const map: Record<string, string> = {
    bad_token: '审核链接格式不正确，请确认你打开的是最新链接。',
    not_found: '没有找到这条审核链接，可能已被替换或尚未生成。',
    review_not_available: '审核链接暂时不可用，请稍后刷新或联系运营。',
    feedback_failed: '反馈提交失败，请检查内容后重试。',
    approval_failed: '批准失败，请确认链接仍在有效期内。',
    approval_confirmation_required: '请先勾选确认项，再批准交付物。',
    deliverable_required_before_approval: '交付物链接缺失，先不要批准。请让运营补齐预览或下载链接后再验收。',
    review_expired: '该审核链接已经过期，请让运营重新生成审核链接。',
    review_revoked: '该审核链接已经撤销，请等待运营发送新的审核链接。',
    asset_view_permission_denied: '当前审核链接没有查看交付物的权限，请让运营重新授权后再打开。',
  };
  if (error === 'expired') return map.review_expired;
  if (error === 'revoked') return map.review_revoked;
  if (error === 'feedback_required') return map.feedback_failed;
  if (error === 'already_approved') return map.approval_failed;
  return map[error] || error;
}

function reviewPayloadFromResponse(data: unknown): ReviewPayload | null {
  if (!data || typeof data !== 'object') return null;
  const candidate = data as { review?: ReviewPayload['review']; feedback?: ReviewPayload['feedback'] };
  if (!candidate.review) return null;
  return {
    review: candidate.review,
    feedback: Array.isArray(candidate.feedback) ? candidate.feedback : [],
  };
}

function feedbackLabel(type: FeedbackType | 'approval') {
  if (type === 'change') return '要求修改';
  if (type === 'question') return '问题';
  if (type === 'approval') return '批准';
  return '评论';
}

function isVideo(url: string) {
  return /\.(mp4|mov|webm|m4v)(\?|#|$)/i.test(url);
}

function decisionPath(status?: ReviewStatus, hasDeliverable = false, feedbackCount = 0) {
  if (!status) {
    return [
      { title: '确认链接', body: '当前链接还没有加载成功，请先确认运营发送的是最新审核链接。', state: 'warn' },
      { title: '等待交付物', body: '交付物不可见前不要批准，避免把空交付写回生产链路。', state: 'warn' },
      { title: '联系运营', body: '如果刷新后仍无法打开，请让运营重新生成审核链接。', state: 'warn' },
    ];
  }
  if (status === 'expired') {
    return [
      { title: '链接已过期', body: '旧链接不能继续验收，也不会展示交付物。', state: 'danger' },
      { title: '重新发起审核', body: '请让运营重新生成有效链接。', state: 'warn' },
      { title: '保留记录', body: '新的审核链接会重新记录反馈和批准结果。', state: 'muted' },
    ];
  }
  if (status === 'revoked') {
    return [
      { title: '链接已撤销', body: '这通常代表交付物已替换或审核被运营收回。', state: 'danger' },
      { title: '等待新链接', body: '不要继续使用旧链接做验收。', state: 'warn' },
      { title: '重新查看新版', body: '收到新链接后再检查交付物。', state: 'muted' },
    ];
  }
  if (status === 'approved') {
    return [
      { title: '已批准', body: '交付结果已经锁定，并写回生产链路。', state: 'ok' },
      { title: '进入交付', body: '运营会推进分发、CRM 交接或后续数据回流。', state: 'ok' },
      { title: '只读留档', body: '本页保留审核证据，不再接受新的修改意见。', state: 'muted' },
    ];
  }
  return [
    { title: '先看交付物', body: hasDeliverable ? '打开预览或原始链接，检查画面、文案、商品信息和平台适配。' : '当前缺少可打开的交付物，先不要批准。', state: hasDeliverable ? 'ok' : 'warn' },
    { title: feedbackCount > 0 ? '复核反馈' : '提交问题', body: feedbackCount > 0 ? '如果修改点还没解决，请继续补充；如果已解决，再进入批准。' : '有问题就写清楚位置、原因和期望修改。', state: feedbackCount > 0 ? 'warn' : 'muted' },
    { title: '确认后批准', body: hasDeliverable ? '确认无误后填写批准人，勾选确认项并提交。' : '补齐交付物前，批准按钮会保持不可用。', state: hasDeliverable ? 'ok' : 'warn' },
  ];
}

function pathClass(state: string) {
  if (state === 'ok') return 'border-emerald-400/30 bg-emerald-950/25 text-emerald-100';
  if (state === 'danger') return 'border-red-400/30 bg-red-950/30 text-red-100';
  if (state === 'warn') return 'border-amber-300/30 bg-amber-950/25 text-amber-100';
  return 'border-white/10 bg-white/[0.03] text-white/70';
}

function checklistStateClass(state: 'ok' | 'warn' | 'locked') {
  if (state === 'ok') return 'border-emerald-400/25 bg-emerald-950/20 text-emerald-100';
  if (state === 'locked') return 'border-red-400/25 bg-red-950/25 text-red-100';
  return 'border-amber-300/25 bg-amber-950/20 text-amber-100';
}

function decisionStateLabel(state: 'feedback' | 'approve' | 'wait' | 'locked') {
  if (state === 'approve') return '可以批准';
  if (state === 'feedback') return '先反馈';
  if (state === 'wait') return '等待运营';
  return '只读留档';
}

function decisionStateClass(state: 'feedback' | 'approve' | 'wait' | 'locked') {
  if (state === 'approve') return 'border-emerald-300/35 bg-emerald-950/25 text-emerald-100';
  if (state === 'feedback') return 'border-amber-300/35 bg-amber-950/25 text-amber-100';
  if (state === 'wait') return 'border-sky-300/35 bg-sky-950/25 text-sky-100';
  return 'border-white/15 bg-white/[0.03] text-white/65';
}

function isImage(url: string) {
  return /\.(png|jpe?g|gif|webp|avif)(\?|#|$)/i.test(url);
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString();
}

function nextStepText(status?: ReviewStatus, hasDeliverable = false) {
  if (!status) return '等待审核链接加载。';
  if (status === 'approved') return '交付物已批准，下一步由运营进入分发、CRM 交接和表现回流。';
  if (status === 'expired') return '链接已过期，请让运营重新生成审核链接。';
  if (status === 'revoked') return '链接已撤销，请等待运营发送新的审核链接。';
  if (!hasDeliverable) return '交付物链接缺失，先不要批准；可以先提交问题反馈。';
  return '先检查交付物；有修改就提交反馈，确认无误后再批准。';
}

function reviewNextStep(review: ReviewPayload['review'] | undefined, hasDeliverable = false) {
  return review?.nextAction || nextStepText(review?.status, hasDeliverable);
}

function reviewChecklist(review: ReviewPayload['review'] | undefined, hasDeliverable: boolean) {
  return [
    {
      label: '交付物可打开',
      ok: hasDeliverable,
      detail: hasDeliverable ? '已附交付物链接，可直接预览或打开。' : '缺少交付物链接，不能完成验收。',
    },
    {
      label: '链接仍有效',
      ok: review?.status === 'active' || review?.status === 'approved',
      detail: review ? `当前状态：${displayStatusLabel(review)}` : '审核链接尚未加载。',
    },
    {
      label: '反馈会写回生产',
      ok: review?.status === 'active',
      detail: review?.status === 'active' ? '修改意见会进入生产链路。' : '当前链接只读，不能继续写入反馈。',
    },
    {
      label: '批准会锁定结果',
      ok: review?.status === 'approved',
      detail: review?.status === 'approved' ? '已批准并锁定。' : '批准后会写回生产链路并锁定本链接。',
    },
  ];
}

function reviewDecisionSummary(
  review: ReviewPayload['review'] | undefined,
  hasDeliverable: boolean,
  feedbackCount: number,
) {
  if (!review) {
    return {
      title: '审核链接尚未加载',
      body: '请刷新页面；如果仍无法打开，请让运营重新发送最新审核链接。',
      tone: 'warn',
    };
  }
  if (review.status === 'approved') {
    return {
      title: '已完成验收',
      body: `该交付物已由 ${review.approvalName || '客户'} 批准，生产链路会进入分发、CRM 交接和表现回流。`,
      tone: 'ok',
    };
  }
  if (review.status === 'expired') {
    return {
      title: '链接已过期',
      body: '请不要继续使用旧链接；让运营重新生成审核链接后再验收。',
      tone: 'danger',
    };
  }
  if (review.status === 'revoked') {
    return {
      title: '链接已撤销',
      body: '这通常代表交付物已被替换或需要重新审核，请等待运营发送新链接。',
      tone: 'danger',
    };
  }
  if (!hasDeliverable) {
    return {
      title: '暂不能批准',
      body: '交付物链接缺失。你可以先提交问题反馈，但不要批准，直到运营补齐可预览或可打开的交付物。',
      tone: 'warn',
    };
  }
  if (feedbackCount > 0) {
    return {
      title: '已有反馈记录',
      body: '请确认反馈是否已经处理。如果修改点仍未解决，继续提交反馈；确认无误后再批准。',
      tone: 'warn',
    };
  }
  return {
    title: '可以开始验收',
    body: '先查看交付物画面、文案、商品信息和平台适配；确认无误后填写批准人并勾选确认项。',
    tone: 'ok',
  };
}

function clientHandoffCards(
  review: ReviewPayload['review'] | undefined,
  hasDeliverable: boolean,
  feedbackCount: number,
) {
  const status = review?.status;
  if (status === 'approved') {
    return [
      { title: '你已完成', body: '批准结果已锁定，客户侧不需要再重复操作。' },
      { title: '系统已写回', body: '交付状态进入 approved，并保留批准人、时间和审核记录。' },
      { title: '运营接力', body: '运营继续推进分发、CRM 交接和表现回流。' },
      { title: '数据留档', body: '本页作为只读验收凭证，后续复盘可追溯。' },
    ];
  }
  if (status === 'expired' || status === 'revoked') {
    return [
      { title: '你先暂停', body: status === 'expired' ? '当前链接已过期，不要继续验收。' : '当前链接已撤销，不要继续验收。' },
      { title: '系统已保护', body: '旧链接不会继续写入反馈或批准，避免错审旧版本。' },
      { title: '运营接力', body: '等待运营重新生成有效审核链接后再打开。' },
      { title: '数据留档', body: '历史状态会保留，新的审核链接会重新记录结果。' },
    ];
  }
  if (!hasDeliverable) {
    return [
      { title: '你先反馈', body: '直接提交“交付物打不开/缺失”的问题反馈。' },
      { title: '系统会拦截', body: '批准按钮保持不可用，避免空交付写回生产链路。' },
      { title: '运营接力', body: '运营补齐预览或下载链接后重新通知你验收。' },
      { title: '数据不丢', body: '你的问题会进入生产记录，不需要私聊重复说明。' },
    ];
  }
  if (feedbackCount > 0) {
    return [
      { title: '你先复核', body: '确认上一轮反馈是否已经处理，未处理就继续补充。' },
      { title: '系统会归档', body: '每条反馈都会写回生产链路，形成修改依据。' },
      { title: '运营接力', body: '运营按反馈修订交付物，再推回本页确认。' },
      { title: '确认后批准', body: '修改点都解决后，再批准进入分发和 CRM 后续动作。' },
    ];
  }
  return [
    { title: '你先查看', body: '检查画面、文案、商品信息、链接和平台适配。' },
    { title: '有问题就反馈', body: '写清楚位置、原因和期望修改，不要勉强批准。' },
    { title: '没问题再批准', body: '批准会锁定本链接，并写回生产和交付链路。' },
    { title: '后续可追踪', body: '运营会继续推进分发、CRM 交接和表现回流。' },
  ];
}

function systemWritebackReceipts(
  review: ReviewPayload['review'] | undefined,
  hasDeliverable: boolean,
  feedbackCount: number,
) {
  const status = review?.status;
  const approved = status === 'approved';
  const locked = status === 'expired' || status === 'revoked';
  const missingDeliverable = status === 'active' && !hasDeliverable;
  const hasFeedback = feedbackCount > 0;

  return [
    {
      label: '生产记录',
      state: approved || hasFeedback || missingDeliverable ? '已写入' : locked ? '已保护' : '待动作',
      detail: approved
        ? '批准人、批准时间和审核结果已经锁定到交付记录。'
        : hasFeedback
          ? '客户反馈已成为生产修订依据。'
          : missingDeliverable
            ? '缺交付物问题会进入生产补齐队列。'
            : locked
              ? '旧链接不会继续写入生产，避免错审旧版本。'
              : '客户提交反馈或批准后才会写入。',
    },
    {
      label: 'CRM 交接',
      state: approved ? '可交接' : locked ? '暂停' : '待验收',
      detail: approved
        ? '可把客户批准、交付物和下一步动作交给运营/销售跟进。'
        : locked
          ? '需要新审核链接后再继续客户交接。'
          : '验收完成前不应宣称已交付。',
    },
    {
      label: '分发门禁',
      state: approved ? '已放行' : '未放行',
      detail: approved
        ? '内容可进入分发计划、矩阵发布或投放准备。'
        : '未批准前不进入自动分发，避免错误素材上线。',
    },
    {
      label: '表现回流',
      state: approved ? '待回流' : '未开始',
      detail: approved
        ? '上线后的平台指标会回到复盘和品牌学习档案。'
        : '只有批准并发布后才会产生表现数据。',
    },
  ];
}

const ZERO_EXPLANATION_REVIEW_STEPS = [
  {
    title: '先打开交付物',
    body: '能播放、能下载或能预览，才进入下一步；打不开就直接反馈，不要批准。',
  },
  {
    title: '只看四件事',
    body: '商品信息、画面/文案、版本是否正确、目标平台是否适配。',
  },
  {
    title: '有问题写具体',
    body: '写清楚位置、原因和希望怎么改，反馈会写回生产链路。',
  },
  {
    title: '确认无误再批准',
    body: '批准会锁定本链接，并进入分发、CRM 交接和表现回流。',
  },
];

export function IndustrialReviewPortalClient({
  token,
  initialPayload = null,
  initialError = '',
}: {
  token: string;
  initialPayload?: ReviewPayload | null;
  initialError?: string;
}) {
  const [payload, setPayload] = useState<ReviewPayload | null>(initialPayload);
  const [error, setError] = useState(initialError);
  const [authorName, setAuthorName] = useState('');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('comment');
  const [body, setBody] = useState('');
  const [approvalName, setApprovalName] = useState('');
  const [approvalConfirmed, setApprovalConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  const review = payload?.review;
  const deliverableUrl = review?.deliverableUrl || '';
  const interactionDisabled = useMemo(() => review?.canSubmitFeedback === false || review?.status !== 'active' || submitting, [review?.canSubmitFeedback, review?.status, submitting]);
  const approvalDisabled = useMemo(
    () => review?.canApprove === false || review?.status !== 'active' || submitting || !deliverableUrl,
    [deliverableUrl, review?.canApprove, review?.status, submitting],
  );
  const lockedReason = review?.interactionLockedReason || (review ? lockMessage(review.status) : '');
  const clientDecision = review?.clientDecision;
  const checklist = reviewChecklist(review, Boolean(deliverableUrl));
  const serverChecklist = review?.clientChecklist || [];
  const decision = reviewDecisionSummary(review, Boolean(deliverableUrl), payload?.feedback.length || 0);
  const path = decisionPath(review?.status, Boolean(deliverableUrl), payload?.feedback.length || 0);
  const handoffCards = clientHandoffCards(review, Boolean(deliverableUrl), payload?.feedback.length || 0);
  const writebackReceipts = systemWritebackReceipts(review, Boolean(deliverableUrl), payload?.feedback.length || 0);
  const decisionClass = decision.tone === 'ok'
    ? 'border-emerald-400/40 bg-emerald-950/35 text-emerald-100'
    : decision.tone === 'danger'
      ? 'border-red-400/40 bg-red-950/35 text-red-100'
      : 'border-amber-300/40 bg-amber-950/30 text-amber-100';

  async function refresh() {
    const res = await fetch(`/api/industrial-chain/review/${token}`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'review_not_available');
      setPayload(reviewPayloadFromResponse(data));
      return;
    }
    setError('');
    setPayload(data);
  }

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const res = await fetch(`/api/industrial-chain/review/${token}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorName, type: feedbackType, body }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || 'feedback_failed');
      const nextPayload = reviewPayloadFromResponse(data);
      if (nextPayload) setPayload(nextPayload);
      return;
    }
    setError('');
    setNotice('反馈已提交，生产团队会按这条记录更新交付状态。');
    setBody('');
    await refresh();
  }

  async function approve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!deliverableUrl) {
      setError('deliverable_required_before_approval');
      return;
    }
    if (!approvalConfirmed) {
      setError('approval_confirmation_required');
      return;
    }
    setSubmitting(true);
    const res = await fetch(`/api/industrial-chain/review/${token}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalName }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || 'approval_failed');
      const nextPayload = reviewPayloadFromResponse(data);
      if (nextPayload) setPayload(nextPayload);
      return;
    }
    setError('');
    setNotice('已批准交付物，系统已把批准结果写回生产链路。');
    await refresh();
  }

  return (
    <main className="min-h-screen bg-[#0d1014] text-[#f4efe7]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-7 px-5 py-8 sm:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/65">Wenai 客户审核</span>
            <span className={`border px-3 py-1 text-xs ${review ? statusClass(review.status) : 'border-white/15 text-white/60'}`}>
              {displayStatusLabel(review)}
            </span>
          </div>
          <div>
            <p className="text-sm text-white/55">交付审核</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
              {review?.assetTitle || '审核链接未加载'}
            </h1>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-white/65">
            你可以在这里查看交付物、留下明确修改意见，或批准进入分发与 CRM 交接。链接批准、过期或撤销后，本页面会变为只读。
          </p>
          {lockedReason ? <div className={`border px-4 py-3 text-sm ${statusClass(review!.status)}`}>{lockedReason}</div> : null}
          <div className={`border px-4 py-3 ${decisionClass}`}>
            <div className="text-sm font-semibold">{decision.title}</div>
            <div className="mt-1 text-sm leading-6 opacity-80">{decision.body}</div>
          </div>
          {review ? (
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-xs text-white/45">当前判断</div>
                <div className="mt-1 font-semibold text-white">{review.clientHeadline || decision.title}</div>
              </div>
              <div className="border border-amber-300/25 bg-amber-950/20 px-4 py-3 text-amber-100">
                <div className="text-xs opacity-65">不要踩坑</div>
                <div className="mt-1 leading-6">{review.clientRisk || '批准前请先确认交付物能打开、内容正确、版本无误。'}</div>
              </div>
              <div className="border border-emerald-300/25 bg-emerald-950/20 px-4 py-3 text-emerald-100">
                <div className="text-xs opacity-65">需要帮助时</div>
                <div className="mt-1 leading-6">{review.supportAction || '看不懂或打不开时，先提交问题反馈，不要勉强批准。'}</div>
              </div>
            </div>
          ) : null}
          <div className="border border-emerald-300/20 bg-emerald-950/20 px-4 py-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-semibold text-emerald-100/70">零解释验收流程</div>
                <div className="mt-1 text-sm font-semibold text-emerald-50">不懂生产链路也能独立完成审核</div>
              </div>
              <div className="text-xs leading-5 text-emerald-100/70">
                这页只让客户做两件事：反馈或批准；其他交接由系统和运营承接。
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-4">
              {ZERO_EXPLANATION_REVIEW_STEPS.map((item, index) => (
                <div className="border border-emerald-300/15 bg-black/15 px-3 py-2" key={item.title}>
                  <div className="text-[11px] font-semibold text-emerald-100/60">0{index + 1}</div>
                  <div className="mt-1 text-xs font-semibold text-emerald-50">{item.title}</div>
                  <div className="mt-1 text-xs leading-5 text-emerald-100/70">{item.body}</div>
                </div>
              ))}
            </div>
          </div>
          {clientDecision ? (
            <div className={`border px-4 py-3 ${decisionStateClass(clientDecision.primaryActionState)}`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs font-semibold opacity-70">客户当前应该做什么</div>
                  <div className="mt-1 text-lg font-semibold">{clientDecision.primaryActionLabel}</div>
                </div>
                <span className="w-fit border border-current/30 px-3 py-1 text-xs">
                  {decisionStateLabel(clientDecision.primaryActionState)}
                </span>
              </div>
              {clientDecision.disabledReason ? (
                <div className="mt-2 text-sm leading-6 opacity-80">不能继续的原因：{clientDecision.disabledReason}</div>
              ) : null}
              <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1.15fr]">
                <div className="border border-current/20 bg-black/15 px-3 py-2">
                  <div className="text-xs font-semibold opacity-70">运营下一步</div>
                  <div className="mt-1 text-sm leading-6 opacity-85">{clientDecision.operatorNextStep}</div>
                </div>
                <div className="border border-current/20 bg-black/15 px-3 py-2">
                  <div className="text-xs font-semibold opacity-70">批准前核对证据</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {clientDecision.evidenceToCheck.map(item => (
                      <span className="border border-current/20 px-2 py-1 text-xs" key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-3">
            {path.map((item, index) => (
              <div className={`border px-4 py-3 ${pathClass(item.state)}`} key={`${item.title}-${index}`}>
                <div className="text-xs opacity-60">第 {index + 1} 步</div>
                <div className="mt-1 text-sm font-semibold">{item.title}</div>
                <div className="mt-1 text-xs leading-5 opacity-75">{item.body}</div>
              </div>
            ))}
          </div>
          <div className="grid gap-2 text-xs text-white/55 sm:grid-cols-3">
            <div className="border border-white/10 bg-white/[0.03] px-3 py-2">1. 先检查交付物画面、文案、商品信息和平台适配。</div>
            <div className="border border-white/10 bg-white/[0.03] px-3 py-2">2. 有问题就提交修改意见；没问题再批准。</div>
            <div className="border border-white/10 bg-white/[0.03] px-3 py-2">3. 批准会写回生产链路，作为交付和后续分发依据。</div>
          </div>
          <div className="border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
            下一步：{reviewNextStep(review, Boolean(deliverableUrl))}
          </div>
          <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="text-xs font-semibold text-white/55">客户交接闭环</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-4">
              {handoffCards.map(item => (
                <div className="border border-white/10 bg-black/20 px-3 py-2" key={item.title}>
                  <div className="text-xs font-semibold text-white/80">{item.title}</div>
                  <div className="mt-1 text-xs leading-5 text-white/55">{item.body}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-cyan-300/20 bg-cyan-950/15 px-4 py-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold text-cyan-100/65">系统写回回执</div>
                <div className="mt-1 text-sm font-semibold text-cyan-50">客户每一步都会落到可追踪的运营链路</div>
              </div>
              <div className="text-xs leading-5 text-cyan-100/60">
                让客户知道反馈、批准和卡住状态分别流向哪里。
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-4">
              {writebackReceipts.map(item => (
                <div className="border border-cyan-300/15 bg-black/20 px-3 py-2" key={item.label}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-cyan-50">{item.label}</div>
                    <span className="border border-cyan-200/20 px-2 py-0.5 text-[11px] text-cyan-100/70">{item.state}</span>
                  </div>
                  <div className="mt-2 text-xs leading-5 text-cyan-100/65">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
          {review ? (
            <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-xs font-semibold text-white/55">朋友试用不会卡住的处理卡</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {serverChecklist.map(item => (
                    <div className={`border px-3 py-2 text-xs ${checklistStateClass(item.state)}`} key={item.label}>
                      <div className="font-semibold">{item.label}</div>
                      <div className="mt-1 leading-5 opacity-75">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-sky-300/20 bg-sky-950/20 px-4 py-3 text-sm text-sky-100">
                <div className="text-xs font-semibold opacity-70">卡住时直接发给运营</div>
                <div className="mt-2 leading-6">{review.escalationMessage || '发给运营：我打不开审核链接或交付物，请重新确认链接和版本。'}</div>
              </div>
            </div>
          ) : null}
        </header>

        {notice ? (
          <div className="border border-emerald-400/40 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-100">{notice}</div>
        ) : null}
        {error ? (
          <div className="border border-red-400/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">{errorMessage(error)}</div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold">交付物预览</h2>
              <span className="text-xs text-white/45">审核码 {token.slice(0, 12)}</span>
            </div>
            {deliverableUrl ? (
              <div className="space-y-3">
                {isVideo(deliverableUrl) ? (
                  <video className="aspect-video w-full border border-white/10 bg-black object-contain" controls preload="metadata" src={deliverableUrl} />
                ) : isImage(deliverableUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="max-h-[520px] w-full border border-white/10 bg-black object-contain" alt={review?.assetTitle || '交付物预览'} src={deliverableUrl} />
                ) : (
                  <div className="border border-white/10 bg-black/30 px-4 py-10 text-sm text-white/55">该文件类型不能直接嵌入预览，请打开交付物查看。</div>
                )}
                <a
                  href={deliverableUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100 hover:bg-amber-300/15"
                >
                  打开交付物
                </a>
              </div>
            ) : (
              <div className="border border-white/10 px-4 py-8 text-sm text-white/55">暂未附加预览链接，请让运营补齐交付物链接后再审核。</div>
            )}
            <dl className="mt-5 grid gap-3 text-sm text-white/65 sm:grid-cols-3">
              <div>
                <dt className="text-white/40">项目</dt>
                <dd>{review?.projectId || '-'}</dd>
              </div>
              <div>
                <dt className="text-white/40">资产</dt>
                <dd className="break-all">{review?.assetId || '-'}</dd>
              </div>
              <div>
                <dt className="text-white/40">有效期</dt>
                <dd>{formatDate(review?.expiresAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-base font-semibold">批准交付</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">批准后会把交付状态写回生产链路。</p>
            <div className="mt-4 border border-white/10 bg-black/20 p-3">
              <h3 className="text-xs font-semibold text-white/70">客户验收清单</h3>
              <div className="mt-3 space-y-2">
                {checklist.map(item => (
                  <div className="flex gap-2 text-xs leading-5" key={item.label}>
                    <span className={item.ok ? 'text-emerald-200' : 'text-amber-200'}>{item.ok ? '已满足' : '待补齐'}</span>
                    <span className="text-white/70">{item.label}</span>
                    <span className="text-white/40">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
            <form className="mt-4 flex flex-col gap-3" onSubmit={approve}>
              <label className="text-xs text-white/50" htmlFor="approvalName">批准人</label>
              <input
                id="approvalName"
                value={approvalName}
                onChange={event => setApprovalName(event.target.value)}
                disabled={approvalDisabled}
                required
                className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300"
                placeholder="姓名或公司"
              />
              <label className="flex items-start gap-2 border border-white/10 bg-black/20 px-3 py-3 text-xs leading-5 text-white/60">
                <input
                  type="checkbox"
                  checked={approvalConfirmed}
                  onChange={event => setApprovalConfirmed(event.target.checked)}
                  disabled={approvalDisabled}
                  className="mt-1"
                />
                <span>
                  我已检查交付物，确认可以进入交付、分发或 CRM 后续动作。批准后本链接会锁定；如需修改，请先在反馈区提交修改意见。
                </span>
              </label>
              <button
                type="submit"
                disabled={approvalDisabled || !approvalConfirmed}
                className="mt-2 bg-amber-300 px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
              >
                批准并写回状态
              </button>
            </form>
            <div className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-white/45">
              状态：{displayStatusLabel(review)}<br />
              反馈：{payload?.feedback.length || 0}<br />
              {review?.approvedAt ? <>批准：{review.approvalName || '-'} / {formatDate(review.approvedAt)}</> : '批准后将锁定本页并进入分发交接'}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <form className="border border-white/10 bg-white/[0.03] p-5" onSubmit={submitFeedback}>
            <h2 className="text-base font-semibold">提交反馈</h2>
            <div className="mt-4 grid gap-3">
              <input
                value={authorName}
                onChange={event => setAuthorName(event.target.value)}
                disabled={interactionDisabled}
                required
                className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300"
                placeholder="你的姓名"
              />
              <select
                value={feedbackType}
                onChange={event => setFeedbackType(event.target.value as FeedbackType)}
                disabled={interactionDisabled}
                className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300"
              >
                <option value="comment">评论</option>
                <option value="question">问题</option>
                <option value="change">要求修改</option>
              </select>
              <textarea
                value={body}
                onChange={event => setBody(event.target.value)}
                disabled={interactionDisabled}
                required
                rows={6}
                className="border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-amber-300"
                placeholder="写下需要修改、确认或提问的具体位置。"
              />
              <button
                type="submit"
                disabled={interactionDisabled}
                className="bg-white px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
              >
                提交反馈
              </button>
            </div>
          </form>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-base font-semibold">审核记录</h2>
            <div className="mt-4 space-y-3">
              {payload?.feedback.length ? payload.feedback.map(item => (
                <article key={item.id} className="border border-white/10 px-3 py-3">
                  <div className="flex items-center justify-between gap-3 text-xs text-white/45">
                    <span>{item.authorName} / {feedbackLabel(item.type)}</span>
                    <time>{formatDate(item.createdAt)}</time>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/75">{item.body}</p>
                </article>
              )) : (
                <p className="text-sm text-white/50">暂无反馈。</p>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
