import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { TimelineAnimate } from '@/components/ui/timeline-animate';
import { cn } from '@/lib/utils';

export interface ExperienceStep {
  id: string;
  logo?: string;
  company: string;
  role: string;
  period: string;
  status?: { text: string; tone: 'positive' | 'accent' };
  stack: string[];
  achievement: string;
  description: string;
  details?: string[];
}

function ExperienceCard({ logo, company, role, period, status, stack, achievement, description, details }: Omit<ExperienceStep, 'id'>) {
  return (
    <article className="experience-card">
      <div className="experience-card-heading">
        <span className="experience-company-mark" aria-hidden="true">
          {logo ? <Image src={logo} alt="" width={36} height={36} unoptimized /> : company.slice(0, 2).toUpperCase()}
        </span>
        <div><p className="experience-company">{company}</p><h3>{role}</h3></div>
      </div>
      <div className="experience-card-meta">
        <p className="experience-period"><Icon name="calendar" />{period} {status && <span className={cn('experience-status', `experience-status-${status.tone}`)}>{status.text}</span>}</p>
        <div className="experience-stack" aria-label="Areas of work"><Icon name="code" /><div>{stack.map((tech) => <Badge key={tech} variant="secondary" className="experience-stack-badge">{tech}</Badge>)}</div></div>
      </div>
      <p className="experience-description">{description}</p>
      <p className="experience-achievement"><Icon name="shield" />{achievement}</p>
      {details && details.length > 0 && <ul className="experience-details">{details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
    </article>
  );
}

export default function Process({ data, className }: { data: ExperienceStep[]; className?: string }) {
  return <TimelineAnimate className={className} data={data.map(({ id, ...step }) => ({ index: id, content: <ExperienceCard {...step} /> }))} />;
}
