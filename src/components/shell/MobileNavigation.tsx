'use client';

import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export function MobileNavigation({ onSearch }: { onSearch: () => void }) {
  return (
    <Sheet>
      <SheetTrigger className="mobile-menu-trigger">Menu <Icon name="list" /></SheetTrigger>
      <SheetContent className="mobile-menu-panel">
        <SheetHeader>
          <SheetTitle>Pankaj Mouriya</SheetTitle>
          <SheetDescription>Engineering, security, and the stories behind the work.</SheetDescription>
        </SheetHeader>
        <nav className="mobile-navigation" aria-label="Mobile navigation">
          <SheetClose asChild><Link href="/blog"><Icon name="writing" />Writing</Link></SheetClose>
          <SheetClose asChild><Link href="/books"><Icon name="book" />Books</Link></SheetClose>
          <SheetClose asChild><button type="button" onClick={onSearch}><Icon name="search" />Search writing</button></SheetClose>
          <SheetClose asChild><Link href="/portfolio"><Icon name="work" />Portfolio</Link></SheetClose>
          <SheetClose asChild><Link href="/resume"><Icon name="file" />Résumé</Link></SheetClose>
        </nav>
        <Separator />
        <div className="mobile-social-links">
          <a href="https://github.com/pankajmouriya" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/pankajmouriya/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
