# SaeroI-An FrontEnd

# 📱 Frontend Repository – Project Structure

본 레포지토리는 **Expo 기반 React Native 프론트엔드 코드**를 관리합니다.

---

## 🛠 Tech Stack

- **Framework**: React Native (Expo)
- **Language**: JavaScript
- **Internationalization**: react-i18next
- **State / Storage**: AsyncStorage

---

## 📁 Project Structure Overview

```bash
.
├── assets
├── src
│   ├── data
│   ├── i18n
│   ├── lib
│   ├── navigations
│   ├── screens
│   └── styles
├── App.js
├── app.json
└── .env

## 📦 Assets Directory (`assets/`)

앱 전반에서 사용하는 **정적 리소스**를 관리

### `flag/`
- 다국어 지원을 위한 국가 국기 아이콘
- 언어 선택 UI에 사용

### `icon/`
- 앱 내부 UI 아이콘 리소스

### `images/`
- 화면 구성에 사용되는 이미지
- 안내 이미지, 배너 등 UI 요소 포함

---

## 📂 Source Directory (`src/`)

실제 애플리케이션 로직과 UI가 구현된 **핵심 디렉토리**

### `src/data`
앱에서 사용하는 **정적 데이터 및 더미 데이터**를 관리

예:
- 언어 목록
- 선택지 데이터
- 초기 설정 값

---

### `src/i18n`
**다국어(i18n) 설정 관리**

- 언어별 번역 리소스
- i18n 초기화 로직
- 언어 변경 시 앱 전체에 즉시 반영

---

### `src/lib`
**공통 유틸리티 및 API 모듈** 관리

예:
- API 요청 함수
- 인증 토큰 관리
- 공통 헬퍼 함수

---

### `src/navigations`
앱의 **화면 이동 구조(Navigation)** 관리

- Stack / Tab Navigation 구성
- 화면 전환 흐름 중앙 관리

---

### `src/screens`
실제 **화면 단위 컴포넌트**

- 각 Screen은 하나의 기능 또는 페이지 담당
- 사용자 인터랙션 및 화면 로직 중심

---

### `src/styles`
**공통 스타일 관리** 담당

- 화면별 스타일 파일 분리
- 색상, 폰트, 레이아웃 일관성 유지

---

## 🚀 Entry Point

### `App.js`

애플리케이션의 **최상위 엔트리 포인트**

- Navigation 초기화
- i18n 설정 적용
- 전역 설정 관리
- 앱 전체 구조의 시작점

