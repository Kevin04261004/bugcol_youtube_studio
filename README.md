# 버콜 스튜디오

문장별 녹음·음성 가져오기·편집·장면 배치·MP4 렌더링을 지원하는 유튜브 롱폼 편집기입니다.

## 개발 시작

Node.js 22 이상을 설치한 뒤 실행하세요.

```sh
git clone https://github.com/Kevin04261004/bugcol_youtube_studio.git
cd bugcol_youtube_studio
npm ci
npm run dev
```

브라우저에서 http://localhost:5173 을 여세요. 로컬 서버는 편집 화면과 기기 내 저장을 지원합니다. 서버 작업 폴더와 ChatGPT 로그인은 기존 Sites 운영 환경에서만 동작합니다.

```sh
npm test
npm run build
```

## 수정할 파일

| 파일 | 역할 |
| --- | --- |
| `dist/index.html`, `dist/style.css` | 화면과 스타일 |
| `dist/app.js` | 녹음, 음성 가져오기, 편집, 미리보기, MP4 렌더링 |
| `dist/core.js` | 오디오 처리, 문장별 파일 매핑, 타임스탬프 |
| `dist/cloud.js` | 로그인, 서버 폴더, 자동 저장 |
| `server/worker.js` | 계정별 R2 저장 API |
| `scripts/` | 빌드, 로컬 실행, 회귀 테스트 |
| `.github/workflows/deploy.yml` | push 자동 배포 |

`dist`의 화면 파일은 직접 수정하는 원본입니다. `dist/server/index.js`는 빌드 결과이므로 직접 수정하지 말고 `npm run build`로 갱신하세요. 외부 라이브러리와 라이선스는 `dist/vendor`에 포함되어 있습니다.

## 주요 기능

- TXT 문장 분리와 문장별 녹음, 재녹음 이어 붙이기, 선택 구간 편집
- 음성 여러 개 또는 ZIP 가져오기: 숫자 파일명을 문장 번호에 매핑
- 문장별 숫자 WAV 파일과 편집 안내를 ZIP으로 내보내기
- 장면 파일 가져오기, 검수 후 WebCodecs H.264/AAC MP4 렌더링
- 장면 전환: 앞 장면을 깔아 둔 채 다음 장면이 그 위를 덮고, 슬라이드는 화면 끝에서 빠르게 출발해 천천히 닫힘
- IndexedDB 로컬 저장, 프로젝트 ZIP 백업과 복원
- 로그인 계정별 서버 작업 폴더와 자동 저장, 동시 수정 충돌 방지
- 작업 폴더 관리: 지금 작업을 새 폴더로 올리기, 다른 폴더 열기, 이름 바꾸기, 삭제, 빈 프로젝트로 시작

실제 마이크 및 MP4 코덱 지원은 브라우저/기기에 따라 다릅니다. 테스트는 DOM 상호작용, 오디오 타임라인, 서버 권한·저장·충돌 처리를 검사하며 실제 하드웨어 녹음과 인코딩을 대체하지 않습니다.

## 배포

### 화면을 고칠 때 — GitHub에 push하면 끝

`main`에 push하면 GitHub Actions가 테스트를 돌리고, **통과한 커밋만** `live` 브랜치로 올립니다. 운영 사이트의 Worker는 `live` 브랜치의 `dist`를 직접 읽어 화면을 내보내므로, 30초 안에 사이트에 반영됩니다. ChatGPT에 배포를 요청할 필요가 없습니다.

```sh
git add dist && git commit -m "문구 수정" && git push
```

반영 여부는 사이트의 `/api/version`에서 확인합니다.

```json
{"bundled":"21e42ad291e8","live":"9f31c0a4be77","source":"live"}
```

- `live` — 지금 사이트가 실제로 내보내는 버전(= `live` 브랜치의 `dist/build-id.txt`)
- `bundled` — Worker 안에 내장된 예비 사본의 버전
- `source` — `live`면 저장소에서 읽고 있고, `bundled`면 예비 사본으로 돌아간 상태

테스트가 실패하면 `live` 브랜치가 갱신되지 않으므로 사이트는 마지막으로 정상이던 버전을 계속 내보냅니다. GitHub에서 읽지 못하는 상황(장애·삭제·비공개 전환)에서도 Worker에 내장된 예비 사본으로 자동 전환되어 사이트가 멈추지 않습니다.

`dist` 아래에 새 파일을 추가해도 그대로 배포됩니다. 다만 `server/`, `.openai/`, 그 외 확장자(`.txt`, `.md` 등)는 내보내지 않습니다.

### 서버를 고칠 때 — ChatGPT에 한 번 요청

`server/worker.js`(로그인·저장 API)를 고쳤을 때만 ChatGPT Sites에 배포를 요청해야 합니다. 배포가 아직 안 된 서버에서는 편집기가 `/api/version` 응답으로 기능 유무를 확인해, 쓸 수 없는 기능(예: 폴더 삭제)의 버튼을 아예 내보내지 않습니다. ChatGPT Sites는 채팅 밖에서 배포할 방법을 제공하지 않습니다(배포용 API·CLI·GitHub 연동 없음). 배포 전에 `npm test`를 실행해 `dist/server/index.js`와 `dist/build-id.txt`를 함께 커밋하세요.

임시로 저장소를 읽지 않고 내장 사본만 쓰려면 Worker 환경 변수 `LIVE_SOURCE`를 `off`로 두고, 다른 저장소·브랜치를 보게 하려면 해당 raw 주소를 넣습니다. 값이 없으면 `live` 브랜치를 읽습니다.

### 운영 환경

현재 운영 사이트: https://burcol-longform-studio.kdystudy0426.chatgpt.site

서버는 Sites가 검증해서 전달하는 사용자 인증 헤더와 `BUCKET` R2 바인딩을 사용합니다. 다른 호스팅으로 이전하려면 인증 검증 계층과 저장소를 함께 구현해야 합니다. 현재 Worker를 외부에서 임의 인증 헤더를 받을 수 있는 상태로 공개하면 안 됩니다. GitHub Pages만으로는 서버 폴더 기능을 실행할 수 없습니다. Sites 배포 정보는 `.openai/hosting.json`에 있습니다.

폴더를 삭제해도 녹음·이미지 조각은 R2에 남습니다. 같은 내용은 해시로 공유되기 때문에, 함께 지우면 그 조각을 쓰는 다른 폴더가 깨집니다.

개인 녹음·대본·이미지와 서버 작업 폴더 데이터는 이 공개 저장소에 포함하지 않았습니다. 기존 서비스에 유지됩니다. 사용자 작업을 옮길 때는 편집기의 프로젝트 ZIP 내보내기/가져오기를 사용하세요.

## 기존 수정 이력

이 저장소는 최신 전체 코드에서 버전 관리를 시작합니다. 원본 Git 이력 묶음은 공개 업로드의 자동 승인 검토에서 차단되어 포함하지 않았습니다.

이전 변경 요약:
- 문장별 녹음·롱폼 편집기 최초 구현
- 버튼 초기화를 막던 JavaScript 구문 오류 수정
- 문장 경계에서 MP4 DTS가 역행하지 않도록 연속 오디오 타임라인 적용
- 다중 음성 가져오기, 계정별 서버 작업 폴더, 충돌 방지 자동 저장 추가

당시 구현 기록은 `history/IMPLEMENTATION.md`에 보존되어 있습니다.
