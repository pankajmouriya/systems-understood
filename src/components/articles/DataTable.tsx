import type { ComponentPropsWithoutRef } from 'react';

export function DataTable(props: ComponentPropsWithoutRef<'table'>) {
  return <div className="table-scroll" role="region" aria-label="Scrollable data table" tabIndex={0}><table {...props} /></div>;
}
