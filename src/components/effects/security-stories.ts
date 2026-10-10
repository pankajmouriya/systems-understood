export const STORY_SECONDS = 24;
export const COMBAT_START = 3.6;
export const PORTRAIT_RETURN = 15.6;
export type ScenePhase = 'portrait' | 'combat' | 'return';
export const SECURITY_STORIES = [
  { id: 'sqli', title: 'SQL injection', attack: "' OR 1=1", tool: 'AWS WAF', layer: 'SQLi inspection', result: 'Request blocked', detail: 'A SQLi rule matches the request and the WAF blocks it before the application.', source: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-sqli-match.html' },
  { id: 'prompt', title: 'Prompt injection', attack: 'ignore the policy', tool: 'Bedrock Guardrails', layer: 'Prompt screening + tool allowlist', result: 'Tool access denied', detail: 'Untrusted instructions are screened. A separate tool allowlist refuses the requested privileged action.', source: 'https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-prompt-attack.html' },
  { id: 'supply', title: 'Supply-chain attack', attack: 'unsigned image', tool: 'Sigstore / Cosign', layer: 'Signature + admission policy', result: 'Deployment denied', detail: 'An image without the required trusted signature fails admission policy before deployment.', source: 'https://docs.sigstore.dev/policy-controller/overview/' },
  { id: 'rce', title: 'Remote code execution', attack: 'unexpected shell', tool: 'Cloud Armor → Falco', layer: 'Edge rules + runtime response', result: 'Workload isolated', detail: 'An exploit evades the edge rule. Falco detects a suspicious shell, then a configured response workflow isolates the workload.', source: 'https://falco.org/blog/integrate-runtime-security-with-falcosidekick/' },
] as const;
export type SecurityStory = typeof SECURITY_STORIES[number];
export function scenePhaseAt(seconds: number): ScenePhase {
  return seconds < COMBAT_START || seconds >= 18 ? 'portrait' : seconds < PORTRAIT_RETURN ? 'combat' : 'return';
}
