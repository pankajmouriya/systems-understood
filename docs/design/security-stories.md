# Illustrative security stories

The hero uses four fictional encounters to express Pankaj's security interests. Tool names describe example controls, not this site's infrastructure or guarantees about those products. The existing green/terracotta palette and approved illustrated characters remain in use.

- SQL injection: an AWS WAF SQLi rule matches an incoming request and blocks it. [AWS documentation](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-sqli-match.html).
- Prompt injection: Bedrock Guardrails screens untrusted input; a separate application tool allowlist denies the privileged action. Prompt screening is a layer, not a complete prompt-injection solution. [Bedrock documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-prompt-attack.html).
- Supply chain: an unsigned image fails a trusted-signature admission policy. Signed artifacts can still be malicious; the scene demonstrates this one policy check. [Sigstore policy controller](https://docs.sigstore.dev/policy-controller/overview/).
- RCE: an exploit evades an edge rule; Falco detects a suspicious shell, and a separately configured response workflow isolates the workload. Cloud Armor and Falco have distinct roles; Falco alone does not block execution. [Cloud Armor WAF rules](https://docs.cloud.google.com/armor/docs/waf-rules), [Falco response integrations](https://falco.org/blog/integrate-runtime-security-with-falcosidekick/).

## Timing and behavior

Each story lasts 24 seconds, starting with prompt injection. The portrait remains beside the author's name throughout; the separate theater contains the agents and an original pixel-grid infrastructure diagram. The guardian appears over the surname and jumps into the theater. The secured label appears only after the encounter.

Traffic is idle initially, red/right-to-left from rogue arrival at 1.2 seconds, and green/left-to-right after the defense result at 11.04 seconds (12.96 for RCE). Scene and audio pause offscreen/background; reduced motion resets to a static opening. Sound is opt-in and replays the opening when enabled. No per-frame React scene updates are used, and the homepage no longer loads the WebGL portrait.

See [the detailed animation handoff and review](hero-animation-handoff.md) for architecture, timing, findings, tests, limitations, and maintenance recipes.
