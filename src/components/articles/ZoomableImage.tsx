'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export function ZoomableImage({ src, alt, width, height, loading }: { src: string; alt: string; width: number; height: number; loading?: 'lazy' | 'eager' }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const node = dialog.current;
    const restoreFocus = () => trigger.current?.focus();
    node?.addEventListener('close', restoreFocus);
    return () => node?.removeEventListener('close', restoreFocus);
  }, []);

  function open() {
    dialog.current?.showModal();
    document.body.style.overflow = 'hidden';
  }

  function close() {
    dialog.current?.close();
    document.body.style.overflow = '';
  }

  return (
    <>
      <button ref={trigger} type="button" className="figure-trigger" onClick={open} aria-label={`Enlarge image: ${alt}`}>
        <Image src={src} alt={alt} width={width} height={height} loading={loading} sizes="(max-width: 760px) 100vw, 1100px" />
        <span className="figure-zoom-hint" aria-hidden="true">Enlarge ↗</span>
      </button>
      <dialog ref={dialog} className="image-dialog" onClose={() => { document.body.style.overflow = ''; }} onClick={(event) => { if (event.target === dialog.current) close(); }} aria-label={alt}>
        <button type="button" className="image-dialog-close" onClick={close} aria-label="Close enlarged image">Close ×</button>
        <Image src={src} alt={alt} width={width} height={height} sizes="100vw" />
      </dialog>
    </>
  );
}
