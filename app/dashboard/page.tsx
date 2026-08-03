import { ArrowUpRight, CalendarDays, Check, Clock3, Plus, UsersRound } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Open roles", value: "12", change: "+3 this month", icon: BriefcaseIcon },
  { label: "Active candidates", value: "284", change: "+18 this week", icon: UsersRound },
  { label: "Interviews completed", value: "67", change: "+12.5% this month", icon: Check },
];

const interviews = [
  { initials: "JD", name: "Jordan Davis", role: "Senior Product Designer", time: "Today, 10:30 AM", status: "Upcoming" },
  { initials: "AR", name: "Avery Rodriguez", role: "Frontend Engineer", time: "Today, 2:00 PM", status: "Upcoming" },
  { initials: "MK", name: "Morgan Kim", role: "Product Marketing Manager", time: "Tomorrow, 11:00 AM", status: "Upcoming" },
];

const candidates = [
  { initials: "SA", name: "Sam Anderson", role: "Senior Software Engineer", score: "94", stage: "AI interview" },
  { initials: "LW", name: "Lee Williams", role: "Product Designer", score: "88", stage: "Review" },
  { initials: "TJ", name: "Taylor Johnson", role: "Account Executive", score: "82", stage: "Screening" },
];

function BriefcaseIcon() {
  return <span className="stat-icon"><span aria-hidden="true">+</span></span>;
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function dayOfMonth(date: Date): string {
  return String(date.getDate()).padStart(2, "0");
}

export default function DashboardPage() {
  const now = new Date();

  return (
    <div className="dashboard-overview">
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">{formatFullDate(now)}</p>
          <h2>Your hiring, in motion.</h2>
          <p className="dashboard-intro">Stay close to every candidate and keep your team moving forward.</p>
        </div>
        <button className="dashboard-primary-button" type="button">
          <Plus aria-hidden="true" />
          Create a job
        </button>
      </section>

      <section className="dashboard-stats" aria-label="Hiring overview">
        {stats.map(({ label, value, change, icon: Icon }) => (
          <article className="dashboard-stat-card" key={label}>
            <div className="dashboard-stat-top">
              <span>{label}</span>
              <Icon aria-hidden="true" />
            </div>
            <strong>{value}</strong>
            <small>{change}</small>
          </article>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-panel dashboard-interviews-panel">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-eyebrow">Keep an eye on</p>
              <h3>Upcoming interviews</h3>
            </div>
            <Link href="/dashboard/interviews" className="dashboard-text-link">View schedule <ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <div className="interview-list">
            {interviews.map((interview) => (
              <article className="interview-row" key={interview.name}>
                <span className="list-avatar">{interview.initials}</span>
                <div className="interview-details">
                  <strong>{interview.name}</strong>
                  <span>{interview.role}</span>
                </div>
                <div className="interview-time">
                  <span><Clock3 aria-hidden="true" />{interview.time}</span>
                  <small>{interview.status}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-panel dashboard-calendar-panel">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-eyebrow">Your calendar</p>
              <h3>{formatShortDate(now)}</h3>
            </div>
            <CalendarDays aria-hidden="true" />
          </div>
          <div className="calendar-preview">
            <span className="calendar-date">{dayOfMonth(now)}</span>
            <div>
              <strong>3 interviews scheduled</strong>
              <span>Make space for great conversations.</span>
            </div>
          </div>
          <Link href="/dashboard/interviews" className="dashboard-secondary-button">Open calendar <ArrowUpRight aria-hidden="true" /></Link>
        </section>
      </div>

      <section className="dashboard-panel candidates-panel">
        <div className="dashboard-panel-heading">
          <div>
            <p className="dashboard-eyebrow">Recently active</p>
            <h3>Candidate pipeline</h3>
          </div>
          <Link href="/dashboard/candidates" className="dashboard-text-link">View all candidates <ArrowUpRight aria-hidden="true" /></Link>
        </div>
        <div className="candidate-list" role="table" aria-label="Recent candidates">
          <div className="candidate-list-header" role="row">
            <span>Candidate</span><span>AI score</span><span>Stage</span><span />
          </div>
          {candidates.map((candidate) => (
            <div className="candidate-list-row" role="row" key={candidate.name}>
              <div className="candidate-list-name"><span className="list-avatar">{candidate.initials}</span><span><strong>{candidate.name}</strong><small>{candidate.role}</small></span></div>
              <strong className="candidate-score">{candidate.score}</strong>
              <span className="candidate-stage">{candidate.stage}</span>
              <ArrowUpRight aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
