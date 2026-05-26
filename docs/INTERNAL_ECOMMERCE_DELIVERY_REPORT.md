# Wenai Ecommerce Internal Delivery Report

## Customer UI Rule

Customer-facing pages should only answer two questions:

- What does Wenai do?
- What should the customer click or provide next?

Do not expose implementation sources, repository names, provider gates, API keys,
OAuth, cookies, internal ledgers, object storage, worker scaling, or platform
automation research on the customer homepage. Those details belong in internal
delivery notes, sales engineering handoff, or operator runbooks.

## Current Customer Flow

The customer-facing workbench should stay organized around four actions:

- Select a product: provide product claims, target platform, references, and constraints.
- Generate content: create image tasks, short-video tasks, captions, and support copy.
- Take the publish pack: copy titles, body text, tags, covers, and publishing checklist.
- Return proof: upload links, screenshots, CSV exports, or cloud-drive evidence for the next review.

This supports a sellable first delivery without asking the customer to understand
how the production system is built.

## Internal Technical Notes

The current implementation can learn from open-source video and content tooling,
including timeline composition, FFmpeg-style rendering, template-driven short
video assembly, publishing field mapping, and structured content generation.
These are internal implementation references, not customer value propositions.

Generated image, video, digital-human, and TTS services can enhance production
when configured, but they should not be framed as blockers for the first customer
trial. The first trial can ship as a publish-pack workflow with customer
self-publishing and evidence return.

## Longxia Decision

Do not make Longxia-style computer control the default path now.

Recommended staging:

- Phase 1: publish pack plus customer self-publishing and evidence return.
- Phase 2: optional guided operation for customers who explicitly want assisted
  browser or desktop actions.
- Phase 3: only consider direct automation after platform account ownership,
  consent, risk controls, audit logs, and rollback procedures are documented.

This avoids making account operation, platform risk, and compliance complexity
part of the first customer-facing product experience.
