import { useMemo, useState } from "react";
import { Send, Plus, CheckCircle2, Circle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { threads as initial, ThreadItem, TaskStatus, STATUS_LABEL } from "@/lib/mock-data";
import { useAdminMode } from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Requests() {
  const { isAdmin } = useAdminMode();
  const [list, setList] = useState<ThreadItem[]>(initial);
  const [activeId, setActiveId] = useState<string>(initial[0].id);
  const active = useMemo(() => list.find((t) => t.id === activeId)!, [list, activeId]);
  const [draft, setDraft] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCheck, setNewCheck] = useState("");

  function send() {
    if (!draft.trim()) return;
    setList((prev) =>
      prev.map((t) =>
        t.id === activeId
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
    setList((prev) => prev.map((t) => (t.id === activeId ? { ...t, status: s } : t)));
    toast.success(`상태가 '${STATUS_LABEL[s]}'(으)로 변경되었습니다.`);
  }

  function toggleCheck(cid: string) {
    if (!isAdmin) return;
    setList((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, checklist: t.checklist.map((c) => (c.id === cid ? { ...c, done: !c.done } : c)) }
          : t,
      ),
    );
  }

  function addCheck() {
    if (!isAdmin || !newCheck.trim()) return;
    setList((prev) =>
      prev.map((t) =>
        t.id === activeId
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

  return (
    <div className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)_300px]">
      {/* LEFT: 요청 목록 */}
      <aside className="surface-card flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h3 className="text-sm font-semibold">요청 목록</h3>
            <p className="text-[11px] text-muted-foreground">최신순 · {list.length}건</p>
          </div>
          <Dialog open={newOpen} onOpenChange={setNewOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <Plus className="h-3.5 w-3.5" /> 새 요청
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 요청 등록</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="요청 제목" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
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
                <Button onClick={createThread}>등록</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex-1 overflow-y-auto">
          {list.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={cn(
                "w-full border-b px-4 py-3.5 text-left transition-colors hover:bg-muted/40",
                activeId === t.id && "bg-accent/40",
              )}
            >
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
          ))}
        </div>
      </aside>

      {/* CENTER: 대화 */}
      <section className="surface-card flex flex-col overflow-hidden">
        <header className="border-b px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="line-clamp-1 text-base font-semibold">{active.title}</h2>
            <StatusBadge status={active.status} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">담당 {active.owner} · 마지막 업데이트 {active.updatedAt}</p>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto bg-muted/20 px-6 py-5">
          {active.messages.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">아직 대화가 없습니다.</div>
          )}
          {active.messages.map((m) => {
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
                  <div className="mb-1 flex items-baseline gap-2 text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">{m.author}</span>
                    <span className="num">{m.at}</span>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      me ? "bg-primary text-primary-foreground" : "bg-card border",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t bg-card p-3">
          <div className="flex items-end gap-2">
            <Textarea
              placeholder="메시지를 입력하세요"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              className="resize-none"
            />
            <Button onClick={send} className="h-10 gap-1.5">
              <Send className="h-4 w-4" /> 전송
            </Button>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">⌘/Ctrl + Enter로 전송</p>
        </div>
      </section>

      {/* RIGHT: 진행 패널 */}
      <aside className="surface-card flex flex-col overflow-hidden">
        <div className="border-b p-4">
          <h3 className="text-sm font-semibold">진행 상태</h3>
          <div className="mt-3">
            <Select value={active.status} onValueChange={(v) => changeStatus(v as TaskStatus)} disabled={!isAdmin}>
              <SelectTrigger>
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
            {!isAdmin && <p className="mt-2 text-[11px] text-muted-foreground">관리자만 변경 가능</p>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-semibold text-muted-foreground">체크 항목</h4>
            <span className="num text-[11px] text-muted-foreground">
              {active.checklist.filter((c) => c.done).length}/{active.checklist.length}
            </span>
          </div>
          <div className="space-y-1.5">
            {active.checklist.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCheck(c.id)}
                disabled={!isAdmin}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg border p-2.5 text-left text-sm transition-colors",
                  isAdmin && "hover:bg-muted/40",
                  c.done && "bg-muted/30 text-muted-foreground line-through",
                )}
              >
                {c.done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-status-done" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className="leading-snug">{c.text}</span>
              </button>
            ))}
          </div>

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

        <div className="border-t bg-muted/20 p-4 text-xs">
          <div className="mb-1 text-muted-foreground">담당자</div>
          <div className="font-medium">{active.owner}</div>
        </div>
      </aside>
    </div>
  );
}
