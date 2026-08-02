"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const SIDEBAR_WIDTH = 17;
const SIDEBAR_WIDTH_COLLAPSED = 4.5;
const navigation = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/dashboard/candidates", label: "Candidates", icon: UsersRound },
  { href: "/dashboard/interviews", label: "Schedule / Interviews", icon: CalendarDays },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function Brand({ isCollapsed = false }: { isCollapsed?: boolean }) {
  return (
    <Link
      href="/dashboard"
      className="dashboard-brand"
      aria-label="Sift dashboard home"
      title={isCollapsed ? "Home" : undefined}
    >
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>Sift</span>
    </Link>
  );
}

function SidebarContent({
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
  onClose,
}: {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const displayName = user?.fullName || user?.firstName || "Recruiter";
  const email = user?.primaryEmailAddress?.emailAddress || "Your workspace";

  return (
    <div className="dashboard-sidebar-inner">
      <div className="dashboard-sidebar-top">
        <div className="dashboard-sidebar-brand-row">
          <Brand isCollapsed={isCollapsed} />
          {onToggleCollapse ? (
            <button
              type="button"
              className="dashboard-sidebar-collapse-button"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-pressed={isCollapsed}
              onClick={onToggleCollapse}
            >
              <ChevronLeft
                className={`dashboard-collapse-icon${isCollapsed ? " rotated" : ""}`}
                aria-hidden="true"
              />
            </button>
          ) : onClose ? (
            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="Close navigation"
              onClick={onClose}
            >
              <X aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <p className="workspace-label">Workspace</p>
        <button className="workspace-switcher" type="button">
          <span className="icon-cell"><span className="workspace-avatar">S</span></span>
          <span className="workspace-name">Sift workspace</span>
          <ChevronDown aria-hidden="true" />
        </button>
      </div>

      <nav className="dashboard-nav" aria-label="Dashboard navigation">
        <p className="workspace-label">Manage</p>
        {navigation.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`dashboard-nav-link${isActive ? " active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              title={isCollapsed ? label : undefined}
            >
              <span className="icon-cell"><Icon aria-hidden="true" /></span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="dashboard-sidebar-bottom">
        <Link href="/dashboard/upgrade" className="upgrade-card" onClick={onNavigate}>
          <span className="icon-cell">
            <span className="upgrade-icon"><Sparkles aria-hidden="true" /></span>
          </span>
          <span className="upgrade-copy">
            <strong>Upgrade your plan</strong>
            <small>Unlock more interviews</small>
          </span>
          <ChevronDown className="upgrade-arrow" aria-hidden="true" />
        </Link>

        <div className="dashboard-profile">
          <span className="icon-cell">
            <span className="profile-avatar" aria-hidden="true">
              {user?.imageUrl ? <Image src={user.imageUrl} alt="" width={32} height={32} /> : <UserRound />}
            </span>
          </span>
          <span className="profile-copy">
            <strong>{displayName}</strong>
            <small>{email}</small>
          </span>
          <button className="profile-menu-button" type="button" aria-label="Open profile settings">
            <Settings aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="dashboard-app"
      style={
        {
          "--sidebar-width": `${SIDEBAR_WIDTH}rem`,
          "--sidebar-width-collapsed": `${SIDEBAR_WIDTH_COLLAPSED}rem`,
        } as React.CSSProperties
      }
    >
      <aside
        className={`dashboard-sidebar${isCollapsed ? " collapsed" : ""}`}
        aria-label="Primary navigation"
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((previous) => !previous)}
        />
      </aside>

      {isMobileNavOpen && (
        <button
          className="dashboard-nav-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}
      <aside
        className={`dashboard-mobile-sidebar${isMobileNavOpen ? " open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!isMobileNavOpen}
      >
        <SidebarContent
          onNavigate={() => setIsMobileNavOpen(false)}
          onClose={() => setIsMobileNavOpen(false)}
        />
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <button
            type="button"
            className="dashboard-icon-button dashboard-mobile-menu-button"
            aria-label="Open navigation"
            aria-expanded={isMobileNavOpen}
            onClick={() => setIsMobileNavOpen(true)}
          >
            <Menu aria-hidden="true" />
          </button>
          <div>
            <p className="dashboard-header-kicker">Sift workspace</p>
            <h1>Good morning</h1>
          </div>
          <div className="dashboard-header-actions">
            <button className="dashboard-header-action" type="button" aria-label="Open notifications">
              <span className="notification-dot" aria-hidden="true" />
              <span className="dashboard-header-action-label">Notifications</span>
            </button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "dashboard-user-button",
                },
              }}
            />
          </div>
        </header>
        <main className="dashboard-content-area">{children}</main>
      </div>
    </div>
  );
}
