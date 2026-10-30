import type { Metadata } from 'next';
import Link from 'next/link';
import { ExperienceList } from '@/components/Experience';
import { PrintButton } from '@/components/PrintButton';
import { skillCategories } from '@/data/skills';

export const metadata: Metadata = {
  title: 'Résumé | Ronald Vargas',
  description: 'Experience and skills of Ronald Vargas: software engineering, IT support, and technical consulting.',
};

export default function ResumePage() {
  return (
    <main className="wrap" style={{ paddingBlock: '40px 72px' }}>
      <div className="actions no-print" style={{ justifyContent: 'space-between', marginBottom: 40 }}>
        <Link href="/" className="link mono quiet-button">← Back to the site</Link>
        <PrintButton />
      </div>

      <header className="section-head">
        <p className="label">
          <strong>résumé</strong> / 2026
        </p>
        <h1 className="h2">Ronald Vargas</h1>
        <p className="lead">
          Software engineer / IT support &amp; consulting. 6+ years building products,
          troubleshooting systems, and supporting the people who use them.
        </p>
        <p className="tags section-meta">
          <a className="link" href="https://linkedin.com/in/rvar">linkedin.com/in/rvar</a>
          <a className="link" href="https://github.com/ronvar">github.com/ronvar</a>
        </p>
      </header>

      <h2 className="label" style={{ paddingBottom: 12 }}>experience</h2>
      <ExperienceList />

      <h2 className="label" style={{ padding: '48px 0 12px' }}>skills</h2>
      <dl className="rows">
        {skillCategories.map((category) => (
          <div key={category.title} className="split" style={{ paddingBlock: 16 }}>
            <dt className="label">{category.title}</dt>
            <dd className="prose small" style={{ color: 'var(--ink)' }}>
              {category.skills.join(', ')}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
