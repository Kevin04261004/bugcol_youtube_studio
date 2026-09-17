# 버콜 스튜디오

A local-first Korean longform editor. Static browser application; no server upload or AI API connection.

## Workflow

1. Import UTF-8/EUC-KR TXT or paste text. Split via Korean Intl.Segmenter and line breaks.
2. Record each sentence with MediaRecorder. Decode/resample to 48 kHz mono PCM. Select regions, keep/delete, trim edge silence, append retakes, or import audio. One-step audio undo per sentence.
3. Export zero-padded numeric WAV files with manifest.json, script.txt and ASTRA_README.md in a ZIP.
4. Import scenes.json plus relative image/video assets in a ZIP, or numbered PNG/JPG/WebP/MP4/WebM files. JSON describes title/split/full pages with fade/slide/zoom animations, background and captions. Arbitrary HTML/JS is not executed. Complex animation must be provided as video.
5. Preview using the same canvas renderer used in export. Check each scene reviewed. Export H.264/AAC MP4 via WebCodecs and mp4-muxer at 720p or 1080p, 30fps. Clip source audio is excluded. Video shorter than narration holds its last frame. Captions are proportional pages, not forced-aligned words.

## Storage

IndexedDB stores one current project on this browser. Project ZIP backs up audio, scene descriptions, and assets and can restore on another device. Browser storage may be cleared; use explicit ZIP backups. Encoding is device-local. Desktop Chrome/Edge with AAC/H.264 WebCodecs is required for MP4; unsupported codecs display an explicit error. Where File System Access is available, encoding writes directly to disk; otherwise output uses memory, with a 700 MB estimated output limit. Imported archives are limited to 1 GB uncompressed; a single audio take is limited to 10 minutes.

## Implementation and validation

Static files are authored in dist and tracked, with local vendored fflate and mp4-muxer and their licenses. There is no build step. Optional Google Fonts gracefully fall back to system fonts.

Validated with Node: Korean sentence segmentation, audio edit/join sample counts, silence trimming, WAV headers/PCM, ZIP round-trip, scene validation, DOM bindings, local file references and JavaScript syntax. Actual microphone permissions, browser playback and MP4 hardware codec rendering have not been exercised in a browser in this session. Optional WebMCP tools are feature-detected; a permitted supported browser context was unavailable for WebMCP runtime validation.

Button initialization regression: `npm test` parses the complete module graph with esbuild and exercises sample creation, navigation, adding a sentence and WebMCP scene editing in a simulated DOM (canvas stubbed). This does not validate microphone hardware or video encoding.

DTS regression fix: PCM is packed into continuous 1024-sample blocks across sentence boundaries, with timestamps from a single sample counter. Encoder queues drain without intermediate flushes; audio/video flush only once at end. Timeline tests cover the 4.68s boundary, tiny clips, exact sample preservation and 30-minute monotonic timestamps. Hardware encoding remains unverified in this environment.

## Cloud work folders

The public editor now offers ChatGPT sign-in for private work folders. A Worker uses dispatch-authenticated user headers. R2 stores manifests under hashed user prefixes and media in verified SHA-256 chunks of at most 8 MiB. No project data is served anonymously. Folder updates use ETag preconditions to reject concurrent overwrites. The manifest is committed after all referenced chunks exist. IndexedDB is a device draft; the server folder is authoritative once linked. Initial device-only work must be uploaded through “현재 작업을 새 폴더로 저장”. Signed-in users can reopen that folder on another device. No full project ZIP is buffered on the Worker.

The primary import button supports multiple audio files and ZIPs. Numbered files map to sentence IDs; a single unnumbered file replaces the selected sentence. With no script, rows are created from filenames or the ZIP manifest. Batch decode is staged before replacing existing audio.

`npm test` includes simulated server storage tests for authorization, cross-user isolation, CSRF, chunk integrity, cloud round trips, ETag conflicts, and filename mapping. Live authentication on user devices has not been exercised here.
