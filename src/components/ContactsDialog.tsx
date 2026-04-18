import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminMode } from "@/lib/admin-store";
import { companyProfile, agencyContacts } from "@/lib/mock-data";
import { Lock, Save, Mail, Phone, Building2, User2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ContactsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { isAdmin } = useAdminMode();
  const [profile, setProfile] = useState(companyProfile);
  const [contacts, setContacts] = useState(agencyContacts);
  const [editing, setEditing] = useState(false);

  const ro = !isAdmin || !editing;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setEditing(false); }}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto p-0">
        <div className="border-b bg-muted/30 px-6 py-5">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="flex items-center gap-2 text-lg">
              담당 정보
              {!isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  <Lock className="h-3 w-3" /> 읽기 전용
                </span>
              )}
              {isAdmin && editing && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  <Pencil className="h-3 w-3" /> 편집 중
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {!isAdmin
                ? "관리자만 수정할 수 있습니다. 변경이 필요하면 살만 운영팀에 요청해 주세요."
                : editing
                  ? "변경 후 저장하면 즉시 반영됩니다."
                  : "관리자 권한으로 보고 있습니다. 편집을 시작하려면 우측 ‘편집’을 눌러주세요."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          <Tabs defaultValue="company">
            <div className="flex items-center justify-between gap-3">
              <TabsList className="grid w-full max-w-sm grid-cols-2">
                <TabsTrigger value="company">고객사 정보</TabsTrigger>
                <TabsTrigger value="agency">살만 담당자</TabsTrigger>
              </TabsList>
              {isAdmin && !editing && (
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setEditing(true)}>
                  <Pencil className="h-3.5 w-3.5" /> 편집
                </Button>
              )}
            </div>

            <TabsContent value="company" className="mt-5 space-y-5">
              {/* 회사 카드 */}
              <div className="surface-card overflow-hidden">
                <div className="flex items-center gap-3 border-b bg-muted/20 px-5 py-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">고객사</div>
                    <div className="text-sm font-semibold">{profile.company} · {profile.team}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                  <Field label="회사명" value={profile.company} onChange={(v) => setProfile({ ...profile, company: v })} ro={ro} />
                  <Field label="팀명" value={profile.team} onChange={(v) => setProfile({ ...profile, team: v })} ro={ro} />
                  <Field label="사업자번호" value={profile.bizNumber} onChange={(v) => setProfile({ ...profile, bizNumber: v })} ro={ro} mono />
                  <Field label="회사 연락처" value={profile.companyPhone} onChange={(v) => setProfile({ ...profile, companyPhone: v })} ro={ro} icon={Phone} />
                  <div className="sm:col-span-2">
                    <Field label="회사 이메일" value={profile.companyEmail} onChange={(v) => setProfile({ ...profile, companyEmail: v })} ro={ro} icon={Mail} />
                  </div>
                </div>
              </div>

              {/* 담당자 카드 */}
              <div className="surface-card overflow-hidden">
                <div className="flex items-center gap-3 border-b bg-muted/20 px-5 py-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <User2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">고객 담당자</div>
                    <div className="text-sm font-semibold">{profile.clientManager}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                  <Field label="담당자명" value={profile.clientManager} onChange={(v) => setProfile({ ...profile, clientManager: v })} ro={ro} />
                  <Field label="연락처" value={profile.clientPhone} onChange={(v) => setProfile({ ...profile, clientPhone: v })} ro={ro} icon={Phone} />
                  <div className="sm:col-span-2">
                    <Field label="이메일" value={profile.clientEmail} onChange={(v) => setProfile({ ...profile, clientEmail: v })} ro={ro} icon={Mail} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="agency" className="mt-5 space-y-4">
              {contacts.map((c, i) => (
                <div key={i} className="surface-card overflow-hidden">
                  <div className="flex items-center gap-3 border-b bg-muted/20 px-5 py-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {c.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground">{c.role}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                    <Field label="담당자명" value={c.name} onChange={(v) => update(i, { name: v })} ro={ro} />
                    <Field label="직책" value={c.role} onChange={(v) => update(i, { role: v })} ro={ro} />
                    <Field label="연락처" value={c.phone} onChange={(v) => update(i, { phone: v })} ro={ro} icon={Phone} />
                    <Field label="이메일" value={c.email} onChange={(v) => update(i, { email: v })} ro={ro} icon={Mail} />
                    <div className="sm:col-span-2">
                      <Field label="비고" value={c.note} onChange={(v) => update(i, { note: v })} ro={ro} />
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {isAdmin && editing && (
          <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t bg-background/90 px-6 py-3.5 backdrop-blur">
            <Button variant="ghost" onClick={() => setEditing(false)}>취소</Button>
            <Button
              onClick={() => {
                toast.success("담당 정보가 저장되었습니다.");
                setEditing(false);
                onOpenChange(false);
              }}
              className="gap-1.5"
            >
              <Save className="h-4 w-4" /> 저장
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  function update(i: number, patch: Partial<(typeof contacts)[number]>) {
    setContacts((prev) => prev.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }
}

function Field({
  label,
  value,
  onChange,
  ro,
  icon: Icon,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ro: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</Label>
      {ro ? (
        <div
          className={cn(
            "flex h-10 items-center gap-2 rounded-md border border-transparent bg-muted/30 px-3 text-sm text-foreground/90",
            mono && "num",
          )}
        >
          {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
          <span className="truncate">{value || "—"}</span>
        </div>
      ) : (
        <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />}
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(Icon && "pl-9", mono && "num")}
          />
        </div>
      )}
    </div>
  );
}
