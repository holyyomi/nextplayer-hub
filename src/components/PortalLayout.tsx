import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LogOut, UserCog, ShieldCheck, Wallet, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ContactsDialog } from "@/components/ContactsDialog";
import { companyProfile, bizMoney } from "@/lib/mock-data";
import { useAdminMode } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "홈", end: true },
  { to: "/requests", label: "요청·진행" },
  { to: "/calendar", label: "일정" },
  { to: "/reports", label: "리포트" },
];

export default function PortalLayout() {
  const { isAdmin, toggle } = useAdminMode();
  const [contactsOpen, setContactsOpen] = useState(false);
  const location = useLocation();
  const lastChecked = "오늘 14:32";

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl hero-gradient text-primary-foreground shadow-glow">
              <span className="text-sm font-bold">N</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">{companyProfile.company}</span>
              <span className="text-[11px] text-muted-foreground">운영 포털 · {companyProfile.team}</span>
            </div>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {t.label}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-[17px] h-[2px] rounded-full bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-4 rounded-xl border bg-card/50 px-3 py-1.5 text-xs lg:flex">
              <div className="flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">비즈머니</span>
                <span className="num font-semibold">{bizMoney}</span>
              </div>
              <div className="h-3 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">마지막 확인</span>
                <span className="num font-medium">{lastChecked}</span>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs sm:flex">
              <ShieldCheck className={cn("h-3.5 w-3.5", isAdmin ? "text-primary" : "text-muted-foreground")} />
              <span className="text-muted-foreground">관리자</span>
              <Switch checked={isAdmin} onCheckedChange={toggle} className="scale-75" />
            </div>

            <span className="hidden text-sm font-medium sm:inline">{companyProfile.clientManager}</span>

            <Button variant="outline" size="sm" onClick={() => setContactsOpen(true)} className="gap-1.5">
              <UserCog className="h-4 w-4" /> 담당 정보
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <LogOut className="h-4 w-4" /> 나가기
            </Button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex gap-1 overflow-x-auto border-t px-4 py-2 md:hidden">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )
              }
            >
              {t.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main key={location.pathname} className="mx-auto max-w-[1400px] animate-fade-in px-4 py-8 md:px-6">
        <Outlet />
      </main>

      <ContactsDialog open={contactsOpen} onOpenChange={setContactsOpen} />
    </div>
  );
}
