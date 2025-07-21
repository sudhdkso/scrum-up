"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../style/groupForm.module.css";
import Button from "../components/Button";
import NavBar from "../components/NavBar";
import TextInput from "../components/TextInput";
import TextAreaInput from "../components/TextAreaInput";
import ScrapQuestions from "../components/ScrapQuestions";
import { AuthProvider } from "../components/AuthProvider";

const DEFAULT_QUESTIONS = [
  "어제 무엇을 했나요?",
  "오늘 무엇을 할 계획인가요?",
  "진행에 방해되는 장애물이 있나요?",
];
const MAX_QUESTIONS = 10;

function to24HourFormat(hourStr: string, ampm: string) {
  let hourNum = parseInt(hourStr, 10);
  if (ampm === "PM" && hourNum < 12) {
    hourNum += 12;
  }
  if (ampm === "AM" && hourNum === 12) {
    hourNum = 0;
  }
  // 두 자리 문자열로 반환하려면:
  return hourNum.toString().padStart(2, "0");
}

export default function GroupCreate() {
  const router = useRouter();

  const [groupName, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [questions, setQuestions] = useState([...DEFAULT_QUESTIONS]);
  const [ampm, setAmpm] = useState("AM");
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [cycle, setCycle] = useState("매일");
  const [loading, setLoading] = useState(false);

  const hourList = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minuteList = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0")
  );

  const hour24 = to24HourFormat(hour, ampm);

  const sendTime = `${hour24}:${minute}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // 새로고침 방지
    setLoading(true);

    const res = await fetch("/api/group", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: groupName,
        description: desc,
        questions: questions,
        scrumTime: sendTime,
        cycle: cycle,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      alert("그룹이 생성되었습니다!");
      router.push("/dashboard");
    } else {
      alert(data.message || "생성 실패");
    }
  }

  return (
    <AuthProvider>
      <NavBar />
      <div>
        <div className={styles.centerContainer}>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>그룹 생성</h2>

            <TextInput
              label="그룹 이름"
              required
              value={groupName}
              onChange={(e) => setName(e.target.value)}
              placeholder="그룹 이름을 입력하세요"
              className={styles.inputBase}
            />

            <TextAreaInput
              label="그룹 설명 (선택)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="그룹 설명을 입력하세요"
              className={styles.textareaBase}
            />

            <label className={styles.labelBase}>
              스크럼 시간
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                <select
                  value={ampm}
                  onChange={(e) => setAmpm(e.target.value)}
                  className={styles.selectBase}
                  style={{ width: 100 }}
                >
                  <option value="AM">오전</option>
                  <option value="PM">오후</option>
                </select>
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className={styles.selectBase}
                  style={{ width: 100 }}
                >
                  {hourList.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <span style={{ fontWeight: 400, color: "#666" }}>:</span>
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className={styles.selectBase}
                  style={{ width: 100 }}
                >
                  {minuteList.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className={styles.labelBase}>
              스크럼 주기
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                className={styles.selectBase}
                style={{ width: 100, marginTop: 7, marginLeft: 7 }}
              >
                <option value="매일">매일</option>
                <option value="평일">평일</option>
                <option value="주말">주말</option>
              </select>
            </label>

            <ScrapQuestions
              questions={questions}
              onChange={setQuestions}
              maxQuestions={MAX_QUESTIONS}
              inputClassName={styles.inputBase}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              style={{ width: "100%", marginTop: 10, fontSize: "1.09rem" }}
            >
              그룹 생성하기
            </Button>
          </form>
        </div>
      </div>
    </AuthProvider>
  );
}
