$ErrorActionPreference = "Stop"

function Invoke-Step {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Name,
    [Parameter(Mandatory = $true)]
    [scriptblock] $Command
  )

  Write-Host ""
  Write-Host "==> $Name" -ForegroundColor Cyan
  & $Command
  if ($LASTEXITCODE -ne 0) {
    throw "$Name failed with exit code $LASTEXITCODE"
  }
}

Invoke-Step "Vitest focused suite" {
  npm.cmd run test -- __tests__/standard-pack-routing.test.ts __tests__/sop-workflows.test.ts __tests__/poc-launch-check.test.ts __tests__/poc-report-evaluator.test.ts __tests__/poc-report-generator.test.ts __tests__/inquiry-activity.test.ts __tests__/ratelimit.test.ts __tests__/ai-route-demo-guard.test.ts __tests__/ocr-route.test.ts __tests__/browser-storage.test.ts __tests__/case-library.test.ts __tests__/ecommerce-guardrails.test.ts __tests__/content-marketing-pack.test.ts __tests__/brand-iq.test.ts __tests__/crm-pipeline.test.ts __tests__/share-readonly.test.ts __tests__/listing-factory-demo.test.ts __tests__/listing-factory-engine.test.ts __tests__/listing-factory-engine-samples.test.ts __tests__/listing-factory-workbench.test.ts __tests__/listing-factory-production-layer.test.ts __tests__/listing-factory-asset-layer.test.ts __tests__/listing-factory-batch-production.test.ts __tests__/listing-factory-production-rc.test.ts __tests__/listing-factory-core-capabilities.test.ts __tests__/listing-factory-real-provider.test.ts __tests__/listing-factory-video-assembly.test.ts __tests__/listing-factory-performance-feedback.test.ts __tests__/listing-factory-experiment-orchestration.test.ts __tests__/production-handoff-pack.test.ts __tests__/kuaizi-server.test.ts __tests__/sales-inquiry-memory-route.test.ts __tests__/product-readiness.test.ts __tests__/performance-import.test.ts __tests__/commerce-chain.test.ts __tests__/creative-intelligence.test.ts __tests__/creative-monitoring.test.ts __tests__/creative-harvest-cron-route.test.ts __tests__/channel-account-ledger.test.ts __tests__/industrial-chain-store.test.ts __tests__/industrial-action-queue.test.ts __tests__/industrial-dispatch-route.test.ts __tests__/industrial-asset-access-route.test.ts __tests__/industrial-production-handoff.test.ts __tests__/industrial-production-result.test.ts __tests__/industrial-crm-handoff.test.ts __tests__/industrial-review-portal.test.ts __tests__/industrial-review-page.test.tsx __tests__/industrial-video-workflow.test.ts __tests__/video-production-queue-page.test.tsx __tests__/cast-distribution-console-page.test.tsx __tests__/create-asset-console-page.test.tsx __tests__/manage-operations-console-page.test.tsx __tests__/asset-permission-ledger.test.ts __tests__/brand-learning-profile.test.ts __tests__/status-page.test.tsx __tests__/settings-pages.test.tsx __tests__/creative-monitoring-console-page.test.tsx __tests__/proxy-public-review.test.ts
}

Invoke-Step "TypeScript noEmit" {
  npx.cmd tsc --noEmit
}

Invoke-Step "ESLint" {
  npm.cmd run lint -- `
    src/lib/standard-pack-routing.ts `
    src/lib/sop-workflows.ts `
    src/lib/poc-case-studies.ts `
    src/lib/case-study-details.ts `
    src/lib/case-library.ts `
    src/lib/ecommerce-guardrails.ts `
    src/lib/content-marketing-pack.ts `
    src/lib/brand-iq.ts `
    src/lib/crm-pipeline.ts `
    src/lib/share-readonly.ts `
    src/lib/listing-factory-demo.ts `
    src/lib/listing-factory-engine.ts `
    src/lib/listing-factory-providers.ts `
    src/lib/listing-factory-golden-projects.ts `
    src/lib/listing-factory-samples.ts `
    src/lib/production-handoff-pack.ts `
    src/lib/kuaizi-shared.ts `
    src/lib/kuaizi-server.ts `
    src/lib/kuaizi-api.ts `
    src/lib/platform-connector-readiness.ts `
    src/lib/readiness-input.ts `
    src/lib/product-readiness.ts `
    src/lib/factory-readiness-view.ts `
    src/lib/performance-import.ts `
    src/lib/commerce-chain.ts `
    src/lib/channel-account-ledger.ts `
    src/lib/creative-intelligence.ts `
    src/lib/creative-monitoring.ts `
    src/lib/asset-permission-ledger.ts `
    src/lib/brand-learning-profile.ts `
    src/lib/industrial-chain-store.ts `
    src/lib/industrial-action-queue.ts `
    src/lib/industrial-production-handoff.ts `
    src/lib/industrial-production-result.ts `
    src/lib/industrial-crm-handoff.ts `
    src/lib/industrial-review-portal.ts `
    src/lib/industrial-video-workflow.ts `
    src/lib/org-id.ts `
    src/lib/inquiry-activity.ts `
    src/lib/poc-launch-check.ts `
    src/lib/poc-report-evaluator.ts `
    src/i18n/zh.ts `
    __tests__/standard-pack-routing.test.ts `
    __tests__/sop-workflows.test.ts `
    __tests__/poc-launch-check.test.ts `
    __tests__/poc-report-evaluator.test.ts `
    __tests__/poc-report-generator.test.ts `
    __tests__/inquiry-activity.test.ts `
    __tests__/ai-route-demo-guard.test.ts `
    __tests__/ocr-route.test.ts `
    __tests__/browser-storage.test.ts `
    __tests__/case-library.test.ts `
    __tests__/ecommerce-guardrails.test.ts `
    __tests__/content-marketing-pack.test.ts `
    __tests__/brand-iq.test.ts `
    __tests__/crm-pipeline.test.ts `
    __tests__/share-readonly.test.ts `
    __tests__/listing-factory-demo.test.ts `
    __tests__/listing-factory-engine.test.ts `
    __tests__/listing-factory-engine-samples.test.ts `
    __tests__/listing-factory-workbench.test.ts `
    __tests__/listing-factory-production-layer.test.ts `
    __tests__/listing-factory-asset-layer.test.ts `
    __tests__/listing-factory-batch-production.test.ts `
    __tests__/listing-factory-production-rc.test.ts `
    __tests__/listing-factory-core-capabilities.test.ts `
    __tests__/listing-factory-real-provider.test.ts `
    __tests__/listing-factory-video-assembly.test.ts `
    __tests__/listing-factory-performance-feedback.test.ts `
    __tests__/listing-factory-experiment-orchestration.test.ts `
    __tests__/production-handoff-pack.test.ts `
    __tests__/kuaizi-server.test.ts `
    __tests__/sales-inquiry-memory-route.test.ts `
    __tests__/product-readiness.test.ts `
    __tests__/performance-import.test.ts `
    __tests__/commerce-chain.test.ts `
    __tests__/creative-intelligence.test.ts `
    __tests__/creative-monitoring.test.ts `
    __tests__/creative-harvest-cron-route.test.ts `
    __tests__/channel-account-ledger.test.ts `
    __tests__/industrial-chain-store.test.ts `
    __tests__/industrial-action-queue.test.ts `
    __tests__/industrial-production-handoff.test.ts `
    __tests__/industrial-asset-access-route.test.ts `
    __tests__/industrial-production-result.test.ts `
    __tests__/industrial-crm-handoff.test.ts `
    __tests__/industrial-review-portal.test.ts `
    __tests__/industrial-review-page.test.tsx `
    __tests__/industrial-video-workflow.test.ts `
    __tests__/video-production-queue-page.test.tsx `
    __tests__/cast-distribution-console-page.test.tsx `
    __tests__/create-asset-console-page.test.tsx `
    __tests__/asset-permission-ledger.test.ts `
    __tests__/brand-learning-profile.test.ts `
    __tests__/status-page.test.tsx `
    __tests__/settings-pages.test.tsx `
    __tests__/creative-monitoring-console-page.test.tsx `
    __tests__/proxy-public-review.test.ts `
    e2e/review-portal.spec.ts `
    src/components/CaseLibraryExplorer.tsx `
    src/components/FiveMinutePocOnboarding.tsx `
    src/components/ContentMarketingPackWorkspace.tsx `
    src/components/StandardPackWorkspace.tsx `
    src/components/PocLaunchChecklist.tsx `
    src/components/PocReportGenerator.tsx `
    src/components/SharePageActions.tsx `
    src/components/IndustrialReviewPortalClient.tsx `
    src/components/VideoProductionQueueClient.tsx `
    src/components/CastDistributionConsoleClient.tsx `
    src/components/CreateAssetConsoleClient.tsx `
    src/components/ManageOperationsConsoleClient.tsx `
    src/components/CreativeMonitoringConsoleClient.tsx `
    src/components/OnboardingChecklist.tsx `
    src/components/AdminInquiryCommercialEditor.tsx `
    src/components/marketing/TopNav.tsx `
    src/components/marketing/MarketingFooter.tsx `
    src/components/marketing/Hero.tsx `
    src/components/marketing/TrustWall.tsx `
    src/components/marketing/ThreeStepPipeline.tsx `
    src/components/marketing/RoiCalculator.tsx `
    src/components/marketing/BeforeAfter.tsx `
    src/components/marketing/CaseCards.tsx `
    src/components/marketing/ComplianceStrip.tsx `
    src/components/marketing/PricingTiers.tsx `
    src/components/marketing/Faq.tsx `
    src/components/marketing/FinalCta.tsx `
    src/components/marketing/ListingFactorySections.tsx `
    src/components/SiteFooter.tsx `
    src/app/pipelines/product-image/page.tsx `
    src/app/pipelines/product-discovery/page.tsx `
    src/app/pipelines/batch-launch/page.tsx `
    src/app/pipelines/ai-photoshoot/page.tsx `
    src/app/pipelines/ai-video/page.tsx `
    src/app/pipelines/ab-test/page.tsx `
    src/app/pipelines/data-insights/page.tsx `
    src/app/pipelines/intent-mining/page.tsx `
    src/app/pipelines/new-listing/page.tsx `
    src/app/pipelines/customer-service/page.tsx `
    src/app/pipelines/influencer-outbound/page.tsx `
    src/app/pipelines/video-teardown/page.tsx `
    src/app/pipelines/marketing-campaign/page.tsx `
    src/app/about/page.tsx `
    src/app/docs/page.tsx `
    src/app/roadmap/page.tsx `
    src/app/enterprise/page.tsx `
    src/app/tools/page.tsx `
    src/app/changelog/page.tsx `
    src/app/product/photoshoot/page.tsx `
    src/app/product/pipeline/page.tsx `
    src/app/product/video/page.tsx `
    src/app/inquire/page.tsx `
    src/app/factory/page.tsx `
    src/app/factory/creative/page.tsx `
    src/app/factory/create/page.tsx `
    src/app/factory/cast/page.tsx `
    src/app/factory/manage/page.tsx `
    src/app/factory/video/page.tsx `
    src/app/briefs/page.tsx `
    src/app/insights/page.tsx `
    src/app/poc/page.tsx `
    src/app/poc/report/page.tsx `
    src/app/dashboard/DashboardClient.tsx `
    src/app/report/[shareId]/ReportTemplateClient.tsx `
    src/app/share/[id]/page.tsx `
    src/app/share/[id]/executive/page.tsx `
    src/app/cases/page.tsx `
    src/app/cases/[slug]/page.tsx `
    src/app/admin/inquiries/page.tsx `
    src/app/admin/inquiries/[id]/page.tsx `
    src/app/admin/metrics/page.tsx `
    src/app/api/ai/route.ts `
    src/app/api/ocr/route.ts `
    src/app/api/share/route.ts `
    src/app/api/kuaizi/health/route.ts `
    src/app/api/kuaizi/production-tasks/route.ts `
    src/app/api/kuaizi/production-tasks/[taskId]/route.ts `
    src/app/api/readiness/route.ts `
    src/app/api/performance-import/route.ts `
    src/app/api/commerce-chain/route.ts `
    src/app/api/channel-accounts/route.ts `
    src/app/api/creative-intelligence/route.ts `
    src/app/api/creative-monitoring/route.ts `
    src/app/api/cron/creative-harvest/route.ts `
    src/app/api/asset-permissions/route.ts `
    src/app/api/asset-permissions/access/route.ts `
    src/app/api/brand-learning-profile/route.ts `
    src/app/api/industrial-chain/route.ts `
    src/app/api/industrial-chain/assets/[assetId]/route.ts `
    src/app/api/industrial-chain/action-queue/route.ts `
    src/app/api/industrial-chain/dispatch/route.ts `
    src/app/api/industrial-chain/production-handoff/route.ts `
    src/app/api/industrial-chain/production-result/route.ts `
    src/app/api/industrial-chain/handoff/route.ts `
    src/app/api/industrial-chain/review-links/route.ts `
    src/app/api/industrial-chain/review/[token]/route.ts `
    src/app/api/industrial-chain/review/[token]/feedback/route.ts `
    src/app/api/industrial-chain/review/[token]/approve/route.ts `
    src/app/api/industrial-chain/video-workflow/route.ts `
    src/app/review/[token]/page.tsx `
    src/app/api/sales/inquiry/route.ts `
    src/app/status/page.tsx `
    src/app/settings/page.tsx `
    src/proxy.ts `
    src/lib/browser-storage.ts `
    src/lib/local-analytics.ts
}

Invoke-Step "Next build" {
  npm.cmd run build
}

Write-Host ""
Write-Host "Verification passed." -ForegroundColor Green
