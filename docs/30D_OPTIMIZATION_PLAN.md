# 30-Day Optimization Plan (TypeScript SDK)

## Outcome Target

- Ship a production-grade SDK experience with faster onboarding, safer retries, and verifiable quality gates.
- Keep customer time-to-first-success under 10 minutes for first API call and under 30 minutes for first SSE chat flow.

## P0 (Day 1-14): Reliability and Contract Hardening

| Workstream | Task | Files | Acceptance |
| --- | --- | --- | --- |
| API Contract Alignment | Align chat history and knowledge-base status paths/methods with latest backend contract and docs | `src/client.ts`, `openapi/ai-sandbox-v1.yaml`, `docs/INTEGRATION.md` | 11 API operations validated with no mismatch |
| Safe Retry Policy | Restrict automatic retries to idempotent methods by default; add optional idempotency key for write endpoints | `src/client.ts`, `src/types.ts`, `README.md` | No duplicate create/send events in retry fault-injection test |
| Error Observability | Ensure `ApiError` always carries status/body/traceId and examples show trace logging | `src/errors.ts`, `README.md`, `docs/INTEGRATION.md` | Error handling guide includes traceId extraction example |
| QA Baseline | Add unit tests for request builder, SSE parser, and retry decisions | `src/*.ts`, `tests/*` (new), `package.json` | CI test stage green with minimum 80% critical-path coverage |
| CI/CD Guardrails | Restore workflow for lint/build/test and release checks | `.github/workflows/ci.yml` (new), `package.json` | PR blocked unless required checks pass |

## P1 (Day 15-30): Developer Experience and Growth

| Workstream | Task | Files | Acceptance |
| --- | --- | --- | --- |
| Example Expansion | Add end-to-end quickstart for create agent -> channel -> SSE stream -> KB list | `examples/quickstart.ts`, `README.md` | Example runs successfully with env vars only |
| Visual Docs Upgrade | Keep README visual cards/flow and add troubleshooting matrix | `README.md`, `docs/INTEGRATION.md` | Reduced setup questions in onboarding feedback |
| Release Quality | Add changelog automation and semantic release checklist | `CHANGELOG.md`, `CONTRIBUTING.md` | Every release includes versioned notes and compatibility notes |
| Security Posture | Add dependency audit and secret scanning in CI | `.github/workflows/ci.yml`, `SECURITY.md` | No high-severity unresolved alert before release |

## Language File Checklist

- `README.md`
- `docs/INTEGRATION.md`
- `docs/30D_OPTIMIZATION_PLAN.md`
- `src/client.ts`
- `src/errors.ts`
- `src/types.ts`
- `examples/quickstart.ts`
- `openapi/ai-sandbox-v1.yaml`
- `package.json`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `SECURITY.md`

## Definition of Done (DoD)

- [ ] 11/11 API operations pass production integration validation.
- [ ] SSE flow returns chunk data and terminates with `[DONE]` in regression test.
- [ ] Retry policy no longer duplicates non-idempotent write operations by default.
- [ ] CI pipeline enforces lint + build + test on every PR.
- [ ] README quickstart is executable as-is with only `AI_SANDBOX_BASE_URL` and `AI_SANDBOX_API_KEY`.
