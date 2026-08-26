FTNDNS_AI — Production Source Map & Upload Audit
Audit basis: all directly uploaded project sources available in this conversation.
Audit result
Uploaded source records audited: 56
Distinct source titles/groups identified: 20+
Major implementation families: Conversation Compiler, FTN ISP/Network, AI/Agent, Security/Recovery, GIS/Fiber, Telemetry, API Security, Autonomous Intelligence expansion.
Repository target: `beparykamrul-dev/FTNDNS_AI`
Push status: NOT PUSHED YET. This map is the pre-push source-of-truth.
Canonical repository layout
```text
FTNDNS_AI/
├── apps/
│   ├── web/
│   ├── flutter/
│   └── callcenter/
├── services/
│   ├── core-compiler/
│   ├── parser/
│   ├── planner/
│   ├── code-generator/
│   ├── filesystem-builder/
│   ├── deployment/
│   ├── monitoring/
│   ├── ai/
│   ├── api-gateway/
│   ├── database/
│   ├── auth/
│   ├── plugin/
│   ├── workflow/
│   ├── project-manager/
│   ├── source-control/
│   ├── testing/
│   ├── documentation/
│   ├── package-registry/
│   ├── api-marketplace/
│   ├── cloud/
│   ├── kubernetes/
│   ├── cicd/
│   ├── release/
│   ├── security/
│   ├── backup/
│   ├── governance/
│   ├── notifications/
│   ├── enterprise-search/
│   ├── agent-orchestration/
│   ├── billing/
│   ├── isp-network/
│   ├── customer/
│   ├── payment/
│   ├── mikrotik/
│   ├── olt/
│   ├── fiber/
│   ├── gis/
│   ├── ai-noc/
│   ├── telemetry/
│   ├── autonomous-network/
│   ├── smart-noc/
│   ├── ai-assistant/
│   ├── service-mesh/
│   ├── event-bus/
│   ├── api-security/
│   ├── iam/
│   ├── configuration/
│   └── asset-inventory/
├── packages/
│   ├── shared-types/
│   ├── security/
│   ├── telemetry/
│   └── sdk/
├── infra/
│   ├── docker/
│   ├── kubernetes/
│   └── deployment/
├── database/
├── docs/
├── tests/
└── scripts/
```
Source families
Source family	Canonical destination	Audit disposition
Conversation to Code Compiler / Branch	`services/core-compiler/` + `apps/web/` + `apps/flutter/` + `infra/`	MERGE; duplicate branch material must not be copied verbatim
Parser Engine Structure	`services/parser/`	MERGE
Code Generator Implementation / Part-3	`services/code-generator/`	MERGE; consolidate repeated Part-3 uploads
AI Engine Implementation	`services/ai/`	MERGE; separate model/provider adapters
Authentication Engine	`services/auth/` + `services/iam/`	MERGE; consolidate duplicate auth uploads
Enterprise Project Manager	`services/project-manager/`	MERGE
Documentation Engine	`services/documentation/`	MERGE
Cloud Infrastructure Engine	`services/cloud/` + `infra/`	MERGE
Security Operations Engine	`services/security/`	MERGE; consolidate duplicate security uploads
Disaster Recovery Automation	`services/backup/`	MERGE; distinguish backup from recovery orchestration
Enterprise Search Pipeline	`services/enterprise-search/`	MERGE
Billing/Finance modules	`services/billing/` + `services/payment/`	MERGE
ISP Network Operations	`services/isp-network/`	MERGE
Customer Management/Portal	`services/customer/`	MERGE
MikroTik Auto Control	`services/mikrotik/`	MERGE
OLT Discovery/Management	`services/olt/`	MERGE
Fiber Network Intelligence	`services/fiber/`	MERGE
GIS Fiber Mapping	`services/gis/`	MERGE
Real-Time Telemetry	`services/telemetry/`	MERGE; remove duplicate snapshots
AI Network Autonomous Operations	`services/autonomous-network/`	MERGE
Smart NOC / Command Center	`services/smart-noc/`	MERGE
FTN AI Network Assistant	`services/ai-assistant/`	MERGE
Service Mesh	`services/service-mesh/`	MERGE
Event Streaming / Message Bus	`services/event-bus/`	MERGE
FTN API Security Gateway	`services/api-security/`	MERGE
Identity & Access Management	`services/iam/`	MERGE with Auth Security; do not maintain two independent identity cores
Configuration Management	`services/configuration/`	MERGE
Asset & Inventory Intelligence	`services/asset-inventory/`	MERGE
Autonomous Intelligence 310–377	`services/autonomous-expansion/`	IMPORT AS EXPANSION; preserve module numbering and avoid replacing canonical core modules
378+ batch proposal	`docs/roadmap/`	ROADMAP ONLY unless concrete source code is present
Critical pre-push findings
1. Duplicate uploads
Several source files were uploaded multiple times. They must be deduplicated by canonical module and content, not copied as separate implementations.
2. Module numbering conflicts
The sources contain multiple pipeline interpretations. For example, one source defines 01–45 as the core compiler/FTN pipeline, while another later source extends the autonomous intelligence numbering to 310–377. The repository should keep:
stable service names as the real directory identity;
historical module numbers in metadata/docs;
no duplicate services merely because numbering differs.
3. Production-readiness gap
The sources call the modules “production”, but the audited code contains explicit placeholder implementations. Examples include methods returning `nil`, empty slices, fixed values, or placeholder strings. Therefore these sources are implementation blueprints + partial code, not evidence that the whole system is already production-complete.
4. Dependency consolidation required
The uploaded sources use a broad dependency set including Fiber, GORM/Postgres, Redis, JWT, Zap, Viper, go-git, pgvector, Kafka, SNMP, React/Vite and Flutter packages. The repository should centralize versions and remove redundant packages before release.
5. AI safety architecture is consistent
The strongest recurring architecture rule is approval-first execution: AI analyzes/recommends, risk is checked, a human approves, then an action executor runs and records an audit trail. This should become a shared platform policy instead of being reimplemented independently in each AI module.
6. Frontend/mobile integration
The sources explicitly target Web + Flutter and describe customer/NOC unified application integration. These should consume stable backend APIs rather than duplicating business logic.
Canonical integration order
```text
Core Compiler
  → Parser
  → Planner
  → Code Generator
  → Filesystem
  → Testing/Validation
  → Source Control
  → Deployment

Platform Core
  → API Gateway
  → Database
  → Auth/IAM
  → Configuration
  → Plugin
  → Workflow
  → Event Bus
  → Service Mesh

FTN Operations
  → Asset Inventory
  → ISP Network
  → MikroTik
  → OLT
  → Fiber
  → GIS
  → Telemetry
  → AI NOC
  → Autonomous Network
  → Smart NOC
  → AI Assistant

Business
  → Customer
  → Billing
  → Payment
  → Notification
  → Search/Knowledge

Platform Security/Resilience
  → API Security
  → Security Operations
  → Governance
  → Backup/Recovery
  → Observability

Clients
  → Web
  → Flutter Android
  → AI Call Center
```
Push gate
Do NOT push until these checks pass:
Deduplicate source.
Resolve module-name/number conflicts.
Extract real code from prose/command blocks.
Replace stubs with implemented interfaces or explicitly mark them as pending.
Normalize Go module paths.
Generate one root `go.work`/workspace strategy.
Normalize frontend and Flutter dependencies.
Add shared auth, permissions, audit, telemetry and error contracts.
Run formatting, static checks, unit tests and build checks.
Run secret scan before first public commit.
Only then create the initial repository commit and push.
Status
SOURCE MAP: CREATED
AUDIT: COMPLETED AT SOURCE-DOCUMENT LEVEL
CODE INTEGRATION: NOT YET PERFORMED
GITHUB PUSH: NOT YET PERFORMED
