# 골든래빗 일정 대시보드

2025년 12월 골든래빗 일정 스프레드시트를 읽기 전용 대시보드로 표시합니다.

## 시작하기

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## Google Sheets 연동 (CSV 게시)

1. [일정 스프레드시트](https://docs.google.com/spreadsheets/d/1jpxH-LKFzC8SBFOtC6RNIrWWOpoBqoHd/edit?gid=1654763778)를 엽니다.
2. **파일 → 공유 → 웹에 게시**에서 시트를 **CSV** 형식으로 게시합니다.
3. `.env.local`에 게시 URL을 설정합니다.

```env
GOOGLE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/1jpxH-LKFzC8SBFOtC6RNIrWWOpoBqoHd/export?format=csv&gid=1654763778
```

환경 변수가 없거나 게시 URL이 동작하지 않으면, 앱은 내장 샘플 데이터로 동작합니다.

## 기능

- 월 캘린더(2025년 12월) + 날짜별 타임라인
- 날짜별 아젠다 목록
- 부서·완료 상태·검색 필터
- 일정 상세 Sheet

## 스택

- Next.js (App Router)
- shadcn/ui (preset b0)
- date-fns, papaparse
