export const securityTopics = {
  kubernetes: {
    name: 'Kubernetes', motion: 'network',
    controls: ['RBAC', 'Policies', 'IRSA', 'EKS Pod Identity', 'Service mesh', 'mTLS'],
    threats: ['Token theft', 'Privileged pods', 'Lateral movement', 'Exposed API'],
    note: 'Kubernetes defense layers. IRSA and EKS Pod Identity are AWS workload identity options; policies and mesh controls require configuration.',
    sources: ['https://kubernetes.io/docs/concepts/security/security-checklist/', 'https://docs.aws.amazon.com/eks/latest/userguide/service-accounts.html', 'https://istio.io/latest/docs/concepts/security/'],
  },
  cloud: {
    name: 'Cloud security', motion: 'perimeter',
    controls: ['Least-privilege IAM', 'MFA', 'Network rules', 'KMS', 'Audit logs', 'Posture checks'],
    threats: ['Stolen credentials', 'Public storage', 'Metadata abuse', 'Privilege escalation'],
    note: 'Identity, network, data, and monitoring layers. Their effectiveness depends on configuration and response.',
    sources: ['https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html'],
  },
  appsec: {
    name: 'Application security', motion: 'requests',
    controls: ['Authorization', 'Input validation', 'Bound parameters', 'Output encoding', 'Session controls', 'Rate limits'],
    threats: ['SQL injection', 'XSS', 'Broken access', 'Session theft'],
    note: 'Application defense layers. Controls address different threat classes and must be applied at the correct trust boundary.',
    sources: ['https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html', 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html'],
  },
  runtime: {
    name: 'Runtime security', motion: 'telemetry',
    controls: ['Falco alerts', 'seccomp', 'AppArmor / SELinux', 'Least privilege', 'Read-only FS', 'Response workflow'],
    threats: ['Unexpected shell', 'Process injection', 'Container escape', 'Cryptomining'],
    note: 'Runtime detection and hardening. Falco alerts on behavior; isolation requires a configured response workflow.',
    sources: ['https://falco.org/docs/', 'https://kubernetes.io/docs/concepts/security/security-checklist/'],
  },
  ai: {
    name: 'AI security', motion: 'screening',
    controls: ['Prompt screening', 'Tool allowlist', 'Scoped identity', 'Output validation', 'Sandbox', 'Human approval'],
    threats: ['Prompt injection', 'Tool misuse', 'Data exfiltration', 'Poisoned context'],
    note: 'Layered AI defenses. Screening alone cannot guarantee protection against prompt injection.',
    sources: ['https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html'],
  },
} as const;
export type SecurityTopic = keyof typeof securityTopics;

/** Explicit tags only; no inferred claims from arbitrary article prose. */
export function securityTopicFor(tags: string[]): SecurityTopic | null {
  const has = (...values: string[]) => values.some(value => tags.includes(value));
  if (has('ai-security', 'llm-security', 'ai')) return 'ai';
  if (has('runtime-security', 'runtime')) return 'runtime';
  if (has('containers-kubernetes', 'kubernetes')) return 'kubernetes';
  if (has('cloud-security', 'cloud', 'aws', 'gcp', 'azure')) return 'cloud';
  if (has('application-security', 'appsec', 'browser-security')) return 'appsec';
  return null;
}
