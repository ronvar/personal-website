import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="wrap" style={{ width: '100%' }}>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <p className="label">
            <strong>404</strong> / not found
          </p>
          <h1 className="h2">This page needs some DIY.</h1>
          <p className="lead">
            I haven&apos;t built it yet. The rest of the site is still standing.
          </p>
        </div>
        <div className="split">
          <span aria-hidden="true" />
          <div className="actions">
            <Link href="/" className="btn btn-primary">
              Back to the homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
