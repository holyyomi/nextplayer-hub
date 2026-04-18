import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
  isAfter,
  startOfToday,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Trash2, CalendarDays, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarEvent, EventType, EVENT_COLOR, EVENT_LABEL, initialEvents } from "@/lib/mock-data";
import { useAdminMode } from "@/lib/admin-store";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Calendar() {
  const { isAdmin } = useAdminMode();
  const [cursor, setCursor] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selected, setSelected] = useState<Date>(new Date());
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<Omit<CalendarEvent, "id">>({
    date: format(new Date(), "yyyy-MM-dd"),
    type: "operation",
    title: "",
    description: "",
  });

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const eventsByDate = useMemo(() => {
    const m: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => ((m[e.date] ||= []).push(e)));
    return m;
  }, [events]);

  const selectedKey = format(selected, "yyyy-MM-dd");
  const selectedEvents = eventsByDate[selectedKey] ?? [];
  const isSelectedToday = isSameDay(selected, new Date());
  const upcoming = events
    .filter((e) => isAfter(parseISO(e.date), startOfToday()) || e.date === format(new Date(), "yyyy-MM-dd"))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  function openNew(date?: Date) {
    if (!isAdmin) {
      toast.error("관리자만 일정을 등록할 수 있습니다.");
      return;
    }
    setEditing(null);
    setForm({
      date: format(date ?? selected, "yyyy-MM-dd"),
      type: "operation",
      title: "",
      description: "",
    });
    setOpen(true);
  }

  function openEdit(e: CalendarEvent) {
    if (!isAdmin) return;
    setEditing(e);
    setForm({ date: e.date, type: e.type, title: e.title, description: e.description ?? "" });
    setOpen(true);
  }

  function save() {
    if (!form.title.trim()) return;
    if (editing) {
      setEvents((prev) => prev.map((x) => (x.id === editing.id ? { ...editing, ...form } : x)));
      toast.success("일정이 수정되었습니다.");
    } else {
      setEvents((prev) => [...prev, { id: Math.random().toString(36).slice(2), ...form }]);
      toast.success("일정이 등록되었습니다.");
    }
    setOpen(false);
  }

  function remove(id: string) {
    if (!isAdmin) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success("일정이 삭제되었습니다.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* CALENDAR */}
      <div className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight">
              {format(cursor, "yyyy년 M월", { locale: ko })}
            </h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCursor(subMonths(cursor, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => { setCursor(new Date()); setSelected(new Date()); }}>
                오늘
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCursor(addMonths(cursor, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button size="sm" className="gap-1.5 shadow-sm" onClick={() => openNew()}>
            <Plus className="h-4 w-4" /> 일정 등록
          </Button>
        </div>

        <div className="grid grid-cols-7 border-b bg-muted/30 text-center text-[11px] font-medium text-muted-foreground">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div key={d} className={cn("py-2", i === 0 && "text-destructive")}>
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDate[key] ?? [];
            const inMonth = isSameMonth(day, cursor);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selected);
            const hasEvents = dayEvents.length > 0;
            return (
              <button
                key={key}
                onClick={() => setSelected(day)}
                onDoubleClick={() => openNew(day)}
                className={cn(
                  "group relative min-h-[116px] border-b border-r p-2 text-left transition-colors hover:bg-muted/30",
                  !inMonth && "bg-muted/10 text-muted-foreground/50",
                  isSelected && "bg-accent/40",
                )}
              >
                {isSelected && (
                  <span className="pointer-events-none absolute inset-1 rounded-lg ring-2 ring-primary/50" />
                )}
                <div className="relative mb-1 flex items-center justify-between">
                  <span
                    className={cn(
                      "num inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs",
                      isToday && "bg-primary font-semibold text-primary-foreground shadow-sm",
                      !isToday && hasEvents && "font-semibold text-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {hasEvents && !isToday && (
                    <span className="num text-[10px] font-medium text-muted-foreground">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                <div className="relative space-y-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-[10.5px]"
                      style={{ background: `${EVENT_COLOR[e.type]}1f`, color: EVENT_COLOR[e.type] }}
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full" style={{ background: EVENT_COLOR[e.type] }} />
                      <span className="truncate font-medium">{e.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}건 더</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="space-y-4">
        {/* 선택한 일정 - 주인공 */}
        <div className="surface-card overflow-hidden">
          <div className="border-b bg-gradient-to-br from-accent/40 to-accent/10 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wide text-primary/80">
                  {isSelectedToday ? "오늘" : "선택한 날짜"}
                </div>
                <h3 className="mt-1 text-base font-bold">
                  {format(selected, "M월 d일 (EEE)", { locale: ko })}
                </h3>
              </div>
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-card shadow-sm">
                <span className="text-[10px] uppercase text-muted-foreground">
                  {format(selected, "MMM", { locale: ko })}
                </span>
                <span className="num text-lg font-bold leading-none">{format(selected, "dd")}</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            {selectedEvents.length === 0 ? (
              <EmptyState
                icon={CalendarPlus}
                size="sm"
                title="등록된 일정이 없어요"
                description={isAdmin ? "이 날짜에 일정을 추가할 수 있어요." : undefined}
                action={isAdmin ? { label: "일정 추가", onClick: () => openNew() } : undefined}
              />
            ) : (
              <div className="space-y-2">
                {selectedEvents.map((e) => (
                  <div key={e.id} className="rounded-xl border p-3.5 transition-colors hover:bg-muted/30">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{ background: `${EVENT_COLOR[e.type]}1f`, color: EVENT_COLOR[e.type] }}
                        >
                          {EVENT_LABEL[e.type]}
                        </span>
                        <div className="mt-2 text-sm font-semibold">{e.title}</div>
                        {e.description && (
                          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{e.description}</p>
                        )}
                      </div>
                      {isAdmin && (
                        <div className="flex shrink-0 gap-1">
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => openEdit(e)}>
                            편집
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(e.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 다가오는 일정 - 보조 */}
        <div className="surface-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">다가오는 일정</h3>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState icon={CalendarDays} size="sm" title="예정된 일정이 없어요" />
          ) : (
            <div className="space-y-1.5">
              {upcoming.map((e) => (
                <button
                  key={e.id}
                  onClick={() => {
                    setSelected(parseISO(e.date));
                    setCursor(parseISO(e.date));
                  }}
                  className="flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-muted/50">
                    <span className="text-[9px] uppercase text-muted-foreground">
                      {format(parseISO(e.date), "MMM", { locale: ko })}
                    </span>
                    <span className="num text-sm font-bold leading-none">{format(parseISO(e.date), "dd")}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full" style={{ background: EVENT_COLOR[e.type] }} />
                      <span className="text-[10px] text-muted-foreground">{EVENT_LABEL[e.type]}</span>
                    </div>
                    <div className="truncate text-xs font-medium">{e.title}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "일정 수정" : "일정 등록"}</DialogTitle>
            <DialogDescription className="text-xs">
              운영·프로모션·공유 일정 등 카테고리를 선택해 주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">제목</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">날짜</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">유형</Label>
                <Select value={form.type} onValueChange={(v: EventType) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(EVENT_LABEL) as EventType[]).map((k) => (
                      <SelectItem key={k} value={k}>
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ background: EVENT_COLOR[k] }} />
                          {EVENT_LABEL[k]}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">설명 (선택)</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            {editing && (
              <Button
                variant="ghost"
                className="mr-auto text-destructive"
                onClick={() => {
                  remove(editing.id);
                  setOpen(false);
                }}
              >
                삭제
              </Button>
            )}
            <Button variant="ghost" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={save} disabled={!form.title.trim()}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
