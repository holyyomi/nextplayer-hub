import { useState } from "react";
import {
  Sparkles,
  Megaphone,
  MousePointerClick,
  Wrench,
  Tag,
  Check,
  Clock,
  MessageSquare,
  X,
  TrendingUp,
  Timer,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { insightActions, InsightAction, InsightStatus, InsightPriority } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ICONS = {
  소재: Megaphone,
  랜딩: MousePointerClick,
  운영: Wrench,
  프로모션: Tag,
} as const;

const PRIORITY_LABEL: Record<InsightPriority, string> = {
  high: "우선 검토",
  medium: "권장",
  low: "참고",
};

const PRIORITY_STYLES: Record<InsightPriority, string> = {
  high: "bg-status-pending/10 text-status-pending",
  medium: "bg-status-progress/10 text-status-progress",
  low: "bg-muted text-muted-foreground",
};

export function InsightSection() {
  const [items, setItems] = useState<InsightAction[]>(insightActions);
  const [commentFor, setCommentFor] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  function setStatus(id: string, s: InsightStatus, msg: string) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: s } : x)));
    toast.success(msg);
  }

  const pendingCount = items.filter((x) => x.status === "idle").length;

  return (
    <section>
      {/* Section header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Lightbulb className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-base font-semibold tracking-tight">이번 주 제안</h2>
            <span className="rounded-full border bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              살만 운영팀 큐레이션
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            데이터를 살펴본 살만 운영팀이 다음 주 함께 진행하면 좋을 액션을 정리했습니다. 가볍게 승인·보류·코멘트로 의견을 남겨주세요.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="num font-semibold text-foreground">{pendingCount}</span>
          <span>건 응답 대기</span>
          <span className="text-border">·</span>
          <span className="num">{items.length}건 전체</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((it) => {
          const Icon = ICONS[it.category];
          const isApproved = it.status === "approved";
          const isHold = it.status === "hold";
          return (
            <article
              key={it.id}
              className={cn(
                "surface-card relative flex flex-col p-5 transition-colors",
                isApproved && "border-primary/40 bg-accent/30",
                isHold && "bg-muted/40",
              )}
            >
              {/* Top row */}
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                  <Icon className="h-3 w-3 text-primary" /> {it.category}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    PRIORITY_STYLES[it.priority],
                  )}
                >
                  {PRIORITY_LABEL[it.priority]}
                </span>
              </div>

              <h3 className="text-[15px] font-semibold leading-snug">{it.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{it.body}</p>

              <div className="mt-3 rounded-lg border-l-2 border-primary/40 bg-muted/20 px-3 py-2 text-[11px] leading-relaxed text-foreground/75">
                <span className="font-medium text-primary/80">이유 · </span>
                {it.reason}
              </div>

              <div className="mt-3 flex-1 space-y-1.5 rounded-lg bg-muted/30 px-3 py-2.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-status-done" />
                  <span className="text-muted-foreground">기대 효과</span>
                  <span className="ml-auto font-semibold text-foreground">{it.impact}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Timer className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">예상 일정</span>
                  <span className="num ml-auto font-medium text-foreground/80">{it.effort}</span>
                </div>
              </div>

              {/* Status indicator */}
              {it.status !== "idle" && (
                <div
                  className={cn(
                    "mt-3 inline-flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    isApproved && "bg-status-done/10 text-status-done",
                    isHold && "bg-muted text-muted-foreground",
                  )}
                >
                  {isApproved ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {isApproved ? "승인됨" : "보류됨"}
                </div>
              )}

              {/* Actions */}
              {commentFor === it.id ? (
                <div className="mt-3 space-y-2">
                  <Textarea
                    rows={2}
                    placeholder="코멘트를 남겨주세요"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="resize-none text-xs"
                  />
                  <div className="flex justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        setCommentFor(null);
                        setDraft("");
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        toast.success("코멘트가 전달되었습니다.");
                        setCommentFor(null);
                        setDraft("");
                      }}
                    >
                      전송
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant={isApproved ? "default" : "outline"}
                    className="h-8 flex-1 gap-1 text-xs"
                    onClick={() => setStatus(it.id, "approved", "제안을 승인했습니다.")}
                  >
                    <Check className="h-3.5 w-3.5" /> 승인
                  </Button>
                  <Button
                    size="sm"
                    variant={isHold ? "secondary" : "outline"}
                    className="h-8 flex-1 gap-1 text-xs"
                    onClick={() => setStatus(it.id, "hold", "보류로 표시했습니다.")}
                  >
                    <Clock className="h-3.5 w-3.5" /> 보류
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setCommentFor(it.id)}
                    aria-label="코멘트 남기기"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}

              {it.status !== "idle" && (
                <button
                  onClick={() => setStatus(it.id, "idle", "응답을 취소했습니다.")}
                  className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted"
                  aria-label="응답 취소"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </article>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-3 flex items-center justify-between rounded-xl border border-dashed bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary/70" />
          제안은 매주 월요일 오전, 전주 데이터를 기반으로 갱신됩니다.
        </div>
        <span>다음 갱신 · 4월 21일 (월)</span>
      </div>
    </section>
  );
}
