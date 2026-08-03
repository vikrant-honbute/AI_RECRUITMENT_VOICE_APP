import Link from "next/link";

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="M5.75 14.25 14.25 5.75M7 5.75h7.25V13" />
  </svg>
);

const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="m5.5 10 3 3 6-6" />
  </svg>
);

const Phone = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="M6.6 3.5 8.2 7 6.6 8.4c.9 2 2.5 3.7 4.6 4.6l1.4-1.6 3.5 1.6-.4 2.5c-.2.8-.9 1.3-1.7 1.3A11.8 11.8 0 0 1 3.2 6c0-.8.5-1.5 1.3-1.7l2.1-.8Z" />
  </svg>
);

const steps = [
  {
    number: "01",
    title: "Import your candidates",
    body: "Upload a CSV or connect your ATS. Your roles, resumes, and candidate details stay organized in one place.",
  },
  {
    number: "02",
    title: "Let the agent interview",
    body: "Your AI voice agent calls every candidate, asks role-specific questions, and handles natural follow-ups.",
  },
  {
    number: "03",
    title: "Advance the right people",
    body: "Review structured summaries and transcripts, then let qualified candidates book directly with your team.",
  },
];

const candidates = [
  { initials: "AC", name: "Amelia Chen", role: "Product Designer", score: "92", tone: "top" },
  { initials: "JM", name: "Jonah Miller", role: "Product Designer", score: "87", tone: "good" },
  { initials: "SO", name: "Samira Okafor", role: "Product Designer", score: "81", tone: "good" },
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <header className="site-header shell">
          <a className="brand focus-ring" href="#home" aria-label="Sift home">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            Sift
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#product">Product</a>
            <a href="#workflow">How it works</a>
            <a href="#results">Results</a>
          </nav>

          <div className="header-actions">
            <Link className="button button-ghost-light" href="/sign-in">Log in</Link>
            <Link className="button button-light" href="/sign-up">Get started for free <ArrowUpRight /></Link>
          </div>

          <details className="mobile-nav">
            <summary className="focus-ring" aria-label="Open navigation menu">
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              <a href="#product">Product</a>
              <a href="#workflow">How it works</a>
              <a href="#results">Results</a>
              <Link href="/sign-in">Log in</Link>
              <Link href="/sign-up">Get started for free</Link>
            </nav>
          </details>
        </header>

        <div className="hero-content shell">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-dark">
              <span /> AI voice interviews for recruiting teams
            </p>
            <h1>Meet every candidate. Before your calendar does.</h1>
            <p className="hero-description">
              Import your candidate list and let our AI agent automatically call, screen, and schedule interviews - 24/7, at scale, with zero manual effort.
            </p>
            <div className="hero-actions">
              <Link className="button button-light" href="/sign-up">
                Get started for free <ArrowUpRight />
              </Link>
              <a className="text-link" href="#product">
                See the agent in action <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-note"><Check /> No credit card. Set up in under 10 minutes.</p>
          </div>

          <div className="hero-visual" aria-label="Voice screening in progress">
            <div className="signal-field" aria-hidden="true">
              {Array.from({ length: 23 }).map((_, index) => <span key={index} />)}
            </div>
              <div className="call-card">
              <div className="call-card-top">
                <span className="live-dot" /> Live interview
                <span>07:07</span>
              </div>
              <div className="candidate-avatar">VH</div>
              <strong>Vikrant Honbute</strong>
              <p>AI Engineer candidate</p>
              <div className="waveform" aria-label="Candidate is speaking">
                {Array.from({ length: 31 }).map((_, index) => <span key={index} />)}
              </div>
              <div className="question-box">
                <span>Agent is asking</span>
                “Walk me through an AI system you designed, from problem to production.”
              </div>
              <div className="call-status"><Phone /> Screening call in progress</div>
            </div>
          </div>
        </div>

        <div className="trusted shell" aria-label="Teams using Sift">
          <span>BUILT FOR HIGH-VELOCITY TEAMS</span>
          <strong>Northstar</strong>
          <strong>POLARIS</strong>
          <strong>Arc &amp; Co.</strong>
          <strong>Vertex</strong>
          <strong>DAYLIGHT</strong>
        </div>
      </section>

      <section className="product-section shell section" id="product">
        <div className="section-heading">
          <p className="eyebrow"><span /> From list to shortlist</p>
          <h2>Screen hundreds.<br />Understand each one.</h2>
        </div>
        <p className="section-intro">
          Give every applicant a fair first conversation, without asking your recruiters to spend every day on the phone.
        </p>

        <div className="dashboard-frame">
          <aside className="dashboard-sidebar">
            <div className="mini-brand"><span className="brand-mark"><i /><i /><i /></span> Sift</div>
            <div className="side-nav">
              <span className="active">Overview</span>
              <span>Candidates <b>24</b></span>
              <span>Interviews</span>
              <span>Roles</span>
            </div>
            <div className="side-user"><span>MK</span><div>Maya Kim<small>Recruiting lead</small></div></div>
          </aside>
          <div className="dashboard-content">
            <div className="dashboard-title">
              <div><small>Product Designer</small><h3>Candidate pipeline</h3></div>
              <button type="button">+ Import candidates</button>
            </div>
            <div className="stats-row">
              <div><span>Calls completed</span><strong>38</strong><small>+12 this week</small></div>
              <div><span>Qualified</span><strong>14</strong><small>37% pass rate</small></div>
              <div><span>Hours saved</span><strong>26.5</strong><small>Estimated</small></div>
            </div>
            <div className="candidate-table">
              <div className="table-head"><span>Candidate</span><span>Interview</span><span>Match</span><span>Status</span></div>
              {candidates.map((candidate) => (
                <div className="candidate-row" key={candidate.name}>
                  <div><span className="table-avatar">{candidate.initials}</span><p><strong>{candidate.name}</strong><small>{candidate.role}</small></p></div>
                  <span><i className="complete-icon"><Check /></i> Completed</span>
                  <strong className={`score ${candidate.tone}`}>{candidate.score}</strong>
                  <span className="status-pill">Recommended</span>
                </div>
              ))}
            </div>
            <div className="insight-card">
              <span className="spark">✦</span>
              <div><strong>AI interview summary</strong><p>Amelia shows strong product thinking and clear cross-functional communication. Her portfolio examples match the role’s seniority.</p></div>
              <span className="summary-score">92<small>/100</small></span>
            </div>
          </div>
        </div>
      </section>

      <section className="workflow-section section" id="workflow">
        <div className="shell">
          <div className="section-heading workflow-heading">
            <p className="eyebrow"><span /> One simple workflow</p>
            <h2>From upload to<br />interview booked.</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <div className={`step-visual step-visual-${step.number}`} aria-hidden="true">
                  {step.number === "01" && <><span className="file-card">CSV<small>candidates.csv</small></span><span className="upload-line" /><span className="upload-check"><Check /></span></>}
                  {step.number === "02" && <><span className="visual-phone"><Phone /></span><div className="mini-wave">{Array.from({ length: 13 }).map((_, i) => <i key={i} />)}</div><span className="mini-live">LIVE</span></>}
                  {step.number === "03" && <><span className="calendar-sheet"><i>14</i><small>Interview booked</small><b><Check /></b></span></>}
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="results-section section shell" id="results">
        <div className="results-copy">
          <p className="eyebrow"><span /> Your team, multiplied</p>
          <h2>Spend time deciding.<br />Not dialing.</h2>
          <p>Sift handles repetitive first-round calls while your recruiters focus on the human moments that actually need them.</p>
        </div>
        <div className="metrics">
          <div><strong>10×</strong><span>more candidates screened</span></div>
          <div><strong>26h</strong><span>saved per open role</span></div>
          <div><strong>24/7</strong><span>candidate availability</span></div>
        </div>
      </section>

      <section className="final-cta" id="start">
        <div className="shell">
          <p className="eyebrow eyebrow-dark"><span /> Your next shortlist is waiting</p>
          <h2>Make the first interview<br />your easiest one.</h2>
          <p>Import your next candidate list and launch your first AI voice screening campaign today.</p>
          <div className="final-cta-actions">
            <Link className="button button-ghost-light" href="/sign-in">Log in</Link>
            <Link className="button button-light" href="/sign-up">
              Get started for free <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer-inner">
          <a className="brand focus-ring" href="#home"><span className="brand-mark"><i /><i /><i /></span>Sift</a>
          <p>AI voice interviews for better hiring.</p>
          <nav aria-label="Footer navigation"><a href="#product">Product</a><a href="#workflow">How it works</a><a href="mailto:hello@sift.ai">Contact</a></nav>
          <span>© 2026 Sift</span>
        </div>
      </footer>
    </main>
  );
}
