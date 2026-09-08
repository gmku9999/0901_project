# 디자인 가이드

## 1. 색상 (라이트 모드 기준)
| 용도 | 변수명 | 색상(예시) |
|---|---|---|
| 배경(기본) | --color-bg | #ffffff |
| 배경(보조 섹션) | --color-bg-alt | #f5f6f8 |
| 텍스트(기본) | --color-text | #1a1a1a |
| 텍스트(보조) | --color-text-muted | #6b7280 |
| 포인트 색상 | --color-primary | #2563eb |
| 포인트 색상(hover) | --color-primary-dark | #1e40af |
| 테두리/구분선 | --color-border | #e5e7eb |

## 2. 다크모드 색상
| 용도 | 변수명 | 색상(예시) |
|---|---|---|
| 배경(기본) | --color-bg | #0f172a |
| 배경(보조 섹션) | --color-bg-alt | #1e293b |
| 텍스트(기본) | --color-text | #f1f5f9 |
| 텍스트(보조) | --color-text-muted | #94a3b8 |
| 포인트 색상 | --color-primary | #60a5fa |

> 실제 색상은 개인 취향/브랜드에 맞춰 자유롭게 변경. CSS 변수(`variables.css`)로 관리하여 손쉽게 테마 전환.

## 3. 타이포그래피
- 기본 폰트: 시스템 폰트 스택 또는 Google Fonts (예: 'Pretendard', 'Noto Sans KR')
- 제목(h1): 2.5rem ~ 3rem, bold
- 부제목(h2): 1.75rem ~ 2rem, semibold
- 본문: 1rem, line-height 1.6

## 4. 레이아웃 원칙
- 최대 콘텐츠 너비: 1200px, 좌우 여백은 auto
- 섹션 간 여백: 최소 4rem 이상 (숨 쉴 공간 확보)
- 그리드: Flexbox/CSS Grid 활용, 카드형 컴포넌트는 auto-fit 그리드 권장

## 5. 반응형 브레이크포인트
| 구간 | 너비 |
|---|---|
| 모바일 | ~480px |
| 태블릿 | 481px ~ 768px |
| 데스크톱 | 769px ~ |

## 6. 톤앤매너
- 미니멀하고 깔끔한 스타일, 과도한 그림자/효과 지양
- 호버/포커스 시 자연스러운 transition (0.2s ~ 0.3s ease)
- 아이콘은 통일된 세트 사용 (예: 하나의 아이콘 라이브러리 또는 직접 제작한 SVG)
