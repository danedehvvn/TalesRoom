# BEJV27-1st-2TEAM

# TalesRoom (테일즈룸)

방탈출 매장·테마 정보를 제공하고, 카테고리별 Q&A를 통해 이용자가 자신에게 맞는 방탈출 테마를 탐색하고 궁금증을 해결할 수 있는 커뮤니티 서비스

## 프로젝트 기본 정보

- **팀명:** 취업할거조 (2팀)
- **프로젝트명:** TalesRoom (테일즈룸)
- **프로젝트 기간:** 2026.10.28 ~ 2026.11.12
- **GitHub:** https://github.com/likelion-backendschool-10th/BEJV27-1st-2TEAM

## 개발 환경

| 항목          | 버전 / 도구                      |
| ------------- | -------------------------------- |
| Node.js       | v24.21.0 (팀 통일)               |
| 패키지 매니저 | npm                              |
| Frontend      | React, Vite, React Router, Axios |
| Backend       | Node.js, Express                 |
| Database      | MySQL Community Server v26.7.0   |
| DB 관리 도구  | MySQL Workbench 또는 DBeaver     |
| Editor        | VS Code                          |
| VS Code 확장  | ESLint, Prettier                 |
| API 테스트    | Postman 또는 Thunder Client      |
| 협업          | Git, GitHub                      |

## 프로젝트 구조

```text
TalesRoom/
├── frontend/ # React (Vite)
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ └── App.jsx
│ └── .env
├── backend/ # Node.js + Express
│ ├── src/
│ │ ├── routes/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── repositories/
│ │ ├── middlewares/
│ │ ├── config/db.js
│ │ └── app.js
│ ├── db/schema.sql
│ └── .env
├── docs/ # 프로젝트 산출물 5종, 회고
├── .gitignore
└── README.md
```

## 프로젝트 실행 방법

**1. 저장소 클론**

```bash
git clone https://github.com/likelion-backendschool-10th/BEJV27-1st-2TEAM.git
```

**2. 프론트엔드 실행**

```bash
cd frontend
npm install
npm run dev
```

**3. 백엔드 실행 (별도 터미널)**

```bash
cd backend
npm install
npm run dev
```

※ 백엔드의 `dev` 스크립트 설정 후 실행 가능합니다.

## 환경변수 설정

`frontend/.env.example`과 `backend/.env.example`을 참고하여 각 폴더에 `.env` 파일을 생성합니다.

- `.env`: 개인 로컬 환경설정 파일 (Git 업로드 제외)
- `.env.example`: 환경변수 이름을 공유하는 예시 파일 (Git 업로드 포함)

DB는 `backend/db/schema.sql`을 참고하여 각자 로컬 환경에 생성합니다.
