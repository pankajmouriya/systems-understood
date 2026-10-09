import { ZoomableImage } from './ZoomableImage';

export function Figure({ src, alt, caption, width, height, loading }: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
}) {
  return (
    <figure className="article-figure">
      <ZoomableImage src={src} alt={alt} width={width} height={height} loading={loading} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
