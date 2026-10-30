import { ReactNode } from 'react';

interface SectionHeadProps {
  index: string;
  name: string;
  id: string;
  title: ReactNode;
  lead?: ReactNode;
}

export function SectionHead({ index, name, id, title, lead }: SectionHeadProps) {
  return (
    <header className="section-head">
      <p className="label">
        <strong>{index}</strong> / {name}
      </p>
      <h2 className="h2" id={id}>
        {title}
      </h2>
      {lead && <p className="lead">{lead}</p>}
    </header>
  );
}
