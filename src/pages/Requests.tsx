import { useMemo, useState } from "react";
import { Send, Plus, CheckCircle2, Circle, User, Inbox, Clock3, MessageSquarePlus, AtSign, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { threads as initial, ThreadItem, TaskStatus, STATUS_LABEL } from "@/lib/mock-data";
import { useAdminMode } from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Requests() {
  const { isAdmin } = useAdminMode();
  const [list, setList] = useState<ThreadItem[]>(initial);
  const [activeId, setActiveId] = useState<string | null>(initial[0]?.id ?? null);
  const active = useMemo(() => list.find((t) => t.id === activeId) ?? null, [list, activeId]);
  const [draft, setDraft] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCheck, setNewCheck] = useState("");

  function send() {
    if (!draft.trim() || !active) return;
    setList((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? {
              ...t,
              updatedAt: "방금",
              messages: [
                ...t.messages,
                {
                  id: Math.random().toString(36).slice(2),
                  author: isAdmin ? "살만 운영팀" : "고객 담당자",
                  role: isAdmin ? "admin" : "client",
                  text: draft,
                  at: "방금",
                },
              ],
            }
          : t,
      ),
    );
    setDraft("");
  }

  function changeStatus(s: TaskStatus) {
    if (!isAdmin) {
      toast.error("관리자만 상태를 변경할 수 있습니다.");
      return;
    }
    if (!active) return;
    setList((prev) => prev.map((t) => (t.id === active.id ? { ...t, status: s } : t)));
    toast.success(`상태가 '${STATUS_LABEL[s]}'(으)로 변경되었습니다.`);
  }

  function toggleCheck(cid: string) {
    if (!isAdmin || !active) return;
    setList((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? { ...t, checklist: t.checklist.map((c) => (c.id === cid ? { ...c, done: !c.done } : c)) }
          : t,
      ),
    );
  }

  function addCheck() {
    if (!isAdmin || !newCheck.trim() || !active) return;
    setList((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? {
              ...t,
              checklist: [...t.checklist, { id: Math.random().toString(36).slice(2), text: newCheck, done: false }],
            }
          : t,
      ),
    );
    setNewCheck("");
  }

  function createThread() {
    if (!newTitle.trim()) return;
    const id = Math.random().toString(36).slice(2);
    const t: ThreadItem = {
      id,
      title: newTitle,
      status: "pending",
      owner: "미지정",
      updatedAt: "방금",
      messages: newBody
        ? [{ id: "m0", author: "고객 담당자", role: "client", text: newBody, at: "방금" }]
        : [],
      checklist: [],
    };
    setList((prev) => [t, ...prev]);
    setActiveId(id);
    setNewTitle("");
    setNewBody("");
    setNewOpen(false);
    toast.success("새 요청이 등록되었습니다.");
  }

  const checkDone = active ? active.checklist.filter((c) => c.done).length : 0;
  const checkTotal = active?.checklist.length ?? 0;
  const progressPct = checkTotal ? Math.round((checkDone / checkTotal) * 100) : 0;

  return (
    <div className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
      {/* LEFT: 요청 목록 */}
      <aside className="surface-card flex flex-col overflow-hidden">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">요청 목록</h3>
              <p className="text-[11px] text-muted-foreground">최신순 · {list.length}건</p>
            </div>
          </div>
          <Dialog open={newOpen} onOpenChange={setNewOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-3 h-9 w-full gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" /> 새 요청 작성
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 요청 등록</DialogTitle>
                <DialogDescription className="text-xs">
                  요청 제목과 내용을 입력하면 살만 운영팀에 즉시 전달됩니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="요청 제목" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
                <Textarea
                  placeholder="요청 내용을 자유롭게 작성하세요."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={5}
                />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setNewOpen(false)}>
                  취소
                </Button>
                <Button onClick={createThread} disabled={!newTitle.trim()}>등록</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex-1 overflow-y-auto">
          {list.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon={Inbox}
                size="sm"
                title="요청이 없어요"
                description="새 요청을 작성하면 여기에 쌓입니다."
                action={{ label: "새 요청 작성", onClick: () => setNewOpen(true) }}
              />
            </div>
          ) : (
            list.map((t) => {
              const isActive = activeId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    "relative w-full border-b px-4 py-3.5 text-left transition-colors hover:bg-muted/40",
                    isActive && "bg-accent/40",
                  )}
                >
                  {isActive && <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-primary" />}
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <StatusBadge status={t.status} />
                    <span className="num text-[10px] text-muted-foreground">{t.updatedAt}</span>
                  </div>
                  <div className="line-clamp-2 text-sm font-medium">{t.title}</div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <User className="h-3 w-3" />
                    {t.owner}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* CENTER: 대화 */}
      <section className="surface-card flex flex-col overflow-hidden">
        {!active ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              icon={MessageSquarePlus}
              title="요청을 선택해 주세요"
              description="좌측에서 요청을 선택하면 대화가 표시됩니다."
            />
          </div>
        ) : (
          <>
            <header className="border-b px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="line-clamp-1 text-base font-semibold">{active.title}</h2>
                <StatusBadge status={active.status} />
              </div>
              <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" /> {active.owner}
                <span className="text-border">·</span>
                <Clock3 className="h-3 w-3" /> 마지막 업데이트 {active.updatedAt}
              </p>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto bg-muted/20 px-6 py-5">
              {active.messages.length === 0 ? (
                <EmptyState icon={MessageSquarePlus} size="sm" title="아직 대화가 없어요" description="아래 입력창에서 첫 메시지를 보내보세요." />
              ) : (
                active.messages.map((m) => {
                  const me = m.role === "admin" ? isAdmin : !isAdmin;
                  return (
                    <div key={m.id} className={cn("flex gap-3", me && "flex-row-reverse")}>
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                          m.role === "admin" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                        )}
                      >
                        {m.author.slice(0, 1)}
                      </div>
                      <div className={cn("max-w-[75%]", me && "items-end text-right")}>
                        <div className={cn("mb-1 flex items-baseline gap-2 text-[11px] text-muted-foreground", me && "justify-end")}>
                          <span className="font-medium text-foreground">{m.author}</span>
                          <span className="num">{m.at}</span>
                        </div>
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                            me ? "bg-primary text-primary-foreground" : "border bg-card",
                          )}
                        >
                          {m.text}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t bg-card p-3">
              <div className="rounded-xl border bg-background focus-within:ring-2 focus-within:ring-primary/30">
                <Textarea
                  placeholder="메시지를 입력하세요. ⌘/Ctrl + Enter로 전송"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={2}
                  className="resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="flex items-center justify-between border-t px-2.5 py-1.5">
                  <div className="flex items-center gap-0.5 text-muted-foreground">
                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                      <Paperclip className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                      <AtSign className="h-3.5 w-3.5" />
                    </Button>
                    <span className="ml-1 text-[10px]">곧 지원 예정</span>
                  </div>
                  <Button onClick={send} size="sm" className="h-8 gap-1.5" disabled={!draft.trim()}>
                    <Send className="h-3.5 w-3.5" /> 전송
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* RIGHT: 진행 패널 */}
      <aside className="surface-card flex flex-col overflow-hidden">
        {!active ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <EmptyState icon={Clock3} size="sm" title="진행 정보 없음" />
          </div>
        ) : (
          <>
            {/* 현재 상태 - 헤드라인 */}
            <div className="border-b bg-muted/20 p-5">
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">현재 상태</div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <StatusBadge status={active.status} className="text-sm" />
                <span className="num text-[11px] text-muted-foreground">{progressPct}% 완료</span>
              </div>
              <div className="mt-3">
                <Select value={active.status} onValueChange={(v) => changeStatus(v as TaskStatus)} disabled={!isAdmin}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["pending", "progress", "done"] as TaskStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!isAdmin && <p className="mt-1.5 text-[10px] text-muted-foreground">관리자만 변경 가능</p>}
              </div>
            </div>

            {/* 체크리스트 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-muted-foreground">체크 항목</h4>
                <span className="num text-[11px] text-muted-foreground">
                  {checkDone}/{checkTotal}
                </span>
              </div>
              {checkTotal === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  size="sm"
                  title="체크 항목 없음"
                  description={isAdmin ? "아래에서 항목을 추가하세요." : undefined}
                />
              ) : (
                <div className="space-y-1.5">
                  {active.checklist.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => toggleCheck(c.id)}
                      disabled={!isAdmin}
                      className={cn(
                        "flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left text-sm transition-colors",
                        isAdmin && "hover:bg-muted/40 hover:border-primary/30",
                        c.done
                          ? "border-status-done/20 bg-status-done/5 text-muted-foreground"
                          : "bg-card",
                      )}
                    >
                      {c.done ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-status-done" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className={cn("leading-snug", c.done && "line-through")}>{c.text}</span>
                    </button>
                  ))}
                </div>
              )}

              {isAdmin && (
                <div className="mt-3 flex gap-1.5">
                  <Input
                    placeholder="새 체크 항목"
                    value={newCheck}
                    onChange={(e) => setNewCheck(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCheck()}
                    className="h-9"
                  />
                  <Button size="sm" variant="outline" onClick={addCheck}>
                    추가
                  </Button>
                </div>
              )}
            </div>

            {/* 메타 정보 */}
            <div className="space-y-2.5 border-t bg-muted/20 p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">담당자</span>
                <span className="font-medium">{active.owner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">마지막 업데이트</span>
                <span className="num font-medium">{active.updatedAt}</span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
