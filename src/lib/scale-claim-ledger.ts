export type ScaleClaimMetric = 'creative_output' | 'video_distribution';

export interface ScaleClaimLedgerRecord {
  id: string;
  orgId: string;
  projectId: string;
  metric: ScaleClaimMetric;
  count: number;
  platform: string;
  source: string;
  dateRange: string;
  dedupeRule: string;
  evidenceUrl: string;
  auditorNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScaleClaimSnapshot {
  orgId: string;
  projectId: string;
  creativeOutputCount: number;
  videoDistributionCount: number;
  platformBreakdownCount: number;
  evidenceUrlCount: number;
  hasDedupeRule: boolean;
  hasDateRange: boolean;
  hasAuditorNote: boolean;
  canDisplayCreativeBenchmark: boolean;
  canDisplayVideoBenchmark: boolean;
  missingLinks: string[];
  nextActions: string[];
}

type ScaleClaimGlobal = typeof globalThis & {
  __wenaiScaleClaimRecords?: Map<string, ScaleClaimLedgerRecord>;
  __wenaiScaleClaimLists?: Map<string, string[]>;
};

const CREATIVE_BENCHMARK_COUNT = 91_000_000;
const VIDEO_BENCHMARK_COUNT = 42_000_000;

function stores() {
  const target = globalThis as ScaleClaimGlobal;
  if (!target.__wenaiScaleClaimRecords) target.__wenaiScaleClaimRecords = new Map();
  if (!target.__wenaiScaleClaimLists) target.__wenaiScaleClaimLists = new Map();
  return {
    records: target.__wenaiScaleClaimRecords,
    lists: target.__wenaiScaleClaimLists,
  };
}

function genId(metric: ScaleClaimMetric) {
  return `scale_${metric}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function cleanString(value: unknown, fallback: string, limit = 500) {
  return (typeof value === 'string' ? value : fallback).trim().slice(0, limit) || fallback;
}

function cleanCount(value: unknown) {
  const num = Math.floor(Number(value));
  return Number.isFinite(num) && num > 0 ? Math.min(num, 1_000_000_000) : 0;
}

function normalizeMetric(value: unknown): ScaleClaimMetric {
  return value === 'video_distribution' ? 'video_distribution' : 'creative_output';
}

export async function upsertScaleClaimRecord(
  orgId: string,
  input: Partial<ScaleClaimLedgerRecord>,
): Promise<ScaleClaimLedgerRecord> {
  const now = new Date().toISOString();
  const projectId = cleanString(input.projectId, 'default-project', 120);
  const metric = normalizeMetric(input.metric);
  const id = input.id || genId(metric);
  const existing = stores().records.get(`${orgId}:${id}`);
  const record: ScaleClaimLedgerRecord = {
    id,
    orgId,
    projectId,
    metric,
    count: cleanCount(input.count ?? existing?.count),
    platform: cleanString(input.platform ?? existing?.platform, 'manual-ledger', 120),
    source: cleanString(input.source ?? existing?.source, 'manual-audit', 120),
    dateRange: cleanString(input.dateRange ?? existing?.dateRange, '', 120),
    dedupeRule: cleanString(input.dedupeRule ?? existing?.dedupeRule, '', 500),
    evidenceUrl: cleanString(input.evidenceUrl ?? existing?.evidenceUrl, '', 1000),
    auditorNote: cleanString(input.auditorNote ?? existing?.auditorNote, '', 1000),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  const store = stores();
  store.records.set(`${orgId}:${id}`, record);
  const listKey = `${orgId}:${projectId}`;
  const list = store.lists.get(listKey) || [];
  store.lists.set(listKey, [id, ...list.filter(item => item !== id)].slice(0, 500));
  return record;
}

export async function listScaleClaimRecords(orgId: string, projectId = 'default-project', limit = 100): Promise<ScaleClaimLedgerRecord[]> {
  const store = stores();
  const ids = store.lists.get(`${orgId}:${projectId}`) || [];
  return ids.slice(0, limit).map(id => store.records.get(`${orgId}:${id}`)).filter(Boolean) as ScaleClaimLedgerRecord[];
}

export async function getScaleClaimSnapshot(orgId: string, projectId = 'default-project'): Promise<ScaleClaimSnapshot> {
  const records = await listScaleClaimRecords(orgId, projectId, 500);
  const creativeRecords = records.filter(record => record.metric === 'creative_output');
  const videoRecords = records.filter(record => record.metric === 'video_distribution');
  const creativeOutputCount = creativeRecords.reduce((sum, record) => sum + record.count, 0);
  const videoDistributionCount = videoRecords.reduce((sum, record) => sum + record.count, 0);
  const platforms = new Set(records.map(record => `${record.metric}:${record.platform}`).filter(Boolean));
  const evidenceUrlCount = records.filter(record => record.evidenceUrl.startsWith('http://') || record.evidenceUrl.startsWith('https://')).length;
  const hasDedupeRule = records.length > 0 && records.every(record => record.dedupeRule.length >= 12);
  const hasDateRange = records.length > 0 && records.every(record => /\d{4}/.test(record.dateRange));
  const hasAuditorNote = records.length > 0 && records.every(record => record.auditorNote.length >= 12);
  const evidenceReady = evidenceUrlCount === records.length && records.length > 0 && hasDedupeRule && hasDateRange && hasAuditorNote && platforms.size > 0;
  const canDisplayCreativeBenchmark = evidenceReady && creativeOutputCount >= CREATIVE_BENCHMARK_COUNT;
  const canDisplayVideoBenchmark = evidenceReady && videoDistributionCount >= VIDEO_BENCHMARK_COUNT;
  const missingLinks = [
    records.length === 0 ? 'Missing audited scale claim ledger' : '',
    creativeOutputCount === 0 ? 'Missing audited creative output count' : '',
    videoDistributionCount === 0 ? 'Missing audited video distribution count' : '',
    !hasDedupeRule ? 'Missing dedupe rule for every scale claim record' : '',
    !hasDateRange ? 'Missing audited date range for every scale claim record' : '',
    evidenceUrlCount < records.length ? 'Missing evidence URL for every scale claim record' : '',
    !hasAuditorNote ? 'Missing auditor or customer confirmation note' : '',
    creativeOutputCount > 0 && creativeOutputCount < CREATIVE_BENCHMARK_COUNT ? 'Audited creative output below 91M benchmark' : '',
    videoDistributionCount > 0 && videoDistributionCount < VIDEO_BENCHMARK_COUNT ? 'Audited video distribution below 42M benchmark' : '',
  ].filter(Boolean);

  return {
    orgId,
    projectId,
    creativeOutputCount,
    videoDistributionCount,
    platformBreakdownCount: platforms.size,
    evidenceUrlCount,
    hasDedupeRule,
    hasDateRange,
    hasAuditorNote,
    canDisplayCreativeBenchmark,
    canDisplayVideoBenchmark,
    missingLinks,
    nextActions: missingLinks.map(item => `Close scale claim gap: ${item}`),
  };
}

export function scaleClaimSnapshotFacts(snapshot: ScaleClaimSnapshot) {
  return {
    auditedCreativeOutputCount: snapshot.creativeOutputCount,
    auditedVideoDistributionCount: snapshot.videoDistributionCount,
    auditedScalePlatformBreakdownCount: snapshot.platformBreakdownCount,
    auditedScaleEvidenceUrlCount: snapshot.evidenceUrlCount,
    auditedScaleHasDedupeRule: snapshot.hasDedupeRule,
    auditedScaleHasDateRange: snapshot.hasDateRange,
    auditedScaleHasAuditorNote: snapshot.hasAuditorNote,
    auditedScaleCanDisplayCreativeBenchmark: snapshot.canDisplayCreativeBenchmark,
    auditedScaleCanDisplayVideoBenchmark: snapshot.canDisplayVideoBenchmark,
    auditedScaleMissingLinks: snapshot.missingLinks,
  };
}
