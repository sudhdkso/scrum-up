# 🧭 Scrum-Up

**팀의 매일을 연결하는 데일리 스크럼 서비스**  
그룹을 만들고 팀원을 초대하여, 매일 질문에 답하며 진행 상황을 공유하세요.

![스크럼 이미지](./public/preview.png) <!-- 필요시 제거 또는 실제 이미지 경로로 수정 -->

## 🚀 배포 주소

- [https://scrum-up.vercel.app](https://scrum-up.vercel.app)

## ✨ 주요 기능

- 카카오 로그인으로 간편 가입
- 그룹 생성 및 그룹원 초대 (링크 기반)
- 매일 질문에 대한 스크럼 작성
- 그룹장만 볼 수 있는 **관리 기능**
- 일자별 / 멤버별로 스크럼 요약 조회

## ⚙️ 기술 스택

### Back-End

- Framework: Node.js + Next.js (App Router 기반)
- Database: MongoDB (with Mongoose ODM)
- Authentication: 카카오 OAuth2.0
- Infra: Vercel (배포), MongoDB Atlas

### Front-End

- Framework: Next.js (App Router)
- Language: TypeScript

## 📌 프로젝트 의도

팀 프로젝트에서 매일 스크럼을 챗이나 노션으로 진행하던 불편함을 해소하고자,
시간 맞춰 스크럼을 작성하고 쉽게 공유할 수 있는 협업 도구를 직접 만들어보았습니다.

## 📸 주요 화면

### 대시보드

### 그룹 화면

### 스크럼 작성 화면

### 스크럼 조회 화면

### 초대 화면

## 📈 향후 개선 예정

- FCM을 통한 스크럼 알림
- 단위 테스트 작성 및 코드 커버리지 도입
