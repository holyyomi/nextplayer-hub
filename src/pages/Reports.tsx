import { useState } from "react";
import { TrendingUp, FileText, Sparkles, MessageCircle, Plus, Pencil, FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { kpis, weeklyReports as initial, WeeklyReport, oneLineSummary } from "@/lib/mock-data";
import { useAdminMode } from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { InsightSection } from "@/components/InsightSection";
import { EmptyState } from "@/components/EmptyState";

export default function Reports() {
  const { isAdmin } = useAdminMode();
  const [reports, setReports] = useState<WeeklyReport[]>(initial);
  const [activeId, setActiveId] = useState<string | null>(initial[0]?.id ?? null);
  const active = reports.find((r) => r.id === activeId) ?? null;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<WeeklyReport | null>(null);
  const empty: WeeklyReport = {
    id: "", title: "", period: "", summary: "", changes: "", comment: "", nextWeek: "", author: "살만 운영팀", createdAt: "",
  };
  const [form, setForm] = useState<WeeklyReport>(empty);

  function openNew() {
    setEditing(null);
    setForm({ ...empty, createdAt: new Date().toISOString().slice(0, 10).replace(/-/g, ".") });
    setOpen(true);
  }
  function openEdit(r: WeeklyReport) {
    setEditing(r);
    setForm(r);
    setOpen(true);
  }
  function save() {
    if (!form.title.trim()) return;
    if (editing) {
      setReports((p) => p.map((r) => (r.id === editing.id ? { ...form } : r)));
      toast.success("보고서가 수정되었습니다.");
    } else {
      const id = Math.random().toString(36).slice(2);
      const r = { ...form, id };
      setReports((p) => [r, ...p]);
      setActiveId(id);
      toast.success("새 보고서가 등록되었습니다.");
    }
    setOpen(false);
  }

  return (
    <div className="space-y-8">
      {/* HERO + KPI */}
      <section className="surface-elevated overflow-hidden">
        <div className="border-b bg-muted/30 px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                <Sparkles className="h-3 w-3" /> 이번 주 리포트
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight">"{oneLineSummary}"</h1>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="bg-card p-6">
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="num mt-2 text-2xl font-bold tracking-tight">{k.value}</div>
              <div className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", k.positive ? "text-status-done" : "text-destructive")}>
                <TrendingUp className="h-3 w-3" /> {k.delta}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 요약 카드 */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="mt-3 text-sm font-semibold text-muted-foreground">성과 요약</h3>
          <p className="mt-2 text-sm leading-relaxed">{active.summary}</p>
        </div>
        <div className="surface-card p-6">
          <Sparkles className="h-5 w-5 text-warning" />
          <h3 className="mt-3 text-sm font-semibold text-muted-foreground">주요 변화</h3>
          <p className="mt-2 text-sm leading-relaxed">{active.changes}</p>
        </div>
        <div className="surface-card bg-accent/30 p-6">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="mt-3 text-sm font-semibold text-muted-foreground">담당자 코멘트</h3>
          <p className="mt-2 text-sm leading-relaxed">{active.comment}</p>
          <div className="mt-4 text-[11px] text-muted-foreground">— {active.author}</div>
        </div>
      </section>

      {/* 보고서실 */}
      <section className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h3 className="text-sm font-semibold">주간 보고서</h3>
              <p className="text-[11px] text-muted-foreground">{reports.length}개 누적</p>
            </div>
            {isAdmin && (
              <Button size="sm" className="h-8 gap-1" onClick={openNew}>
                <Plus className="h-3.5 w-3.5" /> 작성
              </Button>
            )}
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {reports.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveId(r.id)}
                className={cn(
                  "w-full border-b px-4 py-3.5 text-left transition-colors hover:bg-muted/40",
                  activeId === r.id && "bg-accent/40",
                )}
              >
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="num mt-1 text-[11px] text-muted-foreground">{r.period}</div>
                <div className="mt-2 text-[11px] text-muted-foreground">작성 {r.author} · {r.createdAt}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="surface-card p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span className="num">{active.period}</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">{active.title}</h2>
            </div>
            {isAdmin && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openEdit(active)}>
                <Pencil className="h-3.5 w-3.5" /> 편집
              </Button>
            )}
          </div>

          <div className="mt-6 space-y-6">
            <Block label="성과 요약" text={active.summary} />
            <Block label="주요 변경 사항" text={active.changes} />
            <Block label="담당자 코멘트" text={active.comment} />
            <Block label="다음 주 운영 포인트" text={active.nextWeek} highlight />
          </div>

          <div className="mt-8 flex items-center justify-between border-t pt-5 text-xs text-muted-foreground">
            <span>작성 {active.author}</span>
            <span className="num">{active.createdAt}</span>
          </div>
        </div>
      </section>

      {/* Looker 임베드 placeholder */}
      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="text-sm font-semibold">Looker Studio 대시보드</h3>
            <p className="text-[11px] text-muted-foreground">실시간 통합 대시보드 (연결 후 자동 표시)</p>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">연결 대기</span>
        </div>
        <div className="relative grid h-72 place-items-center bg-gradient-to-br from-muted/40 via-card to-accent/20">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-card">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">대시보드가 곧 연결됩니다</p>
            <p className="mt-1 text-xs text-muted-foreground">Looker Studio 임베드 영역</p>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "보고서 수정" : "새 주간 보고서"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="제목"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="기간"><Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="2025.04.07 — 2025.04.13" /></Field>
            <Field label="성과 요약"><Textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></Field>
            <Field label="주요 변경 사항"><Textarea rows={3} value={form.changes} onChange={(e) => setForm({ ...form, changes: e.target.value })} /></Field>
            <Field label="담당자 코멘트"><Textarea rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} /></Field>
            <Field label="다음 주 운영 포인트"><Textarea rows={3} value={form.nextWeek} onChange={(e) => setForm({ ...form, nextWeek: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="작성자"><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></Field>
              <Field label="작성일"><Input value={form.createdAt} onChange={(e) => setForm({ ...form, createdAt: e.target.value })} /></Field>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>취소</Button>
            <Button onClick={save}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Block({ label, text, highlight }: { label: string; text: string; highlight?: boolean }) {
  return (
    <div>
      <div className={cn("mb-2 text-xs font-semibold uppercase tracking-wide", highlight ? "text-primary" : "text-muted-foreground")}>
        {label}
      </div>
      <p className={cn("text-sm leading-relaxed", highlight && "rounded-xl border-l-2 border-primary bg-accent/30 p-4")}>{text}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
