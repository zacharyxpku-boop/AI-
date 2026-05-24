import { NextRequest, NextResponse } from 'next/server';
import {
  buildCommerceCloudDriveManifest,
  buildCommerceCloudDriveReturnPlan,
  buildCommerceCustomerReturnIntakeBoard,
  buildCommerceCustomerDeliveryMap,
  buildCommerceSalesConversationBoard,
  buildCommerceCustomerServicePack,
  buildCommerceCustomerSupportWorkflow,
  buildCommerceCreatorPersonaMatrix,
  buildCommerceFirstDeliveryChecklist,
  buildCommerceModelImageTaskPack,
  buildCommerceOpenSourceAdapters,
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
  buildDemoCommerceCloudDriveManifest,
  buildDemoCommerceCloudDriveReturnPlan,
  buildDemoCommerceCustomerReturnIntakeBoard,
  buildDemoCommerceCustomerDeliveryMap,
  buildDemoCommerceSalesConversationBoard,
  buildDemoCommerceCustomerServicePack,
  buildDemoCommerceCustomerSupportWorkflow,
  buildDemoCommerceCreatorPersonaMatrix,
  buildDemoCommerceFirstDeliveryChecklist,
  buildDemoCommerceModelImageTaskPack,
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
  const dryRun = executeCommerceRemixDryRun(plan, {
    failQueueItemIds: body.failQueueItemIds,
  });
  const performanceReport = evaluateCommercePerformanceUploads(body.performanceUploads || []);
  const servicePack = buildCommerceCustomerServicePack(input);
  const modelImageTaskPack = buildCommerceModelImageTaskPack(input);
  const customerSupportWorkflow = buildCommerceCustomerSupportWorkflow(input, servicePack);
  const salesConversationBoard = buildCommerceSalesConversationBoard(input, servicePack, customerSupportWorkflow);
  const customerDeliveryMap = buildCommerceCustomerDeliveryMap(input);
  const providerActivationPlan = buildCommerceProviderActivationPlan();
  const providerNeedAssessment = buildCommerceProviderNeedAssessment(input, plan, providerActivationPlan);
  const firstDeliveryChecklist = buildCommerceFirstDeliveryChecklist(input, plan, exportPackage, customerDeliveryMap, providerActivationPlan);
  const openSourceAdapters = buildCommerceOpenSourceAdapters();
  const executionRecipes = buildCommerceRemixExecutionRecipes(input, plan, openSourceAdapters);
  const orchestrationBoard = buildCommerceRemixOrchestrationBoard(input, plan, openSourceAdapters);
  const workflowPlaybook = buildCommerceRemixWorkflowPlaybook(input, plan);
  const publishingMatrix = buildCommercePublishingMatrixPlan(input, plan.publishingPacks);
  const creatorPersonaMatrix = buildCommerceCreatorPersonaMatrix(input, publishingMatrix);
  const cloudReturnPlan = buildCommerceCloudDriveReturnPlan(input, cloudDrive);
  const customerReturnIntakeBoard = buildCommerceCustomerReturnIntakeBoard(performanceReport, cloudReturnPlan);

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
    dryRun,
    performanceReport,
    servicePack,
    modelImageTaskPack,
    customerSupportWorkflow,
    salesConversationBoard,
    customerDeliveryMap,
    providerActivationPlan,
    providerNeedAssessment,
    firstDeliveryChecklist,
    openSourceAdapters,
    executionRecipes,
    orchestrationBoard,
    workflowPlaybook,
    publishingMatrix,
    creatorPersonaMatrix,
    cloudReturnPlan,
    customerReturnIntakeBoard,
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
    dryRun: buildDemoCommerceRemixDryRun(),
    performanceReport: buildDemoCommercePerformanceUploadReport(),
    servicePack: buildDemoCommerceCustomerServicePack(),
    modelImageTaskPack: buildDemoCommerceModelImageTaskPack(),
    customerSupportWorkflow: buildDemoCommerceCustomerSupportWorkflow(),
    salesConversationBoard: buildDemoCommerceSalesConversationBoard(),
    customerDeliveryMap: buildDemoCommerceCustomerDeliveryMap(),
    providerActivationPlan: buildDemoCommerceProviderActivationPlan(),
    providerNeedAssessment: buildDemoCommerceProviderNeedAssessment(),
    firstDeliveryChecklist: buildDemoCommerceFirstDeliveryChecklist(),
    openSourceAdapters: buildCommerceOpenSourceAdapters(),
    executionRecipes: buildDemoCommerceRemixExecutionRecipes(),
    orchestrationBoard: buildDemoCommerceRemixOrchestrationBoard(),
    workflowPlaybook: buildDemoCommerceRemixWorkflowPlaybook(),
    publishingMatrix: buildDemoCommercePublishingMatrixPlan(),
    creatorPersonaMatrix: buildDemoCommerceCreatorPersonaMatrix(),
    cloudReturnPlan: buildDemoCommerceCloudDriveReturnPlan(),
    customerReturnIntakeBoard: buildDemoCommerceCustomerReturnIntakeBoard(),
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
