export type Experience = { organization: string; role: string; period: string; start: string; end?: string; summary: string; highlights: string[] };
export type Talk = { event: string; year: string; title: string; url?: string; description: string; resources?: { label: string; href: string }[] };

// Experience and recent talks: author's supplied Pankaj-Resume-2026_v1.pdf
// (created September 2026). Earlier talks and resources: pankajmouriya.com/talk pages.
export const experience: Experience[] = [
  { organization: 'Harness', role: 'Senior Product Security Engineer', period: 'Nov 2025 — Present', start: '2025-11', summary: 'Product security, vulnerability management, supply chain protection, and security automation.', highlights: ['Architected SoS, a vulnerability management and security posture platform used across Harness and acquired companies.', 'Built security scanning and governance workflows across CI pipelines.', 'Developed AI assisted triage and automation for vulnerability and pentest reports.'] },
  { organization: 'Kong', role: 'Senior Security Engineer', period: 'May 2024 — Oct 2025', start: '2024-05', end: '2025-10', summary: 'DevSecOps, software supply chain security, cloud security, and incident response.', highlights: ['Maintained security scanning across Kong software repositories.', 'Established release provenance and container signing controls.', 'Coordinated pentest findings and incident response.'] },
  { organization: 'DeepSource', role: 'Security Engineer III', period: 'Sep 2022 — May 2024', start: '2022-09', end: '2024-05', summary: 'Security infrastructure and cloud posture across build and runtime environments.', highlights: ['Implemented just in time access with Teleport.', 'Established runtime protections for static analyzers.', 'Built vulnerability scanning and cloud security tooling.'] },
  { organization: 'InVideo', role: 'Security Engineer', period: 'Nov 2021 — Sep 2022', start: '2021-11', end: '2022-09', summary: 'Application and cloud security with automated testing in the delivery pipeline.', highlights: ['Built SAST and DAST pipeline coverage.', 'Automated bug bounty triage and researcher communication.'] },
  { organization: 'Appsecco Consulting', role: 'Security Analyst', period: 'Jan 2020 — Nov 2021', start: '2020-01', end: '2021-11', summary: 'Security assessments and public technical research.', highlights: ['Conducted web and network penetration tests.', 'Performed AWS and GCP security audits.', 'Published research and presented at security conferences.'] },
];

export const selectedProjects = [
  { name: 'The Security Diff', type: 'Independent publication', description: 'A security research and publishing project focused on explaining what changes in vulnerabilities, advisories, and the wider security landscape.', site: 'https://tsd.report', source: 'https://github.com/pankajmouriya/tsd.report' },
] as const;

export const talks: Talk[] = [
  { event: 'BSides Goa 2024', year: '2024', title: 'Safeguarding Against RCE through Dependency Management and eBPF', description: 'Dependency and runtime defenses against remote code execution.' },
  { event: 'Rootconf 2022', year: '2022', title: 'Do’s & Don’ts on Setting up a Bug Bounty Programme', description: 'Lessons from operating a bug bounty programme.' },
  { event: 'H@cktivityCon 2021', year: '2021', title: 'Learn a Few Patterns, Secure your Applications in the Cloud', description: 'Cloud application security patterns, drawn from practical attack and defense work.', url: 'https://pankajmouriya.com/talk/learnandsecure/' },
  { event: 'BSides Newcastle 2021', year: '2021', title: 'Map and Conquer: Application Security over Cloud Infrastructure', description: 'Mapping application security concerns across cloud infrastructure.', url: 'https://pankajmouriya.com/talk/mapandconquer/' },
  { event: 'OWASP Bay Area 2021', year: '2021', title: 'Tangled Web and Its Same Origin Policy', description: 'Browser isolation, cross origin boundaries, and postMessage.', url: 'https://pankajmouriya.com/talk/sameoriginpolicy/', resources: [{ label: 'Read the guide', href: '/books/same-origin-policy' }, { label: 'View the slides', href: 'https://speakerdeck.com/pankajmouriya/tangled-web-and-its-same-origin-policy' }] },
  { event: 'Community talk 2019', year: '2019', title: 'Life in Containers — Are They Secure?', description: 'A session on securing Docker containers and the questions to ask about their runtime boundary.', url: 'https://pankajmouriya.com/talk/container-secure/' },
  { event: 'The pwn School Project 2019', year: '2019', title: 'Life in Containers — The Big Picture', description: 'An introduction to Docker and Kubernetes fundamentals and how the pieces fit together.', url: 'https://pankajmouriya.com/talk/pwn-containers/', resources: [{ label: 'Related Kubernetes guide', href: '/books/kubernetes-101' }] },
  { event: 'null Delhi Combined Meet 2018', year: '2018', title: 'Burp Suite 101 for Web Application Security Testing', description: 'A practical tour of Burp tools and workflows for web security testing.', url: 'https://pankajmouriya.com/talk/burpsuite-1/' },
  { event: 'null Chandigarh Monthly Meet 2018', year: '2018', title: 'Burp Suite 101 for Web Application Security Testing', description: 'A second community session on Burp Proxy, Repeater, Intruder, and hands-on web testing.', url: 'https://pankajmouriya.com/talk/burpsuite-2/' },
];
