import NavBar from "../components/NavBar";
import Button from "../components/Button";

interface User {
  name: string;
}

interface Group {
  id: string;
  name: string;
  isOwner: boolean;
  isScrumToday: boolean;
}

const user: User = {
  name: "홍길동", // 임시 데이터
};

const groups: Group[] = [
  {
    id: "1",
    name: "알고리즘 스터디",
    isOwner: true,
    isScrumToday: true,
  },
  {
    id: "2",
    name: "프로젝트 팀",
    isOwner: false,
    isScrumToday: false,
  },
  // 그룹 불러오는 로직 완성 전까지 임시 데이터
];

const showGroups = groups.length > 0;

export default function Dashboard() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar userName={user.name} />

      <div style={{ padding: "32px 0", flex: 1 }}>
        {/* ...생략... */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: "1.05rem", color: "#666", margin: 0 }}>
            소속 그룹
          </h2>
          {showGroups && (
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="primary">+ 그룹 생성</Button>
              <Button variant="secondary">🔍 그룹 참가</Button>
            </div>
          )}
        </div>
        {/* ...생략... */}
        {!showGroups && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 80,
              gap: 24,
            }}
          >
            <div
              style={{ fontSize: "1.1rem", color: "#aaa", marginBottom: 24 }}
            >
              아직 소속 그룹이 없습니다.
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <Button variant="primary" round>
                🔘 새 그룹 만들기
              </Button>
              <Button variant="secondary" round>
                🔘 초대코드로 참가
              </Button>
            </div>
          </div>
        )}
        {/* ...생략... */}
      </div>
    </div>
  );
}
