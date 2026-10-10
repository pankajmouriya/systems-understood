# Illustrative security stories

The hero uses four fictional encounters to express Pankaj's security interests. Tool names describe example controls, not this site's infrastructure or guarantees about those products. The existing green/terracotta palette and approved illustrated characters remain in use.

- SQL injection: an AWS WAF SQLi rule matches an incoming request and blocks it. [AWS documentation](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-sqli-match.html).
- Prompt injection: Bedrock Guardrails screens untrusted input; a separate application tool allowlist denies the privileged action. Prompt screening is a layer, not a complete prompt-injection solution. [Bedrock documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-prompt-attack.html).
- Supply chain: an unsigned image fails a trusted-signature admission policy. Signed artifacts can still be malicious; the scene demonstrates this one policy check. [Sigstore policy controller](https://docs.sigstore.dev/policy-controller/overview/).
- RCE: an exploit evades an edge rule; Falco detects a suspicious shell, and a separately configured response workflow isolates the workload. Cloud Armor and Falco have distinct roles; Falco alone does not block execution. [Cloud Armor WAF rules](https://docs.cloud.google.com/armor/docs/waf-rules), [Falco response integrations](https://falco.org/blog/integrate-runtime-security-with-falcosidekick/).

## Timing and behavior

Each story lasts 24 seconds: portrait visible initially; combat from 5.8 to 15.6 seconds; portrait drops back at 15.6; the final six seconds settle into the portrait composition. The guardian returns to its lower-left corner. The next story advances only while the scene is active. Selection, replay, and seeking reset a shared scene clock. Motion pauses offscreen and in background tabs, and reduced motion keeps a static portrait. Hidden WebGL rendering pauses during combat. No per-frame React updates are used.

The portrait canvas is reduced by approximately 20% through its viewport dimensions and moved down; its visual strap starts lower. The drawing slot uses the same composition in the comparison route. A Show photo control exits combat immediately.

Prompt injection opens by default. On the homepage, the rogue arrives first (with a brief low synthesized cue when sound is enabled), the guardian appears over the measured surname position, and jumps to the portrait before combat. The upper action lane stays separate from the lower defense diagrams, including during recoil. Sound is off initially, requires an explicit button gesture, and stops when the scene is paused or hidden. Enabling sound replays the opening so the cue is heard in context. No audio file or additional dependency is loaded.
