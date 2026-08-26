# FTNDNS_AI Production Source Map

Pre-push audit of uploaded FTN implementation sources.

## Source families

- Core compiler: parser, planner, code generator, filesystem builder, deployment, monitoring.
- Platform: AI, API gateway, database, auth/IAM, plugin, workflow, project manager, source control, testing, documentation, package registry, cloud, Kubernetes, CI/CD, release, security, backup/DR.
- FTN network: ISP operations, customer management, billing/payment, MikroTik, OLT, fiber, GIS, telemetry, autonomous operations, Smart NOC, AI network assistant.
- Infrastructure: service mesh, event bus, API security, configuration management, asset inventory.
- Autonomous Intelligence expansion: modules 310–377; retain as an expansion layer and do not duplicate canonical services.

## Integration rules

1. Deduplicate repeated uploads by canonical module and content.
2. Treat directory/service names as canonical identity; preserve historical module numbers in documentation.
3. Do not label stubs as complete production implementations.
4. Centralize shared auth, permissions, audit, telemetry, error contracts and security policy.
5. Keep Web, Flutter and Call Center as client layers over stable backend APIs.
6. AI actions follow analysis → risk check → approval → execution → audit.
7. Before importing executable source, normalize Go module paths, dependencies and imports; run formatting, static analysis, tests, build checks and secret scanning.
8. Avoid adding source that is only roadmap/prose unless it contains concrete implementation required by the canonical architecture.

## Current audit decision

The repository is empty and ready for staged ingestion. This file is the initial audit manifest. Actual source ingestion must be performed in validated batches; uploaded snippets containing placeholder implementations must be corrected before being treated as production-complete.
