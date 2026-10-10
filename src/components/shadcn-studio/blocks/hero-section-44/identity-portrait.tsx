import Image from 'next/image';

/** A persistent hanging portrait; no canvas, physics, or automatic motion. */
export function IdentityPortrait() {
  return <figure className="identity-portrait">
    <span className="identity-portrait-strap" aria-hidden="true" />
    <div className="identity-portrait-card">
      <span className="identity-portrait-clip" aria-hidden="true" />
      <Image src="/images/profile/pankaj-portrait.png" alt="Pankaj Mouriya" width={740} height={758} sizes="(max-width: 760px) 88px, 120px" priority />
    </div>
  </figure>;
}
