import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminMode } from "@/lib/admin-store";
import { companyProfile, agencyContacts } from "@/lib/mock-data";
import { Lock, Save } from "lucide-react";
import { toast } from "sonner";

export function ContactsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { isAdmin } = useAdminMode();
  const [profile, setProfile] = useState(companyProfile);
  const [contacts, setContacts] = useState(agencyContacts);

  const ro = !isAdmin;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            담당 정보
            {ro && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                <Lock className="h-3 w-3" /> 읽기 전용
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {ro ? "관리자만 수정할 수 있습니다." : "변경 후 저장하면 즉시 반영됩니다."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="company" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="company">고객사 정보</TabsTrigger>
            <TabsTrigger value="agency">살만 담당자</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="회사명" value={profile.company} onChange={(v) => setProfile({ ...profile, company: v })} ro={ro} />
              <Field label="팀명" value={profile.team} onChange={(v) => setProfile({ ...profile, team: v })} ro={ro} />
              <Field label="사업자번호" value={profile.bizNumber} onChange={(v) => setProfile({ ...profile, bizNumber: v })} ro={ro} />
              <Field label="회사 연락처" value={profile.companyPhone} onChange={(v) => setProfile({ ...profile, companyPhone: v })} ro={ro} />
              <Field label="회사 이메일" value={profile.companyEmail} onChange={(v) => setProfile({ ...profile, companyEmail: v })} ro={ro} />
              <Field label="고객 담당자명" value={profile.clientManager} onChange={(v) => setProfile({ ...profile, clientManager: v })} ro={ro} />
              <Field label="담당자 연락처" value={profile.clientPhone} onChange={(v) => setProfile({ ...profile, clientPhone: v })} ro={ro} />
              <Field label="담당자 이메일" value={profile.clientEmail} onChange={(v) => setProfile({ ...profile, clientEmail: v })} ro={ro} />
            </div>
          </TabsContent>

          <TabsContent value="agency" className="mt-4 space-y-4">
            {contacts.map((c, i) => (
              <div key={i} className="surface-card p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="담당자명" value={c.name} onChange={(v) => update(i, { name: v })} ro={ro} />
                  <Field label="직책" value={c.role} onChange={(v) => update(i, { role: v })} ro={ro} />
                  <Field label="연락처" value={c.phone} onChange={(v) => update(i, { phone: v })} ro={ro} />
                  <Field label="이메일" value={c.email} onChange={(v) => update(i, { email: v })} ro={ro} />
                  <div className="sm:col-span-2">
                    <Field label="비고" value={c.note} onChange={(v) => update(i, { note: v })} ro={ro} />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {!ro && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                toast.success("담당 정보가 저장되었습니다.");
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ro: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={ro}
        className={ro ? "cursor-default bg-muted/40" : ""}
      />
    </div>
  );
}
