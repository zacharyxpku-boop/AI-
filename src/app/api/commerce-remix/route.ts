import { NextRequest, NextResponse } from 'next/server';
import {
  buildCommerceCloudDriveManifest,
  buildCommerceCloudDriveReturnPlan,
  buildCommerceCustomerReturnIntakeBoard,
  buildCommerceCustomerDeliveryMap,
  buildCommerceEvidenceReadinessBoard,
  buildCommerceSalesConversationBoard,
  buildCommerceCustomerServicePack,
  buildCommerceCustomerSupportWorkflow,
  buildCommerceCreatorPersonaMatrix,
  buildCommerceFirstDeliveryChecklist,
  buildCommerceModelImageTaskPack,
  buildCommerceOpenSourceAdapters,
  buildCommerceOpenSourceCoverage,
  buildCommerceOpenSourceStackSelector,
  buildCommercePostPublishActionBoard,
  buildCommerceProviderActivationRunbook,
  buildCommerceProviderActivationPlan,
  buildCommerceProviderNeedAssessment,
  buildCommercePublishingMatrixPlan,
  buildCommerceRemixEnginePlan,
  buildCommerceRemixExportPackage,
  buildCommerceRemixExecutionRecipes,
  buildCommerceRemixOrchestrationBoard,
  buildCommerceRemixTemplateBank,
  buildCommerceRemixWorkflowPlaybook,
  buildCommerceRenderCapacityPlan,
  buildCommerceRenderBatchPlan,
  buildCommerceRenderOperationsRunbook,
  buildCommerceRenderReliabilityBoard,
  buildCommerceSelfPublishingCommandCenter,
  buildCommerceSuperIpTitleBoard,
  buildCommerceWorkbenchSystemMap,
  buildDemoCommerceCloudDriveManifest,
  buildDemoCommerceCloudDriveReturnPlan,
  buildDemoCommerceCustomerReturnIntakeBoard,
  buildDemoCommerceCustomerDeliveryMap,
  buildDemoCommerceEvidenceReadinessBoard,
  buildDemoCommerceSalesConversationBoard,
  buildDemoCommerceCustomerServicePack,
  buildDemoCommerceCustomerSupportWorkflow,
  buildDemoCommerceCreatorPersonaMatrix,
  buildDemoCommerceFirstDeliveryChecklist,
  buildDemoCommerceModelImageTaskPack,
  buildDemoCommerceOpenSourceCoverage,
  buildDemoCommerceOpenSourceStackSelector,
  buildDemoCommercePostPublishActionBoard,
  buildDemoCommerceProviderActivationRunbook,
  buildDemoCommerceProviderActivationPlan,
  buildDemoCommerceProviderNeedAssessment,
  buildDemoCommercePublishingMatrixPlan,
  buildDemoCommercePerformanceUploadReport,
  buildDemoCommerceRemixDryRun,
  buildDemoCommerceRemixEnginePlan,
  buildDemoCommerceRemixExportPackage,
  buildDemoCommerceRemixExecutionRecipes,
  buildDemoCommerceRemixOrchestrationBoard,
  buildDemoCommerceRemixWorkflowPlaybook,
  buildDemoCommerceRemixQualityGate,
  buildDemoCommerceRemixTemplateBank,
  buildDemoCommerceRenderCapacityPlan,
  buildDemoCommerceRenderBatchPlan,
  buildDemoCommerceRenderOperationsRunbook,
  buildDemoCommerceRenderReliabilityBoard,
  buildDemoCommerceSelfPublishingCommandCenter,
  buildDemoCommerceSuperIpTitleBoard,
  buildDemoCommerceWorkbenchSystemMap,
  evaluateCommercePerformanceUploads,
  evaluateCommerceRemixQuality,
  executeCommerceRenderBatches,
  executeCommerceRemixDryRun,
  type CommercePerformanceUpload,
  type CommerceRemixPlanInput,
} from '@/lib/commerce-remix-engine';

type CommerceRemixRequestBody = {
  input?: CommerceRemixPlanInput;
  performanceUploads?: CommercePerformanceUpload[];
  failQueueItemIds?: string[];
  maxConcurrency?: number;
  retryBudget?: number;
};

function isValidInput(value: unknown): value is CommerceRemixPlanInput {
  const candidate = value as Partial<CommerceRemixPlanInput> | null;
  return Boolean(
    candidate
    && typeof candidate.productName === 'string'
    && Array.isArray(candidate.sellingPoints)
    && typeof candidate.audience === 'string'
    && Array.isArray(candidate.platforms)
    && Array.isArray(candidate.assets)
    && Array.isArray(candidate.scenes)
  );
}

function buildInputResponse(input: CommerceRemixPlanInput, body: CommerceRemixRequestBody = {}) {
  const plan = buildCommerceRemixEnginePlan(input);
  const exportPackage = buildCommerceRemixExportPackage(input, plan);
  const cloudDrive = buildCommerceCloudDriveManifest(input, exportPackage.rootDir);
  const templates = buildCommerceRemixTemplateBank(input);
  const qualityGate = evaluateCommerceRemixQuality(input, plan, templates);
  const batchPlan = buildCommerceRenderBatchPlan(plan.queue, {
    maxConcurrency: body.maxConcurrency,
    retryBudget: body.retryBudget,
  });
  const batchExecution = executeCommerceRenderBatches(plan.queue, batchPlan, {
    failQueueItemIds: body.failQueueItemIds,
  });
  const renderCapacity = buildCommerceRenderCapacityPlan(plan.queue, batchPlan);
  const renderReliabilityBoard = buildCommerceRenderReliabilityBoard(plan.queue, batchPlan, renderCapacity);
  const renderOperationsRunbook = buildCommerceRenderOperationsRunbook(plan.queue, batchPlan, renderCapacity, renderReliabilityBoard);
  const dryRun = executeCommerceRemixDryRun(plan, {
    failQueueItemIds: body.failQueueItemIds,
  });
  const performanceReport = evaluateCommercePerformanceUploads(body.performanceUploads || []);
  const servicePack = buildCommerceCustomerServicePack(input);
  const modelImageTaskPack = buildCommerceModelImageTaskPack(input);
  const customerSupportWorkflow = buildCommerceCustomerSupportWorkflow(input, servicePack);
  const salesConversationBoard = buildCommerceSalesConversationBoard(input, servicePack, customerSupportWorkflow);
  const workbenchSystemMap = buildCommerceWorkbenchSystemMap(input, plan);
  const customerDeliveryMap = buildCommerceCustomerDeliveryMap(input);
  const providerActivationPlan = buildCommerceProviderActivationPlan();
  const providerActivationRunbook = buildCommerceProviderActivationRunbook(providerActivationPlan);
  const providerNeedAssessment = buildCommerceProviderNeedAssessment(input, plan, providerActivationPlan);
  const firstDeliveryChecklist = buildCommerceFirstDeliveryChecklist(input, plan, exportPackage, customerDeliveryMap, providerActivationPlan);
  const openSourceAdapters = buildCommerceOpenSourceAdapters();
  const openSourceCoverage = buildCommerceOpenSourceCoverage(input, plan, openSourceAdapters);
  const openSourceStackSelector = buildCommerceOpenSourceStackSelector(input, plan, openSourceAdapters);
  const executionRecipes = buildCommerceRemixExecutionRecipes(input, plan, openSourceAdapters);
  const orchestrationBoard = buildCommerceRemixOrchestrationBoard(input, plan, openSourceAdapters);
  const workflowPlaybook = buildCommerceRemixWorkflowPlaybook(input, plan);
  const publishingMatrix = buildCommercePublishingMatrixPlan(input, plan.publishingPacks);
  const creatorPersonaMatrix = buildCommerceCreatorPersonaMatrix(input, publishingMatrix);
  const superIpTitleBoard = buildCommerceSuperIpTitleBoard(input, creatorPersonaMatrix);
  const cloudReturnPlan = buildCommerceCloudDriveReturnPlan(input, cloudDrive);
  const selfPublishingCommandCenter = buildCommerceSelfPublishingCommandCenter(input, publishingMatrix, creatorPersonaMatrix, cloudReturnPlan);
  const customerReturnIntakeBoard = buildCommerceCustomerReturnIntakeBoard(performanceReport, cloudReturnPlan);
  const evidenceReadinessBoard = buildCommerceEvidenceReadinessBoard(performanceReport, cloudReturnPlan, customerReturnIntakeBoard);
  const postPublishActionBoard = buildCommercePostPublishActionBoard(performanceReport, customerReturnIntakeBoard, customerSupportWorkflow, cloudReturnPlan);

  return {
    mode: 'local_first',
    providerBoundary: '图片、视频、数字人 API Key 可以后续接入；本接口不需要外部 provider，也不自动登录客户账号。',
    customerPublishingBoundary: exportPackage.customerPublishingBoundary,
    plan,
    exportPackage,
    cloudDrive,
    templates,
    qualityGate,
    batchPlan,
    batchExecution,
    renderCapacity,
    renderReliabilityBoard,
    renderOperationsRunbook,
    dryRun,
    performanceReport,
    servicePack,
    modelImageTaskPack,
    customerSupportWorkflow,
    salesConversationBoard,
    workbenchSystemMap,
    customerDeliveryMap,
    providerActivationPlan,
    providerActivationRunbook,
    providerNeedAssessment,
    firstDeliveryChecklist,
    openSourceAdapters,
    openSourceCoverage,
    openSourceStackSelector,
    executionRecipes,
    orchestrationBoard,
    workflowPlaybook,
    publishingMatrix,
    creatorPersonaMatrix,
    superIpTitleBoard,
    selfPublishingCommandCenter,
    cloudReturnPlan,
    customerReturnIntakeBoard,
    evidenceReadinessBoard,
    postPublishActionBoard,
  };
}

export async function GET() {
  return NextResponse.json({
    mode: 'demo',
    providerBoundary: 'Demo 只展示本地混剪、发布包、客户回填和客服素材；真实生图/视频/数字人等待 API Key。',
    plan: buildDemoCommerceRemixEnginePlan(),
    exportPackage: buildDemoCommerceRemixExportPackage(),
    cloudDrive: buildDemoCommerceCloudDriveManifest(),
    templates: buildDemoCommerceRemixTemplateBank(),
    qualityGate: buildDemoCommerceRemixQualityGate(),
    batchPlan: buildDemoCommerceRenderBatchPlan(),
    renderCapacity: buildDemoCommerceRenderCapacityPlan(),
    renderReliabilityBoard: buildDemoCommerceRenderReliabilityBoard(),
    renderOperationsRunbook: buildDemoCommerceRenderOperationsRunbook(),
    dryRun: buildDemoCommerceRemixDryRun(),
    performanceReport: buildDemoCommercePerformanceUploadReport(),
    servicePack: buildDemoCommerceCustomerServicePack(),
    modelImageTaskPack: buildDemoCommerceModelImageTaskPack(),
    customerSupportWorkflow: buildDemoCommerceCustomerSupportWorkflow(),
    salesConversationBoard: buildDemoCommerceSalesConversationBoard(),
    workbenchSystemMap: buildDemoCommerceWorkbenchSystemMap(),
    customerDeliveryMap: buildDemoCommerceCustomerDeliveryMap(),
    providerActivationPlan: buildDemoCommerceProviderActivationPlan(),
    providerActivationRunbook: buildDemoCommerceProviderActivationRunbook(),
    providerNeedAssessment: buildDemoCommerceProviderNeedAssessment(),
    firstDeliveryChecklist: buildDemoCommerceFirstDeliveryChecklist(),
    openSourceAdapters: buildCommerceOpenSourceAdapters(),
    openSourceCoverage: buildDemoCommerceOpenSourceCoverage(),
    openSourceStackSelector: buildDemoCommerceOpenSourceStackSelector(),
    executionRecipes: buildDemoCommerceRemixExecutionRecipes(),
    orchestrationBoard: buildDemoCommerceRemixOrchestrationBoard(),
    workflowPlaybook: buildDemoCommerceRemixWorkflowPlaybook(),
    publishingMatrix: buildDemoCommercePublishingMatrixPlan(),
    creatorPersonaMatrix: buildDemoCommerceCreatorPersonaMatrix(),
    superIpTitleBoard: buildDemoCommerceSuperIpTitleBoard(),
    selfPublishingCommandCenter: buildDemoCommerceSelfPublishingCommandCenter(),
    cloudReturnPlan: buildDemoCommerceCloudDriveReturnPlan(),
    customerReturnIntakeBoard: buildDemoCommerceCustomerReturnIntakeBoard(),
    evidenceReadinessBoard: buildDemoCommerceEvidenceReadinessBoard(),
    postPublishActionBoard: buildDemoCommercePostPublishActionBoard(),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as CommerceRemixRequestBody;
  if (!isValidInput(body.input)) {
    return NextResponse.json({
      error: 'commerce_remix_input_required',
      message: '请提供商品名称、卖点、受众、平台、素材和分镜，才能生成本地混剪任务包。',
    }, { status: 400 });
  }

  return NextResponse.json(buildInputResponse(body.input, body));
}
