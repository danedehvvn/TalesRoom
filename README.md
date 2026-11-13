# BEJV27-1st-2TEAM

<img width="1148" height="440" alt="image" src="https://github.com/user-attachments/assets/39a2ccdf-41ba-4874-8256-18a4136a5c62" />

# 🗝️ TalesRoom (테일즈룸)

**테마를 찾고, 궁금증을 나누고, 함께 탈출할 동료를 만나는 방탈출 커뮤니티**

“우리 인원으로 즐길 수 있는 테마는 어디일까?”, “처음 도전해도 괜찮을까?”, “함께 갈 사람은 어디서 구할까?”

TalesRoom은 흩어진 방탈출 정보를 찾는 수고를 줄이고, 테마 선택부터 동행 모집까지 연결하고자 기획한 서비스입니다. 방탈출을 준비할 때는 지역·인원·장르 등 여러 조건을 비교해야 하지만, 소개와 후기만으로는 자신에게 맞는 테마인지 판단하기 어렵습니다. 정보를 찾는 과정에서 원하지 않는 스포일러를 접하거나, 함께할 인원이 부족해 참여를 망설이기도 합니다.

이러한 불편을 줄이기 위해 이용자가 필요한 정보를 골라 보고, 서로의 경험을 나누며, 함께할 사람을 직접 모집할 수 있도록 구성했습니다.

- **조건별 테마 탐색**으로 지역·인원·장르에 맞는 테마를 찾고, 지도와 평점·후기를 통해 선택에 필요한 정보 확인
- **스포일러 경고와 질문·답변**으로 열람할 정보를 직접 선택하고, 다른 이용자의 경험을 바탕으로 궁금증 해결
- **동행 모집과 멤버 전용 파티 대화**로 함께할 사람을 모으고, 확정된 멤버끼리 모임 준비
- **활동 점수·회원 등급·포인트 교환**으로 경험 공유와 커뮤니티 참여에 동기 부여

이를 통해 테마를 소개하는 데서 나아가, 이용자의 경험이 다음 사람의 선택을 돕고 새로운 만남으로 이어지는 방탈출 커뮤니티를 만들고자 했습니다.


## 프로젝트 기본 정보

| 항목          | 내용                                                                                |
| ------------- | ----------------------------------------------------------------------------------- |
| 팀명          | 취업할거조 (2팀)                                                                    |
| 프로젝트명    | TalesRoom (테일즈룸)                                                                |
| 프로젝트 기간 | 2026.10.28 ~ 2026.11.16                                                             |
| 저장소        | [BEJV27-1st-2TEAM](https://github.com/likelion-backendschool-10th/BEJV27-1st-2TEAM) |


## 주요 기능
<img width="2414" height="1168" alt="image" src="https://github.com/user-attachments/assets/1d683677-8688-4e89-a40d-2b7484f76e25" />

**사용자 인증 및 회원 관리**

- 회원가입 및 이메일 인증: 아이디·이메일·닉네임 중복 검사와 이메일 인증번호 확인을 통한 회원가입
- JWT 기반 인증·인가: 로그인이 필요한 API의 토큰 서명·만료 검증 및 관리자 API의 권한 검사
- 계정 찾기: 이메일 인증을 통한 아이디 찾기 및 비밀번호 재설정
- 마이페이지: 프로필·등급·활동 점수 조회, 닉네임·비밀번호 변경, 작성 글·댓글·북마크 모아보기

**조건 기반 테마 탐색**

- 검색 및 다중 필터: 테마명·매장명 검색과 지역·인원·장르 조건을 조합한 테마 탐색
- 추천 및 정렬: 홈의 장르별 추천 테마와 검색 자동완성, 최신순·평점순·후기 많은순 정렬 제공
- 상세 정보 및 지도: 가격·난이도·플레이 시간·참여 인원과 Google Maps 기반 매장 위치 표시
- 평점·후기 및 북마크: 회원당 테마별 평점·후기 1개 작성, 관심 테마 저장 및 개인 목록 조회

**스포일러를 배려한 커뮤니티**

- 카테고리별 소통: 질문·정보·수다·토론 게시글 작성·조회·수정·삭제와 검색·정렬·페이지네이션 제공
- 질문과 답변 채택: 테마와 연결된 질문 작성, 댓글·답변 등록 및 질문 작성자의 답변 1개 채택
- 스포일러 경고: 작성자가 스포일러를 표시하면 열람 전 경고 팝업으로 내용 확인 여부 선택
- 게시글 좋아요: 유용한 게시글에 회원당 1회 좋아요 및 취소

**동행 모집 및 파티 대화**

- 모집글 작성: 테마 선택·직접 입력·미정 상태를 지원하고 모임 일시와 모집 인원을 설정
- 참가 신청 및 관리: 회원의 참가 신청과 모집 작성자의 승인·거절, 동일 모집에 대한 중복 신청 방지
- 파티 확정: 작성자 포함 정원이 충족되면 작성자가 모집을 마감하고, 확정된 파티를 ‘내 파티’에서 조회
- 멤버 전용 대화: 파티장과 승인된 멤버만 파티 정보·대화를 조회하고 메시지 작성
- 모집 상태 관리: 모집 중(OPEN)·마감(CLOSED)·취소(CANCELED) 상태로 참여 가능 여부 관리

**활동 보상 및 포인트 교환**

- 활동 점수 적립·회수: 게시글 작성 시 10점, 댓글·답변 3점, 테마 평점·후기 15점을 지급하고 해당 삭제 기능 실행 시 작성자의 점수를 최소 0점까지 차감
- 회원 등급 및 명예의 전당: 활동 점수에 따른 회원 등급과 관리자 계정을 제외한 상위 회원 랭킹 제공
- 포인트 상품 교환: 활동 점수 1점을 10P로 환산하고 상품 교환 시 활동 점수와 재고 차감
- 교환 내역 관리: 교환 당시 상품명·사용 포인트·교환 일시를 기록하고 회원별 교환 내역 조회
- 트랜잭션 처리: 점수 차감·재고 차감·교환 내역 저장 중 오류가 발생하면 전체 변경 롤백

**관리자 운영 기능**

- 테마 정보 관리: 테마 등록·수정·삭제를 통한 테마·매장 정보 관리
- 회원 목록 조회: 회원의 아이디·닉네임·이메일·권한·가입일 확인
- 공지 관리: 커뮤니티 공지 작성·조회·수정·삭제
- 교환소 운영: 상품 등록·수정·삭제, 재고 조절 및 전체 회원 교환 내역 조회


## 기술 스택

| 구분      | 기술                                 | 비고                                         |
| --------- | ------------------------------------ | -------------------------------------------- |
| Frontend  | React, React Router, Axios           | Vite 기반, CSS                               |
| Backend   | Node.js, Express                     | JWT 인증, bcrypt 비밀번호 해시, dotenv       |
| Database  | MySQL Community Server 26.7.0        | Sequelize ORM 및 mysql2 드라이버 사용        |
| 외부 API  | Google Maps JavaScript API           | `@vis.gl/react-google-maps`로 위치 표시      |
| 이메일    | Nodemailer, Gmail SMTP               | 이메일 인증번호 발송                         |
| 개발·검증 | ESLint, Node.js Test Runner, Postman | 코드 검사, 공통 에러 핸들러 테스트, API 확인 |
| 협업      | GitHub, Google Docs, Notion          | GitHub PR, 문서 공유                         |


## 팀원 역할

| 이름   | 역할         | 담당 기능(FE, BE)                                            |
| ------ | ------------ | ------------------------------------------------------------ |
| 최진영 | 팀장, FE, BE | 메인·공통 레이아웃(FE), 답변 채택, 매장·테마 조회            |
| 강민하 | FE, BE       | 회원가입, 댓글(답변) CRD, 명예의 전당, 포인트 교환소         |
| 권우리 | FE, BE       | 게시글 CRUD·카테고리, 모집·파티 게시판                       |
| 조성식 | FE, BE, DB   | 로그인, 인증, 공지 CRUD, 좋아요, DB 설계                     |
| 황상경 | FE, BE       | 메인(FE), 질문 검색·페이징, 테마 복합 필터, 관리자 테마 관리 |

## 아키텍처
(추가 필)

## 프로젝트 구조

```text
TalesRoom/
├── frontend/
│   ├── src/
│   │   ├── api/             # API 요청
│   │   ├── components/      # 공통 UI·홈 섹션
│   │   ├── context/         # 인증·알림 상태
│   │   ├── hooks/
│   │   ├── pages/           # 라우트별 화면
│   │   ├── styles/
│   │   └── App.jsx         # 라우팅
│   ├── .env.example
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── config/db.js     # Sequelize 연결
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/        # 검증·비즈니스 로직
│   │   ├── repositories/   # 데이터 접근
│   │   ├── models/          # Sequelize 모델·연관관계
│   │   ├── middlewares/    # 인증·권한·공통 오류 처리
│   │   ├── utils/
│   │   └── app.js
│   ├── db/schema.sql
│   ├── tests/
│   └── .env.example
├── sampleData/
│   ├── data/themes180.json  # 수집된 테마 데이터
│   └── importThemes.js     # JSON 데이터를 DB에 반영
├── docs/                   # 프로젝트 문서·테스트 쿼리
└── README.md
```

## 로컬 실행 방법

### 1. 실행 환경 준비 및 저장소 클론

Node.js와 npm, 실행 중인 MySQL 서버가 필요합니다. 기존 팀 개발 환경의 Node.js 기준 버전은 `v24.21.0`입니다.

```bash
git clone https://github.com/likelion-backendschool-10th/BEJV27-1st-2TEAM.git
cd BEJV27-1st-2TEAM
```

### 2. 환경변수 설정

`backend/.env.example`, `frontend/.env.example`을 각각 같은 폴더의 `.env`로 복사하고 값을 설정합니다. 아래 접속정보는 예시입니다.

**`backend/.env`**

```dotenv
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=talesroom
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=
MAIL_USER=
MAIL_PASS=
```

`MAIL_USER`에는 발송용 Gmail 주소, `MAIL_PASS`에는 앱 비밀번호를 입력합니다. 두 값이 없으면 인증 메일 내용이 서버 터미널에 출력됩니다.

**`frontend/.env`**

```dotenv
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

- `VITE_API_URL`에는 `/api`를 제외한 백엔드 주소를 입력합니다.
- 지도 표시에는 Google Maps JavaScript API를 사용할 수 있는 키가 필요합니다.
- 환경변수 변경 후에는 개발 서버를 재시작합니다.
- 실제 비밀값이 포함된 `.env`는 Git에 커밋하지 않습니다.

### 3. DB 스키마 적용

MySQL Workbench 또는 DBeaver에서 [schema.sql](backend/db/schema.sql)을 실행합니다.
파일에 `talesroom` 데이터베이스 생성·선택 구문과 테이블·인덱스·외래키 생성 구문이 포함되어 있습니다.

다른 DB 이름을 사용한다면 스키마의 생성·선택 구문과 `DB_NAME`을 동일하게 맞춥니다. 초기 생성용 파일이므로 기존 DB에 반복 실행하면 테이블 중복 오류가 발생할 수 있습니다.

### 4. 백엔드 실행

저장소 루트에서 실행합니다.

```bash
cd backend
npm install
npm run dev
```

- 기본 주소: `http://localhost:3000`
- DB 인증 성공 후 서버가 시작됩니다.

### 5. 프론트엔드 실행

별도 터미널의 저장소 루트에서 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

- 기본 접속 주소: `http://localhost:5173` (실제 주소는 Vite 터미널 출력 확인 필요)
- 현재 백엔드 CORS 허용 주소는 `http://localhost:5173`로 설정되어 있습니다.
- 최초 회원가입 후 관리자 기능을 확인하려면 DB에서 해당 회원의 `role`을 `ADMIN`으로 설정하고 다시 로그인합니다.

### 6. 샘플 테마 데이터 넣기 (선택)

테마 목록과 상세 화면을 확인하려면 `sampleData/data/themes180.json`에 준비된 데이터를 DB에 넣을 수 있습니다.

**실행 전 준비**

[] 앞 단계의 DB 스키마 적용, `backend/.env` 설정과 백엔드 `npm install`을 완료
[] 현재 [importThemes.js](sampleData/importThemes.js)는 신규 테마의 등록자 ID를 'admin'로 지정하므로, 이를 참고
[] MySQL 서버 실행 상태

프로젝트 저장소 루트에서 아래 명령을 실행합니다.

```bash
cd sampleData
npm install
node importThemes.js
```

자동으로 themes 테이블에 샘플 데이터가 삽입됩니다.

## 검사 및 빌드

프론트엔드 폴더에서 실행합니다.

```bash
npm run lint
npm run build
npm run preview // 생성된 프론트엔드 빌드 확인
```

백엔드 공통 에러 핸들러 테스트는 `backend/`에서 실행합니다.

```bash
node --test --test-isolation=none tests/errorHandler.test.js
```

## API·예외 처리

- API 기본 경로는 `/api`입니다.
- 인증이 필요한 API는 `Authorization: Bearer <JWT>` 헤더를 사용합니다.
- 관리자 API는 인증 후 `ADMIN` 권한을 검사합니다.
- 공통 에러 미들웨어는 `{ "success": false, "data": null, "message": "오류 안내" }` 형식으로 응답합니다.
- 예상하지 못한 서버 오류는 내부 정보를 응답에 노출하지 않고 공통 메시지로 처리합니다.
- 프론트엔드에서 등록되지 않은 경로는 404 안내 페이지를 표시합니다.

## 프로젝트 문서

- [산출물 안내](docs/README.md)
- [DB 스키마](backend/db/schema.sql)

