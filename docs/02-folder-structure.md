# 폴더 및 파일 구조

## frontend 폴더 구조 (예정)
```
frontend/
├── index.html
├── css/
│   ├── reset.css        # 브라우저 기본 스타일 초기화
│   ├── variables.css     # 색상/폰트/간격 등 CSS 변수
│   ├── style.css         # 공통 레이아웃 및 섹션별 스타일
│   └── responsive.css     # 미디어 쿼리 (반응형)
├── js/
│   ├── main.js            # 초기화 및 이벤트 바인딩
│   ├── navigation.js       # 메뉴, 스무스 스크롤, 스크롤 하이라이트
│   ├── theme.js            # 다크모드 토글
│   ├── animation.js        # 타이핑 효과, 스크롤 페이드인
│   └── contact-form.js      # 폼 유효성 검사
├── assets/
│   ├── images/             # 프로필 사진, 프로젝트 썸네일
│   └── icons/               # SVG/아이콘 파일
└── README.md
```

## docs 폴더 구조
```
docs/
├── 01-requirements.md      # 요구사항 정의서
├── 02-folder-structure.md   # 폴더/파일 구조 (본 문서)
├── 03-content-outline.md     # 섹션별 실제 들어갈 콘텐츠 초안
├── 04-design-guide.md         # 색상, 폰트, 톤앤매너 가이드
└── 05-checklist.md             # 개발 체크리스트
```

## 명명 규칙
- 파일/폴더명: 소문자 + 하이픈(-) 사용 (예: `contact-form.js`)
- CSS 클래스명: BEM 스타일 권장 (예: `.project-card`, `.project-card__title`)
- JS 변수/함수명: camelCase 사용
