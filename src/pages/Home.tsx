import { Link } from "react-router-dom";
import { ArrowUpRight, TrendingUp, TrendingDown, Activity, CalendarDays, MessageSquare } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  kpis,
  operationPoints,
  threads,
  initialEvents,
  recentLogs,
  oneLineSummary,
  EVENT_LABEL,
  EVENT_COLOR,
  TaskStatus,
  STATUS_LABEL,
} from "@/lib/mock-data";
import { format, parseISO, isAfter, startOfToday } from "date-fns";
import { ko } from "date-fns/locale";

export default function Home() {
  const counts: Record<TaskStatus, number> = { pending: 0, progress: 0, done: 0 };
  threads.forEach((t) => (counts[t.status] += 1));

  const upcoming = initialEvents
    .filter((e) => isAfter(parseISO(e.date), startOfToday()) || e.date === format(new Date(), "yyyy-MM-dd"))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="surface-elevated overflow-hidden">
        <div className="hero-gradient relative px-8 py-10 text-primary-foreground">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              안정적으로 운영 중
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-[34px]">
              현재 운영은 계획대로 진행되고 있습니다
            </h1>
            <p className="mt-3 text-sm text-primary-foreground/80 md:text-base">
              이번 주는 봄 시즌 캠페인 라이브와 전환 구조 안정화에 집중하고 있어요.
            </p>
          </div>
        </div>

        {/* 이번 주 운영 포인트 */}
        <div className="grid gap-3 px-8 py-6 md:grid-cols-3">
          {operationPoints.map((p, i) => (
            <div key={i} className="flex gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </div>
              <p className="text-sm leading-relaxed text-foreground/85">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KPI */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-base font-semibold">KPI 핵심 요약</h2>
          <Link to="/reports" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
            상세 리포트 <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="surface-card p-5">
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="num mt-2 text-2xl font-bold tracking-tight md:text-[28px]">{k.value}</div>
              <div
                className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
                  k.positive ? "text-status-done" : "text-destructive"
                }`}
              >
                {k.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {k.delta}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 운영 요약: 진행 상태 + 다가오는 일정 */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">진행 상태 요약</h3>
              <p className="text-xs text-muted-foreground">요청·진행 탭의 실시간 현황</p>
            </div>
            <Link to="/requests">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                전체 보기 <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["pending", "progress", "done"] as TaskStatus[]).map((s) => (
              <div key={s} className="rounded-xl border bg-muted/20 p-4">
                <StatusBadge status={s} />
                <div className="num mt-3 text-3xl font-bold">{counts[s]}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{STATUS_LABEL[s]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">다가오는 일정</h3>
              <p className="text-xs text-muted-foreground">이번 주 확인이 필요한 일정</p>
            </div>
            <Link to="/calendar">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                달력 열기 <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {upcoming.length === 0 && (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                다가오는 일정이 없습니다.
              </div>
            )}
            {upcoming.map((e) => (
              <div key={e.id} className="flex items-center gap-4 rounded-xl border bg-muted/20 p-4">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-card">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {format(parseISO(e.date), "MMM", { locale: ko })}
                  </span>
                  <span className="num text-lg font-bold leading-none">{format(parseISO(e.date), "dd")}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: EVENT_COLOR[e.type] }}
                    />
                    <span className="text-[11px] text-muted-foreground">{EVENT_LABEL[e.type]}</span>
                  </div>
                  <div className="truncate text-sm font-medium">{e.title}</div>
                </div>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 최근 운영 활동 + 한 줄 요약 */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base font-semibold">최근 운영 활동</h3>
          </div>
          <div className="relative space-y-4 pl-4">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
            {recentLogs.map((log, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[14px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm">{log.text}</p>
                  <span className="num shrink-0 text-[11px] text-muted-foreground">{log.at}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{log.by}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card flex flex-col justify-between bg-accent/30 p-6">
          <div>
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="mt-3 text-sm font-semibold text-muted-foreground">한 줄 운영 요약</h3>
            <p className="mt-3 text-base font-medium leading-relaxed text-foreground">
              "{oneLineSummary}"
            </p>
          </div>
          <div className="mt-6 text-[11px] text-muted-foreground">— 살만 운영팀</div>
        </div>
      </section>
    </div>
  );
}
