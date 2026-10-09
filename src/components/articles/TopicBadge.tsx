import { Icon, type IconName } from '@/components/ui/icon';

export function TopicBadge({ tag }: { tag: string }) {
  const infrastructure = /kubernetes|container|cloud/.test(tag);
  const security = /security|appsec|browser/.test(tag);
  const icon: IconName = infrastructure ? 'cube' : security ? 'shield' : 'code';
  return <span className={`topic-badge tone-${infrastructure ? 'blue' : security ? 'teal' : 'warm'}`}><Icon name={icon} />{tag.replaceAll('-', ' ')}</span>;
}
