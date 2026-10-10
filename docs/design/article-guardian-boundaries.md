# Article guardian boundaries

Added 10 October 2026. This extends the character identity into article headers while keeping the article body free of animation.

## Layout and behavior

`ArticleHeader.tsx` selects a topic from explicit article tags, then places `ArticleSecurityBoundary` beside the title/description/metadata. Below 960px the illustration follows the title block. The prose layout is unchanged. A noindex `/security-study` route displays all five variants, including domains with no published articles yet.

Only the approved green guardian's shield pose is rendered. An explicit atlas clip excludes the other poses and the red character. Defense labels remain stationary inside a green boundary; four threat labels remain stationary outside. Small incoming signals fade at the perimeter and a green boundary pulse plays. This is a thematic illustration, not a simulator asserting that every listed attack is prevented.

Each illustration runs once for 12 seconds and then exposes Replay. Pause/Play affects its CSS timeline. The shared visibility hook pauses it offscreen and when the document is hidden. Reduced motion removes the pulse and moving packets while preserving all labels and the guardian. There is no audio, canvas, WebGL, per-frame React update, or new dependency.

## Data and mapping

`src/components/articles/security-topics.ts` owns names, controls, threats, motion variants, source URLs, and tag mapping. Precedence for mixed tags is AI → runtime → Kubernetes → cloud → application security. Unknown tags return null and retain the original text-only header. Do not guess a security category from article prose.

| Variant | Recognized tags | Six defense layers | Four outside threats |
| --- | --- | --- | --- |
| Kubernetes | containers-kubernetes, kubernetes | RBAC, Policies, IRSA, EKS Pod Identity, Service mesh, mTLS | Token theft, Privileged pods, Lateral movement, Exposed API |
| Cloud | cloud-security, cloud, aws, gcp, azure | Least-privilege IAM, MFA, Network rules, KMS, Audit logs, Posture checks | Stolen credentials, Public storage, Metadata abuse, Privilege escalation |
| Application | application-security, appsec, browser-security | Authorization, Input validation, Bound parameters, Output encoding, Session controls, Rate limits | SQL injection, XSS, Broken access, Session theft |
| Runtime | runtime-security, runtime | Falco alerts, seccomp, AppArmor / SELinux, Least privilege, Read-only FS, Response workflow | Unexpected shell, Process injection, Container escape, Cryptomining |
| AI | ai-security, llm-security, ai | Prompt screening, Tool allowlist, Scoped identity, Output validation, Sandbox, Human approval | Prompt injection, Tool misuse, Data exfiltration, Poisoned context |

Motion treatments are intentionally small: angled network packets for Kubernetes, a dashed perimeter for cloud, request bars for application security, telemetry dots for runtime, and diamond packets for AI. All use the same finite lifecycle. The controls are representative selections, not exhaustive inventories.

## Technical content boundaries and references

- Kubernetes RBAC and policy layers: [Kubernetes security checklist](https://kubernetes.io/docs/concepts/security/security-checklist/).
- IRSA and EKS Pod Identity are alternatives for assigning AWS permissions to workloads, not generic controls present in every cluster: [AWS workload service accounts](https://docs.aws.amazon.com/eks/latest/userguide/service-accounts.html).
- Service-mesh identity, authorization, and mTLS require appropriate configuration: [Istio security concepts](https://istio.io/latest/docs/concepts/security/).
- Cloud domains span identity, detection, infrastructure, and data protection: [AWS Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html).
- Application controls have different scopes: [OWASP injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html) and [authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).
- Falco detects and alerts; a response workflow is separate: [Falco documentation](https://falco.org/docs/). Kubernetes checklist above covers container hardening controls.
- AI screening is one layer; tool scope, validation, and approval also matter: [OWASP prompt-injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

These links also appear in each diagram's expandable “About these layers” disclosure. The illustration doesn't update or rewrite historical article guidance.

## Maintenance and tests

Component: `src/components/articles/ArticleSecurityBoundary.tsx`. Styles: the article-boundary section of `src/styles/prose.css`. Tests: `tests/e2e/article-boundary.spec.ts`.

The pulse is the completion sentinel: its `animationend` marks playback finished. All packet iterations and delays must end before the 12-second pulse. If changing duration, keep these synchronized. Replay remounts only the field, resetting CSS animations. Visibility controls play state; it doesn't create another timer. The reduced-motion media rule removes animations entirely.

When adding labels, inspect 375px width: long left/right middle labels need to wrap within the inner boundary. Keep the title readable and don't shrink article body typography to fit the illustration. Don't add looping labels or another autonomous character animation without reviewing reading distraction.

Verification commands:

```sh
npm run lint
PLAYWRIGHT_CHANNEL=chrome npm run test:browser -- tests/e2e/article-boundary.spec.ts
```

Coverage: Kubernetes/application mapping, title and reading continuity, pause/resume, finite completion/replay, offscreen suspension, all five variants, reduced motion, and phone overflow. Real-device battery/frame-rate and cross-engine browser performance are not inferred from these checks.

## Verification evidence (10 October 2026)

Two focused Chrome tests passed against a production build. Final build/TypeScript, lint, and whitespace checks passed. Visual review covered the real Informers header at 1440px, its 375px layout, and all five dark phone diagrams. The final spacing pass fixed long controls cutting across the rounded boundary; updated Cloud, Runtime, and Application captures show them contained. An independent code/document review found no material blockers. Cross-engine and physical-device performance remain unmeasured.

### Compact-circle refinement

The later refinement caps the header slot at 320px and places a true 232px circular boundary in a 280×306px field. Controls and the guardian are smaller; the article title regains horizontal space. See [Reading rewards and traces](reading-rewards-and-traces.md) for this refinement and the reader's earned stamp.
