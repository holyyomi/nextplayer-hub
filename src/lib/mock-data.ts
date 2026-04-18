// Mock 데이터 — 추후 Lovable Cloud 백엔드로 교체
export type TaskStatus = "pending" | "progress" | "done";

export const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: "진행 요청",
  progress: "운영 반영 중",
  done: "적용 완료",
};

export const companyProfile = {
  company: "넥스트플레이어",
  team: "마케팅실",
  bizNumber: "123-45-67890",
  companyPhone: "02-1234-5678",
  companyEmail: "ops@nextplayer.kr",
  clientManager: "김지윤",
  clientPhone: "010-2345-6789",
  clientEmail: "jiyoon.kim@nextplayer.kr",
};

export const agencyContacts = [
  { name: "이도현", role: "운영 총괄", phone: "010-1111-2222", email: "dohyun@salman.kr", note: "전반 커뮤니케이션 리드" },
  { name: "박서윤", role: "퍼포먼스 매니저", phone: "010-3333-4444", email: "seoyun@salman.kr", note: "리포트 작성 담당" },
  { name: "정민재", role: "크리에이티브", phone: "010-5555-6666", email: "minjae@salman.kr", note: "소재 운영" },
];

export const kpis = [
  { label: "ROAS", value: "412%", delta: "+18%", positive: true },
  { label: "전환수", value: "1,284", delta: "+126", positive: true },
  { label: "CTR", value: "2.34%", delta: "+0.21%p", positive: true },
  { label: "광고비", value: "₩28,420,000", delta: "-3.2%", positive: true },
];

export const bizMoney = "₩4,820,300";

export const operationPoints = [
  "신규 캠페인 3종 라이브 — 봄 시즌 키비주얼 적용",
  "전환 이벤트 재정의로 ROAS 안정화 진행",
  "검색 키워드 매칭 옵션 정비 마무리",
];

export type ThreadItem = {
  id: string;
  title: string;
  status: TaskStatus;
  owner: string;
  updatedAt: string;
  unread?: number;
  messages: { id: string; author: string; role: "client" | "admin"; text: string; at: string }[];
  checklist: { id: string; text: string; done: boolean }[];
};

export const threads: ThreadItem[] = [
  {
    id: "t1",
    title: "봄 시즌 캠페인 소재 교체 요청",
    status: "progress",
    owner: "박서윤",
    updatedAt: "오늘 14:22",
    unread: 2,
    messages: [
      { id: "m1", author: "김지윤", role: "client", text: "신규 키비주얼로 4월 1주차부터 교체 부탁드려요.", at: "어제 17:10" },
      { id: "m2", author: "박서윤", role: "admin", text: "확인했습니다. 3개 캠페인에 순차 반영 예정이며, 내일 오전 라이브 가능합니다.", at: "오늘 09:30" },
      { id: "m3", author: "박서윤", role: "admin", text: "현재 2개 적용 완료, 나머지 1개 검수 중입니다.", at: "오늘 14:22" },
    ],
    checklist: [
      { id: "c1", text: "소재 검수", done: true },
      { id: "c2", text: "캠페인 A 적용", done: true },
      { id: "c3", text: "캠페인 B 적용", done: true },
      { id: "c4", text: "캠페인 C 적용", done: false },
    ],
  },
  {
    id: "t2",
    title: "전환 이벤트 재정의 검토",
    status: "pending",
    owner: "이도현",
    updatedAt: "어제 11:08",
    messages: [
      { id: "m1", author: "김지윤", role: "client", text: "구매 완료 외에 장바구니 담기도 보조 전환으로 잡고 싶어요.", at: "어제 11:08" },
    ],
    checklist: [
      { id: "c1", text: "이벤트 구조 정리", done: false },
      { id: "c2", text: "GA/픽셀 동기화 확인", done: false },
    ],
  },
  {
    id: "t3",
    title: "주간 리포트 양식 조정",
    status: "done",
    owner: "박서윤",
    updatedAt: "3일 전",
    messages: [
      { id: "m1", author: "김지윤", role: "client", text: "성과 요약 위에 한 줄 코멘트 추가 가능할까요?", at: "5일 전" },
      { id: "m2", author: "박서윤", role: "admin", text: "이번 주 보고서부터 상단 코멘트 영역 반영했습니다.", at: "3일 전" },
    ],
    checklist: [
      { id: "c1", text: "양식 업데이트", done: true },
      { id: "c2", text: "샘플 공유", done: true },
    ],
  },
  {
    id: "t4",
    title: "검색 매칭 옵션 정비",
    status: "progress",
    owner: "정민재",
    updatedAt: "오늘 10:00",
    messages: [
      { id: "m1", author: "정민재", role: "admin", text: "구문 일치 위주로 재편 진행 중입니다.", at: "오늘 10:00" },
    ],
    checklist: [
      { id: "c1", text: "키워드 분류", done: true },
      { id: "c2", text: "신규 그룹 적용", done: false },
    ],
  },
];

export type EventType = "operation" | "promotion" | "share" | "report" | "etc";
export const EVENT_LABEL: Record<EventType, string> = {
  operation: "운영 일정",
  promotion: "프로모션",
  share: "공유 일정",
  report: "리포트 확인",
  etc: "기타",
};
export const EVENT_COLOR: Record<EventType, string> = {
  operation: "hsl(var(--primary))",
  promotion: "hsl(var(--warning))",
  share: "hsl(var(--info))",
  report: "hsl(var(--status-done))",
  etc: "hsl(var(--muted-foreground))",
};

export type CalendarEvent = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  type: EventType;
  title: string;
  description?: string;
};

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const initialEvents: CalendarEvent[] = [
  { id: "e1", date: addDays(0), type: "report", title: "주간 리포트 확인", description: "이번 주 성과 리뷰 및 다음 주 운영 포인트 협의" },
  { id: "e2", date: addDays(2), type: "promotion", title: "봄맞이 프로모션 라이브", description: "전 캠페인 신규 키비주얼 적용 시작" },
  { id: "e3", date: addDays(4), type: "operation", title: "검색 키워드 정비 완료", description: "구문 일치 기반 그룹 재편" },
  { id: "e4", date: addDays(7), type: "share", title: "월간 운영 공유 미팅", description: "고객사 회의실 / 14:00" },
  { id: "e5", date: addDays(10), type: "promotion", title: "쿠폰 프로모션 종료" },
  { id: "e6", date: addDays(-3), type: "operation", title: "AB 테스트 결과 정리" },
];

export const recentLogs = [
  { at: "오늘 14:22", text: "봄 시즌 캠페인 소재 2건 라이브 적용", by: "박서윤" },
  { at: "오늘 09:30", text: "주간 보고서 초안 등록", by: "박서윤" },
  { at: "어제 18:10", text: "전환 이벤트 재정의 요청 접수", by: "이도현" },
  { at: "어제 11:42", text: "검색 키워드 그룹 1차 정비", by: "정민재" },
];

export const oneLineSummary =
  "이번 주는 봄 시즌 캠페인 라이브와 전환 구조 안정화에 집중하고 있습니다.";

export type WeeklyReport = {
  id: string;
  title: string;
  period: string;
  summary: string;
  changes: string;
  comment: string;
  nextWeek: string;
  author: string;
  createdAt: string;
};

export type InsightStatus = "idle" | "approved" | "hold";
export type InsightAction = {
  id: string;
  category: "소재" | "랜딩" | "운영";
  title: string;
  body: string;
  impact: string;
  status: InsightStatus;
};
export const insightActions: InsightAction[] = [
  {
    id: "i1",
    category: "소재",
    title: "신규 소재 메시지 테스트 제안",
    body: "현재 라이브 소재의 CTR이 안정 구간에 들어왔습니다. ‘혜택 강조’ 카피와 ‘사용 시점 강조’ 카피로 A/B 테스트를 제안드립니다.",
    impact: "예상 CTR +0.2%p · 2주 소요",
    status: "idle",
  },
  {
    id: "i2",
    category: "랜딩",
    title: "랜딩 상단 CTA 구조 개선 제안",
    body: "전환 경로 분석 결과, 첫 화면 이탈이 38% 수준입니다. 핵심 베네핏 1줄 + CTA 노출 위치 상향을 제안드립니다.",
    impact: "예상 전환율 +6~9%",
    status: "approved",
  },
  {
    id: "i3",
    category: "운영",
    title: "다음 주 운영 액션",
    body: "전환 이벤트 재정의 마감과 함께, 검색 키워드 그룹 2차 정비를 동시 진행하면 ROAS 안정화가 가능합니다.",
    impact: "예상 ROAS +5%p",
    status: "idle",
  },
];

export const weeklyReports: WeeklyReport[] = [
  {
    id: "r1",
    title: "4월 2주차 운영 리포트",
    period: "2025.04.07 — 2025.04.13",
    summary: "ROAS 412%로 전주 대비 +18%p 상승. 신규 캠페인 라이브 효과가 본격화되고 있습니다.",
    changes: "봄 시즌 키비주얼 3종 적용, 전환 이벤트 재정의 착수, 검색 키워드 1차 정비 완료.",
    comment: "신규 소재의 CTR 반응이 안정적이며, 전환 경로 정비 후 ROAS 추가 개선이 기대됩니다.",
    nextWeek: "전환 이벤트 재정의 마감, 캠페인 C 라이브, 키워드 그룹 2차 정비.",
    author: "박서윤",
    createdAt: "2025.04.14",
  },
  {
    id: "r2",
    title: "4월 1주차 운영 리포트",
    period: "2025.03.31 — 2025.04.06",
    summary: "ROAS 394%, 전환 1,158건. 캠페인 라이브 직전 정비 작업 위주 진행.",
    changes: "신규 소재 검수 완료, 리포트 양식 개편, 비즈머니 충전 안내.",
    comment: "다음 주 라이브를 위한 사전 정비가 마무리된 한 주였습니다.",
    nextWeek: "신규 캠페인 라이브, 성과 모니터링 강화.",
    author: "박서윤",
    createdAt: "2025.04.07",
  },
];
