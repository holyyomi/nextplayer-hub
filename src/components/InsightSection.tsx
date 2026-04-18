import { useState } from "react";
import { Sparkles, Megaphone, MousePointerClick, Wrench, Check, Clock, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { insightActions, InsightAction, InsightStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ICONS = {
  소재: Megaphone,
  랜딩: MousePointerClick,
  운영: Wrench,
} as const;

export function InsightSection() {
  const [items, setItems] = useState<InsightAction[]>(insightActions);
  const [commentFor, setCommentFor] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  function setStatus(id: string, s: InsightStatus, msg: string) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: s } : x)));
    toast.success(msg);
  }

  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">이번 주 제안</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            살만 운영팀이 데이터에 기반해 제안드리는 다음 액션입니다. 가볍게 승인·보류·코멘트로 의견을 남겨주세요.
          </p>
        </div>
        <span className="num text-[11px] text-muted-foreground">{items.length}건</span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
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
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                  <Icon className="h-3 w-3 text-primary" /> {it.category}
                </span>
                {it.status !== "idle" && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      isApproved && "bg-status-done/10 text-status-done",
                      isHold && "bg-muted text-muted-foreground",
                    )}
                  >
                    {isApproved ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {isApproved ? "승인됨" : "보류"}
                  </span>
                )}
              </div>

              <h3 className="text-[15px] font-semibold leading-snug">{it.title}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{it.body}</p>

              <div className="mt-4 rounded-lg border bg-muted/30 px-3 py-2 text-[11px]">
                <span className="text-muted-foreground">예상 효과 · </span>
                <span className="font-medium text-foreground">{it.impact}</span>
              </div>

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
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setCommentFor(null); setDraft(""); }}>
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
    </section>
  );
}
