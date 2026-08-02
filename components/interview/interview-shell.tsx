import Link from "next/link";

export default function InterviewShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-shell">
      <header className="auth-header shell">
        <Link className="brand focus-ring" href="/">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          Sift
        </Link>
      </header>
      <div className="interview-wrap">{children}</div>
    </main>
  );
}
