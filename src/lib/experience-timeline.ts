import type { ExperienceStep } from '@/components/shadcn-studio/blocks/timeline-component-07/timeline-component-07';
import { experience } from './portfolio';

const stacks: Record<string, string[]> = {
  Harness: ['Product security', 'Vulnerability management', 'CI security'],
  Kong: ['DevSecOps', 'Supply chain', 'Cloud security'],
  DeepSource: ['Security infrastructure', 'Cloud posture', 'Runtime security'],
  InVideo: ['Application security', 'SAST', 'DAST'],
  'Appsecco Consulting': ['Security assessments', 'AWS', 'GCP'],
};

export const experienceSteps: ExperienceStep[] = experience.map((item, index) => ({
  id: String(index + 1).padStart(2, '0'),
  company: item.organization,
  role: item.role,
  period: item.end ? item.period : item.period.replace('Present', '').trim(),
  status: item.end ? undefined : { text: 'Present', tone: 'positive' },
  stack: stacks[item.organization] ?? [],
  achievement: item.highlights[0],
  description: item.summary,
  details: item.highlights.slice(1),
}));
