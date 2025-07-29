# 🧭 Scrum-Up

**팀의 매일을 연결하는 데일리 스크럼 서비스**  
그룹을 만들고 팀원을 초대하여, 매일 질문에 답하며 진행 상황을 공유하세요.


## 🚀 배포 주소

- [https://scrum-up.vercel.app](https://scrum-up.vercel.app)

## ✨ 주요 기능

- 카카오 로그인으로 간편 가입
- 그룹 생성 및 그룹원 초대 (링크 기반)
- 매일 질문에 대한 스크럼 작성
- 그룹장만 볼 수 있는 **관리 기능**
- 일자별 / 멤버별로 스크럼 조회 기능

## ⚙️ 기술 스택

### Front-End & Back-End
- Framework: Next.js (App Router 기반, Backend + Frontend)
- Language: TypeScript
- Database: MongoDB (with Mongoose ODM)
- Authentication: 카카오 OAuth2.0
- Infra: Vercel (배포), MongoDB Atlas


## 📌 프로젝트 의도

- 팀 프로젝트에서 매일 스크럼을 슬랙이나 노션으로 진행하던 불편함을 해소하고자 시간 맞춰 스크럼을 작성하고 쉽게 공유할 수 있는 협업 도구를 직접 만들어보았습니다.

## 🛠 개발 기간
2025.07.19 - 2025.07.30 (약 2주)

## 📸 주요 화면

<table>
  <tr>
    <td>
      <p>대시보드</p>
      <img src="https://github.com/user-attachments/assets/6fe5513c-caa0-43d7-80f3-5c072e614085" width="300" />
    </td>
    <td>
      <p>그룹 생성 화면</p>
      <img src="https://github.com/user-attachments/assets/677e2650-6664-4e49-a554-e8701ac77009" width="300" />
    </td>
    <td>
      <p>그룹 화면</p>
      <img src="https://github.com/user-attachments/assets/ae2697ae-4efc-4d79-8ad1-05cb6091edc6" width="300" />
    </td>
  </tr>
  <tr>
    <td>
      <p>스크럼 작성 화면</p>
      <img src="https://github.com/user-attachments/assets/053c0190-3d9a-4c9d-9037-fd996d140f71" width="300" />
    </td>
    <td>
      <p>스크럼 조회 화면</p>
      <img src="https://github.com/user-attachments/assets/b1fe70a7-7d82-40bc-8059-743e1913ca84" width="300" />
    </td>
    <td>
      <p>초대 화면</p>
      <img src="https://github.com/user-attachments/assets/ece7b027-66c1-48b7-97e5-6653533d9124" width="300" />
    </td>
  </tr>
</table>



## 📈 향후 개선 예정

- FCM을 통한 스크럼 알림 시스템 도입 및 안정화
- 단위 테스트 작성 및 코드 커버리지 도입
- 미들웨어 기반 AOP 스타일 권한 분리 및 인증 강화
- 그룹 및 스크럼 API 성능 최적화 (쿼리 최적화)
- 데이터 일관성 보장을 위한 트랜잭션 관리 강화
