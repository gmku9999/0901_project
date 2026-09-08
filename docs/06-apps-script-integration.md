# Google Apps Script 연동 (회원가입/로그인/게시글)

## 1. 개요

백엔드 서버 없이, 회원/게시글 데이터를 Google 스프레드시트에 저장하기 위해
Google Apps Script를 간이 API 서버로 사용합니다.

- 스프레드시트: `https://docs.google.com/spreadsheets/d/1xnUJ9PLrSwA7moqEDG4T4p3hod_BzsZUzHT4VFntQaE/edit`
- Apps Script 프로젝트: `https://script.google.com/d/1tkOnRXiuB8VtNyeanMDC7Ud6ChwuaCk0cE8A2FaIA4SxnNMQhs_eCy7x/edit`
- 소스 코드: [`apps-script/Code.gs`](../apps-script/Code.gs) (Apps Script 편집기에 그대로 붙여넣는 원본)

회원가입/로그인과 게시글 작성/목록/상세/수정/삭제가 모두 이 스프레드시트를 통해 이뤄집니다.
브라우저의 localStorage에는 로그인 세션(누가 로그인했는지)만 남고, 실제 데이터는 시트에 저장됩니다.

## 2. 시트 구조

Apps Script가 처음 실행될 때 아래 두 시트를 자동으로 만들고 헤더를 채웁니다. (직접 만들 필요 없음)

**Users**

| username | name | email | password | joinedAt |
|---|---|---|---|---|

**Posts**

| id | title | content | authorUsername | authorName | createdAt |
|---|---|---|---|---|---|

> ⚠️ 비밀번호가 평문으로 저장됩니다. 실제 서비스가 아닌 학습/데모 목적에서만 이 구조를 사용하세요.
> 게시글 수정/삭제는 요청에 담긴 `authorUsername`이 시트에 저장된 작성자와 일치할 때만 허용되지만,
> 이는 진짜 인증이 아니라 최소한의 확인일 뿐입니다.

## 3. 배포 방법

1. 위 Apps Script 프로젝트 링크를 엽니다.
2. 기본 생성돼 있는 `Code.gs` 내용을 모두 지우고, 이 저장소의 `apps-script/Code.gs` 내용을 그대로 붙여넣습니다.
3. 저장(Ctrl+S)합니다.
4. 우측 상단 **배포(Deploy) → 새 배포(New deployment)** 클릭
5. 유형 선택(톱니바퀴 아이콘) → **웹 앱(Web app)** 선택
6. 다음과 같이 설정합니다.
   - 실행 사용자(Execute as): **나(Me)**
   - 액세스 권한(Who has access): **전체(Anyone)**
7. **배포** 클릭 → 처음 배포 시 권한 승인 화면이 나오면 본인 계정으로 승인합니다.
8. 배포가 끝나면 나오는 **웹 앱 URL**(`https://script.google.com/macros/s/.../exec` 형태)을 복사합니다.

## 4. 프론트엔드에 연결

복사한 URL을 `js/config.js`의 `API_BASE_URL` 값에 붙여넣습니다.

```js
const API_BASE_URL = "https://script.google.com/macros/s/여기에_배포_URL을_붙여넣으세요/exec";
```

## 5. 동작 확인

1. 배포된 URL을 브라우저 주소창에 직접 붙여넣어 열었을 때
   `{"success":true,"message":"블로그 Apps Script API가 정상 동작 중입니다."}` 형태의 응답이 보이면
   배포가 정상입니다.
2. `signup.html`에서 회원가입을 진행하면 스프레드시트의 `Users` 시트에 새 행이 추가됩니다.
3. 방금 가입한 아이디/비밀번호로 `login.html`에서 로그인이 되는지 확인합니다.
4. 로그인 후 `profile.html`에서 이름/아이디/이메일/가입일이 올바르게 표시되는지 확인합니다.
5. 로그인한 상태에서 `write.html`로 게시글을 작성하면 `Posts` 시트에 새 행이 추가되고,
   `index.html` 목록과 `post.html` 상세 페이지에서 바로 보이는지 확인합니다.
6. 본인 글의 상세 페이지에서 "수정"/"삭제" 버튼이 보이는지, 실제로 동작하는지 확인합니다.
   (다른 계정으로 로그인했을 때는 이 버튼들이 보이지 않아야 합니다.)

## 6. 코드가 수정되면

`apps-script/Code.gs` 내용을 수정한 뒤에는, Apps Script 편집기에서도 같은 내용으로 코드를
교체하고 **배포 → 배포 관리(Manage deployments) → 수정(Edit) → 새 버전(New version) → 배포**를
눌러야 실제 웹 앱에 반영됩니다. (코드만 저장하고 새 버전으로 배포하지 않으면 이전 코드가 계속 실행됩니다.)
