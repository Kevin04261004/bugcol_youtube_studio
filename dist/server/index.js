// <define:STATIC_FILES>
var define_STATIC_FILES_default = { "/index.html": { body: `<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>\uBC84\uCF5C \uC2A4\uD29C\uB514\uC624 \xB7 Longform workshop</title><meta name="description" content="\uB300\uBCF8\uC744 \uBB38\uC7A5\uBCC4\uB85C \uB179\uC74C\uD558\uACE0, \uC7A5\uBA74\uC744 \uC5F0\uACB0\uD574 \uB871\uD3FC \uC601\uC0C1\uC73C\uB85C \uC644\uC131\uD558\uB294 \uC791\uC5C5\uC2E4."><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='10' fill='%237b52ed'/%3E%3Cpath d='M12 12v16M20 8v24M28 15v10' stroke='white' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E"><link rel="stylesheet" href="style.css"></head><body>
<aside class="rail"><a class="brand" href="./"><span class="logo">\u25A5</span><span>\uBC84\uCF5C<span class="brand-small">STUDIO</span></span></a><span class="rail-label">WORKSPACE</span><button class="nav active" data-tab="record">\u25C9 <span>\uB300\uBCF8 & \uB179\uC74C</span></button><button class="nav" data-tab="scenes">\u25A7 <span>\uC7A5\uBA74 & \uD3B8\uC9D1</span></button><button class="nav" data-tab="export">\u2197 <span>\uAC80\uC218 & \uB0B4\uBCF4\uB0B4\uAE30</span></button><div class="rail-bottom"><button id="guideBtn">? \uC0AC\uC6A9 \uAC00\uC774\uB4DC</button><div class="avatar">B</div><span>\uBC84\uCF5C\uC758 \uC791\uC5C5\uC2E4<small>LONGFORM CREATOR</small></span></div></aside>
<div class="shell"><header><div class="breadcrumbs">\uC791\uC5C5\uC2E4 <span>/</span> <input id="projectName" aria-label="\uD504\uB85C\uC81D\uD2B8 \uC774\uB984" value="\uC0C8\uB85C\uC6B4 \uB871\uD3FC"></div><div class="header-actions"><button id="foldersBtn">\u25A3 \uC791\uC5C5 \uD3F4\uB354</button><span id="saveState">\uC774 \uAE30\uAE30\uC5D0 \uC800\uC7A5</span><button id="saveProject">\u2193 \uD504\uB85C\uC81D\uD2B8 \uC800\uC7A5</button><button id="openProject">\uD504\uB85C\uC81D\uD2B8 \uC5F4\uAE30</button><button class="primary" id="goExport">\uB0B4\uBCF4\uB0B4\uAE30 \u2197</button></div></header>
<main><div class="page-heading"><div><p class="eyebrow">YOUR STORY, ONE SENTENCE AT A TIME</p><h1 id="pageTitle">\uC88B\uC740 \uC774\uC57C\uAE30\uB294, \uD55C \uBB38\uC7A5\uBD80\uD130.</h1><p id="pageSubtitle">\uB300\uBCF8\uC744 \uC62C\uB9AC\uACE0, \uD55C \uBB38\uC7A5\uC529 \uD3B8\uC548\uD558\uAC8C \uB179\uC74C\uD558\uC138\uC694.</p></div><div class="project-stat"><b id="completedCount">00</b><span> / <span id="totalCount">00</span><small>\uBB38\uC7A5 \uB179\uC74C \uC644\uB8CC</small></span></div></div>
<div class="steps"><button data-tab="record" class="active"><span>01</span> \uB300\uBCF8 & \uB179\uC74C</button><i></i><button data-tab="scenes"><span>02</span> \uC7A5\uBA74 & \uD3B8\uC9D1</button><i></i><button data-tab="export"><span>03</span> \uAC80\uC218 & \uB0B4\uBCF4\uB0B4\uAE30</button><small id="totalDuration">\uCD1D 00:00</small></div>
<section id="recordView" class="view"><div class="record-layout"><section class="panel script-panel"><div class="panel-heading"><h2>\uB300\uBCF8 <span id="scriptCount" class="badge">0</span></h2><button id="uploadTxt" class="text-btn">\uFF0B TXT \uAC00\uC838\uC624\uAE30</button></div><div class="script-tools"><button id="importAudioBatch" class="primary">\uFF0B \uC74C\uC131 \uAC00\uC838\uC624\uAE30</button><button id="pasteBtn">\uC9C1\uC811 \uC785\uB825</button><button id="sampleBtn">\uC0D8\uD50C\uB85C \uC2DC\uC791</button></div><div id="sentenceList" class="sentence-list"></div><div class="script-footer"><span>\uBB38\uC7A5 \uBC88\uD638\uB294 \uC7A5\uBA74\uACFC \uC790\uB3D9 \uC5F0\uACB0\uB429\uB2C8\uB2E4.</span><button id="addSentence" aria-label="\uBB38\uC7A5 \uCD94\uAC00">\uFF0B</button></div></section>
<div class="record-main"><section class="panel recorder-panel"><div class="panel-heading"><span class="eyebrow purple">RECORDING ROOM</span><span id="recordBadge" class="status">\uB179\uC74C \uC900\uBE44</span></div><div class="sentence-position"><span id="currentNumber">01</span><span id="sentencePosition">\uBB38\uC7A5\uC744 \uC120\uD0DD\uD558\uC138\uC694</span></div><textarea id="sentenceText" placeholder="\uC67C\uCABD\uC5D0\uC11C TXT \uB300\uBCF8\uC744 \uAC00\uC838\uC624\uAC70\uB098 \uC9C1\uC811 \uC785\uB825\uD558\uC138\uC694." aria-label="\uD604\uC7AC \uBB38\uC7A5"></textarea><div class="recorder-bottom"><span id="recordHint">\uB9C8\uC774\uD06C\uB97C \uCF1C\uACE0 \uC774\uC57C\uAE30\uB97C \uC2DC\uC791\uD574 \uBCF4\uC138\uC694.</span><div class="record-clock" id="recordClock">00:00.0</div><canvas id="waveform" width="1200" height="150" aria-label="\uC624\uB514\uC624 \uD30C\uD615"></canvas><div class="range-row"><label>\uC2DC\uC791 <input id="cutStart" type="number" min="0" step="0.01" value="0"> \uCD08</label><label>\uB05D <input id="cutEnd" type="number" min="0" step="0.01" value="0"> \uCD08</label><span id="audioDuration">\uB179\uC74C \uC5C6\uC74C</span></div><div class="transport"><button id="prevSentence" class="round" aria-label="\uC774\uC804 \uBB38\uC7A5">\u276E</button><button id="playAudio" class="round" aria-label="\uC120\uD0DD \uAD6C\uAC04 \uB4E3\uAE30">\u25B7</button><button id="recordBtn" class="record-button"><span class="rec-dot"></span> \uB179\uC74C \uC2DC\uC791</button><button id="nextSentence" class="round" aria-label="\uB2E4\uC74C \uBB38\uC7A5">\u276F</button></div><label class="append-option"><input id="appendRecording" type="checkbox"> \uAE30\uC874 \uB179\uC74C \uB4A4\uC5D0 \uC774\uC5B4 \uB179\uC74C</label></div></section>
<section class="panel edit-panel"><div><span class="edit-icon">\u2702</span><h3>\uB9D0\uC774 \uAF2C\uC5EC\uB3C4 \uAD1C\uCC2E\uC544\uC694.<small>\uD30C\uD615\uC744 \uB4DC\uB798\uADF8\uD574 \uC218\uC815\uD560 \uAD6C\uAC04\uC744 \uC120\uD0DD\uD558\uC138\uC694.</small></h3></div><div class="edit-actions"><button id="keepRange">\uC120\uD0DD\uB9CC \uB0A8\uAE30\uAE30</button><button id="deleteRange">\uC120\uD0DD \uAD6C\uAC04 \uC0AD\uC81C</button><button id="trimSilence">\uC55E\uB4A4 \uBB34\uC74C \uC815\uB9AC</button><button id="undoAudio">\u21B6 \uC2E4\uD589 \uCDE8\uC18C</button><button id="importAudio">\uC74C\uC131 \uAC00\uC838\uC624\uAE30</button></div></section><div class="next-callout"><div><span class="purple">\u2197</span><p>Astra\uC640 \uB2E4\uC74C \uC7A5\uBA74 \uB9CC\uB4E4\uAE30<small>\uB179\uC74C\uACFC \uB300\uC0AC\uB97C \uBB36\uC5B4 \uBCF4\uB0B4\uBA74, \uC774\uC57C\uAE30\uC5D0 \uB9DE\uB294 \uC7A5\uBA74\uC744 \uB9CC\uB4E4 \uC218 \uC788\uC5B4\uC694.</small></p></div><button id="exportAudio">\uB179\uC74C ZIP \uB2E4\uC6B4\uB85C\uB4DC \u2193</button></div></div></div></section>
<section id="scenesView" class="view" hidden><div class="scene-toolbar"><div><h2>\uBAA9\uC18C\uB9AC \uC704\uC5D0, \uC7A5\uBA74\uC744 \uB354\uD558\uC138\uC694.</h2><p>\uC7A5\uBA74 ZIP \uB610\uB294 \uC22B\uC790 \uC774\uB984\uC758 \uC774\uBBF8\uC9C0\xB7\uC601\uC0C1\uC744 \uAC00\uC838\uC624\uBA74 \uBB38\uC7A5 \uBC88\uD638\uC5D0 \uB9DE\uCDB0 \uC5F0\uACB0\uB429\uB2C8\uB2E4.</p></div><button id="importScenes" class="primary">\uFF0B \uC7A5\uBA74 \uAC00\uC838\uC624\uAE30</button><button id="cutVideoBtn">\u2702 \uC601\uC0C1 \uC790\uB974\uAE30</button><button id="sceneTemplate">\uC7A5\uBA74 \uADDC\uACA9 \uB2E4\uC6B4\uB85C\uB4DC</button></div><div class="scene-layout"><section class="panel preview-panel"><canvas id="preview" width="1280" height="720"></canvas><div class="preview-controls"><button id="previewPlay">\u25B6 \uC804\uCCB4 \uBBF8\uB9AC\uBCF4\uAE30</button><button id="previewStop">\u25A0 \uC815\uC9C0</button><span id="previewTime">00:00 / 00:00</span><span class="badge">16:9 \xB7 30 FPS</span></div></section><section class="panel inspector"><h2>\uC7A5\uBA74 \uC124\uC815 <span id="sceneNumber" class="badge">001</span></h2><label class="check-label"><input id="sceneContinue" type="checkbox"> \uC55E \uBB38\uC7A5 \uC7A5\uBA74 \uC774\uC5B4\uAC00\uAE30</label><p id="continueNote" class="clip-note" hidden>\uC55E \uBB38\uC7A5\uC758 \uC7A5\uBA74\uC744 \uB04A\uC9C0 \uC54A\uACE0 \uADF8\uB300\uB85C \uC774\uC5B4\uC11C \uBCF4\uC5EC\uC90D\uB2C8\uB2E4. \uC601\uC0C1\uB3C4 \uC774\uC5B4\uC11C \uC7AC\uC0DD\uB418\uACE0, \uD558\uB2E8 \uC790\uB9C9\uB9CC \uC774 \uBB38\uC7A5 \uB300\uC0AC\uB85C \uBC14\uB01D\uB2C8\uB2E4.</p><label>\uC7A5\uBA74 \uC81C\uBAA9<input id="sceneTitle" placeholder="\uB300\uC0AC\uC5D0\uC11C \uC790\uB3D9\uC73C\uB85C \uAC00\uC838\uC635\uB2C8\uB2E4"></label><label>\uBCF4\uC870 \uBB38\uAD6C<textarea id="sceneSubtitle" rows="3" placeholder="\uC120\uD0DD \uC0AC\uD56D"></textarea></label><label>\uD654\uBA74 \uAD6C\uC131<select id="sceneLayout"><option value="title">\uD0C0\uC774\uD2C0 \uD398\uC774\uC9C0</option><option value="split">\uC774\uBBF8\uC9C0 + \uD14D\uC2A4\uD2B8</option><option value="full">\uC804\uCCB4 \uC774\uBBF8\uC9C0 / \uC601\uC0C1</option></select></label><label>\uC6C0\uC9C1\uC784<select id="sceneMotion"><option value="fade">\uD398\uC774\uB4DC \uC778</option><option value="zoom">\uCC9C\uCC9C\uD788 \uD655\uB300</option><option value="slide">\uC2AC\uB77C\uC774\uB4DC \uC778</option><option value="none">\uC5C6\uC74C</option></select></label><label>\uBC30\uACBD\uC0C9<input id="sceneColor" type="color" value="#171925"></label><label class="check-label"><input id="sceneCaptions" type="checkbox" checked> \uD558\uB2E8 \uB300\uC0AC \uD45C\uC2DC</label><label class="check-label"><input id="sceneReviewed" type="checkbox"> \uC774 \uC7A5\uBA74 \uAC80\uC218 \uC644\uB8CC</label><button id="replaceAsset">\uC774\uBBF8\uC9C0 / \uC601\uC0C1 \uBC14\uAFB8\uAE30</button><div id="clipRow" class="clip-row" hidden><h3>\uC601\uC0C1\uC5D0\uC11C \uC4F8 \uAD6C\uAC04<small>\uC6D0\uD558\uB294 \uC9C0\uC810\uC744 \uCC3E\uC544 \uC2DC\uC791\uACFC \uB05D\uC744 \uC815\uD558\uC138\uC694.</small></h3><video id="clipVideo" muted playsinline preload="metadata"></video><input id="clipScrub" type="range" min="0" max="1" step="0.001" value="0" aria-label="\uC601\uC0C1 \uC704\uCE58"><div class="clip-times"><label>\uC2DC\uC791 <input id="clipStart" type="number" min="0" step="0.05" value="0"> \uCD08</label><label>\uB05D <input id="clipEnd" type="number" min="0" step="0.05" value="0"> \uCD08</label></div><div class="clip-actions"><button id="clipSetStart">\uC5EC\uAE30\uB97C \uC2DC\uC791\uC73C\uB85C</button><button id="clipSetEnd">\uC5EC\uAE30\uB97C \uB05D\uC73C\uB85C</button><button id="clipPlay">\u25B7 \uAD6C\uAC04 \uC7AC\uC0DD</button><button id="clipReset">\uC804\uCCB4 \uC0AC\uC6A9</button></div><p id="clipNote" class="clip-note"></p></div></section></div><section class="panel timeline-panel"><div class="panel-heading"><h2>\uBB38\uC7A5 \uD0C0\uC784\uB77C\uC778</h2><span>\uAC01 \uC7A5\uBA74\uC758 \uAE38\uC774 = \uB179\uC74C \uAE38\uC774</span></div><div id="timeline"></div></section></section>
<section id="exportView" class="view" hidden><div class="export-layout"><section class="panel export-panel"><span class="eyebrow purple">THE FINAL CUT</span><h2>\uC774\uC81C, \uC601\uC0C1\uC73C\uB85C \uC644\uC131\uD560 \uC2DC\uAC04.</h2><p>\uC7A5\uBA74\uC744 \uD655\uC778\uD558\uACE0 \uD558\uB098\uC758 \uB871\uD3FC\uC73C\uB85C \uB0B4\uBCF4\uB0B4\uC138\uC694.</p><div id="exportChecklist"></div><label>\uC601\uC0C1 \uD574\uC0C1\uB3C4<select id="resolution"><option value="1280">HD \xB7 1280 \xD7 720</option><option value="1920">Full HD \xB7 1920 \xD7 1080</option></select></label><p class="muted">MP4\uB294 H.264 / AAC \uC9C0\uC6D0 \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C \uCD9C\uB825\uB429\uB2C8\uB2E4. \uB179\uC74C\uACFC \uC7A5\uBA74\uC740 \uAE30\uAE30 \uC548\uC5D0\uC11C \uCC98\uB9AC\uB429\uB2C8\uB2E4. \uAE34 \uC601\uC0C1\uC740 PC Chrome\xB7Edge\uC5D0\uC11C \uC791\uC5C5\uD558\uC138\uC694.</p><button class="primary export-big" id="renderMp4">MP4 \uB80C\uB354\uB9C1 \uC2DC\uC791 \u2197</button><button id="cancelRender" hidden>\uB80C\uB354\uB9C1 \uCDE8\uC18C</button><progress id="renderProgress" value="0" max="1" hidden></progress><p id="renderStatus" role="status"></p></section><section class="panel handoff-panel"><div class="handoff-symbol">\u2197</div><h2>Astra\uC640 \uC774\uC5B4\uC11C \uC791\uC5C5\uD558\uAE30</h2><ol><li><b>\uB179\uC74C ZIP\uC744 \uB2E4\uC6B4\uB85C\uB4DC\uD558\uC138\uC694.</b><p>001.wav, 002.wav\u2026\uC640 \uB300\uC0AC\xB7\uAE38\uC774 \uC815\uBCF4\uAC00 \uD568\uAED8 \uB2F4\uAE41\uB2C8\uB2E4.</p></li><li><b>Astra\uC5D0\uAC8C ZIP\uC744 \uC804\uB2EC\uD558\uC138\uC694.</b><p>\uD568\uAED8 \uB4E4\uC5B4 \uC788\uB294 ASTRA_README.md\uC758 \uADDC\uACA9\uB300\uB85C \uC7A5\uBA74 \uD328\uD0A4\uC9C0\uB97C \uC81C\uC791\uD574 \uB2EC\uB77C\uACE0 \uC694\uCCAD\uD558\uC138\uC694.</p></li><li><b>\uC7A5\uBA74 ZIP\uC744 \uB2E4\uC2DC \uAC00\uC838\uC624\uC138\uC694.</b><p>\uBB38\uC7A5 \uBC88\uD638\uB85C \uC790\uB3D9 \uC5F0\uACB0\uB429\uB2C8\uB2E4. \uBBF8\uB9AC\uBCF4\uAE30\uC640 \uAC80\uC218\uB97C \uB9C8\uCE58\uBA74 MP4\uB85C \uCD9C\uB825\uD558\uC138\uC694.</p></li></ol><button id="exportAudio2">\uB179\uC74C ZIP \uB2E4\uC6B4\uB85C\uB4DC \u2193</button><button id="backupBtn">\uC804\uCCB4 \uD504\uB85C\uC81D\uD2B8 \uBC31\uC5C5 \u2193</button></section></div></section>
<div class="cloud-strip"><span id="cloudStatus">\uC11C\uBC84 \uC5F0\uACB0 \uD655\uC778 \uC911\u2026</span><button id="saveCloud">\uC11C\uBC84\uC5D0 \uC9C0\uAE08 \uC800\uC7A5</button></div><footer>BURCOL STUDIO <span>\uC791\uC740 \uBB38\uC7A5\uB4E4\uC774 \uBAA8\uC5EC, \uD558\uB098\uC758 \uC774\uC57C\uAE30\uAC00 \uB429\uB2C8\uB2E4.</span><span id="localNote">\uC791\uC5C5 \uD3F4\uB354 \uC5F0\uACB0 \uD6C4 \uC11C\uBC84 \uC790\uB3D9 \uC800\uC7A5</span></footer></main></div>
<dialog id="folderDialog"><div class="panel-heading"><h2>\uB0B4 \uC791\uC5C5 \uD3F4\uB354</h2><button id="closeFolders">\u2715</button></div><p id="cloudAccount"></p><div id="cloudSignedOut"><p>\uC11C\uBC84 \uC791\uC5C5 \uD3F4\uB354\uC5D0 \uC800\uC7A5\uD558\uBA74 \uB179\uC74C\xB7\uB300\uBCF8\xB7\uC7A5\uBA74\uC774 \uACC4\uC815\uC5D0 \uBCF4\uAD00\uB429\uB2C8\uB2E4. \uB2E4\uB978 \uAE30\uAE30\uC5D0\uC11C \uAC19\uC740 \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778\uD574 \uC774\uC5B4\uC11C \uC791\uC5C5\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p><a id="cloudSignIn" class="signin-button" href="/signin-with-chatgpt?return_to=%2F%3Ffolders%3D1" target="_top">ChatGPT\uB85C \uB85C\uADF8\uC778</a><p class="muted-note">\uB85C\uADF8\uC778\uD558\uC9C0 \uC54A\uC544\uB3C4 \uB179\uC74C\uACFC \uD3B8\uC9D1\uC740 \uC774 \uAE30\uAE30\uC5D0 \uADF8\uB300\uB85C \uC800\uC7A5\uB429\uB2C8\uB2E4. \uAE30\uAE30\uB97C \uC62E\uAE38 \uB54C\uB294 \u2018\uC804\uCCB4 \uD504\uB85C\uC81D\uD2B8 \uBC31\uC5C5 \u2193\u2019\uC73C\uB85C ZIP\uC744 \uB0B4\uB824\uBC1B\uC73C\uC138\uC694.</p></div><div id="cloudActions" hidden><p id="currentFolder" class="current-folder"></p><div class="folder-new"><label>\uC0C8 \uD3F4\uB354 \uC774\uB984<input id="newFolderName" placeholder="\uC608: \uBB34\uBAA8\uD55C \uB3C4\uC804 1\uD654" maxlength="200"></label><button id="newCloudFolder" class="primary">\uC9C0\uAE08 \uC791\uC5C5\uC744 \uC0C8 \uD3F4\uB354\uB85C \uC800\uC7A5 \u2191</button></div><p id="folderStatus" class="folder-status" role="status" hidden></p><div class="panel-heading"><h2>\uC800\uC7A5\uB41C \uD3F4\uB354</h2><button id="refreshFolders" class="text-btn">\uC0C8\uB85C\uACE0\uCE68</button></div><div id="folderList"></div><button id="moreFolders" hidden>\uB354 \uBCF4\uAE30</button><div class="dialog-actions"><button id="newProject">\uBE48 \uD504\uB85C\uC81D\uD2B8\uB85C \uC2DC\uC791</button></div></div></dialog><dialog id="cutDialog"><div class="panel-heading"><h2>\uC601\uC0C1 \uC790\uB974\uAE30</h2><button id="closeCut">\u2715</button></div><p>\uAE34 \uC601\uC0C1\uC5D0\uC11C \uD544\uC694\uD55C \uAD6C\uAC04\uB9CC \uC798\uB77C \uB450\uACE0 \uC7A5\uBA74\uC5D0 \uB123\uC2B5\uB2C8\uB2E4. \uC6D0\uBCF8\uC740 \uD504\uB85C\uC81D\uD2B8\uC5D0 \uC800\uC7A5\uB418\uC9C0 \uC54A\uACE0, \uC798\uB77C \uB0B8 \uC870\uAC01\uB9CC \uB0A8\uC2B5\uB2C8\uB2E4.</p><div class="cut-open"><button id="openSource" class="primary">\uC6D0\uBCF8 \uC601\uC0C1 \uC5F4\uAE30</button><span id="sourceName">\uC5F4\uB9B0 \uC6D0\uBCF8\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</span></div><div id="cutBody" hidden><video id="srcVideo" playsinline preload="metadata"></video><input id="srcScrub" type="range" min="0" max="1" step="0.0002" value="0" aria-label="\uC6D0\uBCF8 \uC601\uC0C1 \uC704\uCE58"><p class="cut-clock"><b id="srcNow">00:00.0</b> <span id="srcTotal">/ 00:00</span></p><div class="clip-times"><label>\uC2DC\uC791 <input id="srcStart" type="number" min="0" step="0.05" value="0"> \uCD08</label><label>\uB05D <input id="srcEnd" type="number" min="0" step="0.05" value="0"> \uCD08</label></div><div class="clip-actions"><button id="srcSetStart">\uC5EC\uAE30\uB97C \uC2DC\uC791\uC73C\uB85C</button><button id="srcSetEnd">\uC5EC\uAE30\uB97C \uB05D\uC73C\uB85C</button><button id="srcFit">\uB179\uC74C \uAE38\uC774\uC5D0 \uB9DE\uCD94\uAE30</button><button id="srcPlay">\u25B7 \uAD6C\uAC04 \uC7AC\uC0DD</button></div><label class="cut-name">\uC870\uAC01 \uC774\uB984<input id="srcName" maxlength="60" placeholder="\uC608: \uB3C4\uC785\uBD80 \uD56D\uACF5\uC0F7"></label><button id="srcSave" class="primary">\uC774 \uAD6C\uAC04 \uC798\uB77C \uC800\uC7A5 \u2702</button><button id="srcCancel" hidden>\uC790\uB974\uAE30 \uCDE8\uC18C</button><progress id="srcProgress" value="0" max="1" hidden></progress><p id="srcStatus" class="clip-note" role="status"></p></div><div class="panel-heading"><h2>\uC798\uB77C \uB454 \uC601\uC0C1 <span id="clipCount" class="badge">0</span></h2></div><div id="clipList"></div><input type="file" id="sourceInput" accept="video/mp4,video/webm,video/quicktime,video/*" hidden></dialog><dialog id="textDialog"><form method="dialog"><div class="panel-heading"><h2>\uB300\uBCF8 \uC785\uB825</h2><button aria-label="\uB2EB\uAE30">\u2715</button></div><p>\uBB38\uC7A5\uBD80\uD638\uC640 \uC904\uBC14\uAFC8\uC744 \uAE30\uC900\uC73C\uB85C \uB098\uB215\uB2C8\uB2E4. \uBD84\uB9AC \uD6C4 \uAC01 \uBB38\uC7A5\uC744 \uC218\uC815\uD560 \uC218 \uC788\uC5B4\uC694.</p><textarea id="pasteText" rows="12" placeholder="\uC5EC\uAE30\uC5D0 \uB300\uBCF8\uC744 \uBD99\uC5EC\uB123\uC73C\uC138\uC694."></textarea><div class="dialog-actions"><button value="cancel">\uCDE8\uC18C</button><button type="button" id="applyText" class="primary">\uBB38\uC7A5\uC73C\uB85C \uB098\uB204\uAE30</button></div></form></dialog>
<dialog id="guideDialog"><div class="panel-heading"><h2>\uC791\uC5C5 \uAC00\uC774\uB4DC</h2><button id="closeGuide">\u2715</button></div><ol><li>TXT\uB97C \uAC00\uC838\uC624\uAC70\uB098 \uB300\uBCF8\uC744 \uC9C1\uC811 \uC785\uB825\uD558\uC138\uC694. \uBB38\uC7A5 \uD558\uB098\uC529 \uB179\uC74C\uD569\uB2C8\uB2E4.</li><li>\uD30C\uD615\uC744 \uB4DC\uB798\uADF8\uD558\uAC70\uB098 \uC2DC\uC791\xB7\uB05D \uC2DC\uAC04\uC744 \uC785\uB825\uD574 \uAD6C\uAC04\uC744 \uC790\uB974\uACE0, \u2018\uC774\uC5B4 \uB179\uC74C\u2019\uC73C\uB85C \uB2E4\uC2DC \uB9D0\uD55C \uBD80\uBD84\uC744 \uBD99\uC774\uC138\uC694. \uB9D0\uC2E4\uC218 \uC790\uB3D9 \uC778\uC2DD\uC740 \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.</li><li>\uB179\uC74C ZIP\uC744 Astra\uC5D0\uAC8C \uC804\uB2EC\uD558\uC138\uC694. \uADDC\uACA9\uC5D0 \uB9DE\uCD98 JSON \uD398\uC774\uC9C0\xB7\uC774\uBBF8\uC9C0\xB7\uC601\uC0C1 ZIP\uC744 \uC7A5\uBA74 \uD0ED\uC5D0\uC11C \uAC00\uC838\uC635\uB2C8\uB2E4. \uC784\uC758\uC758 HTML \uD398\uC774\uC9C0\uB294 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.</li><li>\uAC01 \uC7A5\uBA74\uC744 \uAC80\uC218\uD55C \uB4A4 MP4\uB85C \uB80C\uB354\uB9C1\uD558\uC138\uC694. \uC601\uC0C1 \uC18C\uC7AC\uC758 \uC6D0\uC74C\uC740 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uACE0 \uB179\uC74C\uB9CC \uC0AC\uC6A9\uD569\uB2C8\uB2E4.</li><li>\uC790\uB3D9 \uC800\uC7A5\uC740 \uC774 \uBE0C\uB77C\uC6B0\uC800\uC5D0 \uD55C\uC815\uB429\uB2C8\uB2E4. \uD504\uB85C\uC81D\uD2B8 ZIP\uC744 \uC800\uC7A5\uD558\uBA74 \uB2E4\uB978 \uAE30\uAE30\uC5D0\uC11C\uB3C4 \uBCF5\uC6D0\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</li></ol><p>\uB179\uC74C \uC911\uC5D0\uB294 \uD0ED\uC744 \uB2EB\uAC70\uB098 \uAE30\uAE30\uB97C \uC7A0\uADF8\uC9C0 \uB9C8\uC138\uC694. \uB9C8\uC774\uD06C \uAD8C\uD55C\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.</p></dialog>
<div id="toast" role="status" aria-live="polite"></div><input type="file" id="txtInput" accept=".txt,text/plain" hidden><input type="file" id="batchAudioInput" accept="audio/*,.zip" multiple hidden><input type="file" id="audioInput" accept="audio/*" hidden><input type="file" id="sceneInput" accept=".zip,.png,.jpg,.jpeg,.webp,.mp4,.webm,.json" multiple hidden><input type="file" id="projectInput" accept=".zip" hidden><script type="module" src="app.js?v=4"></script></body></html>
`, type: "text/html; charset=utf-8" }, "/style.css": { body: "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap');\n:root{--purple:#7852df;--purple-light:#f0ebfc;--ink:#24252d;--muted:#85858f;--border:#e7e7ec;--bg:#f8f9fb;--rail:#191a23}*{box-sizing:border-box}body{margin:0;color:var(--ink);background:var(--bg);font-family:'DM Sans','Noto Sans KR',sans-serif;font-size:16px}button,input,textarea,select{font:inherit}button{cursor:pointer;border:1px solid var(--border);background:white;border-radius:8px;color:var(--ink);padding:10px 14px;font-size:14px;font-weight:500;transition:background .15s,transform .15s}button:hover{background:#f3f0fa}button:disabled{opacity:.42;cursor:not-allowed}button:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:3px solid #b398ff;outline-offset:2px}button.primary{background:var(--purple);border-color:var(--purple);color:white}.primary:hover{background:#6640cd}input,select,textarea{border:1px solid var(--border);border-radius:7px;background:#fff;padding:10px;min-width:0;color:var(--ink)}textarea{resize:vertical;line-height:1.8}.rail{position:fixed;inset:0 auto 0 0;width:212px;background:var(--rail);color:#eee;padding:34px 20px;display:flex;flex-direction:column;z-index:5}.brand{text-decoration:none;color:white;display:flex;align-items:center;gap:12px;font-size:23px;font-weight:800;padding:0 12px}.logo{background:var(--purple);border-radius:12px;font-size:31px;width:44px;height:44px;text-align:center;line-height:44px}.brand-small{font-size:10px;letter-spacing:3px;display:block;font-weight:500;margin-top:2px}.rail-label{font-size:11px;letter-spacing:1.8px;color:#777986;margin:57px 14px 15px}.nav{border:0;background:none;color:#9696a4;text-align:left;display:flex;gap:14px;align-items:center;padding:15px;margin:3px 0;border-radius:8px}.nav.active{background:#302940;color:#d8c8ff}.nav:hover{background:#292632}.rail-bottom{margin-top:auto;display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-size:14px}.rail-bottom>button{width:100%;background:none;color:#9696a4;border:0;text-align:left;margin-bottom:24px}.avatar{border-radius:50%;width:33px;height:33px;display:grid;place-items:center;background:#3d354d;color:#ccb5ff}.rail-bottom small{display:block;font-size:9px;letter-spacing:1px;color:#7e7c8d;margin-top:4px}.shell{margin-left:212px}header{height:80px;border-bottom:1px solid var(--border);background:white;display:flex;align-items:center;justify-content:space-between;padding:0 34px;gap:16px}.breadcrumbs{font-size:14px;white-space:nowrap;color:var(--muted);display:flex;align-items:center;gap:16px}.breadcrumbs input{border:0;font-weight:600;width:190px}.header-actions{display:flex;gap:8px;align-items:center}#saveState{font-size:12px;color:var(--muted);margin-right:12px}main{max-width:1660px;margin:auto;padding:34px}.page-heading{display:flex;justify-content:space-between;align-items:center;margin:2px 0 30px}.eyebrow{font-size:11px;letter-spacing:1.7px;font-weight:700;color:#94949e;margin:0 0 12px}h1{font-size:29px;letter-spacing:-1px;font-weight:700;margin:0 0 10px}.page-heading p:not(.eyebrow){font-size:14px;color:var(--muted);margin:0}.project-stat{display:flex;align-items:center;gap:9px}.project-stat>b{font-size:38px;font-weight:500;color:var(--purple)}.project-stat>span{font-size:23px;color:#b1b0bc}.project-stat small{display:block;font-size:12px;color:var(--muted);margin-top:2px}.steps{display:flex;align-items:center;gap:19px;padding:0 0 25px;margin-bottom:4px}.steps button{background:none;border:0;color:#9695a3;padding:4px 0;display:flex;gap:9px;align-items:center}.steps button span{border:1px solid #dddae6;border-radius:50%;width:25px;height:25px;display:grid;place-items:center;font-size:11px}.steps button.active{color:var(--purple);font-weight:700}.steps button.active span{background:var(--purple);border-color:var(--purple);color:#fff}.steps i{height:1px;background:#dddce6;width:35px}.steps>small{margin-left:auto;font-size:12px;color:var(--muted)}.panel{background:white;border:1px solid var(--border);border-radius:12px;overflow:hidden}.panel-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:21px 24px}.panel-heading h2{font-size:16px;margin:0;font-weight:700}.panel-heading .eyebrow{margin:0}.badge{font-size:12px;font-weight:500;display:inline-block;background:#f1eff6;color:#898394;border-radius:5px;padding:3px 7px;margin-left:6px}.text-btn{border:0;background:none;color:var(--purple);padding:2px;font-size:13px}.record-layout{display:grid;grid-template-columns:minmax(260px,.85fr) minmax(480px,1.8fr);gap:22px}.script-panel{display:flex;flex-direction:column;min-height:654px;max-height:790px}.script-tools{display:flex;gap:7px;padding:0 24px 18px;border-bottom:1px solid var(--border)}.script-tools button{font-size:12px;padding:6px 10px;color:#83818f}.sentence-list{overflow-y:auto;flex:1;padding:8px}.sentence-item{display:flex;gap:12px;text-align:left;width:100%;border:1px solid transparent;padding:17px 12px;background:white;border-radius:8px;margin:3px 0}.sentence-item.selected{background:#f5f1ff;border-color:#e5d9ff}.sentence-item .num{font-size:12px;color:#a7a3b2;padding-top:4px;min-width:23px}.sentence-item.selected .num{color:var(--purple)}.sentence-item p{font-size:14px;line-height:1.75;margin:0;color:#53515e}.sentence-item small{font-size:11px;color:#aaa5b5;display:block;margin-top:6px}.sentence-item .done{font-size:13px;color:var(--purple);margin-left:auto;padding-top:5px}.script-footer{border-top:1px solid var(--border);padding:13px 17px;color:#9b97a6;display:flex;align-items:center;justify-content:space-between;font-size:11px}.script-footer button{border:0;font-size:20px;padding:0 8px}.empty-state{padding:75px 25px;text-align:center;color:#9d99aa;font-size:14px;line-height:1.9}.empty-state span{display:block;font-size:34px;color:#cab9ee;margin-bottom:15px}.record-main{display:flex;flex-direction:column;gap:16px}.recorder-panel{min-height:467px}.status{font-size:12px;color:#98939f;padding:5px 9px;background:#f6f6f8;border-radius:20px}.status.live{color:#d44362;background:#fff0f3}.purple{color:var(--purple)}.sentence-position{text-align:center;margin:10px 0 14px;font-size:12px;color:#a5a0ae}.sentence-position>span:first-child{display:inline-block;color:var(--purple);background:var(--purple-light);padding:5px 8px;border-radius:5px;margin-right:10px}.recorder-panel textarea{display:block;text-align:center;border:0;width:85%;margin:auto;font-size:24px;line-height:1.8;letter-spacing:-.6px;height:117px;resize:vertical;font-weight:600;padding:2px 10px}.recorder-panel textarea::placeholder{font-size:19px;color:#b6b1c0;font-weight:400}.recorder-bottom{text-align:center;padding:5px 28px 18px}#recordHint{font-size:12px;color:#aaa5b2}.record-clock{font-size:25px;font-variant-numeric:tabular-nums;letter-spacing:1px;margin-top:16px}#waveform{display:block;width:100%;height:69px;touch-action:none;cursor:crosshair}.range-row{display:flex;justify-content:center;align-items:center;gap:13px;font-size:12px;color:#8e8998;margin-bottom:14px}.range-row input{padding:3px 5px;width:62px;font-size:12px;background:#f8f7fa}.range-row>span{font-size:11px;margin-left:auto}.transport{display:flex;justify-content:center;gap:12px;align-items:center}.round{border-radius:50%;width:37px;height:37px;padding:0;color:#807788}.record-button{background:var(--purple);border:0;color:white;display:flex;align-items:center;justify-content:center;gap:10px;width:156px;padding:13px 15px;box-shadow:0 4px 12px #7852df22}.record-button:hover{background:#6842cb}.rec-dot{width:10px;height:10px;border-radius:50%;background:white}.record-button.recording{background:#d54763}.record-button.recording .rec-dot{border-radius:2px}.append-option{display:flex;justify-content:center;align-items:center;gap:6px;font-size:12px;color:#918b9c;margin-top:13px}input[type=checkbox]{accent-color:var(--purple)}.edit-panel{padding:20px 23px}.edit-panel>div:first-child{display:flex;gap:12px;align-items:center}.edit-icon{background:#f3effb;color:var(--purple);padding:10px;border-radius:8px}h3{margin:0;font-size:14px;font-weight:600}h3 small{display:block;font-size:12px;color:#99939f;font-weight:400;margin-top:5px}.edit-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:15px}.edit-actions button{font-size:12px;padding:7px 10px;background:#fcfbfe}.next-callout{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 2px}.next-callout>div{display:flex;gap:12px;align-items:center}.next-callout>div>span{font-size:22px}.next-callout p{font-size:13px;margin:0;font-weight:600}.next-callout small{display:block;font-size:11px;line-height:1.7;color:#99939f;font-weight:400;margin-top:4px}.next-callout button{white-space:nowrap;font-size:12px;color:var(--purple);background:#f0ebfc;border-color:#e8ddff}.scene-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:24px}.scene-toolbar>div{margin-right:auto}.scene-toolbar h2{font-size:20px;margin:0 0 9px}.scene-toolbar p{font-size:13px;color:var(--muted);margin:0}.scene-layout{display:grid;grid-template-columns:minmax(0,1fr) 285px;gap:22px}.preview-panel{align-self:start;background:#15151d}.preview-panel canvas{width:100%;display:block;aspect-ratio:16/9}.preview-controls{display:flex;gap:8px;align-items:center;padding:14px;background:white;flex-wrap:wrap}.preview-controls span{font-size:12px;color:var(--muted);margin-left:auto}.inspector{padding:23px;display:flex;flex-direction:column;gap:14px}.inspector h2{font-size:16px;margin:0 0 6px}.inspector label,.export-panel>label{display:flex;flex-direction:column;font-size:13px;gap:7px;color:#82788c}.inspector input,.inspector select,.inspector textarea{width:100%;font-size:14px}.inspector input[type=color]{height:36px;padding:3px}.inspector label.check-label{flex-direction:row;align-items:center}.inspector input[type=checkbox]{width:auto}.timeline-panel{margin-top:22px}.timeline-panel .panel-heading>span{font-size:12px;color:var(--muted)}#timeline{display:flex;gap:10px;overflow:auto;padding:0 24px 24px}.timeline-card{min-width:154px;max-width:200px;flex:1;text-align:left;padding:0;overflow:hidden}.timeline-card.selected{border-color:var(--purple);box-shadow:0 0 0 2px #7852df20}.timeline-card .thumb{height:83px;background:#191b28;display:flex;align-items:center;justify-content:center;color:#d6c8ff;padding:12px;font-size:12px;overflow:hidden}.thumb img{width:100%;height:100%;object-fit:cover}.timeline-card p{padding:9px;margin:0;font-size:12px}.timeline-card small{display:block;color:var(--muted);margin-top:5px}.export-layout{display:grid;grid-template-columns:1.3fr 1fr;gap:24px}.export-panel,.handoff-panel{padding:34px}.export-panel h2{font-size:25px;letter-spacing:-.7px;margin:15px 0}.export-panel>p{color:var(--muted);font-size:14px;line-height:1.9}#exportChecklist{margin:30px 0;border-top:1px solid var(--border)}.check-row{padding:16px 0;display:flex;justify-content:space-between;gap:14px;font-size:14px;border-bottom:1px solid var(--border)}.check-row b{color:var(--purple);font-weight:500}.check-row b.warn{color:#b87e26}.export-big{width:100%;padding:15px;margin:10px 0}progress{width:100%;height:10px;accent-color:var(--purple)}.handoff-symbol{width:50px;height:50px;background:var(--purple-light);color:var(--purple);font-size:30px;border-radius:12px;text-align:center;line-height:50px}.handoff-panel h2{font-size:21px;margin:22px 0}.handoff-panel ol{padding-left:23px}.handoff-panel li{font-size:14px;padding:8px 0 15px 6px}.handoff-panel li::marker{color:var(--purple)}.handoff-panel p{color:var(--muted);font-size:13px;line-height:1.9}.handoff-panel>button{margin:6px 5px 0 0}footer{display:flex;gap:18px;font-size:10px;letter-spacing:1px;color:#a8a3b0;padding:26px 0 0}footer>span{font-size:11px;letter-spacing:0}footer>span:last-child{margin-left:auto}dialog{border:1px solid var(--border);border-radius:16px;max-width:650px;width:calc(100% - 32px);padding:28px;box-shadow:0 30px 80px #191a2340}dialog::backdrop{background:#191a2366;backdrop-filter:blur(3px)}dialog .panel-heading{padding:0 0 10px}dialog p,dialog li{color:#797383;font-size:14px;line-height:1.9}dialog li{margin:14px 0}dialog textarea{width:100%}.dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}#toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(100px);background:#282333;color:white;padding:14px 24px;border-radius:10px;box-shadow:0 8px 25px #17102233;z-index:50;font-size:14px;transition:transform .2s;max-width:90%;line-height:1.6}#toast.show{transform:translateX(-50%) translateY(0)}[hidden]{display:none!important}body.busy main button:not(#cancelRender):not(#previewStop),body.busy header button,body.busy .rail button,body.busy main input,body.busy main textarea,body.busy main select{pointer-events:none;opacity:.5}\n@media(min-width:1550px){main{padding:44px 50px}.record-layout{grid-template-columns:360px 1fr}.recorder-panel textarea{font-size:29px}}@media(max-width:1200px){.rail{width:174px;padding:28px 13px}.shell{margin-left:174px}main{padding:26px}header{padding:0 26px}#saveState{display:none}.record-layout{grid-template-columns:260px minmax(0,1fr)}.next-callout{flex-wrap:wrap}.header-actions button{font-size:12px;padding:9px}.breadcrumbs input{width:135px}.range-row{gap:6px}}@media(max-width:960px){.rail{width:72px;padding:28px 12px}.brand{padding:0}.brand>span:last-child,.rail-label,.nav span,.rail-bottom{display:none}.logo{width:45px}.nav{font-size:20px;padding:12px;justify-content:center}.nav:first-of-type{margin-top:40px}.shell{margin-left:72px}.record-layout{grid-template-columns:220px minmax(0,1fr);gap:14px}.panel-heading{padding:18px 15px}.script-tools{padding:0 15px 15px}.recorder-panel textarea{font-size:21px}.recorder-bottom{padding:5px 15px 18px}.range-row>span{display:none}.scene-layout{grid-template-columns:1fr}.inspector{display:grid;grid-template-columns:1fr 1fr}.inspector h2{grid-column:1/-1}.export-layout{grid-template-columns:1fr}.scene-toolbar{flex-wrap:wrap}.scene-toolbar>div{width:100%}.header-actions #openProject{display:none}footer>span:last-child{display:none}}@media(max-width:700px){.rail{position:static;width:auto;height:62px;flex-direction:row;padding:9px 16px;align-items:center;gap:10px}.brand{margin-right:auto}.logo{width:35px;height:35px;line-height:35px;font-size:24px;border-radius:9px}.brand>span:last-child{display:block;font-size:16px}.brand-small{font-size:8px;letter-spacing:2px}.nav,.nav:first-of-type{margin:0;padding:9px 12px;font-size:17px}.shell{margin-left:0}header{height:61px;padding:0 16px;gap:5px}.breadcrumbs{gap:3px}.breadcrumbs input{width:127px;font-size:13px}.breadcrumbs{font-size:0}.breadcrumbs span{display:none}.header-actions{gap:5px}.header-actions button{padding:8px;font-size:11px}main{padding:24px 16px}h1{font-size:23px}.eyebrow{font-size:9px}.page-heading{margin-bottom:24px}.project-stat>b{font-size:27px}.project-stat>span{font-size:16px}.project-stat small{font-size:9px}.page-heading p:not(.eyebrow){font-size:12px}.steps{gap:9px;padding-bottom:18px}.steps i{width:10px}.steps button{font-size:11px;gap:5px}.steps button span{width:21px;height:21px;font-size:10px}.steps>small{display:none}.record-layout{display:flex;flex-direction:column}.script-panel{min-height:0;max-height:280px}.script-panel .panel-heading{padding:13px 16px}.script-tools{padding-bottom:10px}.sentence-list{min-height:100px}.sentence-item{padding:9px}.sentence-item p{font-size:13px}.sentence-item small{display:none}.script-footer{padding:7px 16px}.empty-state{padding:15px;font-size:12px}.empty-state span{display:none}.recorder-panel{min-height:440px}.recorder-panel textarea{font-size:22px;height:114px}.recorder-panel .panel-heading{padding:17px}.next-callout small{font-size:10px}.edit-panel{padding:18px}.edit-actions{gap:6px}.edit-actions button{font-size:11px}.scene-toolbar p{line-height:1.8}.scene-toolbar button{font-size:12px}.inspector{padding:20px;gap:12px}.export-panel,.handoff-panel{padding:24px}.export-panel h2{font-size:22px}footer{flex-wrap:wrap;gap:8px;font-size:9px}footer>span{font-size:10px}}\n\n.cloud-strip{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:16px 0;font-size:13px;color:#786c88}.cloud-folder{display:block;width:100%;text-align:left;margin:9px 0;padding:16px}.cloud-folder small{display:block;margin-top:8px;color:#888}.signin-button{display:inline-block;background:#7852df;color:white;padding:12px 18px;border-radius:8px;text-decoration:none}#cloudActions>label{display:block;font-size:14px}#newFolderName{display:block;width:100%;margin:8px 0}#folderList{max-height:42vh;overflow:auto;margin-top:18px}#cloudActions>button{margin:8px 4px 0 0}.script-tools{flex-wrap:wrap}#importAudioBatch{font-size:13px;background:#7852df;color:#fff}.header-actions{flex-wrap:wrap}@media(max-width:700px){header{height:auto;min-height:65px;padding:12px 16px;flex-wrap:wrap}.header-actions{width:100%}.header-actions #openProject{display:block}.cloud-strip{flex-wrap:wrap}}\n#cloudSignedOut .muted-note{font-size:12px;color:#9a94a6;line-height:1.8;margin:16px 0 0}.current-folder{border:1px solid var(--border);border-radius:9px;background:#fafafd;padding:13px 15px;font-size:13px;color:#7c7688;margin:4px 0 18px}.current-folder.linked{background:var(--purple-light);border-color:#e0d3ff;color:#5c3fb0;font-weight:600}.folder-new{border:1px solid var(--border);border-radius:9px;padding:15px;margin-bottom:4px}.folder-new label{font-size:13px;color:#82788c}.folder-new #newCloudFolder{width:100%;margin-top:4px}#folderList .cloud-folder{display:flex;align-items:center;gap:10px;width:100%;margin:9px 0;padding:0;border:1px solid var(--border);border-radius:9px;background:#fff}#folderList .cloud-folder.current{border-color:var(--purple);box-shadow:0 0 0 2px #7852df20}.folder-open{flex:1;text-align:left;border:0;background:none;padding:15px 16px}.folder-actions{display:flex;gap:4px;padding-right:12px;flex-shrink:0}.folder-actions .text-btn{font-size:12px;padding:6px 8px}.text-btn.danger{color:#c4435f}\n.folder-status{font-size:13px;color:#5c3fb0;background:var(--purple-light);border-radius:8px;padding:11px 14px;margin:12px 0 4px;line-height:1.7}\ndialog #toast{z-index:1}\n@media(max-width:560px){dialog{padding:20px 18px}#folderList .cloud-folder{flex-wrap:wrap}.folder-open{flex:1 0 100%;padding:14px 14px 4px}.folder-actions{padding:0 12px 12px;margin-left:auto}}\n.clip-row{border-top:1px solid var(--border);padding-top:16px;margin-top:4px;display:flex;flex-direction:column;gap:10px}.clip-row h3 small{margin-top:4px}#clipVideo{width:100%;border-radius:8px;background:#15151d;display:block;aspect-ratio:16/9}#clipScrub{width:100%;accent-color:var(--purple);padding:0}.clip-times{display:flex;flex-direction:column;gap:8px}.clip-times label{flex-direction:row!important;align-items:center;gap:8px;font-size:12px;white-space:nowrap}.clip-times input{flex:1;min-width:0;font-size:13px;padding:6px}.clip-actions{display:flex;flex-wrap:wrap;gap:6px}.clip-actions button{flex:1 0 46%;font-size:12px;padding:7px 8px}.clip-note{font-size:12px;color:#82788c;line-height:1.7;margin:0}.clip-note.warn{color:#b87e26}\n.cut-open{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}.cut-open span{font-size:13px;color:var(--muted);word-break:break-all}#srcVideo{width:100%;border-radius:10px;background:#15151d;display:block;max-height:46vh;aspect-ratio:16/9}#srcScrub{width:100%;accent-color:var(--purple);padding:0;margin:12px 0 4px}.cut-clock{margin:0 0 12px;font-size:13px;font-variant-numeric:tabular-nums}.cut-clock b{font-size:17px;color:var(--purple)}.cut-name{display:block;font-size:13px;color:#82788c;margin:14px 0 10px}.cut-name input{display:block;width:100%;margin-top:6px}#srcSave{width:100%}#srcCancel{width:100%;margin-top:8px}#srcProgress{width:100%;height:10px;accent-color:var(--purple);margin-top:10px}#clipList{max-height:34vh;overflow:auto}.clip-item{display:flex;align-items:center;gap:10px;flex-wrap:wrap;border:1px solid var(--border);border-radius:9px;padding:13px 15px;margin:9px 0}.clip-item.current{border-color:var(--purple);box-shadow:0 0 0 2px #7852df20}.clip-info{flex:1;min-width:150px}.clip-info strong{display:block;font-size:14px;word-break:break-all}.clip-info small{display:block;color:var(--muted);font-size:12px;margin-top:5px}.clip-item-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.clip-item-actions button{font-size:12px;padding:7px 10px}\n\n", type: "text/css; charset=utf-8" }, "/app.js": { body: "import{createCloudEditor}from'./cloud.js';\nimport{zip,unzipSync,strToU8,strFromU8}from'./vendor/fflate.js';\nimport{Muxer,ArrayBufferTarget,FileSystemWritableFileStreamTarget}from'./vendor/mp4-muxer.js';\nimport{RATE,splitSentences,joinAudio,editAudio,trimAudio,wavBytes,pad,validScene,audioPackets,planAudioImports,COVER,sceneEntrance,needsScrim,offsetAt,clipRange,clipTimeAt,clipOutputSize,safeClipName,uniqueAssetKey,pickClipCodec,sceneGroups}from'./core.js';\nconst $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\nlet project={version:1,name:'\uC0C8\uB85C\uC6B4 \uB871\uD3FC',sentences:[],assets:{}},selected=0,tab='record',busy=false,recording=false,recorder=null,stream=null,ctx=null,analyser=null,recFrame=0,recordStart=0,saveTimer=null,saveChain=Promise.resolve(),toastTimer,undo=new Map(),previewToken=0,audioSource=null,renderCancelled=false;\nconst mediaCache=new Map();let cloud=null;\nfunction toastHost(){return document.querySelector('dialog[open]')||document.body;}\nfunction toast(msg){const t=$('toast'),host=toastHost();if(t.parentNode!==host)host.append(t);t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),5000);}\nfor(const d of document.querySelectorAll('dialog'))d.addEventListener('close',()=>{const t=$('toast');if(t.parentNode!==document.body)document.body.append(t);});\nfunction time(t,decimal=false){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0')+(decimal?'.'+Math.floor((t%1)*10):'');}\nconst current=()=>project.sentences[selected],duration=s=>(s?.audio?.length||0)/RATE,total=()=>project.sentences.reduce((sum,s)=>sum+duration(s),0);\nconst defaultScene=()=>({title:'',subtitle:'',layout:'title',motion:'fade',background:'#171925',captions:true,reviewed:false});\nfunction newSentence(text,id){return{id,text,audio:null,scene:defaultScene()};}\nfunction setBusy(value){busy=value;document.body.classList.toggle('busy',value);}\nasync function audioContext(){ctx??=new AudioContext({sampleRate:RATE});if(ctx.state!=='running')await ctx.resume();return ctx;}\nconst dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('burcol-studio-v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('projects');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});\nfunction changed(){if(current())current().scene.reviewed=false;scheduleSave();renderStats();}\nfunction scheduleSave(localOnly=false){if(!localOnly)cloud?.edited();clearTimeout(saveTimer);$('saveState').textContent='\uC800\uC7A5 \uC911\u2026';saveTimer=setTimeout(()=>{const snapshot=structuredClone(project);saveChain=saveChain.catch(()=>{}).then(async()=>{const db=await dbPromise;await new Promise((resolve,reject)=>{const tx=db.transaction('projects','readwrite');tx.objectStore('projects').put(snapshot,'current');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});$('saveState').textContent='\uC774 \uAE30\uAE30\uC5D0 \uC800\uC7A5\uB428';}).catch(()=>{$('saveState').textContent='\uC790\uB3D9 \uC800\uC7A5 \uC2E4\uD328 \xB7 ZIP\uC73C\uB85C \uBC31\uC5C5';toast('\uAE30\uAE30 \uC800\uC7A5 \uACF5\uAC04\uC744 \uD655\uC778\uD558\uACE0 \uD504\uB85C\uC81D\uD2B8 ZIP\uC744 \uC800\uC7A5\uD558\uC138\uC694.');});},450);}\nasync function loadSaved(){try{const db=await dbPromise;const saved=await new Promise((resolve,reject)=>{const r=db.transaction('projects').objectStore('projects').get('current');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});if(saved?.version===1&&Array.isArray(saved.sentences)){project=saved;$('projectName').value=project.name;}}catch{$('saveState').textContent='\uC790\uB3D9 \uC800\uC7A5 \uC0AC\uC6A9 \uBD88\uAC00';}render();}\nfunction download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}\nconst fileName=()=>project.name.replace(/[\\\\/:*?\"<>|]/g,'_')||'burcol';\nfunction renderStats(){const list=project.sentences;$('completedCount').textContent=String(list.filter(s=>s.audio?.length).length).padStart(2,'0');$('totalCount').textContent=String(list.length).padStart(2,'0');$('scriptCount').textContent=list.length;$('totalDuration').textContent='\uCD1D '+time(total());const done=list.filter(s=>s.audio?.length).length,toReview=list.filter(s=>!s.scene.continues),review=toReview.filter(s=>s.scene.reviewed).length;$('exportChecklist').innerHTML=`<div class=\"check-row\"><span>\uBB38\uC7A5\uBCC4 \uB179\uC74C</span><b class=\"${done<list.length||!list.length?'warn':''}\">${done} / ${list.length} \uC644\uB8CC</b></div><div class=\"check-row\"><span>\uC7A5\uBA74 \uAC80\uC218</span><b class=\"${review<toReview.length||!list.length?'warn':''}\">${review} / ${toReview.length} \uC644\uB8CC</b></div><div class=\"check-row\"><span>\uC601\uC0C1 \uAE38\uC774</span><b>${time(total())}</b></div><div class=\"check-row\"><span>\uCD9C\uB825 \uD615\uC2DD</span><b>MP4 \xB7 16:9 \xB7 30 fps</b></div>`;$('renderMp4').disabled=!list.length||done!==list.length||review!==toReview.length;$('renderStatus').textContent=!list.length?'\uB300\uBCF8\uACFC \uB179\uC74C\uC744 \uBA3C\uC800 \uC900\uBE44\uD558\uC138\uC694.':done<list.length?'\uBAA8\uB4E0 \uBB38\uC7A5\uC758 \uB179\uC74C\uC744 \uC644\uB8CC\uD558\uC138\uC694.':review<list.length?'\uC7A5\uBA74 \uD0ED\uC5D0\uC11C \uAC01 \uC7A5\uBA74\uC744 \uD655\uC778\uD558\uACE0 \uAC80\uC218 \uC644\uB8CC\uB97C \uCCB4\uD06C\uD558\uC138\uC694.':'';}\nfunction renderList(){if(!project.sentences.length){$('sentenceList').innerHTML='<div class=\"empty-state\"><span>\u25A4</span>\uCCAB \uBC88\uC9F8 \uC774\uC57C\uAE30\uB97C \uAC00\uC838\uC624\uC138\uC694.<br>TXT \uD30C\uC77C \uD558\uB098\uBA74 \uC2DC\uC791\uD560 \uC218 \uC788\uC5B4\uC694.</div>';return;}$('sentenceList').innerHTML=project.sentences.map((s,i)=>`<button class=\"sentence-item ${i===selected?'selected':''}\" data-index=\"${i}\"><span class=\"num\">${pad(s.id)}</span><div><p>${esc(s.text||'\uC0C8 \uBB38\uC7A5')}</p><small>${s.audio?time(duration(s),true)+' \xB7 \uB179\uC74C \uC644\uB8CC':'\uB179\uC74C \uB300\uAE30'}</small></div><span class=\"done\">${s.audio?'\u2713':''}</span></button>`).join('');$('sentenceList').querySelectorAll('[data-index]').forEach(el=>el.onclick=()=>selectSentence(+el.dataset.index));}\nfunction renderSelected(){const s=current();$('sentenceText').value=s?.text||'';$('sentenceText').disabled=!s;$('currentNumber').textContent=s?pad(s.id):'01';$('sentencePosition').textContent=s?`${selected+1} / ${project.sentences.length} \uBB38\uC7A5`:'\uBB38\uC7A5\uC744 \uC120\uD0DD\uD558\uC138\uC694';$('recordClock').textContent=time(duration(s),true);$('cutStart').value='0';$('cutEnd').value=duration(s).toFixed(3);$('audioDuration').textContent=s?.audio?duration(s).toFixed(2)+'\uCD08':'\uB179\uC74C \uC5C6\uC74C';$('recordBadge').textContent=s?.audio?'\uB179\uC74C \uC644\uB8CC':'\uB179\uC74C \uC900\uBE44';$('recordHint').textContent=s?.audio?'\uC120\uD0DD \uAD6C\uAC04\uC744 \uB4E3\uACE0, \uD544\uC694\uD55C \uBD80\uBD84\uB9CC \uB0A8\uAE30\uC138\uC694.':'\uB9C8\uC774\uD06C\uB97C \uCF1C\uACE0 \uC774\uC57C\uAE30\uB97C \uC2DC\uC791\uD574 \uBCF4\uC138\uC694.';$('recordBtn').disabled=!s;$('playAudio').disabled=!s?.audio;$('undoAudio').disabled=!undo.has(s?.id);$('prevSentence').disabled=selected<=0;$('nextSentence').disabled=selected>=project.sentences.length-1;drawWave();renderInspector();renderTimeline();drawPreview();}\nfunction render(){renderStats();renderList();renderSelected();}\nfunction selectSentence(i){if(recording||busy)return;const next=Math.max(0,Math.min(project.sentences.length-1,i));if(previewing)previewSeek=next;else stopPlayback();selected=next;renderList();renderSelected();}\nfunction reviewAndSelect(i){if(recording||busy)return;const s=project.sentences[i];if(s&&!s.scene.reviewed){s.scene.reviewed=true;scheduleSave();}selectSentence(i);renderStats();}\nfunction switchTab(next){if(recording||busy)return;stopPlayback();tab=next;document.querySelectorAll('[data-tab]').forEach(el=>el.classList.toggle('active',el.dataset.tab===next));for(const name of['record','scenes','export'])$(name+'View').hidden=name!==next;$('pageTitle').textContent={record:'\uC88B\uC740 \uC774\uC57C\uAE30\uB294, \uD55C \uBB38\uC7A5\uBD80\uD130.',scenes:'\uBAA9\uC18C\uB9AC\uC5D0 \uC7A5\uBA74\uC744 \uC785\uD788\uC138\uC694.',export:'\uB2F9\uC2E0\uC758 \uC774\uC57C\uAE30\uB97C \uC138\uC0C1\uC73C\uB85C.'}[next];$('pageSubtitle').textContent={record:'\uB300\uBCF8\uC744 \uC62C\uB9AC\uACE0, \uD55C \uBB38\uC7A5\uC529 \uD3B8\uC548\uD558\uAC8C \uB179\uC74C\uD558\uC138\uC694.',scenes:'\uB179\uC74C \uAE38\uC774\uC5D0 \uB9DE\uCDB0 \uC7A5\uBA74\uC744 \uC5F0\uACB0\uD558\uACE0, \uD750\uB984\uC744 \uD655\uC778\uD558\uC138\uC694.',export:'\uB9C8\uC9C0\uB9C9 \uAC80\uC218\uB97C \uB9C8\uCE58\uACE0, \uD55C \uD3B8\uC758 \uB871\uD3FC\uC744 \uC644\uC131\uD558\uC138\uC694.'}[next];renderStats();drawPreview();}\nfunction replaceScript(text){const lines=splitSentences(text);if(!lines.length)throw Error('\uB300\uBCF8\uC5D0 \uBB38\uC7A5\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.');if(lines.length>2000)throw Error('\uD55C \uD504\uB85C\uC81D\uD2B8\uB294 2,000\uBB38\uC7A5\uAE4C\uC9C0 \uC9C0\uC6D0\uD569\uB2C8\uB2E4.');if(project.sentences.length&&!confirm('\uD604\uC7AC \uB300\uBCF8\uACFC \uB179\uC74C\uC774 \uAD50\uCCB4\uB429\uB2C8\uB2E4. \uD504\uB85C\uC81D\uD2B8 ZIP\uC73C\uB85C \uBC31\uC5C5\uD558\uC168\uB098\uC694?'))return;stopPlayback();clearMedia();project.sentences=lines.map((s,i)=>newSentence(s,i+1));project.assets={};selected=0;undo.clear();changed();render();toast(lines.length+'\uAC1C\uC758 \uBB38\uC7A5\uC73C\uB85C \uB098\uB204\uC5C8\uC2B5\uB2C8\uB2E4.');}\nasync function decodeAudio(blob){const context=await audioContext();const b=await context.decodeAudioData(await blob.arrayBuffer());if(b.duration>600)throw Error('\uD55C \uBB38\uC7A5 \uB179\uC74C\uC740 10\uBD84 \uC774\uB0B4\uB85C \uB098\uB204\uC5B4 \uC8FC\uC138\uC694.');const off=new OfflineAudioContext(1,Math.ceil(b.duration*RATE),RATE),src=off.createBufferSource();src.buffer=b;src.connect(off.destination);src.start();return(await off.startRendering()).getChannelData(0).slice();}\nfunction updateAudio(data){const s=current();if(!s)return;if(s.audio)undo.set(s.id,s.audio);s.audio=data;changed();render();}\nasync function startRecording(){if(recording){recorder.stop();return;}if(!current()||busy)return;stopPlayback();const s=current(),append=$('appendRecording').checked;if(s.audio&&!append&&!confirm('\uC774 \uBB38\uC7A5\uC744 \uB2E4\uC2DC \uB179\uC74C\uD560\uAE4C\uC694? \uAE30\uC874 \uB179\uC74C\uC740 \uC2E4\uD589 \uCDE8\uC18C\uB85C \uBCF5\uC6D0\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.'))return;setBusy(true);try{await audioContext();stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true}});const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(t=>MediaRecorder.isTypeSupported(t));recorder=new MediaRecorder(stream,mime?{mimeType:mime}:{});const chunks=[];const input=ctx.createMediaStreamSource(stream);analyser=ctx.createAnalyser();analyser.fftSize=2048;input.connect(analyser);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onerror=()=>{toast('\uB179\uC74C \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB9C8\uC774\uD06C \uC5F0\uACB0\uC744 \uD655\uC778\uD558\uC138\uC694.');try{recorder.stop();}catch{cleanupRecord();}};recorder.onstop=async()=>{cleanupRecord();setBusy(true);try{const data=await decodeAudio(new Blob(chunks,{type:recorder.mimeType}));updateAudio(append&&s.audio?joinAudio(s.audio,data):data);toast('\uBB38\uC7A5 '+pad(s.id)+' \uB179\uC74C\uC744 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.');}catch(e){toast('\uB179\uC74C\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. '+e.message);}finally{setBusy(false);}};recording=true;recordStart=performance.now();recorder.start(1000);setBusy(false);$('recordBtn').innerHTML='<span class=\"rec-dot\"></span> \uB179\uC74C \uC644\uB8CC';$('recordBtn').classList.add('recording');$('recordBadge').classList.add('live');$('recordBadge').textContent='\uB179\uC74C \uC911';$('sentenceText').disabled=true;tickRecord();}catch(e){cleanupRecord();setBusy(false);toast(e.name==='NotAllowedError'?'\uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C \uB9C8\uC774\uD06C \uC0AC\uC6A9\uC744 \uD5C8\uC6A9\uD574 \uC8FC\uC138\uC694.':'\uB9C8\uC774\uD06C\uB97C \uC2DC\uC791\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. '+e.message);}}\nfunction cleanupRecord(){recording=false;cancelAnimationFrame(recFrame);stream?.getTracks().forEach(t=>t.stop());stream=null;$('recordBtn').innerHTML='<span class=\"rec-dot\"></span> \uB179\uC74C \uC2DC\uC791';$('recordBtn').classList.remove('recording');$('recordBadge').classList.remove('live');$('sentenceText').disabled=!current();}\nfunction tickRecord(){if(!recording)return;const elapsed=(performance.now()-recordStart)/1000;$('recordClock').textContent=time(elapsed,true);const data=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(data);drawWave(data);if(elapsed>=600){recorder.stop();toast('10\uBD84 \uB179\uC74C\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.');return;}recFrame=requestAnimationFrame(tickRecord);}\nfunction drawWave(live){const canvas=$('waveform'),g=canvas.getContext('2d'),w=canvas.width,h=canvas.height,data=live||current()?.audio;g.clearRect(0,0,w,h);g.fillStyle='#faf9fd';g.fillRect(0,0,w,h);const d=duration(current()),start=+$('cutStart').value,end=+$('cutEnd').value;if(!live&&d&&end>start){g.fillStyle='#eee6ff';g.fillRect(start/d*w,0,(end-start)/d*w,h);}const count=200;for(let i=0;i<count;i++){let peak=0;if(data?.length){const a=Math.floor(i/count*data.length),b=Math.max(a+1,Math.floor((i+1)/count*data.length)),stride=Math.max(1,Math.floor((b-a)/80));for(let j=a;j<b;j+=stride)peak=Math.max(peak,Math.abs(data[j]||0));}g.fillStyle=data?'#9570e8':'#d9d1e8';const bh=Math.max(4,peak*h*.9);g.fillRect(i*w/count+1,(h-bh)/2,3,bh);}if(!live&&d){g.fillStyle='#7852df';for(const t of[start,end])g.fillRect(t/d*w-1,0,2,h);}}\nlet dragStart=0;$('waveform').onpointerdown=e=>{if(!current()?.audio||recording||busy)return;dragStart=Math.max(0,Math.min(duration(current()),(e.clientX-e.currentTarget.getBoundingClientRect().left)/e.currentTarget.clientWidth*duration(current())));e.currentTarget.setPointerCapture(e.pointerId);};$('waveform').onpointermove=e=>{if(!e.currentTarget.hasPointerCapture(e.pointerId))return;const t=Math.max(0,Math.min(duration(current()),(e.clientX-e.currentTarget.getBoundingClientRect().left)/e.currentTarget.clientWidth*duration(current())));$('cutStart').value=Math.min(t,dragStart).toFixed(3);$('cutEnd').value=Math.max(t,dragStart).toFixed(3);drawWave();};$('waveform').onpointerup=e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);};\nfunction stopPlayback(){previewToken++;previewSeek=null;previewing=false;if(audioSource){try{audioSource.stop();}catch{}audioSource=null;}for(const v of mediaCache.values())if(v.el instanceof HTMLVideoElement)v.el.pause();$('previewPlay').textContent='\u25B6 \uC804\uCCB4 \uBBF8\uB9AC\uBCF4\uAE30';}\nasync function playSelected(){if(!current()?.audio||recording||busy)return;stopPlayback();const c=await audioContext(),s=current(),start=Math.max(0,+$('cutStart').value),end=Math.min(duration(s),+$('cutEnd').value);if(end<=start)return toast('\uC7AC\uC0DD\uD560 \uAD6C\uAC04\uC744 \uC120\uD0DD\uD558\uC138\uC694.');const b=c.createBuffer(1,s.audio.length,RATE);b.copyToChannel(s.audio,0);audioSource=c.createBufferSource();audioSource.buffer=b;audioSource.connect(c.destination);audioSource.start(0,start,end-start);}\nfunction editSelected(keep){if(recording||busy||!current()?.audio)return;stopPlayback();try{updateAudio(editAudio(current().audio,+$('cutStart').value,+$('cutEnd').value,keep));toast(keep?'\uC120\uD0DD\uD55C \uAD6C\uAC04\uB9CC \uB0A8\uACBC\uC2B5\uB2C8\uB2E4.':'\uC120\uD0DD\uD55C \uAD6C\uAC04\uC744 \uC0AD\uC81C\uD558\uACE0 \uC55E\uB4A4\uB97C \uC774\uC5B4 \uBD99\uC600\uC2B5\uB2C8\uB2E4.');}catch(e){toast(e.message);}}\nfunction renderInspector(){const s=current(),v=s?.scene||defaultScene();$('sceneNumber').textContent=s?pad(s.id):'\u2014';for(const[k,id]of Object.entries({title:'sceneTitle',subtitle:'sceneSubtitle',layout:'sceneLayout',motion:'sceneMotion',background:'sceneColor'}))$(id).value=v[k];$('sceneCaptions').checked=v.captions;$('sceneReviewed').checked=v.reviewed;document.querySelectorAll('.inspector input,.inspector select,.inspector textarea,.inspector button').forEach(el=>el.disabled=!s);\n const cont=!!s&&!!v.continues&&selected>0;\n $('sceneContinue').checked=cont;$('sceneContinue').disabled=!s||selected===0;$('continueNote').hidden=!cont;\n for(const id of ['sceneTitle','sceneSubtitle','sceneLayout','sceneMotion','sceneColor','sceneCaptions','replaceAsset'])$(id).disabled=!s||cont;\n syncClip(cont);if($('cutDialog').open)renderClips();}\nfunction clipNote(){const s=current();if(!s)return;const el=$('clipVideo'),d=el.duration||0,{start,end,span}=clipRange(s.scene,d),need=duration(s);\n if(!d)return void($('clipNote').textContent='\uC601\uC0C1 \uC815\uBCF4\uB97C \uC77D\uB294 \uC911\u2026');\n const short=need>span+.05,long=need>0&&span>need+.05;\n $('clipNote').classList.toggle('warn',short);\n $('clipNote').textContent=`\uC4F0\uB294 \uAD6C\uAC04 ${start.toFixed(2)}\uCD08 ~ ${end.toFixed(2)}\uCD08 \xB7 \uAE38\uC774 ${span.toFixed(2)}\uCD08 \xB7 \uC774 \uBB38\uC7A5 \uB179\uC74C ${need.toFixed(2)}\uCD08`+(short?' \xB7 \uAD6C\uAC04\uC774 \uC9E7\uC544 \uB0A8\uB294 \uC2DC\uAC04\uC740 \uB9C8\uC9C0\uB9C9 \uD654\uBA74\uC774 \uBA48\uCDA5\uB2C8\uB2E4.':long?' \xB7 \uB179\uC74C\uBCF4\uB2E4 \uAE38\uC5B4 \uB4B7\uBD80\uBD84\uC740 \uC4F0\uC774\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.':'');}\nfunction syncClip(hide){const s=current(),name=s?.scene.asset,isVideo=!hide&&!!name&&assetType(name)==='video';$('clipRow').hidden=!isVideo;\n if(!isVideo){if(clipUrl){URL.revokeObjectURL(clipUrl);clipUrl=null;}clipAsset=null;$('clipVideo').removeAttribute('src');return;}\n if(clipAsset!==name){if(clipUrl)URL.revokeObjectURL(clipUrl);clipAsset=name;clipUrl=URL.createObjectURL(project.assets[name]);$('clipVideo').src=clipUrl;}\n $('clipStart').value=(s.scene.clipStart||0).toFixed(2);$('clipEnd').value=(s.scene.clipEnd||0).toFixed(2);clipNote();}\nfunction setClip(key,value){const s=current();if(!s)return;const d=$('clipVideo').duration||0,x=Math.max(0,d?Math.min(d,value):value);\n if(key==='clipStart'){if(s.scene.clipEnd&&s.scene.clipEnd<=x)return toast('\uC2DC\uC791\uC740 \uB05D\uBCF4\uB2E4 \uC55E\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.');if(x>0)s.scene.clipStart=x;else delete s.scene.clipStart;}\n else{if(x<=(s.scene.clipStart||0))return toast('\uB05D\uC740 \uC2DC\uC791\uBCF4\uB2E4 \uB4A4\uC5EC\uC57C \uD569\uB2C8\uB2E4.');s.scene.clipEnd=x;}\n scheduleSave();syncClip();drawPreview();}\nfunction renderTimeline(){const plan=groupsOf(project.sentences);$('timeline').innerHTML=project.sentences.map((s,i)=>{const base=project.sentences[plan[i].baseIndex]||s,cont=plan[i].baseIndex!==i;return `<button class=\"timeline-card ${i===selected?'selected':''}\" data-index=\"${i}\"><div class=\"thumb\" style=\"background:${esc(base.scene.background)}\">${esc(base.scene.title||base.text).slice(0,90)}</div><p>${pad(s.id)} <span>${cont?'\u21B3 \uC55E \uC7A5\uBA74 \uC774\uC5B4\uAC10':s.scene.reviewed?'\u2713 \uAC80\uC218 \uC644\uB8CC':s.scene.asset?'\uC18C\uC7AC \uC5F0\uACB0\uB428':'\uAE30\uBCF8 \uD398\uC774\uC9C0'}</span><small>${s.audio?duration(s).toFixed(2)+'\uCD08':'\uB179\uC74C \uB300\uAE30'}</small></p></button>`;}).join('');$('timeline').querySelectorAll('[data-index]').forEach(el=>el.onclick=()=>reviewAndSelect(+el.dataset.index));}\nfunction clearMedia(){clipAsset=null;for(const v of mediaCache.values()){if(v.el instanceof HTMLVideoElement){v.el.pause();v.el.removeAttribute('src');v.el.load();}URL.revokeObjectURL(v.url);}mediaCache.clear();}\nfunction assetType(name){return /\\.(mp4|webm)$/i.test(name)?'video':/\\.(png|jpe?g|webp)$/i.test(name)?'image':null;}\nfunction blobType(name){return({mp4:'video/mp4',webm:'video/webm',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp'})[name.split('.').pop().toLowerCase()]||'application/octet-stream';}\nasync function loadMedia(name){if(!name)return null;if(mediaCache.has(name))return mediaCache.get(name).promise;const blob=project.assets[name];if(!blob)throw Error('\uC18C\uC7AC\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4: '+name);const url=URL.createObjectURL(blob),kind=assetType(name),el=kind==='video'?document.createElement('video'):new Image();const entry={url,el,promise:null};entry.promise=new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('\uC18C\uC7AC \uB85C\uB529 \uC2DC\uAC04 \uCD08\uACFC: '+name)),20000);const loaded=()=>{clearTimeout(timeout);resolve(el);};const failed=()=>{clearTimeout(timeout);reject(Error('\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uAC70\uB098 \uC190\uC0C1\uB41C \uC18C\uC7AC: '+name));};if(kind==='video'){el.muted=true;el.playsInline=true;el.preload='auto';el.onloadeddata=loaded;el.onerror=failed;}else{el.onload=loaded;el.onerror=failed;}el.src=url;});mediaCache.set(name,entry);return entry.promise;}\nfunction linesFor(g,text,maxWidth){const lines=[];for(const paragraph of String(text).split('\\n')){let line='';for(const ch of paragraph){if(g.measureText(line+ch).width>maxWidth&&line){lines.push(line);line=ch;}else line+=ch;}lines.push(line);}return lines;}\nfunction textBlock(g,text,x,y,width,size,maxLines,color='#fff',align='left'){g.font=`600 ${size}px \"Noto Sans KR\",sans-serif`;g.textAlign=align;g.fillStyle=color;let lines=linesFor(g,text,width);if(lines.length>maxLines){lines=lines.slice(0,maxLines);lines[maxLines-1]=lines[maxLines-1].slice(0,-1)+'\u2026';}lines.forEach((l,i)=>g.fillText(l,x,y+i*size*1.5));return lines.length*size*1.5;}\nfunction paintScene(g,shot){const v=shot.scene,t=shot.sceneTime,media=shot.media;g.fillStyle=v.background||'#171925';g.fillRect(0,0,1280,720);if(media){const mw=media.videoWidth||media.naturalWidth,mh=media.videoHeight||media.naturalHeight,x=v.layout==='split'?630:0,y=0,dw=v.layout==='split'?650:1280,dh=720,scale=Math.max(dw/mw,dh/mh)*(v.motion==='zoom'?1+.08*Math.min(1,t/shot.sceneSpan):1);g.save();g.beginPath();g.rect(x,y,dw,dh);g.clip();g.drawImage(media,x+(dw-mw*scale)/2,y+(dh-mh*scale)/2,mw*scale,mh*scale);if(needsScrim(v.layout,true)){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,y,dw,dh);}g.restore();}\nif(v.layout!=='full'||!media){const split=v.layout==='split',x=split?65:100,maxW=split?500:1080;g.fillStyle='#a98aff';g.fillRect(x,143,44,5);g.font='500 17px \"DM Sans\",sans-serif';g.fillStyle='#bca9eb';g.textAlign='left';g.fillText('CHAPTER '+pad(shot.chapterId),x,191);const used=textBlock(g,v.title||shot.titleText,x,277,maxW,split?40:52,split?5:4);if(v.subtitle)textBlock(g,v.subtitle,x,Math.min(568,285+used),maxW,22,2,'#c1bacd');}\nif(v.captions){g.font='500 24px \"Noto Sans KR\",sans-serif';const pages=linesFor(g,shot.captionText,1100),pairs=[];for(let i=0;i<pages.length;i+=2)pairs.push(pages.slice(i,i+2));const page=pairs[Math.min(pairs.length-1,Math.floor(Math.min(.999,shot.captionTime/shot.captionSpan)*pairs.length))]||[];const bh=page.length*36+24;g.fillStyle='#111015d9';g.fillRect(55,690-bh,1170,bh);g.textAlign='center';g.fillStyle='white';page.forEach((l,i)=>g.fillText(l,640,690-bh+35+i*36));}}\nfunction drawScene(canvas,shot,prev=null){const g=canvas.getContext('2d'),k=canvas.width/1280;g.save();g.scale(k,k);if(!shot){g.fillStyle='#171925';g.fillRect(0,0,1280,720);textBlock(g,'\uB2E4\uC74C \uC774\uC57C\uAE30\uB294 \uC5B4\uB5A4 \uC7A5\uBA74\uC77C\uAE4C\uC694?',640,338,1000,36,2,'#c6bed8','center');textBlock(g,'\uB300\uBCF8\uC744 \uC900\uBE44\uD558\uBA74 \uC774\uACF3\uC5D0 \uC7A5\uBA74\uC774 \uB098\uD0C0\uB0A9\uB2C8\uB2E4.',640,394,1000,20,2,'#777386','center');g.restore();return;}\nconst v=shot.scene,move=shot.still||shot.continued?{alpha:1,shiftX:0,covers:false}:sceneEntrance(v.motion,shot.sceneTime),under=move.covers&&prev?.scene;\nif(under)paintScene(g,prev);else{g.fillStyle=v.background||'#171925';g.fillRect(0,0,1280,720);}\ng.save();g.globalAlpha=move.alpha;g.translate(move.shiftX,0);paintScene(g,shot);g.restore();g.restore();}\nconst groupsOf=list=>sceneGroups(list.map(s=>({continues:!!s.scene.continues,seconds:duration(s)})));\nfunction shotFor(list,plan,i,t,media=null){const s=list[i];if(!s)return null;\n const g=plan[i]||{baseIndex:i,offset:0,span:duration(s)},base=list[g.baseIndex]||s;\n return{scene:base.scene,chapterId:base.id,titleText:base.text,assetName:base.scene.asset,media,\n  sceneTime:g.offset+Math.max(0,t),sceneSpan:Math.max(.1,g.span),\n  captionText:s.text,captionTime:Math.max(0,t),captionSpan:Math.max(.1,duration(s)),\n  continued:g.baseIndex!==i};}\nlet previewSeek=null,previewing=false;\nlet clipUrl=null,clipAsset=null,cutUrl=null,cutting=false,cutCancelled=false;\nconst offsetOf=i=>offsetAt(project.sentences.map(duration),i);\nlet drawVersion=0;async function drawPreview(){const version=++drawVersion;\n if(!current()){drawScene($('preview'),null);$('previewTime').textContent='00:00 / '+time(total());return;}\n const shot=shotFor(project.sentences,groupsOf(project.sentences),selected,0);shot.still=true;\n try{const media=await loadMedia(shot.assetName);if(version!==drawVersion)return;\n  if(media instanceof HTMLVideoElement){try{await seekVideo(media,clipTimeAt(shot.scene,shot.sceneTime,media.duration));}catch{}if(version!==drawVersion)return;}\n  shot.media=media;drawScene($('preview'),shot);$('previewTime').textContent=time(offsetOf(selected))+' / '+time(total());\n }catch(e){toast(e.message);shot.media=null;drawScene($('preview'),shot);}}\nasync function previewAll(){if(busy||recording)return;if(audioSource){stopPlayback();return;}if(!project.sentences.length||project.sentences.some(s=>!s.audio))return toast('\uBAA8\uB4E0 \uBB38\uC7A5\uC744 \uB179\uC74C\uD558\uBA74 \uC804\uCCB4 \uBBF8\uB9AC\uBCF4\uAE30\uB97C \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.');stopPlayback();const token=previewToken;await audioContext();$('previewPlay').textContent='\u2161 \uC7AC\uC0DD \uC911 \xB7 \uC815\uC9C0';previewing=true;let offset=0,prev=null;const plan=groupsOf(project.sentences);try{for(let i=0;i<project.sentences.length;i++){if(token!==previewToken)return;const s=project.sentences[i],shot0=shotFor(project.sentences,plan,i,0),media=await loadMedia(shot0.assetName);if(token!==previewToken)return;selected=i;renderList();renderInspector();renderTimeline();if(media instanceof HTMLVideoElement){if(!shot0.continued)media.currentTime=clipRange(shot0.scene,media.duration).start;await media.play();}const b=ctx.createBuffer(1,s.audio.length,RATE);b.copyToChannel(s.audio,0);const src=ctx.createBufferSource();src.buffer=b;src.connect(ctx.destination);audioSource=src;const start=ctx.currentTime;src.start();await new Promise(resolve=>{const tick=()=>{if(token!==previewToken||previewSeek!==null)return resolve();const t=ctx.currentTime-start;if(media instanceof HTMLVideoElement&&media.currentTime>=clipRange(shot0.scene,media.duration).end)media.pause();drawScene($('preview'),shotFor(project.sentences,plan,i,Math.min(t,duration(s)),media),prev);$('previewTime').textContent=time(offset+t)+' / '+time(total());if(t>=duration(s))resolve();else requestAnimationFrame(tick);};tick();});if(media instanceof HTMLVideoElement)media.pause();if(previewSeek!==null){const target=previewSeek;previewSeek=null;try{src.stop();}catch{}audioSource=null;i=target-1;offset=offsetOf(target);prev=null;continue;}offset+=duration(s);prev=shotFor(project.sentences,plan,i,duration(s),media);}if(token===previewToken)stopPlayback();}catch(e){stopPlayback();toast(e.message);}}\nconst ASTRA_GUIDE=`# \uBC84\uCF5C \uC2A4\uD29C\uB514\uC624 \xB7 Astra \uC7A5\uBA74 \uC81C\uC791 \uC694\uCCAD\\n\\n\uC774 ZIP\uC758 manifest.json\uACFC \uC22B\uC790 WAV\uB97C \uC77D\uACE0 \uAC01 \uBB38\uC7A5\uC5D0 \uC5B4\uC6B8\uB9AC\uB294 \uC774\uBBF8\uC9C0\xB7\uC560\uB2C8\uBA54\uC774\uC158 \uC7A5\uBA74 \uD328\uD0A4\uC9C0\uB97C \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694. \uB179\uC74C \uC21C\uC11C\uB294 id \uC21C\uC11C\uC774\uBA70 \uAE38\uC774\uB294 durationSeconds\uC785\uB2C8\uB2E4. \uB300\uC0AC\uB294 \uADF8\uB300\uB85C \uC720\uC9C0\uD558\uC138\uC694.\\n\\n## \uBC18\uD658 ZIP \uADDC\uACA9 (version: 1)\\nZIP \uCD5C\uC0C1\uC704\uC5D0 scenes.json, \uC18C\uC7AC\uB294 assets/\uC5D0 \uB123\uC73C\uC138\uC694. \uC678\uBD80 URL\uACFC \uC2E4\uD589 \uCF54\uB4DC, HTML\uC740 \uBC1B\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uC774\uBBF8\uC9C0\uB294 PNG/JPG/WebP, \uC601\uC0C1\uC740 MP4/WebM\uC785\uB2C8\uB2E4. \uD3F0\uD2B8\xB7\uD14D\uC2A4\uD2B8\xB7\uAE30\uBCF8 \uC560\uB2C8\uBA54\uC774\uC158\uC740 \uD3B8\uC9D1\uAE30\uC758 \uB3D9\uC77C\uD55C \uCE94\uBC84\uC2A4 \uB80C\uB354\uB7EC\uAC00 \uC7AC\uD604\uD569\uB2C8\uB2E4. \uBCF5\uC7A1\uD55C \uC560\uB2C8\uBA54\uC774\uC158\uC740 16:9 \uC601\uC0C1\uC73C\uB85C \uB80C\uB354\uD574 \uC18C\uC7AC\uB85C \uB123\uC73C\uC138\uC694.\\n\\nscenes.json \uC608\uC2DC:\\n\\n{\\n  \"version\": 1,\\n  \"scenes\": [\\n    { \"id\": 1, \"title\": \"\uCCAB \uBC88\uC9F8 \uC774\uC57C\uAE30\", \"subtitle\": \"\uC9E7\uC740 \uBCF4\uC870 \uBB38\uAD6C\", \"asset\": \"assets/001.png\", \"layout\": \"split\", \"motion\": \"fade\", \"background\": \"#171925\", \"captions\": true }\\n  ]\\n}\\n\\n- id: manifest.json\uC758 \uBB38\uC7A5 id(\uC815\uC218)\uC640 \uC815\uD655\uD788 \uC77C\uCE58. \uC911\uBCF5 \uAE08\uC9C0.\\n- title, subtitle: \uD14D\uC2A4\uD2B8. title\uC774 \uBE44\uBA74 \uB300\uC0AC\uB97C \uC0AC\uC6A9. title\uC740 \uD55C\uAE00 65\uC790 \uC774\uB0B4 \uAD8C\uC7A5(\uAE34 \uACBD\uC6B0 \uD654\uBA74\uC5D0\uC11C \uC0DD\uB7B5\uB428).\\n- asset: ZIP \uB0B4\uBD80\uC758 \uC0C1\uB300 \uACBD\uB85C. \uC0DD\uB7B5\uD558\uBA74 \uD0C0\uC774\uD2C0 \uD398\uC774\uC9C0.\\n- layout: title(\uD14D\uC2A4\uD2B8 \uC911\uC2EC), split(\uC88C \uD14D\uC2A4\uD2B8\xB7\uC6B0 \uC18C\uC7AC), full(\uC804\uCCB4 \uC18C\uC7AC).\\n- motion: fade / zoom / slide / none. duration\uC740 \uC74C\uC131 \uAE38\uC774\uB85C \uC790\uB3D9 \uACB0\uC815.\\n- background: #RRGGBB. captions: true/false.\\n- 1280\xD7720 \uB610\uB294 1920\xD71080\uC758 16:9. \uC548\uC804 \uC5EC\uBC31 5%.\\n- \uC601\uC0C1\uC740 \uB179\uC74C \uAE38\uC774 \uC774\uC0C1 \uAD8C\uC7A5. \uC9E7\uC740 \uC601\uC0C1\uC740 \uB9C8\uC9C0\uB9C9 \uD504\uB808\uC784\uC744 \uC720\uC9C0. \uC601\uC0C1 \uC6D0\uC74C\uC740 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC74C. \uC790\uB9C9 \uD398\uC774\uC9C0\uB294 \uB179\uC74C \uAE38\uC774\uC5D0 \uBE44\uB840\uD574 \uC804\uD658\uD558\uBA70 \uB2E8\uC5B4 \uB2E8\uC704 \uB3D9\uAE30\uD654\uAC00 \uC544\uB2D8.\\n- HTML/CSS/JS \uD398\uC774\uC9C0\uB294 \uC9C1\uC811 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC73C\uBBC0\uB85C \uC774\uBBF8\uC9C0\uB098 \uC601\uC0C1\uC73C\uB85C \uBCC0\uD658 \uD6C4 \uB123\uAE30.\\n- \uD30C\uC77C \uC774\uB984\uB9CC \uC22B\uC790\uC778 \uC774\uBBF8\uC9C0\xB7\uC601\uC0C1(001.png, 002.mp4)\uB3C4 \uC9C1\uC811 \uAC00\uC838\uC62C \uC218 \uC788\uC74C.\\n\\nAstra\uB294 \uBCC4\uB3C4 \uB300\uD654\uC5D0\uC11C \uC774 \uD328\uD0A4\uC9C0\uB97C \uC81C\uC791\uD569\uB2C8\uB2E4. \uD3B8\uC9D1\uAE30\uB294 AI \uC11C\uBE44\uC2A4\uC5D0 \uC790\uB3D9\uC73C\uB85C \uC811\uC18D\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.\\n`;\nfunction zipAsync(files){return new Promise((resolve,reject)=>zip(files,{level:0},(e,data)=>e?reject(e):resolve(data)));}\nasync function exportPackage(full=false){if(busy||recording)return;if(!project.sentences.length)return toast('\uBA3C\uC800 \uB300\uBCF8\uC744 \uCD94\uAC00\uD558\uC138\uC694.');if(!full&&!project.sentences.some(s=>s.audio))return toast('\uCD5C\uC18C \uD55C \uBB38\uC7A5\uC744 \uB179\uC74C\uD558\uC138\uC694.');setBusy(true);try{const files={},manifest={version:1,name:project.name,sampleRate:RATE,channels:1,sentences:project.sentences.map(s=>({id:s.id,text:s.text,audio:s.audio?pad(s.id)+'.wav':null,durationSeconds:duration(s),scene:s.scene}))};for(const s of project.sentences)if(s.audio)files[pad(s.id)+'.wav']=wavBytes(s.audio);files['manifest.json']=strToU8(JSON.stringify(manifest,null,2));files['script.txt']=strToU8(project.sentences.map(s=>pad(s.id)+'\\t'+s.text).join('\\n'));files['ASTRA_README.md']=strToU8(ASTRA_GUIDE);if(full){files['project.json']=strToU8(JSON.stringify(manifest,null,2));for(const[name,blob]of Object.entries(project.assets))files[name]=new Uint8Array(await blob.arrayBuffer());files['scenes.json']=strToU8(JSON.stringify({version:1,scenes:project.sentences.map(s=>({id:s.id,...s.scene}))},null,2));}download(new Blob([await zipAsync(files)],{type:'application/zip'}),fileName()+(full?'_project.zip':'_audio.zip'));toast(full?'\uD504\uB85C\uC81D\uD2B8 \uBC31\uC5C5\uC744 \uB2E4\uC6B4\uB85C\uB4DC\uD588\uC2B5\uB2C8\uB2E4.':'\uC22B\uC790 WAV\uC640 Astra \uC791\uC5C5 \uC548\uB0B4\uB97C \uB2E4\uC6B4\uB85C\uB4DC\uD588\uC2B5\uB2C8\uB2E4.');}catch(e){toast('ZIP \uC800\uC7A5 \uC2E4\uD328: '+e.message);}finally{setBusy(false);}}\nfunction readZip(data){let size=0;const files=unzipSync(data,{filter:f=>{size+=f.originalSize;if(size>1024*1024*1024)throw Error('\uC555\uCD95 \uD574\uC81C \uD06C\uAE30\uAC00 1GB\uB97C \uB118\uC2B5\uB2C8\uB2E4. \uC18C\uC7AC\uB97C \uB098\uB204\uC5B4 \uAC00\uC838\uC624\uC138\uC694.');return !f.name.endsWith('/')&&!f.name.startsWith('__MACOSX/')&&!/(^|\\/)\\./.test(f.name);}});return files;}\nasync function importSceneFiles(fileList,replace=false){if(!current())return toast('\uBA3C\uC800 \uB300\uBCF8\uC744 \uC900\uBE44\uD558\uC138\uC694.');if(busy||recording)return;setBusy(true);stopPlayback();try{const files={};for(const f of fileList){if(f.size>1024*1024*1024)throw Error('\uD30C\uC77C\uC740 1GB \uC774\uD558\uB85C \uAC00\uC838\uC624\uC138\uC694.');if(/\\.zip$/i.test(f.name))Object.assign(files,readZip(new Uint8Array(await f.arrayBuffer())));else files[f.name]=new Uint8Array(await f.arrayBuffer());}const assets={},updates=[],jsonKey=Object.keys(files).find(n=>n==='scenes.json'||n.endsWith('/scenes.json'));if(jsonKey){const spec=JSON.parse(strFromU8(files[jsonKey]));if(spec.version!==1||!Array.isArray(spec.scenes))throw Error('scenes.json\uC758 version: 1\uACFC scenes \uBC30\uC5F4\uC744 \uD655\uC778\uD558\uC138\uC694.');const prefix=jsonKey.slice(0,-'scenes.json'.length),ids=new Set();for(const raw of spec.scenes){const scene=validScene(raw);if(ids.has(scene.id))throw Error('\uC911\uBCF5 \uC7A5\uBA74 \uBC88\uD638: '+scene.id);ids.add(scene.id);if(!project.sentences.some(s=>s.id===scene.id))throw Error('\uB300\uBCF8\uC5D0 \uC5C6\uB294 \uBB38\uC7A5 \uBC88\uD638: '+scene.id);if(scene.asset){const key=prefix+scene.asset;if(!files[key]||!assetType(key))throw Error('\uC7A5\uBA74 \uC18C\uC7AC \uB204\uB77D \uB610\uB294 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uD615\uC2DD: '+scene.asset);const normalized='assets/'+scene.id+'_'+scene.asset.split('/').pop();assets[normalized]=new Blob([files[key]],{type:blobType(key)});scene.asset=normalized;}updates.push(scene);}}else{for(const[name,bytes]of Object.entries(files)){if(!assetType(name))continue;const n=name.split('/').pop().match(/^(\\d+)\\./),id=replace?current().id:n?Number(n[1]):null;if(!id||!project.sentences.some(s=>s.id===id))throw Error('\uC18C\uC7AC \uD30C\uC77C\uBA85\uC740 \uBB38\uC7A5 \uBC88\uD638\uC5EC\uC57C \uD569\uB2C8\uB2E4: 001.png, 002.mp4');const key='assets/'+id+'_'+name.split('/').pop();assets[key]=new Blob([bytes],{type:blobType(name)});if(updates.some(s=>s.id===id))throw Error('\uD55C \uBB38\uC7A5\uC5D0 \uC18C\uC7AC\uAC00 \uC5EC\uB7EC \uAC1C\uC785\uB2C8\uB2E4.');updates.push({id,asset:key,layout:'full'});}}if(!updates.length)throw Error('\uAC00\uC838\uC62C \uC7A5\uBA74\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.');clearMedia();Object.assign(project.assets,assets);for(const scene of updates){const s=project.sentences.find(s=>s.id===scene.id);if(jsonKey)s.scene={...defaultScene(),...scene,reviewed:false};else s.scene={...s.scene,...scene,reviewed:false};}scheduleSave();render();toast(updates.length+'\uAC1C \uC7A5\uBA74\uC744 \uB179\uC74C \uAE38\uC774\uC5D0 \uB9DE\uCDB0 \uC5F0\uACB0\uD588\uC2B5\uB2C8\uB2E4.');}catch(e){toast('\uC7A5\uBA74 \uAC00\uC838\uC624\uAE30 \uC2E4\uD328: '+e.message);}finally{setBusy(false);}}\nasync function restoreProject(file){if(busy||recording)return;if(project.sentences.length&&!confirm('\uD604\uC7AC \uC791\uC5C5\uC744 \uC774 ZIP\uC758 \uD504\uB85C\uC81D\uD2B8\uB85C \uAD50\uCCB4\uD560\uAE4C\uC694?'))return;setBusy(true);try{const files=readZip(new Uint8Array(await file.arrayBuffer())),raw=files['project.json']||files['manifest.json'];if(!raw)throw Error('\uD504\uB85C\uC81D\uD2B8 \uB610\uB294 \uB179\uC74C ZIP\uC744 \uC120\uD0DD\uD558\uC138\uC694.');const m=JSON.parse(strFromU8(raw));if(m.version!==1||!Array.isArray(m.sentences)||m.sentences.length>2000)throw Error('\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uD504\uB85C\uC81D\uD2B8\uC785\uB2C8\uB2E4.');const next={version:1,name:String(m.name||'\uAC00\uC838\uC628 \uD504\uB85C\uC81D\uD2B8'),sentences:[],assets:{}},ids=new Set();for(const item of m.sentences){if(typeof item.text!=='string')throw Error('\uBB38\uC7A5 \uD14D\uC2A4\uD2B8 \uC624\uB958');const scene=validScene({id:item.id,...item.scene});if(ids.has(scene.id))throw Error('\uC911\uBCF5 \uBB38\uC7A5 \uBC88\uD638');ids.add(scene.id);const s=newSentence(item.text,scene.id);s.scene={...defaultScene(),...scene,reviewed:!!item.scene?.reviewed};if(item.audio){if(!files[item.audio])throw Error('\uB204\uB77D\uB41C \uB179\uC74C: '+item.audio);s.audio=await decodeAudio(new Blob([files[item.audio]]));}if(scene.asset){if(!files[scene.asset]){delete s.scene.asset;s.scene.reviewed=false;}else next.assets[scene.asset]=new Blob([files[scene.asset]],{type:blobType(scene.asset)});}next.sentences.push(s);}for(const[name,bytes]of Object.entries(files))if(name.startsWith('clips/')&&assetType(name)&&!next.assets[name])next.assets[name]=new Blob([bytes],{type:blobType(name)});stopPlayback();clearMedia();project=next;selected=0;undo.clear();$('projectName').value=project.name;scheduleSave();render();toast('\uD504\uB85C\uC81D\uD2B8\uB97C \uBCF5\uC6D0\uD588\uC2B5\uB2C8\uB2E4.');}catch(e){toast('\uD504\uB85C\uC81D\uD2B8 \uBCF5\uC6D0 \uC2E4\uD328: '+e.message);}finally{setBusy(false);}}\nasync function seekVideo(video,t){const target=Math.max(0,Math.min(t,Math.max(0,video.duration-.035)));if(Math.abs(video.currentTime-target)<.0005&&video.readyState>=2)return;await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>{clean();reject(Error('\uC601\uC0C1 \uD504\uB808\uC784\uC744 \uC77D\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC18C\uC7AC\uB97C MP4 H.264\uB85C \uBCC0\uD658\uD574 \uC8FC\uC138\uC694.'));},10000);const clean=()=>{clearTimeout(timeout);video.removeEventListener('seeked',done);video.removeEventListener('error',fail);};const done=()=>{clean();resolve();},fail=()=>{clean();reject(Error('\uC601\uC0C1 \uC18C\uC7AC \uC624\uB958'));};video.addEventListener('seeked',done);video.addEventListener('error',fail);video.currentTime=target;});}\nasync function renderMp4(){if(busy||recording)return;const list=project.sentences;if(!list.length||list.some(s=>!s.audio||(!s.scene.continues&&!s.scene.reviewed)))return toast('\uB179\uC74C\uACFC \uC7A5\uBA74 \uAC80\uC218\uB97C \uBA3C\uC800 \uC644\uB8CC\uD558\uC138\uC694.');if(!globalThis.VideoEncoder||!globalThis.AudioEncoder)return toast('\uC774 \uBE0C\uB77C\uC6B0\uC800\uB294 MP4 \uC778\uCF54\uB529\uC744 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. PC Chrome \uB610\uB294 Edge\uC5D0\uC11C \uD504\uB85C\uC81D\uD2B8 ZIP\uC744 \uC5F4\uC5B4 \uC8FC\uC138\uC694.');let fileHandle=null,writer=null,ve=null,ae=null,wakeLock=null;renderCancelled=false;stopPlayback();const width=+$('resolution').value,height=width*9/16;try{if(globalThis.showSaveFilePicker){try{fileHandle=await showSaveFilePicker({suggestedName:fileName()+'.mp4',types:[{description:'MP4 \uC601\uC0C1',accept:{'video/mp4':['.mp4']}}]});}catch(e){if(e.name==='AbortError')return;fileHandle=null;}}setBusy(true);const videoConfig={codec:'avc1.420028',width,height,bitrate:width===1920?6500000:3500000,framerate:30,latencyMode:'realtime',avc:{format:'avc'}},audioConfig={codec:'mp4a.40.2',sampleRate:RATE,numberOfChannels:1,bitrate:128000};const [vs,as]=await Promise.all([VideoEncoder.isConfigSupported(videoConfig),AudioEncoder.isConfigSupported(audioConfig)]);if(!vs.supported||!as.supported)throw Error('\uC774 \uAE30\uAE30\uC5D0\uC11C H.264/AAC MP4 \uC778\uCF54\uB529\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. PC Chrome\xB7Edge\uB85C \uD504\uB85C\uC81D\uD2B8 ZIP\uC744 \uC62E\uACA8 \uC8FC\uC138\uC694.');if(!fileHandle&&total()*(videoConfig.bitrate+128000)/8>700*1024*1024)throw Error('\uAE34 \uC601\uC0C1\uC740 \uC9C1\uC811 \uD30C\uC77C \uC800\uC7A5\uC774 \uAC00\uB2A5\uD55C PC Chrome\xB7Edge\uC5D0\uC11C \uB80C\uB354\uB9C1\uD558\uC138\uC694.');if(fileHandle)writer=await fileHandle.createWritable();try{wakeLock=await navigator.wakeLock?.request('screen');}catch{}const target=writer?new FileSystemWritableFileStreamTarget(writer):new ArrayBufferTarget(),muxer=new Muxer({target,video:{codec:'avc',width,height,frameRate:30},audio:{codec:'aac',numberOfChannels:1,sampleRate:RATE},fastStart:false,firstTimestampBehavior:'offset'});let encoderError=null;ve=new VideoEncoder({output:(chunk,meta)=>{try{muxer.addVideoChunk(chunk,meta);}catch(e){encoderError=e;}},error:e=>encoderError=e});ae=new AudioEncoder({output:(chunk,meta)=>{try{muxer.addAudioChunk(chunk,meta);}catch(e){encoderError=e;}},error:e=>encoderError=e});ve.configure(videoConfig);ae.configure(audioConfig);const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;await document.fonts.ready;$('renderProgress').hidden=false;$('cancelRender').hidden=false;$('renderProgress').value=0;let sampleOffset=0,frame=0;\nconst packets=audioPackets(list.map(s=>s.audio));let packet=packets.next();\nconst drain=async(encoder,limit)=>{while(encoder.encodeQueueSize>limit){if(renderCancelled)throw Error('\uB80C\uB354\uB9C1\uC744 \uCDE8\uC18C\uD588\uC2B5\uB2C8\uB2E4.');if(encoderError)throw encoderError;await new Promise(resolve=>setTimeout(resolve,1));}};\nconst encodeAudioUntil=async(timeUs)=>{while(!packet.done&&packet.value.timestamp<timeUs){if(encoderError)throw encoderError;const {data,timestamp}=packet.value;const ad=new AudioData({format:'f32',sampleRate:RATE,numberOfFrames:data.length,numberOfChannels:1,timestamp,data});try{ae.encode(ad);}finally{ad.close();}packet=packets.next();await drain(ae,32);}};\nconst frameTotal=Math.ceil(total()*30),started=performance.now(),plan=groupsOf(list);let prev=null;for(let i=0;i<list.length;i++){if(renderCancelled)throw Error('\uB80C\uB354\uB9C1\uC744 \uCDE8\uC18C\uD588\uC2B5\uB2C8\uB2E4.');const s=list[i],shot0=shotFor(list,plan,i,0),media=await loadMedia(shot0.assetName),start=sampleOffset/RATE,end=(sampleOffset+s.audio.length)/RATE;if(media instanceof HTMLVideoElement)media.pause();for(;frame<Math.ceil(end*30);frame++){if(renderCancelled)throw Error('\uB80C\uB354\uB9C1\uC744 \uCDE8\uC18C\uD588\uC2B5\uB2C8\uB2E4.');if(encoderError)throw encoderError;const t=Math.max(0,frame/30-start);const shot=shotFor(list,plan,i,t,media);if(media instanceof HTMLVideoElement)await seekVideo(media,clipTimeAt(shot.scene,shot.sceneTime,media.duration));drawScene(canvas,shot,prev);const vf=new VideoFrame(canvas,{timestamp:Math.round(frame*1e6/30),duration:Math.round((frame+1)*1e6/30)-Math.round(frame*1e6/30)});ve.encode(vf,{keyFrame:frame%60===0});vf.close();await encodeAudioUntil(Math.round((frame+1)*1e6/30));await drain(ve,8);if(frame%15===0){const fraction=(frame+1)/frameTotal;$('renderProgress').value=fraction;const elapsed=(performance.now()-started)/1000;$('renderStatus').textContent=`${Math.round(fraction*100)}% \xB7 \uBB38\uC7A5 ${pad(s.id)} \xB7 \uACBD\uACFC ${time(elapsed)} \xB7 \uC774 \uD0ED\uC744 \uC5F4\uC5B4 \uB450\uC138\uC694`;await new Promise(r=>setTimeout(r,0));}}sampleOffset+=s.audio.length;prev=shotFor(list,plan,i,duration(s),media);}await encodeAudioUntil(Infinity);await Promise.all([ve.flush(),ae.flush()]);if(encoderError)throw encoderError;if(renderCancelled)throw Error('\uB80C\uB354\uB9C1\uC744 \uCDE8\uC18C\uD588\uC2B5\uB2C8\uB2E4.');muxer.finalize();if(writer){await writer.close();writer=null;}else download(new Blob([target.buffer],{type:'video/mp4'}),fileName()+'.mp4');$('renderProgress').value=1;$('renderStatus').textContent='MP4 \uC800\uC7A5 \uC644\uB8CC \xB7 '+width+' \xD7 '+height+' \xB7 '+time(total());toast('\uB871\uD3FC MP4\uB97C \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.');}catch(e){if(writer)try{await writer.abort();}catch{}$('renderStatus').textContent=e.message;toast(e.message);}finally{if(ve?.state!=='closed')try{ve?.close();}catch{}if(ae?.state!=='closed')try{ae?.close();}catch{}await wakeLock?.release().catch(()=>{});$('cancelRender').hidden=true;setBusy(false);}}\nconst on=(id,fn)=>$(id).addEventListener('click',async()=>{if((busy||recording)&&!['recordBtn','cancelRender','previewStop'].includes(id))return;try{await fn();}catch(e){toast(e.message||'\uC791\uC5C5\uC744 \uC644\uB8CC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.');}});\ndocument.querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>switchTab(el.dataset.tab));on('goExport',()=>switchTab('export'));on('uploadTxt',()=>$('txtInput').click());on('pasteBtn',()=>$('textDialog').showModal());on('applyText',()=>{replaceScript($('pasteText').value);$('textDialog').close();});on('sampleBtn',()=>{replaceScript('\uC88B\uC740 \uC774\uC57C\uAE30\uB294 \uD55C \uBB38\uC7A5\uC5D0\uC11C \uC2DC\uC791\uB429\uB2C8\uB2E4.\\n\uC7A0\uAE50 \uB9D0\uC744 \uBA48\uCDB0\uB3C4 \uAD1C\uCC2E\uC544\uC694. \uB2E4\uC2DC \uB9D0\uD558\uACE0, \uD544\uC694\uD55C \uBD80\uBD84\uB9CC \uB0A8\uAE30\uBA74 \uB429\uB2C8\uB2E4.\\n\uC774\uC81C \uBAA9\uC18C\uB9AC\uC5D0 \uC7A5\uBA74\uC744 \uB354\uD574 \uD558\uB098\uC758 \uC601\uC0C1\uC73C\uB85C \uC644\uC131\uD574 \uBCFC\uAE4C\uC694?');project.name='\uB098\uC758 \uCCAB \uBC88\uC9F8 \uB871\uD3FC';$('projectName').value=project.name;scheduleSave();});on('addSentence',()=>{project.sentences.push(newSentence('',Math.max(0,...project.sentences.map(s=>s.id))+1));selected=project.sentences.length-1;changed();render();$('sentenceText').focus();});on('recordBtn',startRecording);on('playAudio',playSelected);on('prevSentence',()=>selectSentence(selected-1));on('nextSentence',()=>selectSentence(selected+1));on('keepRange',()=>editSelected(true));on('deleteRange',()=>editSelected(false));on('trimSilence',()=>{if(current()?.audio){stopPlayback();updateAudio(trimAudio(current().audio));toast('\uC55E\uB4A4\uC758 \uC791\uC740 \uBB34\uC74C\uC744 \uC815\uB9AC\uD588\uC2B5\uB2C8\uB2E4.');}});on('undoAudio',()=>{const s=current(),old=undo.get(s?.id);if(old){stopPlayback();s.audio=old;undo.delete(s.id);changed();render();toast('\uC9C1\uC804 \uC624\uB514\uC624 \uD3B8\uC9D1\uC744 \uBCF5\uC6D0\uD588\uC2B5\uB2C8\uB2E4.');}});on('importAudio',()=>{if(!current())return toast('\uBB38\uC7A5\uC744 \uBA3C\uC800 \uC120\uD0DD\uD558\uC138\uC694.');$('audioInput').click();});on('exportAudio',()=>exportPackage());on('exportAudio2',()=>exportPackage());on('saveProject',()=>exportPackage(true));on('backupBtn',()=>exportPackage(true));on('openProject',()=>$('projectInput').click());let replaceMode=false;on('importScenes',()=>{replaceMode=false;$('sceneInput').multiple=true;$('sceneInput').click();});on('replaceAsset',()=>{replaceMode=true;$('sceneInput').multiple=false;$('sceneInput').click();});on('sceneTemplate',async()=>{const scenes={version:1,scenes:(project.sentences.length?project.sentences:[newSentence('\uCCAB \uBC88\uC9F8 \uC774\uC57C\uAE30',1)]).map(s=>({id:s.id,title:s.text,subtitle:'',layout:'title',motion:'fade',background:'#171925',captions:true,continues:false,clipStart:0,clipEnd:0}))};download(new Blob([await zipAsync({'scenes.json':strToU8(JSON.stringify(scenes,null,2)),'ASTRA_README.md':strToU8(ASTRA_GUIDE)})],{type:'application/zip'}),'astra_scene_template.zip');});on('previewPlay',previewAll);on('previewStop',()=>{stopPlayback();drawPreview();});on('renderMp4',renderMp4);on('cancelRender',()=>{renderCancelled=true;$('renderStatus').textContent='\uB80C\uB354\uB9C1\uC744 \uC911\uB2E8\uD558\uB294 \uC911\u2026';});on('guideBtn',()=>$('guideDialog').showModal());on('closeGuide',()=>$('guideDialog').close());\n$('txtInput').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file||busy||recording)return;try{if(file.size>2*1024*1024)throw Error('\uB300\uBCF8 TXT\uB294 2MB \uC774\uD558\uB85C \uAC00\uC838\uC624\uC138\uC694.');const bytes=await file.arrayBuffer();let text=new TextDecoder('utf-8',{fatal:true});try{text=text.decode(bytes);}catch{text=new TextDecoder('euc-kr').decode(bytes);}replaceScript(text);}catch(e){toast(e.message);}};\n$('audioInput').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file||busy||recording)return;if(current()?.audio&&!$('appendRecording').checked&&!confirm('\uD604\uC7AC \uBB38\uC7A5 \uB179\uC74C\uC744 \uC774 \uD30C\uC77C\uB85C \uAD50\uCCB4\uD560\uAE4C\uC694?'))return;setBusy(true);try{const audio=await decodeAudio(file);updateAudio($('appendRecording').checked&&current().audio?joinAudio(current().audio,audio):audio);}catch(e){toast(e.message);}finally{setBusy(false);}};\n$('sceneInput').onchange=async e=>{const files=[...e.target.files];e.target.value='';if(files.length)await importSceneFiles(files,replaceMode);};$('projectInput').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(file)await restoreProject(file);};\n$('sentenceText').oninput=()=>{if(current()&&!busy&&!recording){current().text=$('sentenceText').value;changed();renderList();}};$('projectName').oninput=()=>{project.name=$('projectName').value;scheduleSave();};for(const id of['cutStart','cutEnd'])$(id).oninput=()=>drawWave();\nfor(const[k,id]of Object.entries({title:'sceneTitle',subtitle:'sceneSubtitle',layout:'sceneLayout',motion:'sceneMotion',background:'sceneColor'}))$(id).oninput=()=>{if(!current()||busy)return;stopPlayback();current().scene[k]=$(id).value;changed();$('sceneReviewed').checked=false;drawPreview();renderTimeline();};$('sceneCaptions').onchange=()=>{if(current()){current().scene.captions=$('sceneCaptions').checked;changed();$('sceneReviewed').checked=false;drawPreview();}};// \u2500\u2500 \uC601\uC0C1 \uC790\uB974\uAE30 \uB3C4\uAD6C \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nconst clipKeys=()=>Object.keys(project.assets).filter(k=>k.startsWith('clips/')).sort();\nconst clipLabel=key=>key.slice('clips/'.length);\nconst srcSpan=()=>clipRange({clipStart:+$('srcStart').value||0,clipEnd:+$('srcEnd').value||0},$('srcVideo').duration||0);\nfunction srcNote(extra){\n const s=current(),el=$('srcVideo');\n if(extra!==undefined)return void($('srcStatus').textContent=extra);\n if(!el.duration)return void($('srcStatus').textContent='\uC6D0\uBCF8 \uC601\uC0C1\uC744 \uC5F4\uBA74 \uAD6C\uAC04\uC744 \uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.');\n const {start,end,span}=srcSpan();\n $('srcStatus').textContent=`\uC790\uB97C \uAD6C\uAC04 ${start.toFixed(2)}\uCD08 ~ ${end.toFixed(2)}\uCD08 \xB7 \uAE38\uC774 ${span.toFixed(2)}\uCD08`\n  +(s?` \xB7 \uC9C0\uAE08 \uACE0\uB978 \uBB38\uC7A5 ${pad(s.id)} \uB179\uC74C ${duration(s).toFixed(2)}\uCD08`:'');\n}\nfunction renderClips(){\n const keys=clipKeys(),list=$('clipList'),s=current();\n $('clipCount').textContent=keys.length;list.replaceChildren();\n if(!keys.length)return void(list.textContent='\uC544\uC9C1 \uC798\uB77C \uB454 \uC601\uC0C1\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC6D0\uBCF8\uC744 \uC5F4\uACE0 \uAD6C\uAC04\uC744 \uC798\uB77C \uBCF4\uC138\uC694.');\n for(const key of keys){\n  const row=document.createElement('div');row.className='clip-item'+(s?.scene.asset===key?' current':'');\n  const info=document.createElement('div');info.className='clip-info';\n  const name=document.createElement('strong'),meta=document.createElement('small');\n  name.textContent='\u2702 '+clipLabel(key);\n  const used=project.sentences.filter(x=>x.scene.asset===key).map(x=>pad(x.id));\n  meta.textContent=(project.assets[key].size/1048576).toFixed(1)+'MB'+(used.length?' \xB7 \uBB38\uC7A5 '+used.join(', ')+'\uC5D0\uC11C \uC0AC\uC6A9 \uC911':' \xB7 \uC544\uC9C1 \uB123\uC9C0 \uC54A\uC74C');\n  info.append(name,meta);\n  const acts=document.createElement('div');acts.className='clip-item-actions';\n  const use=document.createElement('button');use.className='primary';use.disabled=!s;\n  use.textContent=s?`\uBB38\uC7A5 ${pad(s.id)}\uC5D0 \uB123\uAE30`:'\uBB38\uC7A5\uC744 \uBA3C\uC800 \uACE0\uB974\uC138\uC694';use.onclick=()=>useClip(key);\n  const dl=document.createElement('button');dl.className='text-btn';dl.textContent='\uB0B4\uB824\uBC1B\uAE30';\n  dl.onclick=()=>download(project.assets[key],clipLabel(key));\n  const del=document.createElement('button');del.className='text-btn danger';del.textContent='\uC0AD\uC81C';\n  del.onclick=()=>removeClip(key);\n  acts.append(use,dl,del);row.append(info,acts);list.append(row);\n }\n}\nfunction useClip(key){\n const s=current();if(!s)return toast('\uBB38\uC7A5\uC744 \uBA3C\uC800 \uACE0\uB974\uC138\uC694.');\n if(!project.assets[key])return toast('\uC870\uAC01\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.');\n s.scene.asset=key;s.scene.layout='full';delete s.scene.clipStart;delete s.scene.clipEnd;s.scene.reviewed=false;\n clearMedia();scheduleSave();\n const next=Math.min(project.sentences.length-1,selected+1),moved=next!==selected;\n toast(`\uBB38\uC7A5 ${pad(s.id)}\uC5D0 \uB123\uC5C8\uC2B5\uB2C8\uB2E4.`+(moved?` \uB2E4\uC74C \uBB38\uC7A5 ${pad(project.sentences[next].id)}\uB85C \uC62E\uACBC\uC2B5\uB2C8\uB2E4.`:''));\n selected=next;render();renderClips();\n}\nfunction removeClip(key){\n const used=project.sentences.filter(s=>s.scene.asset===key);\n if(!confirm(`\u2018${clipLabel(key)}\u2019 \uC870\uAC01\uC744 \uC9C0\uC6B8\uAE4C\uC694?`+(used.length?` \uBB38\uC7A5 ${used.map(s=>pad(s.id)).join(', ')}\uC5D0\uC11C \uC4F0\uACE0 \uC788\uC5B4 \uADF8 \uC7A5\uBA74\uC758 \uC601\uC0C1\uB3C4 \uC0AC\uB77C\uC9D1\uB2C8\uB2E4.`:'')))return;\n for(const s of used){delete s.scene.asset;delete s.scene.clipStart;delete s.scene.clipEnd;s.scene.reviewed=false;}\n delete project.assets[key];clearMedia();scheduleSave();render();renderClips();\n toast('\uC870\uAC01\uC744 \uC9C0\uC6E0\uC2B5\uB2C8\uB2E4.');\n}\nasync function cutClip(){\n if(cutting)return;\n const video=$('srcVideo');\n if(!video.duration)throw Error('\uC6D0\uBCF8 \uC601\uC0C1\uC744 \uBA3C\uC800 \uC5F4\uC5B4 \uC8FC\uC138\uC694.');\n if(!globalThis.VideoEncoder)throw Error('\uC774 \uBE0C\uB77C\uC6B0\uC800\uB294 \uC601\uC0C1 \uC790\uB974\uAE30\uB97C \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. PC Chrome \uB610\uB294 Edge\uB97C \uC0AC\uC6A9\uD558\uC138\uC694.');\n const {start,end,span}=srcSpan();\n if(span<.1)throw Error('\uAD6C\uAC04\uC774 \uB108\uBB34 \uC9E7\uC2B5\uB2C8\uB2E4. \uC2DC\uC791\uACFC \uB05D\uC744 \uB2E4\uC2DC \uC815\uD558\uC138\uC694.');\n if(span>300)throw Error('\uD55C \uBC88\uC5D0 5\uBD84 \uC774\uD558\uB85C \uC798\uB77C \uC8FC\uC138\uC694.');\n const {width,height}=clipOutputSize(video.videoWidth,video.videoHeight,+$('resolution').value||1280);\n const base={width,height,bitrate:width>=1920?6500000:3500000,framerate:30,latencyMode:'realtime'};\n const pick=await pickClipCodec(base,c=>VideoEncoder.isConfigSupported(c));\n if(!pick)throw Error('\uC774 \uAE30\uAE30\uC5D0\uC11C \uC601\uC0C1 \uC778\uCF54\uB529\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. PC Chrome\xB7Edge\uB97C \uC0AC\uC6A9\uD558\uC138\uC694.');\n const config={...base,...pick.extra,codec:pick.codec};\n const key=uniqueAssetKey(Object.keys(project.assets),safeClipName($('srcName').value,'\uC870\uAC01'));\n cutting=true;cutCancelled=false;setBusy(true);\n $('srcProgress').hidden=false;$('srcProgress').value=0;$('srcCancel').hidden=false;\n let enc=null;\n try{\n  video.pause();\n  const target=new ArrayBufferTarget(),muxer=new Muxer({target,video:{codec:pick.muxer,width,height,frameRate:30},fastStart:'in-memory'});\n  let encErr=null;\n  enc=new VideoEncoder({output:(chunk,meta)=>{try{muxer.addVideoChunk(chunk,meta);}catch(e){encErr=e;}},error:e=>encErr=e});\n  enc.configure(config);\n  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;\n  const g=canvas.getContext('2d'),frames=Math.max(1,Math.round(span*30)),began=performance.now();\n  for(let i=0;i<frames;i++){\n   if(cutCancelled)throw Error('\uC790\uB974\uAE30\uB97C \uCDE8\uC18C\uD588\uC2B5\uB2C8\uB2E4.');\n   if(encErr)throw encErr;\n   await seekVideo(video,Math.min(start+i/30,Math.max(start,end-1/60)));\n   g.drawImage(video,0,0,width,height);\n   const frame=new VideoFrame(canvas,{timestamp:Math.round(i*1e6/30),duration:Math.round(1e6/30)});\n   enc.encode(frame,{keyFrame:i%60===0});frame.close();\n   while(enc.encodeQueueSize>8){if(encErr)throw encErr;await new Promise(r=>setTimeout(r,1));}\n   if(i%10===0||i===frames-1){$('srcProgress').value=(i+1)/frames;\n    srcNote(`\uC790\uB974\uB294 \uC911 ${Math.round((i+1)/frames*100)}% \xB7 ${width}\xD7${height} ${pick.label} \xB7 \uACBD\uACFC ${time((performance.now()-began)/1000)}`);\n    await new Promise(r=>setTimeout(r,0));}\n  }\n  await enc.flush();\n  if(encErr)throw encErr;\n  muxer.finalize();\n  project.assets[key]=new Blob([target.buffer],{type:'video/mp4'});\n  scheduleSave();renderClips();\n  srcNote(`\uC798\uB77C \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4 \xB7 ${clipLabel(key)} \xB7 ${span.toFixed(2)}\uCD08 \xB7 ${(project.assets[key].size/1048576).toFixed(1)}MB`);\n  toast('\uC601\uC0C1 \uC870\uAC01\uC744 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4. \uC544\uB798 \uBAA9\uB85D\uC5D0\uC11C \uC7A5\uBA74\uC5D0 \uB123\uC73C\uC138\uC694.');\n }finally{\n  if(enc&&enc.state!=='closed')try{enc.close();}catch{}\n  cutting=false;setBusy(false);$('srcCancel').hidden=true;$('srcProgress').hidden=true;\n }\n}\non('cutVideoBtn',()=>{renderClips();srcNote();if(!$('cutDialog').open)$('cutDialog').showModal();});\n$('closeCut').onclick=()=>{if(cutting)return toast('\uC790\uB974\uAE30\uAC00 \uB05D\uB09C \uB4A4\uC5D0 \uB2EB\uC544 \uC8FC\uC138\uC694.');$('cutDialog').close();};\non('openSource',()=>$('sourceInput').click());\n$('sourceInput').onchange=e=>{const file=e.target.files[0];e.target.value='';if(!file)return;\n if(cutUrl)URL.revokeObjectURL(cutUrl);\n cutUrl=URL.createObjectURL(file);$('srcVideo').src=cutUrl;\n $('sourceName').textContent=file.name+' \xB7 '+(file.size/1048576).toFixed(0)+'MB';\n $('cutBody').hidden=false;$('srcStart').value='0.00';$('srcEnd').value='0.00';\n $('srcName').value=safeClipName(file.name.replace(/\\.[^.]+$/,''),'\uC870\uAC01');srcNote();};\n$('srcVideo').onloadedmetadata=()=>{$('srcTotal').textContent='/ '+time($('srcVideo').duration);srcNote();};\n$('srcVideo').ontimeupdate=()=>{const el=$('srcVideo');$('srcNow').textContent=time(el.currentTime,true);if(el.duration)$('srcScrub').value=el.currentTime/el.duration;};\n$('srcScrub').oninput=()=>{const el=$('srcVideo');if(el.duration)el.currentTime=(+$('srcScrub').value)*el.duration;};\n$('srcStart').onchange=()=>srcNote();$('srcEnd').onchange=()=>srcNote();\non('srcSetStart',()=>{$('srcStart').value=$('srcVideo').currentTime.toFixed(2);srcNote();});\non('srcSetEnd',()=>{$('srcEnd').value=$('srcVideo').currentTime.toFixed(2);srcNote();});\non('srcFit',()=>{const s=current();if(!s?.audio)return toast('\uC774 \uBB38\uC7A5\uC744 \uBA3C\uC800 \uB179\uC74C\uD558\uC138\uC694.');\n $('srcEnd').value=((+$('srcStart').value||0)+duration(s)).toFixed(2);srcNote();});\non('srcPlay',async()=>{const el=$('srcVideo'),{start,end}=srcSpan();el.currentTime=start;\n const stop=()=>{if(el.currentTime>=end){el.pause();el.removeEventListener('timeupdate',stop);}};\n el.addEventListener('timeupdate',stop);try{await el.play();}catch{}});\non('srcSave',()=>cutClip().catch(e=>{srcNote(e.message);toast(e.message);}));\n$('srcCancel').onclick=()=>{cutCancelled=true;srcNote('\uC790\uB974\uAE30\uB97C \uBA48\uCD94\uB294 \uC911\u2026');};\n$('clipScrub').oninput=()=>{const el=$('clipVideo');if(el.duration)el.currentTime=(+$('clipScrub').value)*el.duration;};\n$('clipVideo').ontimeupdate=()=>{const el=$('clipVideo');if(el.duration)$('clipScrub').value=el.currentTime/el.duration;};\n$('clipVideo').onloadedmetadata=()=>clipNote();\n$('clipStart').onchange=()=>setClip('clipStart',+$('clipStart').value);\n$('clipEnd').onchange=()=>setClip('clipEnd',+$('clipEnd').value);\non('clipSetStart',()=>setClip('clipStart',$('clipVideo').currentTime));\non('clipSetEnd',()=>setClip('clipEnd',$('clipVideo').currentTime));\non('clipReset',()=>{const s=current();if(!s)return;delete s.scene.clipStart;delete s.scene.clipEnd;scheduleSave();syncClip();drawPreview();toast('\uC601\uC0C1 \uC804\uCCB4\uB97C \uC0AC\uC6A9\uD569\uB2C8\uB2E4.');});\non('clipPlay',async()=>{const s=current();if(!s)return;const el=$('clipVideo'),{start,end}=clipRange(s.scene,el.duration||0);\n el.currentTime=start;const stop=()=>{if(el.currentTime>=end){el.pause();el.removeEventListener('timeupdate',stop);}};\n el.addEventListener('timeupdate',stop);try{await el.play();}catch{}});\n$('sceneContinue').onchange=()=>{const s=current();if(!s)return;\n if(selected===0){$('sceneContinue').checked=false;return toast('\uCCAB \uBB38\uC7A5\uC740 \uC774\uC5B4\uAC08 \uC55E \uC7A5\uBA74\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.');}\n if($('sceneContinue').checked)s.scene.continues=true;else delete s.scene.continues;\n const on=!!s.scene.continues;scheduleSave();render();\n toast(on?'\uC55E \uBB38\uC7A5\uC758 \uC7A5\uBA74\uC744 \uB04A\uC9C0 \uC54A\uACE0 \uC774\uC5B4\uAC11\uB2C8\uB2E4.':'\uC774 \uBB38\uC7A5\uBD80\uD130 \uC0C8 \uC7A5\uBA74\uC73C\uB85C \uBC14\uB01D\uB2C8\uB2E4.');};\n$('sceneReviewed').onchange=()=>{if(current()){current().scene.reviewed=$('sceneReviewed').checked;scheduleSave();renderStats();renderTimeline();}};\nwindow.addEventListener('beforeunload',e=>{if(recording||busy||saveTimer&&$('saveState').textContent==='\uC800\uC7A5 \uC911\u2026'){e.preventDefault();e.returnValue='';}});\nasync function registerTools(){const mc=document.modelContext;if(!mc?.registerTool)return;try{await mc.registerTool({name:'get_longform_project',description:'Read sentence IDs, scripts, audio durations and scene review status from the current longform editing project.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:()=>({name:project.name,sentences:project.sentences.map(s=>({id:s.id,text:s.text,durationSeconds:duration(s),scene:s.scene}))})});await mc.registerTool({name:'update_longform_scenes',description:'Apply validated page descriptions to existing sentence IDs. Resets review status. Does not record audio, generate assets or export a video.',inputSchema:{type:'object',properties:{scenes:{type:'array',items:{type:'object',properties:{id:{type:'integer'},title:{type:'string'},subtitle:{type:'string'},layout:{type:'string',enum:['title','split','full']},motion:{type:'string',enum:['fade','zoom','slide','none']},background:{type:'string'},captions:{type:'boolean'}},required:['id'],additionalProperties:false}}},required:['scenes'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:input=>{if(busy||recording)throw Error('Editor is busy');if(!Array.isArray(input?.scenes))throw Error('scenes array required');const checked=input.scenes.map(validScene),seen=new Set();for(const v of checked){if(seen.has(v.id)||!project.sentences.some(s=>s.id===v.id))throw Error('Unknown or duplicate sentence ID');seen.add(v.id);if(v.asset&&!project.assets[v.asset])throw Error('Asset not loaded');}stopPlayback();for(const v of checked){const s=project.sentences.find(s=>s.id===v.id);s.scene={...s.scene,...v,reviewed:false};}scheduleSave();render();return{updated:checked.map(s=>s.id)};}});}catch(e){console.info('Optional agent tools unavailable',e);}}\nasync function importAudioFiles(files){\n if(busy||recording||!files.length)return;setBusy(true);stopPlayback();\n try{let entries=[],script=[];\n for(const file of files){if(/\\.zip$/i.test(file.name)){const contents=readZip(new Uint8Array(await file.arrayBuffer()));const manifest=contents['manifest.json']||contents['project.json'];if(manifest){const m=JSON.parse(strFromU8(manifest));if(Array.isArray(m.sentences))script=m.sentences;}for(const[name,data]of Object.entries(contents))if(/\\.(wav|mp3|m4a|aac|ogg|webm|flac|mp4)$/i.test(name))entries.push(new File([data],name));}else if(file.type.startsWith('audio/')||/\\.(wav|mp3|m4a|aac|ogg|webm|flac|mp4)$/i.test(file.name))entries.push(file);else throw Error('\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uC74C\uC131 \uD30C\uC77C: '+file.name);}\n if(!entries.length)throw Error('\uAC00\uC838\uC62C \uC74C\uC131 \uD30C\uC77C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.');\n const plan=planAudioImports(entries,project.sentences,current()?.id,script);\n if(plan.some(p=>project.sentences.find(s=>s.id===p.id)?.audio)&&!confirm('\uAC19\uC740 \uBC88\uD638\uC758 \uAE30\uC874 \uB179\uC74C\uC744 \uAC00\uC838\uC628 \uD30C\uC77C\uB85C \uAD50\uCCB4\uD560\uAE4C\uC694?'))return;\n const decoded=[];for(let i=0;i<plan.length;i++){toast(`\uC74C\uC131 \uAC00\uC838\uC624\uB294 \uC911 ${i+1} / ${plan.length}`);decoded.push({...plan[i],audio:await decodeAudio(plan[i].file)});}\n if(!project.sentences.length){project.sentences=decoded.map(p=>newSentence(p.text,p.id)).sort((a,b)=>a.id-b.id);selected=0;}\n for(const p of decoded){const s=project.sentences.find(s=>s.id===p.id);if(s.audio)undo.set(s.id,s.audio);s.audio=p.audio;s.scene.reviewed=false;}\n changed();render();toast(decoded.length+'\uAC1C \uC74C\uC131\uC744 \uBB38\uC7A5\uC5D0 \uC5F0\uACB0\uD588\uC2B5\uB2C8\uB2E4.');\n }catch(e){toast('\uC74C\uC131 \uAC00\uC838\uC624\uAE30 \uC2E4\uD328: '+e.message);}finally{setBusy(false);}\n}\non('importAudioBatch',()=>$('batchAudioInput').click());\n$('batchAudioInput').onchange=async e=>{const files=[...e.target.files];e.target.value='';await importAudioFiles(files);};\ncloud=createCloudEditor({getProject:()=>project,isBusy:()=>busy||recording,setBusy,toast,\n persistLocal:()=>scheduleSave(true),updateName:name=>{$('projectName').value=name;},\n flushLocal:async()=>{scheduleSave(true);await new Promise(r=>setTimeout(r,500));await saveChain;},\n setProject:next=>{stopPlayback();clearMedia();project=next;selected=0;undo.clear();$('projectName').value=project.name;render();},\n newProject:()=>{stopPlayback();clearMedia();project={version:1,name:'\uC0C8\uB85C\uC6B4 \uB871\uD3FC',sentences:[],assets:{}};selected=0;undo.clear();$('projectName').value=project.name;render();scheduleSave(true);}\n});\nawait loadSaved();registerTools();cloud.init();\n", type: "text/javascript; charset=utf-8" }, "/cloud.js": { body: "const PART=8*1024*1024;\nexport function createCloudEditor(hooks){\n const $=id=>document.getElementById(id);let user=null,timer,saving=false,blocked=false,revision=0,cursor=null;const cache=new WeakMap();\n const status=text=>{$('cloudStatus').textContent=text;const el=$('folderStatus');if(el){el.textContent=text;el.hidden=!text;}};\n async function request(path,options={}){const r=await fetch(path,{credentials:'same-origin',...options});if(!r.ok){let msg;try{msg=(await r.json()).error;}catch{}const e=new Error(msg||'\uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.');e.status=r.status;throw e;}return r;}\n const auth=async()=>{const r=await request('/api/session');user=(await r.json()).user;$('cloudAccount').textContent=user?user.email:'\uB2E4\uB978 \uAE30\uAE30\uC5D0\uC11C\uB3C4 \uAC19\uC740 \uACC4\uC815\uC73C\uB85C \uC791\uC5C5\uC744 \uC774\uC5B4\uAC00\uC138\uC694.';$('cloudSignedOut').hidden=!!user;$('cloudActions').hidden=!user;if(!user)status('\uB85C\uADF8\uC778\uD558\uBA74 \uC11C\uBC84 \uD3F4\uB354 \uC0AC\uC6A9 \uAC00\uB2A5');return user;};\n async function uploadBlob(blob){if(cache.has(blob))return cache.get(blob);const parts=[];for(let offset=0;offset<blob.size;offset+=PART){const part=blob.slice(offset,offset+PART),bytes=await part.arrayBuffer(),hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');const exists=await fetch('/api/media/'+hash,{method:'HEAD',credentials:'same-origin'});if(exists.status===404)await request('/api/media/'+hash,{method:'PUT',body:bytes,headers:{'Content-Type':'application/octet-stream'}});else if(!exists.ok)throw new Error('\uC18C\uC7AC \uC800\uC7A5 \uC0C1\uD0DC\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.');parts.push(hash);}const result={parts,size:blob.size,mime:blob.type||'application/octet-stream'};cache.set(blob,result);return result;}\n async function audioFile(audio){if(cache.has(audio))return cache.get(audio);const result={...await uploadBlob(new Blob([audio],{type:'application/octet-stream'})),samples:audio.length};cache.set(audio,result);return result;}\n async function save(asNew=false){if(saving)return;const p=hooks.getProject();if(hooks.isBusy()){status('\uD604\uC7AC \uC791\uC5C5\uC774 \uB05D\uB098\uBA74 \uC800\uC7A5\uD569\uB2C8\uB2E4.');timer=setTimeout(()=>save(asNew),2500);return;}if(!user){await auth();if(!user){if(!$('folderDialog').open)$('folderDialog').showModal();return;}}if(!asNew&&!p.cloud){$('newFolderName').value=p.name;if(!$('folderDialog').open)$('folderDialog').showModal();await list();return;}if(!asNew&&blocked)return;if(p.cloud&&p.cloud.userId!==user.id&&!asNew)throw new Error('\uC774 \uD3F4\uB354\uB97C \uC800\uC7A5\uD588\uB358 \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778\uD558\uAC70\uB098 \uC0C8 \uD3F4\uB354\uB85C \uC800\uC7A5\uD558\uC138\uC694.');\n saving=true;const rev=revision,id=asNew?crypto.randomUUID():p.cloud.id,etag=asNew?null:p.cloud.etag;const snapshot={name:p.name,sentences:p.sentences.map(s=>({...s,scene:{...s.scene}})),assets:{...p.assets}};status('\uC11C\uBC84\uC5D0 \uC800\uC7A5 \uC911\u2026');\n try{const doc={version:1,name:snapshot.name.slice(0,200)||'\uC0C8 \uC791\uC5C5 \uD3F4\uB354',sentences:[],assets:{}};for(let i=0;i<snapshot.sentences.length;i++){const s=snapshot.sentences[i];status(`\uB179\uC74C \uC800\uC7A5 ${i+1} / ${snapshot.sentences.length}`);doc.sentences.push({id:s.id,text:s.text,scene:s.scene,audio:s.audio?await audioFile(s.audio):null});}for(const [name,blob]of Object.entries(snapshot.assets)){status('\uC774\uBBF8\uC9C0\xB7\uC601\uC0C1 \uC800\uC7A5 \uC911\u2026');doc.assets[name]=await uploadBlob(blob);}const saved=await(await request('/api/folders/'+id,{method:'PUT',headers:{'Content-Type':'application/json',...(etag?{'If-Match':etag}:{'If-None-Match':'*'})},body:JSON.stringify(doc)})).json();\n if(hooks.getProject()===p){p.cloud={id,etag:saved.etag,userId:user.id};p.cloudDirty=revision!==rev;blocked=false;hooks.persistLocal();}status('\uC11C\uBC84 \uC800\uC7A5 \uC644\uB8CC \xB7 '+new Date(saved.updatedAt).toLocaleTimeString('ko-KR'));showCurrent();if($('folderDialog').open)await list();\n }catch(e){if(e.status===409)blocked=true;status(e.message);hooks.toast(e.message);if(hooks.getProject()===p){p.cloudDirty=true;hooks.persistLocal();}}finally{saving=false;if(revision!==rev&&!blocked&&hooks.getProject().cloud)timer=setTimeout(()=>save(),2000);}}\n function showCurrent(){const p=hooks.getProject(),el=$('currentFolder');if(!el)return;el.classList.toggle('linked',!!p.cloud);el.textContent=p.cloud?'\uC9C0\uAE08 \uC5F4\uB9B0 \uD3F4\uB354 \xB7 '+p.name+(p.cloudDirty?' \xB7 \uC800\uC7A5\uD558\uC9C0 \uC54A\uC740 \uBCC0\uACBD \uC788\uC74C':' \xB7 \uC11C\uBC84\uC640 \uAC19\uC74C'):'\uC544\uC9C1 \uC11C\uBC84 \uD3F4\uB354\uC5D0 \uC800\uC7A5\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uC9C0\uAE08 \uC791\uC5C5\uC744 \uC0C8 \uD3F4\uB354\uB85C \uC800\uC7A5\uD558\uC138\uC694.';}\n async function supportsDelete(){try{const r=await fetch('/api/version',{credentials:'same-origin'});return r.ok&&typeof (await r.json()).bundled==='string';}catch{return false;}}\n function folderRow(f,canDelete){const current=hooks.getProject().cloud?.id===f.id,row=document.createElement('div');row.className='cloud-folder'+(current?' current':'');\n  const pick=document.createElement('button');pick.className='folder-open';const title=document.createElement('strong'),meta=document.createElement('small');\n  title.textContent='\u25A3 '+f.name;meta.textContent=f.count+'\uBB38\uC7A5 \xB7 '+new Date(f.updatedAt).toLocaleString('ko-KR')+(current?' \xB7 \uC9C0\uAE08 \uC5F4\uB9BC':'');\n  pick.append(title,meta);pick.onclick=()=>open(f.id);\n  const actions=document.createElement('div');actions.className='folder-actions';\n  for(const [label,cls,run]of [['\uC774\uB984 \uBC14\uAFB8\uAE30','',()=>rename(f)],...(canDelete?[['\uC0AD\uC81C','danger',()=>remove(f)]]:[])]){const b=document.createElement('button');b.className='text-btn '+cls;b.textContent=label;b.onclick=()=>run().catch(e=>{status(e.message);hooks.toast(e.message);});actions.append(b);}\n  row.append(pick,actions);return row;}\n async function rename(f){if(saving||hooks.isBusy())return hooks.toast('\uC800\uC7A5\uC774\uB098 \uB179\uC74C\uC774 \uB05D\uB09C \uB4A4\uC5D0 \uBC14\uAFD4 \uC8FC\uC138\uC694.');\n  const name=(prompt('\uC0C8 \uD3F4\uB354 \uC774\uB984',f.name)||'').trim();if(!name||name===f.name)return;\n  status('\uC774\uB984 \uBC14\uAFB8\uB294 \uC911\u2026');const {project:doc,etag}=await(await request('/api/folders/'+f.id)).json();doc.name=name.slice(0,200);\n  const saved=await(await request('/api/folders/'+f.id,{method:'PUT',headers:{'Content-Type':'application/json','If-Match':etag},body:JSON.stringify(doc)})).json();\n  const p=hooks.getProject();if(p.cloud?.id===f.id){p.cloud.etag=saved.etag;p.name=doc.name;hooks.updateName(doc.name);hooks.persistLocal();}\n  status('\uD3F4\uB354 \uC774\uB984\uC744 \uBC14\uAFE8\uC2B5\uB2C8\uB2E4.');await list();}\n async function remove(f){if(saving||hooks.isBusy())return hooks.toast('\uC800\uC7A5\uC774\uB098 \uB179\uC74C\uC774 \uB05D\uB09C \uB4A4\uC5D0 \uC0AD\uC81C\uD574 \uC8FC\uC138\uC694.');\n  if(!confirm('\u2018'+f.name+'\u2019 \uD3F4\uB354\uB97C \uC11C\uBC84\uC5D0\uC11C \uC0AD\uC81C\uD560\uAE4C\uC694? \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC774 \uAE30\uAE30\uC5D0 \uC5F4\uB824 \uC788\uB294 \uC791\uC5C5\uC740 \uADF8\uB300\uB85C \uB0A8\uC2B5\uB2C8\uB2E4.'))return;\n  status('\uD3F4\uB354 \uC0AD\uC81C \uC911\u2026');await request('/api/folders/'+f.id,{method:'DELETE'});\n  const p=hooks.getProject();if(p.cloud?.id===f.id){clearTimeout(timer);p.cloud=null;p.cloudDirty=false;blocked=false;hooks.persistLocal();}\n  status('\uD3F4\uB354\uB97C \uC0AD\uC81C\uD588\uC2B5\uB2C8\uB2E4.');await list();}\n async function list(append=false){if(!user)return;try{const data=await(await request('/api/folders'+(append&&cursor?'?cursor='+encodeURIComponent(cursor):''))).json();cursor=data.cursor;const canDelete=await supportsDelete();if(!append)$('folderList').replaceChildren();for(const f of data.folders.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt))))$('folderList').append(folderRow(f,canDelete));if(!$('folderList').children.length)$('folderList').textContent='\uC800\uC7A5\uB41C \uD3F4\uB354\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC704\uC5D0\uC11C \uC9C0\uAE08 \uC791\uC5C5\uC744 \uC0C8 \uD3F4\uB354\uB85C \uC800\uC7A5\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uC313\uC785\uB2C8\uB2E4.';$('moreFolders').hidden=!cursor;showCurrent();}catch(e){status(e.message);hooks.toast(e.message);}}\n async function getBlob(f){const chunks=[];for(const hash of f.parts)chunks.push(await(await request('/api/media/'+hash)).arrayBuffer());const blob=new Blob(chunks,{type:f.mime});if(blob.size!==f.size)throw Error('\uC11C\uBC84 \uC18C\uC7AC \uD06C\uAE30\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.');return blob;}\n async function open(id){if(saving||hooks.isBusy())return hooks.toast('\uD604\uC7AC \uC800\uC7A5\uC774\uB098 \uB179\uC74C\uC774 \uB05D\uB09C \uB4A4 \uC5F4\uC5B4 \uC8FC\uC138\uC694.');const old=hooks.getProject();if(old.sentences.length&&(!old.cloud||old.cloudDirty)&&!confirm('\uD604\uC7AC \uAE30\uAE30\uC5D0\uB9CC \uC800\uC7A5\uB41C \uBCC0\uACBD \uC0AC\uD56D\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uC11C\uBC84 \uD3F4\uB354\uB97C \uC5F4\uBA74 \uD604\uC7AC \uD654\uBA74\uC758 \uC791\uC5C5\uC774 \uBC14\uB01D\uB2C8\uB2E4. \uACC4\uC18D\uD560\uAE4C\uC694?'))return;clearTimeout(timer);hooks.setBusy(true);try{status('\uC791\uC5C5 \uD3F4\uB354 \uC5EC\uB294 \uC911\u2026');const {project:doc,etag}=await(await request('/api/folders/'+id)).json();const next={version:1,name:doc.name,sentences:[],assets:{},cloud:{id,etag,userId:user.id},cloudDirty:false};for(const s of doc.sentences){const audio=s.audio?new Float32Array(await(await getBlob(s.audio)).arrayBuffer()):null;if(audio&&audio.length!==s.audio.samples)throw Error('\uB179\uC74C \uAE38\uC774 \uAC80\uC99D \uC2E4\uD328');next.sentences.push({...s,audio});if(audio)cache.set(audio,s.audio);}for(const[name,f]of Object.entries(doc.assets)){const blob=await getBlob(f);next.assets[name]=blob;cache.set(blob,f);}hooks.setProject(next);blocked=false;revision++;hooks.persistLocal();status('\uC11C\uBC84 \uD3F4\uB354 \uC5F0\uACB0\uB428 \xB7 \uC790\uB3D9 \uC800\uC7A5');showCurrent();$('folderDialog').close();}catch(e){status(e.message);hooks.toast(e.message);}finally{hooks.setBusy(false);}}\n $('foldersBtn').onclick=async()=>{if(hooks.isBusy())return hooks.toast('\uB179\uC74C\uC774\uB098 \uD30C\uC77C \uCC98\uB9AC\uAC00 \uB05D\uB09C \uB4A4\uC5D0 \uC5F4 \uC218 \uC788\uC2B5\uB2C8\uB2E4.');$('newFolderName').value=hooks.getProject().name;showCurrent();if(!$('folderDialog').open)$('folderDialog').showModal();try{await auth();await list();}catch(e){status(e.message);}};\n $('newProject').onclick=()=>{if(saving||hooks.isBusy())return hooks.toast('\uC800\uC7A5\uC774\uB098 \uB179\uC74C\uC774 \uB05D\uB09C \uB4A4\uC5D0 \uC2DC\uC791\uD574 \uC8FC\uC138\uC694.');const p=hooks.getProject();if(p.sentences.length&&(!p.cloud||p.cloudDirty)&&!confirm('\uC774 \uAE30\uAE30\uC5D0\uB9CC \uC800\uC7A5\uB41C \uBCC0\uACBD \uC0AC\uD56D\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uBE48 \uD504\uB85C\uC81D\uD2B8\uB85C \uC2DC\uC791\uD558\uBA74 \uD604\uC7AC \uD654\uBA74\uC758 \uC791\uC5C5\uC774 \uBE44\uC6CC\uC9D1\uB2C8\uB2E4. \uACC4\uC18D\uD560\uAE4C\uC694?'))return;clearTimeout(timer);hooks.newProject();blocked=false;revision++;$('newFolderName').value=hooks.getProject().name;showCurrent();status('\uBE48 \uD504\uB85C\uC81D\uD2B8 \xB7 \uC544\uC9C1 \uC11C\uBC84 \uD3F4\uB354\uC5D0 \uC800\uC7A5\uD558\uC9C0 \uC54A\uC74C');};\n $('closeFolders').onclick=()=>$('folderDialog').close();$('refreshFolders').onclick=()=>list();$('moreFolders').onclick=()=>list(true);\n $('saveCloud').onclick=()=>save().catch(e=>hooks.toast(e.message));$('newCloudFolder').onclick=async()=>{if(saving)return hooks.toast('\uC774\uBBF8 \uC11C\uBC84\uC5D0 \uC800\uC7A5\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.');if(hooks.isBusy())return hooks.toast('\uB179\uC74C\uC774\uB098 \uD30C\uC77C \uCC98\uB9AC\uAC00 \uB05D\uB09C \uB4A4\uC5D0 \uC800\uC7A5\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.');const name=$('newFolderName').value.trim();if(!name)return hooks.toast('\uD3F4\uB354 \uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694.');hooks.getProject().name=name;hooks.updateName(name);revision++;await save(true);};\n $('cloudSignIn').onclick=async e=>{e.preventDefault();if(hooks.isBusy())return;await hooks.flushLocal();window.top.location.href='/signin-with-chatgpt?return_to=%2F%3Ffolders%3D1';};\n function edited(){revision++;const p=hooks.getProject();if(!p.cloud)return;p.cloudDirty=true;clearTimeout(timer);status(blocked?'\uC800\uC7A5 \uCDA9\uB3CC \xB7 \uC0C8 \uD3F4\uB354\uB85C \uC800\uC7A5\uD558\uAC70\uB098 \uC11C\uBC84 \uBC84\uC804\uC744 \uC5F4\uC5B4 \uC8FC\uC138\uC694.':'\uC11C\uBC84 \uC800\uC7A5 \uB300\uAE30\u2026');if(!blocked)timer=setTimeout(()=>save().catch(e=>status(e.message)),2000);}\n async function init(){try{await auth();if(hooks.getProject().cloud){status('\uC11C\uBC84 \uD3F4\uB354 \uC5F0\uACB0\uB428');if(hooks.getProject().cloudDirty)edited();}if(new URLSearchParams(location.search).has('folders')){$('folderDialog').showModal();await list();}}catch{status('\uC11C\uBC84 \uC5F0\uACB0 \uB300\uAE30 \xB7 \uAE30\uAE30 \uC791\uC5C5\uC740 \uC720\uC9C0\uB429\uB2C8\uB2E4.');}}\n window.addEventListener('online',()=>{if(hooks.getProject().cloudDirty)edited();});window.addEventListener('beforeunload',e=>{if(saving||hooks.getProject().cloudDirty){e.preventDefault();e.returnValue='';}});\n return {edited,init};\n}\n", type: "text/javascript; charset=utf-8" }, "/core.js": { body: `export const RATE=48000;
export function splitSentences(text){return text.replace(/^\\uFEFF/,'').split(/\\n+/).flatMap(line=>{line=line.trim();if(!line)return[];if(globalThis.Intl?.Segmenter)return [...new Intl.Segmenter('ko',{granularity:'sentence'}).segment(line)].map(s=>s.segment.trim()).filter(Boolean);return line.match(/[^.!?]+[.!?]+[\u201D\u2019"']*|[^.!?]+$/g)?.map(s=>s.trim()).filter(Boolean)||[];});}
export function joinAudio(a,b){const c=new Float32Array(a.length+b.length);c.set(a);c.set(b,a.length);return c;}
export function editAudio(data,start,end,keep=false){const a=Math.max(0,Math.min(data.length,Math.round(start*RATE))),b=Math.max(a,Math.min(data.length,Math.round(end*RATE)));if(b<=a)throw Error('\uC218\uC815\uD560 \uAD6C\uAC04\uC744 \uBA3C\uC800 \uC120\uD0DD\uD558\uC138\uC694.');const out=keep?data.slice(a,b):joinAudio(data.slice(0,a),data.slice(b));if(!out.length)throw Error('\uC804\uCCB4 \uB179\uC74C\uC744 \uC0AD\uC81C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uB179\uC74C\uC744 \uC0AC\uC6A9\uD558\uC138\uC694.');if(!keep){const edge=Math.min(240,a,out.length-a);for(let i=0;i<edge;i++){out[a-edge+i]*=1-i/edge;out[a+i]*=i/edge;}}return out;}
export function trimAudio(data){const block=480,threshold=.008;let a=0,b=data.length;const rms=(s,e)=>{let sum=0;for(let i=s;i<e;i++)sum+=data[i]*data[i];return Math.sqrt(sum/(e-s));};while(a+block<b&&rms(a,a+block)<threshold)a+=block;while(b-block>a&&rms(b-block,b)<threshold)b-=block;if(b-a<=block)throw Error('\uC74C\uC131\uC774 \uAC10\uC9C0\uB418\uC9C0 \uC54A\uC544 \uC6D0\uBCF8\uC744 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4.');return data.slice(Math.max(0,a-4800),Math.min(data.length,b+4800));}
export function wavBytes(data){const bytes=new Uint8Array(44+data.length*2),v=new DataView(bytes.buffer);const str=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};str(0,'RIFF');v.setUint32(4,36+data.length*2,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,RATE,true);v.setUint32(28,RATE*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,data.length*2,true);for(let i=0;i<data.length;i++){const s=Math.max(-1,Math.min(1,data[i]));v.setInt16(44+i*2,s<0?s*32768:s*32767,true);}return bytes;}
export const pad=n=>String(n).padStart(3,'0');
export function validScene(s){if(!s||!Number.isInteger(Number(s.id))||Number(s.id)<1)throw Error('\uC7A5\uBA74 id\uB294 1 \uC774\uC0C1\uC758 \uBB38\uC7A5 \uBC88\uD638\uC5EC\uC57C \uD569\uB2C8\uB2E4.');const out={id:Number(s.id)};for(const key of ['title','subtitle','asset']){if(s[key]!=null){if(typeof s[key]!=='string'||s[key].length>10000)throw Error('\uC7A5\uBA74 \uD14D\uC2A4\uD2B8 \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.');out[key]=s[key];}}if(s.asset&&(/(^|\\/)\\.\\.?(\\/|$)|^\\/|:|\\\\/.test(s.asset)))throw Error('\uC7A5\uBA74 \uC18C\uC7AC\uB294 ZIP \uB0B4\uBD80\uC758 \uC0C1\uB300 \uACBD\uB85C\uC5EC\uC57C \uD569\uB2C8\uB2E4.');if(s.background!=null){if(!/^#[0-9a-f]{6}$/i.test(s.background))throw Error('\uBC30\uACBD\uC0C9\uC740 #171925 \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.');out.background=s.background;}for(const [k,vals]of Object.entries({layout:['title','split','full'],motion:['none','fade','zoom','slide']})){if(s[k]!=null){if(!vals.includes(s[k]))throw Error('\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uC7A5\uBA74 '+k);out[k]=s[k];}}for(const k of ['clipStart','clipEnd']){if(s[k]!=null){const n=Number(s[k]);if(!Number.isFinite(n)||n<0||n>86400)throw Error('\uC7A5\uBA74 '+k+' \uB294 0 \uC774\uC0C1 86400 \uC774\uD558\uC758 \uCD08\uC5EC\uC57C \uD569\uB2C8\uB2E4.');if(n>0)out[k]=n;}}if(out.clipEnd!=null&&out.clipEnd<=(out.clipStart||0))throw Error('\uC7A5\uBA74 clipEnd \uB294 clipStart \uBCF4\uB2E4 \uB4A4\uC5EC\uC57C \uD569\uB2C8\uB2E4.');if(s.captions!=null)out.captions=!!s.captions;if(s.continues)out.continues=true;return out;}

// Keep one PCM clock and one packet sequence across every sentence boundary.
export function* audioPackets(clips, packetSize=1024){
  let data=new Float32Array(packetSize),used=0,offset=0;
  for(const clip of clips){
    let pos=0;
    while(pos<clip.length){
      const n=Math.min(packetSize-used,clip.length-pos);
      data.set(clip.subarray(pos,pos+n),used);used+=n;pos+=n;
      if(used===packetSize){
        yield {data,timestamp:Math.round(offset*1e6/RATE)};
        offset+=used;used=0;data=new Float32Array(packetSize);
      }
    }
  }
  if(used)yield {data:data.slice(0,used),timestamp:Math.round(offset*1e6/RATE)};
}
export function planAudioImports(files,sentences=[],selectedId=null,script=[]){
 const known=new Set(sentences.map(s=>s.id)),used=new Set();
 return files.map((file,index)=>{const base=file.name.split('/').pop(),match=base.match(/^(\\d+)(?:[_. -]|$)/);let id=match?Number(match[1]):sentences.length?(files.length===1?selectedId:null):index+1;
 if(!id||!Number.isInteger(id)||id<1)throw Error('\uC5EC\uB7EC \uC74C\uC131 \uD30C\uC77C\uC740 001.wav, 002.mp3\uCC98\uB7FC \uBB38\uC7A5 \uBC88\uD638\uB85C \uC774\uB984\uC744 \uC9C0\uC815\uD558\uC138\uC694.');
 if(used.has(id))throw Error('\uAC19\uC740 \uBB38\uC7A5 \uBC88\uD638\uC758 \uC74C\uC131 \uD30C\uC77C\uC774 \uC5EC\uB7EC \uAC1C\uC785\uB2C8\uB2E4: '+id);used.add(id);
 if(sentences.length&&!known.has(id))throw Error('\uB300\uBCF8\uC5D0 \uC5C6\uB294 \uBB38\uC7A5 \uBC88\uD638\uC785\uB2C8\uB2E4: '+id);
 const text=script.find(s=>s.id===id)?.text||base.replace(/\\.[^.]+$/,'');return {file,id,text};
 });
}
export const COVER=.65;
export const easeOut=(p,power=3)=>1-Math.pow(1-Math.min(1,Math.max(0,p)),power);
export function sceneEntrance(motion,t,cover=COVER){const p=Math.min(1,Math.max(0,t)/cover);
 if(motion==='none')return{alpha:1,shiftX:0,covers:false};
 if(motion==='slide')return{alpha:1,shiftX:(1-easeOut(p,4))*1280,covers:p<1};
 return{alpha:easeOut(p),shiftX:0,covers:p<1};}
export const needsScrim=(layout,hasMedia)=>!!hasMedia&&layout==='title';
export const offsetAt=(durations,index)=>durations.slice(0,Math.max(0,index)).reduce((a,n)=>a+(n||0),0);
// \uC7A5\uBA74\uC774 \uC601\uC0C1 \uC18C\uC7AC\uC758 \uC5B4\uB290 \uAD6C\uAC04\uC744 \uC4F0\uB294\uC9C0. clipEnd \uAC00 \uC5C6\uC73C\uBA74 \uC18C\uC7AC \uB05D\uAE4C\uC9C0 \uC4F4\uB2E4.
export function clipRange(scene,mediaDuration=0){const start=Math.max(0,Number(scene?.clipStart)||0);const raw=Number(scene?.clipEnd)||0,tail=Math.max(start,Number(mediaDuration)||0);const end=raw>start?(tail>start?Math.min(raw,tail):raw):tail;return{start,end,span:Math.max(0,end-start)};}
// \uC7A5\uBA74 \uC2DC\uAC04 t \uC77C \uB54C \uC601\uC0C1 \uC18C\uC7AC\uC5D0\uC11C \uC77D\uC744 \uC704\uCE58. \uAD6C\uAC04\uC774 \uC9E7\uC73C\uBA74 \uB9C8\uC9C0\uB9C9 \uD654\uBA74\uC5D0\uC11C \uBA48\uCD98\uB2E4.
export function clipTimeAt(scene,t,mediaDuration=0){const {start,span}=clipRange(scene,mediaDuration);return start+Math.min(Math.max(0,Number(t)||0),Math.max(0,span-1/60));}
// \uC798\uB77C \uB0B8 \uC870\uAC01\uC744 \uC5B4\uB5A4 \uD06C\uAE30\uB85C \uC778\uCF54\uB529\uD560\uC9C0. H.264 \uB294 \uC9DD\uC218 \uD06C\uAE30\uB97C \uC694\uAD6C\uD55C\uB2E4.
export function clipOutputSize(width,height,maxWidth=1280){const sw=Math.max(2,Math.round(Number(width)||0)),sh=Math.max(2,Math.round(Number(height)||0));
 const cap=Math.max(2,Math.round(Number(maxWidth)||1280)),scale=Math.min(1,cap/sw),even=n=>Math.max(2,Math.round(n/2)*2);
 return{width:even(sw*scale),height:even(sh*scale)};}
export function safeClipName(name,fallback='\uC870\uAC01'){const clean=String(name??'').replace(/[^\\p{L}\\p{N} _-]/gu,' ').replace(/\\s+/g,' ').trim().slice(0,60);return clean||fallback;}
export function uniqueAssetKey(existingKeys,name,prefix='clips/',ext='.mp4'){const taken=new Set(existingKeys||[]),base=prefix+name;
 let key=base+ext;for(let n=2;taken.has(key);n++)key=base+'-'+n+ext;return key;}
// \uC870\uAC01\uC744 \uC778\uCF54\uB529\uD560 \uCF54\uB371 \uD6C4\uBCF4. \uC870\uAC01\uC740 \uCD5C\uC885 \uB80C\uB354\uB9C1\uC5D0\uC11C \uB2E4\uC2DC \uC778\uCF54\uB529\uB418\uBBC0\uB85C H.264 \uAC00 \uC544\uB2C8\uC5B4\uB3C4 \uB41C\uB2E4.
export const CLIP_CODECS=[{codec:'avc1.420028',muxer:'avc',extra:{avc:{format:'avc'}},label:'H.264'},{codec:'vp09.00.10.08',muxer:'vp9',extra:{},label:'VP9'},{codec:'av01.0.04M.08',muxer:'av1',extra:{},label:'AV1'}];
export async function pickClipCodec(base,isSupported){for(const option of CLIP_CODECS){
 try{const result=await isSupported({...base,...option.extra,codec:option.codec});if(result?.supported)return option;}catch{}
}return null;}
// \uC774\uC5B4\uAC00\uAE30\uB85C \uBB36\uC778 \uC7A5\uBA74 \uACC4\uC0B0. \uAC01 \uBB38\uC7A5\uC774 \uC5B4\uB290 \uC7A5\uBA74\uC744 \uC4F0\uACE0, \uADF8 \uC7A5\uBA74\uC774 \uC2DC\uC791\uD55C \uC9C0 \uC5BC\uB9C8\uB098 \uB410\uB294\uC9C0.
export function sceneGroups(items){const list=(items||[]).map(it=>({continues:!!it?.continues,seconds:Math.max(0,Number(it?.seconds)||0)}));
 const out=list.map(()=>({baseIndex:0,offset:0,span:0}));let base=0,offset=0;
 list.forEach((it,i)=>{if(i===0||!it.continues){base=i;offset=0;}out[i].baseIndex=base;out[i].offset=offset;offset+=it.seconds;});
 const spans=new Map();list.forEach((it,i)=>spans.set(out[i].baseIndex,(spans.get(out[i].baseIndex)||0)+it.seconds));
 out.forEach(o=>{o.span=spans.get(o.baseIndex)||0;});return out;}

`, type: "text/javascript; charset=utf-8" }, "/vendor/fflate.js": { body: `// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).
var ch2 = {};
var wk = (function (c, id, msg, transfer, cb) {
    var w = new Worker(ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([
        c + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
    ], { type: 'text/javascript' }))));
    w.onmessage = function (e) {
        var d = e.data, ed = d.$e$;
        if (ed) {
            var err = new Error(ed[0]);
            err['code'] = ed[1];
            err.stack = ed[2];
            cb(err, null);
        }
        else
            cb(null, d);
    };
    w.postMessage(msg, transfer);
    return w;
});

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new i32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return { b: b, r: r };
};
var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b.b, revfd = _b.r;
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >> 8) | ((x & 0x00FF) << 8)) >> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
    var s = cd.length;
    // index
    var i = 0;
    // u16 "map": index -> # of codes with bit length = index
    var l = new u16(mb);
    // length of cd must be 288 (total # of codes)
    for (; i < s; ++i) {
        if (cd[i])
            ++l[cd[i] - 1];
    }
    // u16 "map": index -> minimum code for bit length = index
    var le = new u16(mb);
    for (i = 1; i < mb; ++i) {
        le[i] = (le[i - 1] + l[i - 1]) << 1;
    }
    var co;
    if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
            // ignore 0 lengths
            if (cd[i]) {
                // num encoding both symbol and bits read
                var sv = (i << 4) | cd[i];
                // free bits
                var r_1 = mb - cd[i];
                // start value
                var v = le[cd[i] - 1]++ << r_1;
                // m is end value
                for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                    // every 16 bit value starting with the code yields the same result
                    co[rev[v] >> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >> (15 - cd[i]);
            }
        }
    }
    return co;
});
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
    flt[i] = 8;
for (var i = 144; i < 256; ++i)
    flt[i] = 9;
for (var i = 256; i < 280; ++i)
    flt[i] = 7;
for (var i = 280; i < 288; ++i)
    flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
    fdt[i] = 5;
// fixed length map
var flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
var fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
// find max of array
var max = function (a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
            m = a[i];
    }
    return m;
};
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
};
// get end of byte
var shft = function (p) { return ((p + 7) / 8) | 0; };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (s == null || s < 0)
        s = 0;
    if (e == null || e > v.length)
        e = v.length;
    // can't use .constructor in case user-supplied
    return new u8(v.subarray(s, e));
};
/**
 * Codes for errors generated within this library
 */
export var FlateErrorCode = {
    UnexpectedEOF: 0,
    InvalidBlockType: 1,
    InvalidLengthLiteral: 2,
    InvalidDistance: 3,
    StreamFinished: 4,
    NoStreamHandler: 5,
    InvalidHeader: 6,
    NoCallback: 7,
    InvalidUTF8: 8,
    ExtraFieldTooLong: 9,
    InvalidDate: 10,
    FilenameTooLong: 11,
    StreamFinishing: 12,
    InvalidZipData: 13,
    UnknownCompressionMethod: 14
};
// error codes
var ec = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    , // determined by compression function
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data'
    // determined by unknown compression method
];
;
var err = function (ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
    if (!nt)
        throw e;
    return e;
};
// expands raw DEFLATE data
var inflt = function (dat, st, buf, dict) {
    // source length       dict length
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
        return buf || new u8(0);
    var noBuf = !buf;
    // have to estimate size
    var resize = noBuf || st.i != 2;
    // no state
    var noSt = st.i;
    // Assumes roughly 33% compression ratio average
    if (noBuf)
        buf = new u8(sl * 3);
    // ensure buffer can fit at least l elements
    var cbuf = function (l) {
        var bl = buf.length;
        // need to increase size to fit
        if (l > bl) {
            // Double or set to necessary, whichever is greater
            var nbuf = new u8(Math.max(bl * 2, l));
            nbuf.set(buf);
            buf = nbuf;
        }
    };
    //  last chunk         bitpos           bytes
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    // total bits
    var tbts = sl * 8;
    do {
        if (!lm) {
            // BFINAL - this is only 1 when last chunk is next
            final = bits(dat, pos, 1);
            // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
                // go to end of byte boundary
                var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                if (t > sl) {
                    if (noSt)
                        err(0);
                    break;
                }
                // ensure size
                if (resize)
                    cbuf(bt + l);
                // Copy over uncompressed data
                buf.set(dat.subarray(s, t), bt);
                // Get new bitpos, update byte count
                st.b = bt += l, st.p = pos = t * 8, st.f = final;
                continue;
            }
            else if (type == 1)
                lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
            else if (type == 2) {
                //  literal                            lengths
                var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                var tl = hLit + bits(dat, pos + 5, 31) + 1;
                pos += 14;
                // length+distance tree
                var ldt = new u8(tl);
                // code length tree
                var clt = new u8(19);
                for (var i = 0; i < hcLen; ++i) {
                    // use index map to get real code
                    clt[clim[i]] = bits(dat, pos + i * 3, 7);
                }
                pos += hcLen * 3;
                // code lengths bits
                var clb = max(clt), clbmsk = (1 << clb) - 1;
                // code lengths map
                var clm = hMap(clt, clb, 1);
                for (var i = 0; i < tl;) {
                    var r = clm[bits(dat, pos, clbmsk)];
                    // bits read
                    pos += r & 15;
                    // symbol
                    var s = r >> 4;
                    // code length to copy
                    if (s < 16) {
                        ldt[i++] = s;
                    }
                    else {
                        //  copy   count
                        var c = 0, n = 0;
                        if (s == 16)
                            n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                        else if (s == 17)
                            n = 3 + bits(dat, pos, 7), pos += 3;
                        else if (s == 18)
                            n = 11 + bits(dat, pos, 127), pos += 7;
                        while (n--)
                            ldt[i++] = c;
                    }
                }
                //    length tree                 distance tree
                var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                // max length bits
                lbt = max(lt);
                // max dist bits
                dbt = max(dt);
                lm = hMap(lt, lbt, 1);
                dm = hMap(dt, dbt, 1);
            }
            else
                err(1);
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
        }
        // Make sure the buffer can hold this + the largest possible addition
        // Maximum chunk size (practically, theoretically infinite) is 2^17
        if (resize)
            cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
            // bits read, code
            var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
            pos += c & 15;
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
            if (!c)
                err(2);
            if (sym < 256)
                buf[bt++] = sym;
            else if (sym == 256) {
                lpos = pos, lm = null;
                break;
            }
            else {
                var add = sym - 254;
                // no extra bits needed if less
                if (sym > 264) {
                    // index
                    var i = sym - 257, b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) + fl[i];
                    pos += b;
                }
                // dist
                var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
                if (!d)
                    err(3);
                pos += d & 15;
                var dt = fd[dsym];
                if (dsym > 3) {
                    var b = fdeb[dsym];
                    dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
                }
                if (pos > tbts) {
                    if (noSt)
                        err(0);
                    break;
                }
                if (resize)
                    cbuf(bt + 131072);
                var end = bt + add;
                if (bt < dt) {
                    var shift = dl - dt, dend = Math.min(dt, end);
                    if (shift + bt < 0)
                        err(3);
                    for (; bt < dend; ++bt)
                        buf[bt] = dict[shift + bt];
                }
                for (; bt < end; ++bt)
                    buf[bt] = buf[bt - dt];
            }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
            final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    // don't reallocate for streams or user buffers
    return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
// starting at p, write the minimum number of bits that can hold v to d
var wbits = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
};
// starting at p, write the minimum number of bits (>8) that can hold v to d
var wbits16 = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
    d[o + 2] |= v >> 16;
};
// creates code lengths from a frequency table
var hTree = function (d, mb) {
    // Need extra info to make a tree
    var t = [];
    for (var i = 0; i < d.length; ++i) {
        if (d[i])
            t.push({ s: i, f: d[i] });
    }
    var s = t.length;
    var t2 = t.slice();
    if (!s)
        return { t: et, l: 0 };
    if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return { t: v, l: 1 };
    }
    t.sort(function (a, b) { return a.f - b.f; });
    // after i2 reaches last ind, will be stopped
    // freq must be greater than largest possible number of symbols
    t.push({ s: -1, f: 25001 });
    var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
    t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
    // efficient algorithm from UZIP.js
    // i0 is lookbehind, i2 is lookahead - after processing two low-freq
    // symbols that combined have high freq, will start processing i2 (high-freq,
    // non-composite) symbols instead
    // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
    while (i1 != s - 1) {
        l = t[t[i0].f < t[i2].f ? i0++ : i2++];
        r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
        t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
    }
    var maxSym = t2[0].s;
    for (var i = 1; i < s; ++i) {
        if (t2[i].s > maxSym)
            maxSym = t2[i].s;
    }
    // code lengths
    var tr = new u16(maxSym + 1);
    // max bits in tree
    var mbt = ln(t[i1 - 1], tr, 0);
    if (mbt > mb) {
        // more algorithms from UZIP.js
        // TODO: find out how this code works (debt)
        //  ind    debt
        var i = 0, dt = 0;
        //    left            cost
        var lft = mbt - mb, cst = 1 << lft;
        t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
        for (; i < s; ++i) {
            var i2_1 = t2[i].s;
            if (tr[i2_1] > mb) {
                dt += cst - (1 << (mbt - tr[i2_1]));
                tr[i2_1] = mb;
            }
            else
                break;
        }
        dt >>= lft;
        while (dt > 0) {
            var i2_2 = t2[i].s;
            if (tr[i2_2] < mb)
                dt -= 1 << (mb - tr[i2_2]++ - 1);
            else
                ++i;
        }
        for (; i >= 0 && dt; --i) {
            var i2_3 = t2[i].s;
            if (tr[i2_3] == mb) {
                --tr[i2_3];
                ++dt;
            }
        }
        mbt = mb;
    }
    return { t: new u8(tr), l: mbt };
};
// get the max length and assign length codes
var ln = function (n, l, d) {
    return n.s == -1
        ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
        : (l[n.s] = d);
};
// length codes generation
var lc = function (c) {
    var s = c.length;
    // Note that the semicolon was intentional
    while (s && !c[--s])
        ;
    var cl = new u16(++s);
    //  ind      num         streak
    var cli = 0, cln = c[0], cls = 1;
    var w = function (v) { cl[cli++] = v; };
    for (var i = 1; i <= s; ++i) {
        if (c[i] == cln && i != s)
            ++cls;
        else {
            if (!cln && cls > 2) {
                for (; cls > 138; cls -= 138)
                    w(32754);
                if (cls > 2) {
                    w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                    cls = 0;
                }
            }
            else if (cls > 3) {
                w(cln), --cls;
                for (; cls > 6; cls -= 6)
                    w(8304);
                if (cls > 2)
                    w(((cls - 3) << 5) | 8208), cls = 0;
            }
            while (cls--)
                w(cln);
            cls = 1;
            cln = c[i];
        }
    }
    return { c: cl.subarray(0, cli), n: s };
};
// calculate the length of output from tree, code lengths
var clen = function (cf, cl) {
    var l = 0;
    for (var i = 0; i < cl.length; ++i)
        l += cf[i] * cl[i];
    return l;
};
// writes a fixed block
// returns the new bit pos
var wfblk = function (out, pos, dat) {
    // no need to write 00 as type: TypedArray defaults to 0
    var s = dat.length;
    var o = shft(pos + 2);
    out[o] = s & 255;
    out[o + 1] = s >> 8;
    out[o + 2] = out[o] ^ 255;
    out[o + 3] = out[o + 1] ^ 255;
    for (var i = 0; i < s; ++i)
        out[o + i + 4] = dat[i];
    return (o + 4 + s) * 8;
};
// writes a block
var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
    wbits(out, p++, final);
    ++lf[256];
    var _a = hTree(lf, 15), dlt = _a.t, mlb = _a.l;
    var _b = hTree(df, 15), ddt = _b.t, mdb = _b.l;
    var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
    var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
    var lcfreq = new u16(19);
    for (var i = 0; i < lclt.length; ++i)
        ++lcfreq[lclt[i] & 31];
    for (var i = 0; i < lcdt.length; ++i)
        ++lcfreq[lcdt[i] & 31];
    var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
    var nlcc = 19;
    for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
    var flen = (bl + 5) << 3;
    var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
    var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
    if (bs >= 0 && flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
    var lm, ll, dm, dl;
    wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
    if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i = 0; i < nlcc; ++i)
            wbits(out, p + 3 * i, lct[clim[i]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i = 0; i < clct.length; ++i) {
                var len = clct[i] & 31;
                wbits(out, p, llm[len]), p += lct[len];
                if (len > 15)
                    wbits(out, p, (clct[i] >> 5) & 127), p += clct[i] >> 12;
            }
        }
    }
    else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
    }
    for (var i = 0; i < li; ++i) {
        var sym = syms[i];
        if (sym > 255) {
            var len = (sym >> 18) & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
                wbits(out, p, (sym >> 23) & 31), p += fleb[len];
            var dst = sym & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
                wbits16(out, p, (sym >> 5) & 8191), p += fdeb[dst];
        }
        else {
            wbits16(out, p, lm[sym]), p += ll[sym];
        }
    }
    wbits16(out, p, lm[256]);
    return p + ll[256];
};
// deflate options (nice << 13) | chain
var deo = /*#__PURE__*/ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
// empty
var et = /*#__PURE__*/ new u8(0);
// compresses data into a raw DEFLATE buffer
var dflt = function (dat, lvl, plvl, pre, post, st) {
    var s = st.z || dat.length;
    var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post);
    // writing to this writes to the output buffer
    var w = o.subarray(pre, o.length - post);
    var lst = st.l;
    var pos = (st.r || 0) & 7;
    if (lvl) {
        if (pos)
            w[0] = st.r >> 3;
        var opt = deo[lvl - 1];
        var n = opt >> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        //    prev 2-byte val map    curr 2-byte val map
        var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
        // 24576 is an arbitrary number of maximum symbols per block
        // 424 buffer for last block
        var syms = new i32(25000);
        // length/literal freq   distance freq
        var lf = new u16(288), df = new u16(32);
        //  l/lcnt  exbits  index          l/lind  waitdx          blkpos
        var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
        for (; i + 2 < s; ++i) {
            // hash value
            var hv = hsh(i);
            // index mod 32768    previous index mod
            var imod = i & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            // We always should modify head and prev, but only add symbols if
            // this data is not yet processed ("wait" for wait index)
            if (wi <= i) {
                // bytes remaining
                var rem = s - i;
                if ((lc_1 > 7000 || li > 24576) && (rem > 423 || !lst)) {
                    pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                    li = lc_1 = eb = 0, bs = i;
                    for (var j = 0; j < 286; ++j)
                        lf[j] = 0;
                    for (var j = 0; j < 30; ++j)
                        df[j] = 0;
                }
                //  len    dist   chain
                var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
                if (rem > 2 && hv == hsh(i - dif)) {
                    var maxn = Math.min(n, rem) - 1;
                    var maxd = Math.min(32767, i);
                    // max possible length
                    // not capped at dif because decompressors implement "rolling" index population
                    var ml = Math.min(258, rem);
                    while (dif <= maxd && --ch_1 && imod != pimod) {
                        if (dat[i + l] == dat[i + l - dif]) {
                            var nl = 0;
                            for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                ;
                            if (nl > l) {
                                l = nl, d = dif;
                                // break out early when we reach "nice" (we are satisfied enough)
                                if (nl > maxn)
                                    break;
                                // now, find the rarest 2-byte sequence within this
                                // length of literals and search for that instead.
                                // Much faster than just using the start
                                var mmd = Math.min(dif, nl - 2);
                                var md = 0;
                                for (var j = 0; j < mmd; ++j) {
                                    var ti = i - dif + j & 32767;
                                    var pti = prev[ti];
                                    var cd = ti - pti & 32767;
                                    if (cd > md)
                                        md = cd, pimod = ti;
                                }
                            }
                        }
                        // check the previous match
                        imod = pimod, pimod = prev[imod];
                        dif += imod - pimod & 32767;
                    }
                }
                // d will be nonzero only when a match was found
                if (d) {
                    // store both dist and len data in one int32
                    // Make sure this is recognized as a len/dist with 28th bit (2^28)
                    syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                    var lin = revfl[l] & 31, din = revfd[d] & 31;
                    eb += fleb[lin] + fdeb[din];
                    ++lf[257 + lin];
                    ++df[din];
                    wi = i + l;
                    ++lc_1;
                }
                else {
                    syms[li++] = dat[i];
                    ++lf[dat[i]];
                }
            }
        }
        for (i = Math.max(i, wi); i < s; ++i) {
            syms[li++] = dat[i];
            ++lf[dat[i]];
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        if (!lst) {
            st.r = (pos & 7) | w[(pos / 8) | 0] << 3;
            // shft(pos) now 1 less if pos & 7 != 0
            pos -= 7;
            st.h = head, st.p = prev, st.i = i, st.w = wi;
        }
    }
    else {
        for (var i = st.w || 0; i < s + lst; i += 65535) {
            // end
            var e = i + 65535;
            if (e >= s) {
                // write final block
                w[(pos / 8) | 0] = lst;
                e = s;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i, e));
        }
        st.i = s;
    }
    return slc(o, 0, pre + shft(pos) + post);
};
// CRC32 table
var crct = /*#__PURE__*/ (function () {
    var t = new Int32Array(256);
    for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
            c = ((c & 1) && -306674912) ^ (c >>> 1);
        t[i] = c;
    }
    return t;
})();
// CRC32
var crc = function () {
    var c = -1;
    return {
        p: function (d) {
            // closures have awful performance
            var cr = c;
            for (var i = 0; i < d.length; ++i)
                cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
            c = cr;
        },
        d: function () { return ~c; }
    };
};
// Adler32
var adler = function () {
    var a = 1, b = 0;
    return {
        p: function (d) {
            // closures have awful performance
            var n = a, m = b;
            var l = d.length | 0;
            for (var i = 0; i != l;) {
                var e = Math.min(i + 2655, l);
                for (; i < e; ++i)
                    m += n += d[i];
                n = (n & 65535) + 15 * (n >> 16), m = (m & 65535) + 15 * (m >> 16);
            }
            a = n, b = m;
        },
        d: function () {
            a %= 65521, b %= 65521;
            return (a & 255) << 24 | (a & 0xFF00) << 8 | (b & 255) << 8 | (b >> 8);
        }
    };
};
;
// deflate with opts
var dopt = function (dat, opt, pre, post, st) {
    if (!st) {
        st = { l: 1 };
        if (opt.dictionary) {
            var dict = opt.dictionary.subarray(-32768);
            var newDat = new u8(dict.length + dat.length);
            newDat.set(dict);
            newDat.set(dat, dict.length);
            dat = newDat;
            st.w = dict.length;
        }
    }
    return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? (st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20) : (12 + opt.mem), pre, post, st);
};
// Walmart object spread
var mrg = function (a, b) {
    var o = {};
    for (var k in a)
        o[k] = a[k];
    for (var k in b)
        o[k] = b[k];
    return o;
};
// worker clone
// This is possibly the craziest part of the entire codebase, despite how simple it may seem.
// The only parameter to this function is a closure that returns an array of variables outside of the function scope.
// We're going to try to figure out the variable names used in the closure as strings because that is crucial for workerization.
// We will return an object mapping of true variable name to value (basically, the current scope as a JS object).
// The reason we can't just use the original variable names is minifiers mangling the toplevel scope.
// This took me three weeks to figure out how to do.
var wcln = function (fn, fnStr, td) {
    var dt = fn();
    var st = fn.toString();
    var ks = st.slice(st.indexOf('[') + 1, st.lastIndexOf(']')).replace(/\\s+/g, '').split(',');
    for (var i = 0; i < dt.length; ++i) {
        var v = dt[i], k = ks[i];
        if (typeof v == 'function') {
            fnStr += ';' + k + '=';
            var st_1 = v.toString();
            if (v.prototype) {
                // for global objects
                if (st_1.indexOf('[native code]') != -1) {
                    var spInd = st_1.indexOf(' ', 8) + 1;
                    fnStr += st_1.slice(spInd, st_1.indexOf('(', spInd));
                }
                else {
                    fnStr += st_1;
                    for (var t in v.prototype)
                        fnStr += ';' + k + '.prototype.' + t + '=' + v.prototype[t].toString();
                }
            }
            else
                fnStr += st_1;
        }
        else
            td[k] = v;
    }
    return fnStr;
};
var ch = [];
// clone bufs
var cbfs = function (v) {
    var tl = [];
    for (var k in v) {
        if (v[k].buffer) {
            tl.push((v[k] = new v[k].constructor(v[k])).buffer);
        }
    }
    return tl;
};
// use a worker to execute code
var wrkr = function (fns, init, id, cb) {
    if (!ch[id]) {
        var fnStr = '', td_1 = {}, m = fns.length - 1;
        for (var i = 0; i < m; ++i)
            fnStr = wcln(fns[i], fnStr, td_1);
        ch[id] = { c: wcln(fns[m], fnStr, td_1), e: td_1 };
    }
    var td = mrg({}, ch[id].e);
    return wk(ch[id].c + ';onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=' + init.toString() + '}', id, td, cbfs(td), cb);
};
// base async inflate fn
var bInflt = function () { return [u8, u16, i32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gopt]; };
var bDflt = function () { return [u8, u16, i32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf]; };
// gzip extra
var gze = function () { return [gzh, gzhl, wbytes, crc, crct]; };
// gunzip extra
var guze = function () { return [gzs, gzl]; };
// zlib extra
var zle = function () { return [zlh, wbytes, adler]; };
// unzlib extra
var zule = function () { return [zls]; };
// post buf
var pbf = function (msg) { return postMessage(msg, [msg.buffer]); };
// get opts
var gopt = function (o) { return o && {
    out: o.size && new u8(o.size),
    dictionary: o.dictionary
}; };
// async helper
var cbify = function (dat, opts, fns, init, id, cb) {
    var w = wrkr(fns, init, id, function (err, dat) {
        w.terminate();
        cb(err, dat);
    });
    w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
    return function () { w.terminate(); };
};
// auto stream
var astrm = function (strm) {
    strm.ondata = function (dat, final) { return postMessage([dat, final], [dat.buffer]); };
    return function (ev) {
        if (ev.data[0]) {
            strm.push(ev.data[0], ev.data[1]);
            postMessage([ev.data[0].length]);
        }
        else
            strm.flush(ev.data[1]);
    };
};
// async stream attach
var astrmify = function (fns, strm, opts, init, id, flush, ext) {
    var t;
    var w = wrkr(fns, init, id, function (err, dat) {
        if (err)
            w.terminate(), strm.ondata.call(strm, err);
        else if (!Array.isArray(dat))
            ext(dat);
        else if (dat.length == 1) {
            strm.queuedSize -= dat[0];
            if (strm.ondrain)
                strm.ondrain(dat[0]);
        }
        else {
            if (dat[1])
                w.terminate();
            strm.ondata.call(strm, err, dat[0], dat[1]);
        }
    });
    w.postMessage(opts);
    strm.queuedSize = 0;
    strm.push = function (d, f) {
        if (!strm.ondata)
            err(5);
        if (t)
            strm.ondata(err(4, 0, 1), null, !!f);
        strm.queuedSize += d.length;
        // can fail for cross-realm Uint8Array, but ok - only a small performance penalty
        w.postMessage([d, t = f], d.buffer instanceof ArrayBuffer ? [d.buffer] : []);
    };
    strm.terminate = function () { w.terminate(); };
    if (flush) {
        strm.flush = function (sync) { w.postMessage([0, sync]); };
    }
};
// read 2 bytes
var b2 = function (d, b) { return d[b] | (d[b + 1] << 8); };
// read 4 bytes
var b4 = function (d, b) { return (d[b] | (d[b + 1] << 8) | (d[b + 2] << 16) | (d[b + 3] << 24)) >>> 0; };
// read 8 bytes
var b8 = function (d, b) { return b4(d, b) + (b4(d, b + 4) * 4294967296); };
// write bytes
var wbytes = function (d, b, v) {
    for (; v; ++b)
        d[b] = v, v >>>= 8;
};
// gzip header
var gzh = function (c, o) {
    var fn = o.filename;
    c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3; // assume Unix
    if (o.mtime != 0)
        wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1000));
    if (fn) {
        c[3] = 8;
        for (var i = 0; i <= fn.length; ++i)
            c[i + 10] = fn.charCodeAt(i);
    }
};
// gzip footer: -8 to -4 = CRC, -4 to -0 is length
// gzip start
var gzs = function (d) {
    if (d[0] != 31 || d[1] != 139 || d[2] != 8)
        err(6, 'invalid gzip data');
    var flg = d[3];
    var st = 10;
    if (flg & 4)
        st += (d[10] | d[11] << 8) + 2;
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
        ;
    return st + (flg & 2);
};
// gzip length
var gzl = function (d) {
    var l = d.length;
    return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
};
// gzip header length
var gzhl = function (o) { return 10 + (o.filename ? o.filename.length + 1 : 0); };
// zlib header
var zlh = function (c, o) {
    var lv = o.level, fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
    c[0] = 120, c[1] = (fl << 6) | (o.dictionary && 32);
    c[1] |= 31 - ((c[0] << 8) | c[1]) % 31;
    if (o.dictionary) {
        var h = adler();
        h.p(o.dictionary);
        wbytes(c, 2, h.d());
    }
};
// zlib start
var zls = function (d, dict) {
    if ((d[0] & 15) != 8 || (d[0] >> 4) > 7 || ((d[0] << 8 | d[1]) % 31))
        err(6, 'invalid zlib data');
    if ((d[1] >> 5 & 1) == +!dict)
        err(6, 'invalid zlib data: ' + (d[1] & 32 ? 'need' : 'unexpected') + ' dictionary');
    return (d[1] >> 3 & 4) + 2;
};
function StrmOpt(opts, cb) {
    if (typeof opts == 'function')
        cb = opts, opts = {};
    this.ondata = cb;
    return opts;
}
/**
 * Streaming DEFLATE compression
 */
var Deflate = /*#__PURE__*/ (function () {
    function Deflate(opts, cb) {
        if (typeof opts == 'function')
            cb = opts, opts = {};
        this.ondata = cb;
        this.o = opts || {};
        this.s = { l: 0, i: 32768, w: 32768, z: 32768 };
        // Buffer length must always be 0 mod 32768 for index calculations to be correct when modifying head and prev
        // 98304 = 32768 (lookback) + 65536 (common chunk size)
        this.b = new u8(98304);
        if (this.o.dictionary) {
            var dict = this.o.dictionary.subarray(-32768);
            this.b.set(dict, 32768 - dict.length);
            this.s.i = 32768 - dict.length;
        }
    }
    Deflate.prototype.p = function (c, f) {
        this.ondata(dopt(c, this.o, 0, 0, this.s), f);
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Deflate.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (this.s.l)
            err(4);
        var endLen = chunk.length + this.s.z;
        if (endLen > this.b.length) {
            if (endLen > 2 * this.b.length - 32768) {
                var newBuf = new u8(endLen & -32768);
                newBuf.set(this.b.subarray(0, this.s.z));
                this.b = newBuf;
            }
            var split = this.b.length - this.s.z;
            this.b.set(chunk.subarray(0, split), this.s.z);
            this.s.z = this.b.length;
            this.p(this.b, false);
            this.b.set(this.b.subarray(-32768));
            this.b.set(chunk.subarray(split), 32768);
            this.s.z = chunk.length - split + 32768;
            this.s.i = 32766, this.s.w = 32768;
        }
        else {
            this.b.set(chunk, this.s.z);
            this.s.z += chunk.length;
        }
        this.s.l = final & 1;
        if (this.s.z > this.s.w + 8191 || final) {
            this.p(this.b, final || false);
            this.s.w = this.s.i, this.s.i -= 2;
        }
        if (final) {
            // cleanup unneeded buffers/state to reduce memory usage
            this.s = this.o = {};
            this.b = et;
        }
    };
    /**
     * Flushes buffered uncompressed data. Useful to immediately retrieve the
     * deflated output for small inputs.
     * @param sync Whether to flush to a byte boundary. A sync flush takes 4-5
     *             extra bytes, but guarantees all pushed data is immediately
     *             decompressible. A separate DEFLATE stream may be concatenated
     *             with the current output after a sync flush.
     */
    Deflate.prototype.flush = function (sync) {
        if (!this.ondata)
            err(5);
        if (this.s.l)
            err(4);
        this.p(this.b, false);
        this.s.w = this.s.i, this.s.i -= 2;
        // could technically skip writing the type-0 block for (this.s.r & 7) == 0,
        // but the deterministic trailer (00 00 FF FF) is useful in some situations
        if (sync) {
            var c = new u8(6);
            c[0] = this.s.r >> 3;
            // write empty, non-final type-0 block
            var ep = wfblk(c, this.s.r, et);
            this.s.r = 0;
            this.ondata(c.subarray(0, ep >> 3), false);
        }
    };
    return Deflate;
}());
export { Deflate };
/**
 * Asynchronous streaming DEFLATE compression
 */
var AsyncDeflate = /*#__PURE__*/ (function () {
    function AsyncDeflate(opts, cb) {
        astrmify([
            bDflt,
            function () { return [astrm, Deflate]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Deflate(ev.data);
            onmessage = astrm(strm);
        }, 6, 1);
    }
    return AsyncDeflate;
}());
export { AsyncDeflate };
export function deflate(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
    ], function (ev) { return pbf(deflateSync(ev.data[0], ev.data[1])); }, 0, cb);
}
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
export function deflateSync(data, opts) {
    return dopt(data, opts || {}, 0, 0);
}
/**
 * Streaming DEFLATE decompression
 */
var Inflate = /*#__PURE__*/ (function () {
    function Inflate(opts, cb) {
        // no StrmOpt here to avoid adding to workerizer
        if (typeof opts == 'function')
            cb = opts, opts = {};
        this.ondata = cb;
        var dict = opts && opts.dictionary && opts.dictionary.subarray(-32768);
        this.s = { i: 0, b: dict ? dict.length : 0 };
        this.o = new u8(32768);
        this.p = new u8(0);
        if (dict)
            this.o.set(dict);
    }
    Inflate.prototype.e = function (c) {
        if (!this.ondata)
            err(5);
        if (this.d)
            err(4);
        if (!this.p.length)
            this.p = c;
        else if (c.length) {
            var n = new u8(this.p.length + c.length);
            n.set(this.p), n.set(c, this.p.length), this.p = n;
        }
    };
    Inflate.prototype.c = function (final) {
        this.s.i = +(this.d = final || false);
        var bts = this.s.b;
        var dt = inflt(this.p, this.s, this.o);
        this.ondata(slc(dt, bts, this.s.b), this.d);
        this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
        this.p = slc(this.p, (this.s.p / 8) | 0), this.s.p &= 7;
    };
    /**
     * Pushes a chunk to be inflated
     * @param chunk The chunk to push
     * @param final Whether this is the final chunk
     */
    Inflate.prototype.push = function (chunk, final) {
        this.e(chunk), this.c(final);
    };
    return Inflate;
}());
export { Inflate };
/**
 * Asynchronous streaming DEFLATE decompression
 */
var AsyncInflate = /*#__PURE__*/ (function () {
    function AsyncInflate(opts, cb) {
        astrmify([
            bInflt,
            function () { return [astrm, Inflate]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Inflate(ev.data);
            onmessage = astrm(strm);
        }, 7, 0);
    }
    return AsyncInflate;
}());
export { AsyncInflate };
export function inflate(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt
    ], function (ev) { return pbf(inflateSync(ev.data[0], gopt(ev.data[1]))); }, 1, cb);
}
export function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
// before you yell at me for not just using extends, my reason is that TS inheritance is hard to workerize.
/**
 * Streaming GZIP compression
 */
var Gzip = /*#__PURE__*/ (function () {
    function Gzip(opts, cb) {
        this.c = crc();
        this.l = 0;
        this.v = 1;
        Deflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be GZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Gzip.prototype.push = function (chunk, final) {
        this.c.p(chunk);
        this.l += chunk.length;
        Deflate.prototype.push.call(this, chunk, final);
    };
    Gzip.prototype.p = function (c, f) {
        var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, this.s);
        if (this.v)
            gzh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
        this.ondata(raw, f);
    };
    /**
     * Flushes buffered uncompressed data. Useful to immediately retrieve the
     * GZIPped output for small inputs.
     * @param sync Whether to flush to a byte boundary. A sync flush takes 4-5
     *             extra bytes, but guarantees all pushed data is immediately
     *             decompressible.
     */
    Gzip.prototype.flush = function (sync) {
        Deflate.prototype.flush.call(this, sync);
    };
    return Gzip;
}());
export { Gzip };
/**
 * Asynchronous streaming GZIP compression
 */
var AsyncGzip = /*#__PURE__*/ (function () {
    function AsyncGzip(opts, cb) {
        astrmify([
            bDflt,
            gze,
            function () { return [astrm, Deflate, Gzip]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Gzip(ev.data);
            onmessage = astrm(strm);
        }, 8, 1);
    }
    return AsyncGzip;
}());
export { AsyncGzip };
export function gzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
        gze,
        function () { return [gzipSync]; }
    ], function (ev) { return pbf(gzipSync(ev.data[0], ev.data[1])); }, 2, cb);
}
/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
export function gzipSync(data, opts) {
    if (!opts)
        opts = {};
    var c = crc(), l = data.length;
    c.p(data);
    var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
    return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
/**
 * Streaming single or multi-member GZIP decompression
 */
var Gunzip = /*#__PURE__*/ (function () {
    function Gunzip(opts, cb) {
        this.v = 1;
        this.r = 0;
        Inflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be GUNZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Gunzip.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        this.r += chunk.length;
        if (this.v) {
            var p = this.p.subarray(this.v - 1);
            var s = p.length > 3 ? gzs(p) : 4;
            if (s > p.length) {
                if (!final)
                    return;
            }
            else if (this.v > 1 && this.onmember) {
                this.onmember(this.r - p.length);
            }
            this.p = p.subarray(s), this.v = 0;
        }
        // necessary to prevent TS from using the closure value
        // This allows for workerization to function correctly
        Inflate.prototype.c.call(this, 0);
        // process concatenated GZIP
        if (this.s.f && !this.s.l) {
            this.v = shft(this.s.p) + 9;
            this.s = { i: 0 };
            this.o = new u8(0);
            this.push(new u8(0), final);
        }
        else if (final) {
            Inflate.prototype.c.call(this, final);
        }
    };
    return Gunzip;
}());
export { Gunzip };
/**
 * Asynchronous streaming single or multi-member GZIP decompression
 */
var AsyncGunzip = /*#__PURE__*/ (function () {
    function AsyncGunzip(opts, cb) {
        var _this = this;
        astrmify([
            bInflt,
            guze,
            function () { return [astrm, Inflate, Gunzip]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Gunzip(ev.data);
            strm.onmember = function (offset) { return postMessage(offset); };
            onmessage = astrm(strm);
        }, 9, 0, function (offset) { return _this.onmember && _this.onmember(offset); });
    }
    return AsyncGunzip;
}());
export { AsyncGunzip };
export function gunzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt,
        guze,
        function () { return [gunzipSync]; }
    ], function (ev) { return pbf(gunzipSync(ev.data[0], ev.data[1])); }, 3, cb);
}
export function gunzipSync(data, opts) {
    var st = gzs(data);
    if (st + 8 > data.length)
        err(6, 'invalid gzip data');
    return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
/**
 * Streaming Zlib compression
 */
var Zlib = /*#__PURE__*/ (function () {
    function Zlib(opts, cb) {
        this.c = adler();
        this.v = 1;
        Deflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be zlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Zlib.prototype.push = function (chunk, final) {
        this.c.p(chunk);
        Deflate.prototype.push.call(this, chunk, final);
    };
    Zlib.prototype.p = function (c, f) {
        var raw = dopt(c, this.o, this.v && (this.o.dictionary ? 6 : 2), f && 4, this.s);
        if (this.v)
            zlh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 4, this.c.d());
        this.ondata(raw, f);
    };
    /**
     * Flushes buffered uncompressed data. Useful to immediately retrieve the
     * zlibbed output for small inputs.
     * @param sync Whether to flush to a byte boundary. A sync flush takes 4-5
     *             extra bytes, but guarantees all pushed data is immediately
     *             decompressible.
     */
    Zlib.prototype.flush = function (sync) {
        Deflate.prototype.flush.call(this, sync);
    };
    return Zlib;
}());
export { Zlib };
/**
 * Asynchronous streaming Zlib compression
 */
var AsyncZlib = /*#__PURE__*/ (function () {
    function AsyncZlib(opts, cb) {
        astrmify([
            bDflt,
            zle,
            function () { return [astrm, Deflate, Zlib]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Zlib(ev.data);
            onmessage = astrm(strm);
        }, 10, 1);
    }
    return AsyncZlib;
}());
export { AsyncZlib };
export function zlib(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
        zle,
        function () { return [zlibSync]; }
    ], function (ev) { return pbf(zlibSync(ev.data[0], ev.data[1])); }, 4, cb);
}
/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */
export function zlibSync(data, opts) {
    if (!opts)
        opts = {};
    var a = adler();
    a.p(data);
    var d = dopt(data, opts, opts.dictionary ? 6 : 2, 4);
    return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}
/**
 * Streaming Zlib decompression
 */
var Unzlib = /*#__PURE__*/ (function () {
    function Unzlib(opts, cb) {
        Inflate.call(this, opts, cb);
        this.v = opts && opts.dictionary ? 2 : 1;
    }
    /**
     * Pushes a chunk to be unzlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Unzlib.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
            if (this.p.length < 6 && !final)
                return;
            this.p = this.p.subarray(zls(this.p, this.v - 1)), this.v = 0;
        }
        if (final) {
            if (this.p.length < 4)
                err(6, 'invalid zlib data');
            this.p = this.p.subarray(0, -4);
        }
        // necessary to prevent TS from using the closure value
        // This allows for workerization to function correctly
        Inflate.prototype.c.call(this, final);
    };
    return Unzlib;
}());
export { Unzlib };
/**
 * Asynchronous streaming Zlib decompression
 */
var AsyncUnzlib = /*#__PURE__*/ (function () {
    function AsyncUnzlib(opts, cb) {
        astrmify([
            bInflt,
            zule,
            function () { return [astrm, Inflate, Unzlib]; }
        ], this, StrmOpt.call(this, opts, cb), function (ev) {
            var strm = new Unzlib(ev.data);
            onmessage = astrm(strm);
        }, 11, 0);
    }
    return AsyncUnzlib;
}());
export { AsyncUnzlib };
export function unzlib(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bInflt,
        zule,
        function () { return [unzlibSync]; }
    ], function (ev) { return pbf(unzlibSync(ev.data[0], gopt(ev.data[1]))); }, 5, cb);
}
export function unzlibSync(data, opts) {
    return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
// Default algorithm for compression (used because having a known output size allows faster decompression)
export { gzip as compress, AsyncGzip as AsyncCompress };
export { gzipSync as compressSync, Gzip as Compress };
/**
 * Streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var Decompress = /*#__PURE__*/ (function () {
    function Decompress(opts, cb) {
        this.o = StrmOpt.call(this, opts, cb) || {};
        this.G = Gunzip;
        this.I = Inflate;
        this.Z = Unzlib;
    }
    // init substream
    // overriden by AsyncDecompress
    Decompress.prototype.i = function () {
        var _this = this;
        this.s.ondata = function (dat, final) {
            _this.ondata(dat, final);
        };
    };
    /**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Decompress.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (!this.s) {
            if (this.p && this.p.length) {
                var n = new u8(this.p.length + chunk.length);
                n.set(this.p), n.set(chunk, this.p.length);
            }
            else
                this.p = chunk;
            if (this.p.length > 2) {
                this.s = (this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8)
                    ? new this.G(this.o)
                    : ((this.p[0] & 15) != 8 || (this.p[0] >> 4) > 7 || ((this.p[0] << 8 | this.p[1]) % 31))
                        ? new this.I(this.o)
                        : new this.Z(this.o);
                this.i();
                this.s.push(this.p, final);
                this.p = null;
            }
        }
        else
            this.s.push(chunk, final);
    };
    return Decompress;
}());
export { Decompress };
/**
 * Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var AsyncDecompress = /*#__PURE__*/ (function () {
    function AsyncDecompress(opts, cb) {
        Decompress.call(this, opts, cb);
        this.queuedSize = 0;
        this.G = AsyncGunzip;
        this.I = AsyncInflate;
        this.Z = AsyncUnzlib;
    }
    AsyncDecompress.prototype.i = function () {
        var _this = this;
        this.s.ondata = function (err, dat, final) {
            _this.ondata(err, dat, final);
        };
        this.s.ondrain = function (size) {
            _this.queuedSize -= size;
            if (_this.ondrain)
                _this.ondrain(size);
        };
    };
    /**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    AsyncDecompress.prototype.push = function (chunk, final) {
        this.queuedSize += chunk.length;
        Decompress.prototype.push.call(this, chunk, final);
    };
    return AsyncDecompress;
}());
export { AsyncDecompress };
export function decompress(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzip(data, opts, cb)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflate(data, opts, cb)
            : unzlib(data, opts, cb);
}
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
export function decompressSync(data, opts) {
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzipSync(data, opts)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflateSync(data, opts)
            : unzlibSync(data, opts);
}
// flatten a directory structure
var fltn = function (d, p, t, o) {
    for (var k in d) {
        var val = d[k], n = p + k, op = o;
        if (Array.isArray(val))
            op = mrg(o, val[1]), val = val[0];
        if (ArrayBuffer.isView(val))
            t[n] = [val, op];
        else {
            t[n += '/'] = [new u8(0), op];
            fltn(val, n, t, o);
        }
    }
};
// text encoder
var te = typeof TextEncoder != 'undefined' && /*#__PURE__*/ new TextEncoder();
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
// text decoder stream
var tds = 0;
try {
    td.decode(et, { stream: true });
    tds = 1;
}
catch (e) { }
// decode UTF8
var dutf8 = function (d) {
    for (var r = '', i = 0;;) {
        var c = d[i++];
        var eb = (c > 127) + (c > 223) + (c > 239);
        if (i + eb > d.length)
            return { s: r, r: slc(d, i - 1) };
        if (!eb)
            r += String.fromCharCode(c);
        else if (eb == 3) {
            c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63)) - 65536,
                r += String.fromCharCode(55296 | (c >> 10), 56320 | (c & 1023));
        }
        else if (eb & 1)
            r += String.fromCharCode((c & 31) << 6 | (d[i++] & 63));
        else
            r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63));
    }
};
/**
 * Streaming UTF-8 decoding
 */
var DecodeUTF8 = /*#__PURE__*/ (function () {
    /**
     * Creates a UTF-8 decoding stream
     * @param cb The callback to call whenever data is decoded
     */
    function DecodeUTF8(cb) {
        this.ondata = cb;
        if (tds)
            this.t = new TextDecoder();
        else
            this.p = et;
    }
    /**
     * Pushes a chunk to be decoded from UTF-8 binary
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    DecodeUTF8.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        final = !!final;
        if (this.t) {
            this.ondata(this.t.decode(chunk, { stream: true }), final);
            if (final) {
                if (this.t.decode().length)
                    err(8);
                this.t = null;
            }
            return;
        }
        if (!this.p)
            err(4);
        var dat = new u8(this.p.length + chunk.length);
        dat.set(this.p);
        dat.set(chunk, this.p.length);
        var _a = dutf8(dat), s = _a.s, r = _a.r;
        if (final) {
            if (r.length)
                err(8);
            this.p = null;
        }
        else
            this.p = r;
        this.ondata(s, final);
    };
    return DecodeUTF8;
}());
export { DecodeUTF8 };
/**
 * Streaming UTF-8 encoding
 */
var EncodeUTF8 = /*#__PURE__*/ (function () {
    /**
     * Creates a UTF-8 decoding stream
     * @param cb The callback to call whenever data is encoded
     */
    function EncodeUTF8(cb) {
        this.ondata = cb;
    }
    /**
     * Pushes a chunk to be encoded to UTF-8
     * @param chunk The string data to push
     * @param final Whether this is the last chunk
     */
    EncodeUTF8.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        if (this.d)
            err(4);
        this.ondata(strToU8(chunk), this.d = final || false);
    };
    return EncodeUTF8;
}());
export { EncodeUTF8 };
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
export function strToU8(str, latin1) {
    if (latin1) {
        var ar_1 = new u8(str.length);
        for (var i = 0; i < str.length; ++i)
            ar_1[i] = str.charCodeAt(i);
        return ar_1;
    }
    if (te)
        return te.encode(str);
    var l = str.length;
    var ar = new u8(str.length + (str.length >> 1));
    var ai = 0;
    var w = function (v) { ar[ai++] = v; };
    for (var i = 0; i < l; ++i) {
        if (ai + 5 > ar.length) {
            var n = new u8(ai + 8 + ((l - i) << 1));
            n.set(ar);
            ar = n;
        }
        var c = str.charCodeAt(i);
        if (c < 128 || latin1)
            w(c);
        else if (c < 2048)
            w(192 | (c >> 6)), w(128 | (c & 63));
        else if (c > 55295 && c < 57344)
            c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                w(240 | (c >> 18)), w(128 | ((c >> 12) & 63)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
        else
            w(224 | (c >> 12)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
    }
    return slc(ar, 0, ai);
}
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
export function strFromU8(dat, latin1) {
    if (latin1) {
        var r = '';
        for (var i = 0; i < dat.length; i += 16384)
            r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
        return r;
    }
    else if (td) {
        return td.decode(dat);
    }
    else {
        var _a = dutf8(dat), s = _a.s, r = _a.r;
        if (r.length)
            err(8);
        return s;
    }
}
;
// deflate bit flag
var dbf = function (l) { return l == 1 ? 3 : l < 6 ? 2 : l == 9 ? 1 : 0; };
// skip local zip header
var slzh = function (d, b) { return b + 30 + b2(d, b + 26) + b2(d, b + 28); };
// read zip header
var zh = function (d, b, z) {
    var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
    var _a = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a[0], su = _a[1], off = _a[2];
    return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
};
// read zip64 header sizes
var z64hs = function (d, b, l, z, sc, su, off) {
    var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
    var nf = nsc + nsu + noff;
    if (z && nf) {
        for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
            if (b2(d, b) == 1) {
                return [
                    nsc ? b8(d, b + 4 + 8 * nsu) : sc,
                    nsu ? b8(d, b + 4) : su,
                    noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
                    1
                ];
            }
        }
        // z == 2 for unknown whether or not zip64
        if (z < 2)
            err(13);
    }
    return [sc, su, off, 0];
};
// extra field length
var exfl = function (ex) {
    var le = 0;
    if (ex) {
        for (var k in ex) {
            var l = ex[k].length;
            if (l > 65535)
                err(9);
            le += l + 4;
        }
    }
    return le;
};
// write zip header
var wzh = function (d, b, f, fn, u, c, ce, co) {
    var fl = fn.length, ex = f.extra, col = co && co.length;
    var exl = exfl(ex);
    wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
    if (ce != null)
        d[b++] = 20, d[b++] = f.os;
    d[b] = 20, b += 2; // spec compliance? what's that?
    d[b++] = (f.flag << 1) | (c < 0 && 8), d[b++] = u && 8;
    d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
    var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
    if (y < 0 || y > 119)
        err(10);
    wbytes(d, b, (y << 25) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >> 1)), b += 4;
    if (c != -1) {
        wbytes(d, b, f.crc);
        wbytes(d, b + 4, c < 0 ? -c - 2 : c);
        wbytes(d, b + 8, f.size);
    }
    wbytes(d, b + 12, fl);
    wbytes(d, b + 14, exl), b += 16;
    if (ce != null) {
        wbytes(d, b, col);
        wbytes(d, b + 6, f.attrs);
        wbytes(d, b + 10, ce), b += 14;
    }
    d.set(fn, b);
    b += fl;
    if (exl) {
        for (var k in ex) {
            var exf = ex[k], l = exf.length;
            wbytes(d, b, +k);
            wbytes(d, b + 2, l);
            d.set(exf, b + 4), b += 4 + l;
        }
    }
    if (col)
        d.set(co, b), b += col;
    return b;
};
// write zip footer (end of central directory)
var wzf = function (o, b, c, d, e) {
    wbytes(o, b, 0x6054B50); // skip disk
    wbytes(o, b + 8, c);
    wbytes(o, b + 10, c);
    wbytes(o, b + 12, d);
    wbytes(o, b + 16, e);
};
/**
 * A pass-through stream to keep data uncompressed in a ZIP archive.
 */
var ZipPassThrough = /*#__PURE__*/ (function () {
    /**
     * Creates a pass-through stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     */
    function ZipPassThrough(filename) {
        this.filename = filename;
        this.c = crc();
        this.size = 0;
        this.compression = 0;
    }
    /**
     * Processes a chunk and pushes to the output stream. You can override this
     * method in a subclass for custom behavior, but by default this passes
     * the data through. You must call this.ondata(err, chunk, final) at some
     * point in this method.
     * @param chunk The chunk to process
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.process = function (chunk, final) {
        this.ondata(null, chunk, final);
    };
    /**
     * Pushes a chunk to be added. If you are subclassing this with a custom
     * compression algorithm, note that you must push data from the source
     * file only, pre-compression.
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.push = function (chunk, final) {
        if (!this.ondata)
            err(5);
        this.c.p(chunk);
        this.size += chunk.length;
        if (final)
            this.crc = this.c.d();
        // we shouldn't really do this cast, but properly handling ArrayBufferLike
        // makes the API unergonomic with Buffer
        this.process(chunk, final || false);
    };
    return ZipPassThrough;
}());
export { ZipPassThrough };
// I don't extend because TypeScript extension adds 1kB of runtime bloat
/**
 * Streaming DEFLATE compression for ZIP archives. Prefer using AsyncZipDeflate
 * for better performance
 */
var ZipDeflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     * @param opts The compression options
     */
    function ZipDeflate(filename, opts) {
        var _this = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new Deflate(opts, function (dat, final) {
            _this.ondata(null, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
    }
    ZipDeflate.prototype.process = function (chunk, final) {
        try {
            this.d.push(chunk, final);
        }
        catch (e) {
            this.ondata(e, null, final);
        }
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    ZipDeflate.prototype.push = function (chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
    };
    return ZipDeflate;
}());
export { ZipDeflate };
/**
 * Asynchronous streaming DEFLATE compression for ZIP archives
 */
var AsyncZipDeflate = /*#__PURE__*/ (function () {
    /**
     * Creates an asynchronous DEFLATE stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     * @param opts The compression options
     */
    function AsyncZipDeflate(filename, opts) {
        var _this = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new AsyncDeflate(opts, function (err, dat, final) {
            _this.ondata(err, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
        this.terminate = this.d.terminate;
    }
    AsyncZipDeflate.prototype.process = function (chunk, final) {
        this.d.push(chunk, final);
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    AsyncZipDeflate.prototype.push = function (chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
    };
    return AsyncZipDeflate;
}());
export { AsyncZipDeflate };
// TODO: Better tree shaking
/**
 * A zippable archive to which files can incrementally be added
 */
var Zip = /*#__PURE__*/ (function () {
    /**
     * Creates an empty ZIP archive to which files can be added
     * @param cb The callback to call whenever data for the generated ZIP archive
     *           is available
     */
    function Zip(cb) {
        this.ondata = cb;
        this.u = [];
        this.d = 1;
    }
    /**
     * Adds a file to the ZIP archive
     * @param file The file stream to add
     */
    Zip.prototype.add = function (file) {
        var _this = this;
        if (!this.ondata)
            err(5);
        // finishing or finished
        if (this.d & 2)
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, false);
        else {
            var f = strToU8(file.filename), fl_1 = f.length;
            var com = file.comment, o = com && strToU8(com);
            var u = fl_1 != file.filename.length || (o && (com.length != o.length));
            var hl_1 = fl_1 + exfl(file.extra) + 30;
            if (fl_1 > 65535)
                this.ondata(err(11, 0, 1), null, false);
            var header = new u8(hl_1);
            wzh(header, 0, file, f, u, -1);
            var chks_1 = [header];
            var pAll_1 = function () {
                for (var _i = 0, chks_2 = chks_1; _i < chks_2.length; _i++) {
                    var chk = chks_2[_i];
                    _this.ondata(null, chk, false);
                }
                chks_1 = [];
            };
            var tr_1 = this.d;
            this.d = 0;
            var ind_1 = this.u.length;
            var uf_1 = mrg(file, {
                f: f,
                u: u,
                o: o,
                t: function () {
                    if (file.terminate)
                        file.terminate();
                },
                r: function () {
                    pAll_1();
                    if (tr_1) {
                        var nxt = _this.u[ind_1 + 1];
                        if (nxt)
                            nxt.r();
                        else
                            _this.d = 1;
                    }
                    tr_1 = 1;
                }
            });
            var cl_1 = 0;
            file.ondata = function (err, dat, final) {
                if (err) {
                    _this.ondata(err, dat, final);
                    _this.terminate();
                }
                else {
                    cl_1 += dat.length;
                    chks_1.push(dat);
                    if (final) {
                        var dd = new u8(16);
                        wbytes(dd, 0, 0x8074B50);
                        wbytes(dd, 4, file.crc);
                        wbytes(dd, 8, cl_1);
                        wbytes(dd, 12, file.size);
                        chks_1.push(dd);
                        uf_1.c = cl_1, uf_1.b = hl_1 + cl_1 + 16, uf_1.crc = file.crc, uf_1.size = file.size;
                        if (tr_1)
                            uf_1.r();
                        tr_1 = 1;
                    }
                    else if (tr_1)
                        pAll_1();
                }
            };
            this.u.push(uf_1);
        }
    };
    /**
     * Ends the process of adding files and prepares to emit the final chunks.
     * This *must* be called after adding all desired files for the resulting
     * ZIP file to work properly.
     */
    Zip.prototype.end = function () {
        var _this = this;
        if (this.d & 2) {
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, true);
            return;
        }
        if (this.d)
            this.e();
        else
            this.u.push({
                r: function () {
                    if (!(_this.d & 1))
                        return;
                    _this.u.splice(-1, 1);
                    _this.e();
                },
                t: function () { }
            });
        this.d = 3;
    };
    Zip.prototype.e = function () {
        var bt = 0, l = 0, tl = 0;
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
        }
        var out = new u8(tl + 22);
        for (var _b = 0, _c = this.u; _b < _c.length; _b++) {
            var f = _c[_b];
            wzh(out, bt, f, f.f, f.u, -f.c - 2, l, f.o);
            bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
        }
        wzf(out, bt, this.u.length, tl, l);
        this.ondata(null, out, true);
        this.d = 2;
    };
    /**
     * A method to terminate any internal workers used by the stream. Subsequent
     * calls to add() will fail.
     */
    Zip.prototype.terminate = function () {
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            f.t();
        }
        this.d = 2;
    };
    return Zip;
}());
export { Zip };
export function zip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    var r = {};
    fltn(data, '', r, opts);
    var k = Object.keys(r);
    var lft = k.length, o = 0, tot = 0;
    var slft = lft, files = new Array(lft);
    var term = [];
    var tAll = function () {
        for (var i = 0; i < term.length; ++i)
            term[i]();
    };
    var cbd = function (a, b) {
        mt(function () { cb(a, b); });
    };
    mt(function () { cbd = cb; });
    var cbf = function () {
        var out = new u8(tot + 22), oe = o, cdl = tot - o;
        tot = 0;
        for (var i = 0; i < slft; ++i) {
            var f = files[i];
            try {
                var l = f.c.length;
                wzh(out, tot, f, f.f, f.u, l);
                var badd = 30 + f.f.length + exfl(f.extra);
                var loc = tot + badd;
                out.set(f.c, loc);
                wzh(out, o, f, f.f, f.u, l, tot, f.m), o += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l;
            }
            catch (e) {
                return cbd(e, null);
            }
        }
        wzf(out, o, files.length, cdl, oe);
        cbd(null, out);
    };
    if (!lft)
        cbf();
    var _loop_1 = function (i) {
        var fn = k[i];
        var _a = r[fn], file = _a[0], p = _a[1];
        var c = crc(), size = file.length;
        c.p(file);
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        var compression = p.level == 0 ? 0 : 8;
        var cbl = function (e, d) {
            if (e) {
                tAll();
                cbd(e, null);
            }
            else {
                var l = d.length;
                files[i] = mrg(p, {
                    size: size,
                    crc: c.d(),
                    c: d,
                    f: f,
                    m: m,
                    u: s != fn.length || (m && (com.length != ms)),
                    compression: compression
                });
                o += 30 + s + exl + l;
                tot += 76 + 2 * (s + exl) + (ms || 0) + l;
                if (!--lft)
                    cbf();
            }
        };
        if (s > 65535)
            cbl(err(11, 0, 1), null);
        if (!compression)
            cbl(null, file);
        else if (size < 160000) {
            try {
                cbl(null, deflateSync(file, p));
            }
            catch (e) {
                cbl(e, null);
            }
        }
        else
            term.push(deflate(file, p, cbl));
    };
    // Cannot use lft because it can decrease
    for (var i = 0; i < slft; ++i) {
        _loop_1(i);
    }
    return tAll;
}
/**
 * Synchronously creates a ZIP file. Prefer using \`zip\` for better performance
 * with more than one file.
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @returns The generated ZIP archive
 */
export function zipSync(data, opts) {
    if (!opts)
        opts = {};
    var r = {};
    var files = [];
    fltn(data, '', r, opts);
    var o = 0;
    var tot = 0;
    for (var fn in r) {
        var _a = r[fn], file = _a[0], p = _a[1];
        var compression = p.level == 0 ? 0 : 8;
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        if (s > 65535)
            err(11);
        var d = compression ? deflateSync(file, p) : file, l = d.length;
        var c = crc();
        c.p(file);
        files.push(mrg(p, {
            size: file.length,
            crc: c.d(),
            c: d,
            f: f,
            m: m,
            u: s != fn.length || (m && (com.length != ms)),
            o: o,
            compression: compression
        }));
        o += 30 + s + exl + l;
        tot += 76 + 2 * (s + exl) + (ms || 0) + l;
    }
    var out = new u8(tot + 22), oe = o, cdl = tot - o;
    for (var i = 0; i < files.length; ++i) {
        var f = files[i];
        wzh(out, f.o, f, f.f, f.u, f.c.length);
        var badd = 30 + f.f.length + exfl(f.extra);
        out.set(f.c, f.o + badd);
        wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
    }
    wzf(out, o, files.length, cdl, oe);
    return out;
}
/**
 * Streaming pass-through decompression for ZIP archives
 */
var UnzipPassThrough = /*#__PURE__*/ (function () {
    function UnzipPassThrough() {
    }
    UnzipPassThrough.prototype.push = function (chunk, final) {
        // same as ZipPassThrough: cast to retain Buffer ergonomics
        this.ondata(null, chunk, final);
    };
    UnzipPassThrough.compression = 0;
    return UnzipPassThrough;
}());
export { UnzipPassThrough };
/**
 * Streaming DEFLATE decompression for ZIP archives. Prefer AsyncZipInflate for
 * better performance.
 */
var UnzipInflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE decompression that can be used in ZIP archives
     */
    function UnzipInflate() {
        var _this = this;
        this.i = new Inflate(function (dat, final) {
            _this.ondata(null, dat, final);
        });
    }
    UnzipInflate.prototype.push = function (chunk, final) {
        try {
            this.i.push(chunk, final);
        }
        catch (e) {
            this.ondata(e, null, final);
        }
    };
    UnzipInflate.compression = 8;
    return UnzipInflate;
}());
export { UnzipInflate };
/**
 * Asynchronous streaming DEFLATE decompression for ZIP archives
 */
var AsyncUnzipInflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE decompression that can be used in ZIP archives
     */
    function AsyncUnzipInflate(_, sz) {
        var _this = this;
        if (sz < 320000) {
            this.i = new Inflate(function (dat, final) {
                _this.ondata(null, dat, final);
            });
        }
        else {
            this.i = new AsyncInflate(function (err, dat, final) {
                _this.ondata(err, dat, final);
            });
            this.terminate = this.i.terminate;
        }
    }
    AsyncUnzipInflate.prototype.push = function (chunk, final) {
        if (this.i.terminate)
            chunk = slc(chunk, 0);
        this.i.push(chunk, final);
    };
    AsyncUnzipInflate.compression = 8;
    return AsyncUnzipInflate;
}());
export { AsyncUnzipInflate };
/**
 * A ZIP archive decompression stream that emits files as they are discovered
 */
var Unzip = /*#__PURE__*/ (function () {
    /**
     * Creates a ZIP decompression stream
     * @param cb The callback to call whenever a file in the ZIP archive is found
     */
    function Unzip(cb) {
        this.onfile = cb;
        this.k = [];
        this.o = {
            0: UnzipPassThrough
        };
        this.p = et;
    }
    /**
     * Pushes a chunk to be unzipped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Unzip.prototype.push = function (chunk, final) {
        var _this = this;
        if (!this.onfile)
            err(5);
        if (!this.p)
            err(4);
        if (this.c > 0) {
            var len = Math.min(this.c, chunk.length);
            var toAdd = chunk.subarray(0, len);
            this.c -= len;
            if (this.d)
                this.d.push(toAdd, !this.c);
            else
                this.k[0].push(toAdd);
            chunk = chunk.subarray(len);
            if (chunk.length)
                return this.push(chunk, final);
        }
        else {
            var f = 0, i = 0, is = void 0, buf = void 0;
            if (!this.p.length)
                buf = chunk;
            else if (!chunk.length)
                buf = this.p;
            else {
                buf = new u8(this.p.length + chunk.length);
                buf.set(this.p), buf.set(chunk, this.p.length);
            }
            var l = buf.length, oc = this.c, add = oc && this.d;
            var _loop_2 = function () {
                var sig = b4(buf, i);
                if (sig == 0x4034B50) {
                    f = 1, is = i;
                    this_1.d = null;
                    this_1.c = 0;
                    var bf = b2(buf, i + 6), cmp_1 = b2(buf, i + 8), u = bf & 2048, dd = bf & 8, fnl = b2(buf, i + 26), es = b2(buf, i + 28);
                    if (l > i + 30 + fnl + es) {
                        var chks_3 = [];
                        this_1.k.unshift(chks_3);
                        f = 2;
                        var lsc = b4(buf, i + 18), lsu = b4(buf, i + 22);
                        var fn_1 = strFromU8(buf.subarray(i + 30, i += 30 + fnl), !u);
                        var _a = z64hs(buf, i, es, 2, lsc, lsu, 0), sc_1 = _a[0], su_1 = _a[1], z64 = _a[3];
                        if (dd)
                            sc_1 = -1 - z64;
                        i += es;
                        this_1.c = sc_1;
                        var d_1;
                        var file_1 = {
                            name: fn_1,
                            compression: cmp_1,
                            start: function () {
                                if (!file_1.ondata)
                                    err(5);
                                if (!sc_1)
                                    file_1.ondata(null, et, true);
                                else {
                                    var ctr = _this.o[cmp_1];
                                    if (!ctr)
                                        file_1.ondata(err(14, 'unknown compression type ' + cmp_1, 1), null, false);
                                    d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                                    d_1.ondata = function (err, dat, final) { file_1.ondata(err, dat, final); };
                                    for (var _i = 0, chks_4 = chks_3; _i < chks_4.length; _i++) {
                                        var dat = chks_4[_i];
                                        d_1.push(dat, false);
                                    }
                                    if (_this.k[0] == chks_3 && _this.c)
                                        _this.d = d_1;
                                    else
                                        d_1.push(et, true);
                                }
                            },
                            terminate: function () {
                                if (d_1 && d_1.terminate)
                                    d_1.terminate();
                            }
                        };
                        if (sc_1 >= 0)
                            file_1.size = sc_1, file_1.originalSize = su_1;
                        this_1.onfile(file_1);
                    }
                    return "break";
                }
                else if (oc) {
                    if (sig == 0x8074B50) {
                        is = i += 12 + (oc == -2 && 8), f = 3, this_1.c = 0;
                        return "break";
                    }
                    else if (sig == 0x2014B50) {
                        is = i -= 4, f = 3, this_1.c = 0;
                        return "break";
                    }
                }
            };
            var this_1 = this;
            for (; i < l - 4; ++i) {
                var state_1 = _loop_2();
                if (state_1 === "break")
                    break;
            }
            this.p = et;
            if (oc < 0) {
                var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 0x8074B50 && 4)) : buf.subarray(0, i);
                if (add)
                    add.push(dat, !!f);
                else
                    this.k[+(f == 2)].push(dat);
            }
            if (f & 2)
                return this.push(buf.subarray(i), final);
            this.p = buf.subarray(i);
        }
        if (final) {
            if (this.c)
                err(13);
            this.p = null;
        }
    };
    /**
     * Registers a decoder with the stream, allowing for files compressed with
     * the compression type provided to be expanded correctly
     * @param decoder The decoder constructor
     */
    Unzip.prototype.register = function (decoder) {
        this.o[decoder.compression] = decoder;
    };
    return Unzip;
}());
export { Unzip };
var mt = typeof queueMicrotask == 'function' ? queueMicrotask : typeof setTimeout == 'function' ? setTimeout : function (fn) { fn(); };
export function unzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    var term = [];
    var tAll = function () {
        for (var i = 0; i < term.length; ++i)
            term[i]();
    };
    var files = {};
    var cbd = function (a, b) {
        mt(function () { cb(a, b); });
    };
    mt(function () { cbd = cb; });
    var e = data.length - 22;
    for (; b4(data, e) != 0x6054B50; --e) {
        if (!e || data.length - e > 65558) {
            cbd(err(13, 0, 1), null);
            return tAll;
        }
    }
    ;
    var lft = b2(data, e + 8);
    if (lft) {
        var c = lft;
        var o = b4(data, e + 16);
        var z = b4(data, e - 20) == 0x7064B50;
        if (z) {
            var ze = b4(data, e - 12);
            z = b4(data, ze) == 0x6064B50;
            if (z) {
                c = lft = b4(data, ze + 32);
                o = b4(data, ze + 48);
            }
        }
        var fltr = opts && opts.filter;
        var _loop_3 = function (i) {
            var _a = zh(data, o, z), c_1 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
            o = no;
            var cbl = function (e, d) {
                if (e) {
                    tAll();
                    cbd(e, null);
                }
                else {
                    if (d)
                        files[fn] = d;
                    if (!--lft)
                        cbd(null, files);
                }
            };
            if (!fltr || fltr({
                name: fn,
                size: sc,
                originalSize: su,
                compression: c_1
            })) {
                if (!c_1)
                    cbl(null, slc(data, b, b + sc));
                else if (c_1 == 8) {
                    var infl = data.subarray(b, b + sc);
                    // Synchronously decompress under 512KB, or barely-compressed data
                    if (su < 524288 || sc > 0.8 * su) {
                        try {
                            cbl(null, inflateSync(infl, { out: new u8(su) }));
                        }
                        catch (e) {
                            cbl(e, null);
                        }
                    }
                    else
                        term.push(inflate(infl, { size: su }, cbl));
                }
                else
                    cbl(err(14, 'unknown compression type ' + c_1, 1), null);
            }
            else
                cbl(null, null);
        };
        for (var i = 0; i < c; ++i) {
            _loop_3(i);
        }
    }
    else
        cbd(null, {});
    return tAll;
}
/**
 * Synchronously decompresses a ZIP archive. Prefer using \`unzip\` for better
 * performance with more than one file.
 * @param data The raw compressed ZIP file
 * @param opts The ZIP extraction options
 * @returns The decompressed files
 */
export function unzipSync(data, opts) {
    var files = {};
    var e = data.length - 22;
    for (; b4(data, e) != 0x6054B50; --e) {
        if (!e || data.length - e > 65558)
            err(13);
    }
    ;
    var c = b2(data, e + 8);
    if (!c)
        return {};
    var o = b4(data, e + 16);
    var z = b4(data, e - 20) == 0x7064B50;
    if (z) {
        var ze = b4(data, e - 12);
        z = b4(data, ze) == 0x6064B50;
        if (z) {
            c = b4(data, ze + 32);
            o = b4(data, ze + 48);
        }
    }
    var fltr = opts && opts.filter;
    for (var i = 0; i < c; ++i) {
        var _a = zh(data, o, z), c_2 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
        o = no;
        if (!fltr || fltr({
            name: fn,
            size: sc,
            originalSize: su,
            compression: c_2
        })) {
            if (!c_2)
                files[fn] = slc(data, b, b + sc);
            else if (c_2 == 8)
                files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
            else
                err(14, 'unknown compression type ' + c_2);
        }
    }
    return files;
}
`, type: "text/javascript; charset=utf-8" }, "/vendor/mp4-muxer.js": { body: `var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// src/misc.ts
var bytes = new Uint8Array(8);
var view = new DataView(bytes.buffer);
var u8 = (value) => {
  return [(value % 256 + 256) % 256];
};
var u16 = (value) => {
  view.setUint16(0, value, false);
  return [bytes[0], bytes[1]];
};
var i16 = (value) => {
  view.setInt16(0, value, false);
  return [bytes[0], bytes[1]];
};
var u24 = (value) => {
  view.setUint32(0, value, false);
  return [bytes[1], bytes[2], bytes[3]];
};
var u32 = (value) => {
  view.setUint32(0, value, false);
  return [bytes[0], bytes[1], bytes[2], bytes[3]];
};
var i32 = (value) => {
  view.setInt32(0, value, false);
  return [bytes[0], bytes[1], bytes[2], bytes[3]];
};
var u64 = (value) => {
  view.setUint32(0, Math.floor(value / 2 ** 32), false);
  view.setUint32(4, value, false);
  return [bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5], bytes[6], bytes[7]];
};
var fixed_8_8 = (value) => {
  view.setInt16(0, 2 ** 8 * value, false);
  return [bytes[0], bytes[1]];
};
var fixed_16_16 = (value) => {
  view.setInt32(0, 2 ** 16 * value, false);
  return [bytes[0], bytes[1], bytes[2], bytes[3]];
};
var fixed_2_30 = (value) => {
  view.setInt32(0, 2 ** 30 * value, false);
  return [bytes[0], bytes[1], bytes[2], bytes[3]];
};
var ascii = (text, nullTerminated = false) => {
  let bytes2 = Array(text.length).fill(null).map((_, i) => text.charCodeAt(i));
  if (nullTerminated)
    bytes2.push(0);
  return bytes2;
};
var last = (arr) => {
  return arr && arr[arr.length - 1];
};
var lastPresentedSample = (samples) => {
  let result = void 0;
  for (let sample of samples) {
    if (!result || sample.presentationTimestamp > result.presentationTimestamp) {
      result = sample;
    }
  }
  return result;
};
var intoTimescale = (timeInSeconds, timescale, round = true) => {
  let value = timeInSeconds * timescale;
  return round ? Math.round(value) : value;
};
var rotationMatrix = (rotationInDegrees) => {
  let theta = rotationInDegrees * (Math.PI / 180);
  let cosTheta = Math.cos(theta);
  let sinTheta = Math.sin(theta);
  return [
    cosTheta,
    sinTheta,
    0,
    -sinTheta,
    cosTheta,
    0,
    0,
    0,
    1
  ];
};
var IDENTITY_MATRIX = rotationMatrix(0);
var matrixToBytes = (matrix) => {
  return [
    fixed_16_16(matrix[0]),
    fixed_16_16(matrix[1]),
    fixed_2_30(matrix[2]),
    fixed_16_16(matrix[3]),
    fixed_16_16(matrix[4]),
    fixed_2_30(matrix[5]),
    fixed_16_16(matrix[6]),
    fixed_16_16(matrix[7]),
    fixed_2_30(matrix[8])
  ];
};
var deepClone = (x) => {
  if (!x)
    return x;
  if (typeof x !== "object")
    return x;
  if (Array.isArray(x))
    return x.map(deepClone);
  return Object.fromEntries(Object.entries(x).map(([key, value]) => [key, deepClone(value)]));
};
var isU32 = (value) => {
  return value >= 0 && value < 2 ** 32;
};

// src/box.ts
var box = (type, contents, children) => ({
  type,
  contents: contents && new Uint8Array(contents.flat(10)),
  children
});
var fullBox = (type, version, flags, contents, children) => box(
  type,
  [u8(version), u24(flags), contents ?? []],
  children
);
var ftyp = (details) => {
  let minorVersion = 512;
  if (details.fragmented)
    return box("ftyp", [
      ascii("iso5"),
      // Major brand
      u32(minorVersion),
      // Minor version
      // Compatible brands
      ascii("iso5"),
      ascii("iso6"),
      ascii("mp41")
    ]);
  return box("ftyp", [
    ascii("isom"),
    // Major brand
    u32(minorVersion),
    // Minor version
    // Compatible brands
    ascii("isom"),
    details.holdsAvc ? ascii("avc1") : [],
    ascii("mp41")
  ]);
};
var mdat = (reserveLargeSize) => ({ type: "mdat", largeSize: reserveLargeSize });
var free = (size) => ({ type: "free", size });
var moov = (tracks, creationTime, fragmented = false) => box("moov", null, [
  mvhd(creationTime, tracks),
  ...tracks.map((x) => trak(x, creationTime)),
  fragmented ? mvex(tracks) : null
]);
var mvhd = (creationTime, tracks) => {
  let duration = intoTimescale(Math.max(
    0,
    ...tracks.filter((x) => x.samples.length > 0).map((x) => {
      const lastSample = lastPresentedSample(x.samples);
      return lastSample.presentationTimestamp + lastSample.duration;
    })
  ), GLOBAL_TIMESCALE);
  let nextTrackId = Math.max(...tracks.map((x) => x.id)) + 1;
  let needsU64 = !isU32(creationTime) || !isU32(duration);
  let u32OrU64 = needsU64 ? u64 : u32;
  return fullBox("mvhd", +needsU64, 0, [
    u32OrU64(creationTime),
    // Creation time
    u32OrU64(creationTime),
    // Modification time
    u32(GLOBAL_TIMESCALE),
    // Timescale
    u32OrU64(duration),
    // Duration
    fixed_16_16(1),
    // Preferred rate
    fixed_8_8(1),
    // Preferred volume
    Array(10).fill(0),
    // Reserved
    matrixToBytes(IDENTITY_MATRIX),
    // Matrix
    Array(24).fill(0),
    // Pre-defined
    u32(nextTrackId)
    // Next track ID
  ]);
};
var trak = (track, creationTime) => box("trak", null, [
  tkhd(track, creationTime),
  mdia(track, creationTime)
]);
var tkhd = (track, creationTime) => {
  let lastSample = lastPresentedSample(track.samples);
  let durationInGlobalTimescale = intoTimescale(
    lastSample ? lastSample.presentationTimestamp + lastSample.duration : 0,
    GLOBAL_TIMESCALE
  );
  let needsU64 = !isU32(creationTime) || !isU32(durationInGlobalTimescale);
  let u32OrU64 = needsU64 ? u64 : u32;
  let matrix;
  if (track.info.type === "video") {
    matrix = typeof track.info.rotation === "number" ? rotationMatrix(track.info.rotation) : track.info.rotation;
  } else {
    matrix = IDENTITY_MATRIX;
  }
  return fullBox("tkhd", +needsU64, 3, [
    u32OrU64(creationTime),
    // Creation time
    u32OrU64(creationTime),
    // Modification time
    u32(track.id),
    // Track ID
    u32(0),
    // Reserved
    u32OrU64(durationInGlobalTimescale),
    // Duration
    Array(8).fill(0),
    // Reserved
    u16(0),
    // Layer
    u16(0),
    // Alternate group
    fixed_8_8(track.info.type === "audio" ? 1 : 0),
    // Volume
    u16(0),
    // Reserved
    matrixToBytes(matrix),
    // Matrix
    fixed_16_16(track.info.type === "video" ? track.info.width : 0),
    // Track width
    fixed_16_16(track.info.type === "video" ? track.info.height : 0)
    // Track height
  ]);
};
var mdia = (track, creationTime) => box("mdia", null, [
  mdhd(track, creationTime),
  hdlr(track.info.type === "video" ? "vide" : "soun"),
  minf(track)
]);
var mdhd = (track, creationTime) => {
  let lastSample = lastPresentedSample(track.samples);
  let localDuration = intoTimescale(
    lastSample ? lastSample.presentationTimestamp + lastSample.duration : 0,
    track.timescale
  );
  let needsU64 = !isU32(creationTime) || !isU32(localDuration);
  let u32OrU64 = needsU64 ? u64 : u32;
  return fullBox("mdhd", +needsU64, 0, [
    u32OrU64(creationTime),
    // Creation time
    u32OrU64(creationTime),
    // Modification time
    u32(track.timescale),
    // Timescale
    u32OrU64(localDuration),
    // Duration
    u16(21956),
    // Language ("und", undetermined)
    u16(0)
    // Quality
  ]);
};
var hdlr = (componentSubtype) => fullBox("hdlr", 0, 0, [
  ascii("mhlr"),
  // Component type
  ascii(componentSubtype),
  // Component subtype
  u32(0),
  // Component manufacturer
  u32(0),
  // Component flags
  u32(0),
  // Component flags mask
  ascii("mp4-muxer-hdlr", true)
  // Component name
]);
var minf = (track) => box("minf", null, [
  track.info.type === "video" ? vmhd() : smhd(),
  dinf(),
  stbl(track)
]);
var vmhd = () => fullBox("vmhd", 0, 1, [
  u16(0),
  // Graphics mode
  u16(0),
  // Opcolor R
  u16(0),
  // Opcolor G
  u16(0)
  // Opcolor B
]);
var smhd = () => fullBox("smhd", 0, 0, [
  u16(0),
  // Balance
  u16(0)
  // Reserved
]);
var dinf = () => box("dinf", null, [
  dref()
]);
var dref = () => fullBox("dref", 0, 0, [
  u32(1)
  // Entry count
], [
  url()
]);
var url = () => fullBox("url ", 0, 1);
var stbl = (track) => {
  const needsCtts = track.compositionTimeOffsetTable.length > 1 || track.compositionTimeOffsetTable.some((x) => x.sampleCompositionTimeOffset !== 0);
  return box("stbl", null, [
    stsd(track),
    stts(track),
    stss(track),
    stsc(track),
    stsz(track),
    stco(track),
    needsCtts ? ctts(track) : null
  ]);
};
var stsd = (track) => fullBox("stsd", 0, 0, [
  u32(1)
  // Entry count
], [
  track.info.type === "video" ? videoSampleDescription(
    VIDEO_CODEC_TO_BOX_NAME[track.info.codec],
    track
  ) : soundSampleDescription(
    AUDIO_CODEC_TO_BOX_NAME[track.info.codec],
    track
  )
]);
var videoSampleDescription = (compressionType, track) => box(compressionType, [
  Array(6).fill(0),
  // Reserved
  u16(1),
  // Data reference index
  u16(0),
  // Pre-defined
  u16(0),
  // Reserved
  Array(12).fill(0),
  // Pre-defined
  u16(track.info.width),
  // Width
  u16(track.info.height),
  // Height
  u32(4718592),
  // Horizontal resolution
  u32(4718592),
  // Vertical resolution
  u32(0),
  // Reserved
  u16(1),
  // Frame count
  Array(32).fill(0),
  // Compressor name
  u16(24),
  // Depth
  i16(65535)
  // Pre-defined
], [
  VIDEO_CODEC_TO_CONFIGURATION_BOX[track.info.codec](track),
  track.info.decoderConfig.colorSpace ? colr(track) : null
]);
var COLOR_PRIMARIES_MAP = {
  "bt709": 1,
  // ITU-R BT.709
  "bt470bg": 5,
  // ITU-R BT.470BG
  "smpte170m": 6
  // ITU-R BT.601 525 - SMPTE 170M
};
var TRANSFER_CHARACTERISTICS_MAP = {
  "bt709": 1,
  // ITU-R BT.709
  "smpte170m": 6,
  // SMPTE 170M
  "iec61966-2-1": 13
  // IEC 61966-2-1
};
var MATRIX_COEFFICIENTS_MAP = {
  "rgb": 0,
  // Identity
  "bt709": 1,
  // ITU-R BT.709
  "bt470bg": 5,
  // ITU-R BT.470BG
  "smpte170m": 6
  // SMPTE 170M
};
var colr = (track) => box("colr", [
  ascii("nclx"),
  // Colour type
  u16(COLOR_PRIMARIES_MAP[track.info.decoderConfig.colorSpace.primaries]),
  // Colour primaries
  u16(TRANSFER_CHARACTERISTICS_MAP[track.info.decoderConfig.colorSpace.transfer]),
  // Transfer characteristics
  u16(MATRIX_COEFFICIENTS_MAP[track.info.decoderConfig.colorSpace.matrix]),
  // Matrix coefficients
  u8((track.info.decoderConfig.colorSpace.fullRange ? 1 : 0) << 7)
  // Full range flag
]);
var avcC = (track) => track.info.decoderConfig && box("avcC", [
  // For AVC, description is an AVCDecoderConfigurationRecord, so nothing else to do here
  ...new Uint8Array(track.info.decoderConfig.description)
]);
var hvcC = (track) => track.info.decoderConfig && box("hvcC", [
  // For HEVC, description is a HEVCDecoderConfigurationRecord, so nothing else to do here
  ...new Uint8Array(track.info.decoderConfig.description)
]);
var vpcC = (track) => {
  if (!track.info.decoderConfig) {
    return null;
  }
  let decoderConfig = track.info.decoderConfig;
  if (!decoderConfig.colorSpace) {
    throw new Error(\`'colorSpace' is required in the decoder config for VP9.\`);
  }
  let parts = decoderConfig.codec.split(".");
  let profile = Number(parts[1]);
  let level = Number(parts[2]);
  let bitDepth = Number(parts[3]);
  let chromaSubsampling = 0;
  let thirdByte = (bitDepth << 4) + (chromaSubsampling << 1) + Number(decoderConfig.colorSpace.fullRange);
  let colourPrimaries = 2;
  let transferCharacteristics = 2;
  let matrixCoefficients = 2;
  return fullBox("vpcC", 1, 0, [
    u8(profile),
    // Profile
    u8(level),
    // Level
    u8(thirdByte),
    // Bit depth, chroma subsampling, full range
    u8(colourPrimaries),
    // Colour primaries
    u8(transferCharacteristics),
    // Transfer characteristics
    u8(matrixCoefficients),
    // Matrix coefficients
    u16(0)
    // Codec initialization data size
  ]);
};
var av1C = () => {
  let marker = 1;
  let version = 1;
  let firstByte = (marker << 7) + version;
  return box("av1C", [
    firstByte,
    0,
    0,
    0
  ]);
};
var soundSampleDescription = (compressionType, track) => box(compressionType, [
  Array(6).fill(0),
  // Reserved
  u16(1),
  // Data reference index
  u16(0),
  // Version
  u16(0),
  // Revision level
  u32(0),
  // Vendor
  u16(track.info.numberOfChannels),
  // Number of channels
  u16(16),
  // Sample size (bits)
  u16(0),
  // Compression ID
  u16(0),
  // Packet size
  fixed_16_16(track.info.sampleRate)
  // Sample rate
], [
  AUDIO_CODEC_TO_CONFIGURATION_BOX[track.info.codec](track)
]);
var esds = (track) => {
  let description = new Uint8Array(track.info.decoderConfig.description);
  return fullBox("esds", 0, 0, [
    // https://stackoverflow.com/a/54803118
    u32(58753152),
    // TAG(3) = Object Descriptor ([2])
    u8(32 + description.byteLength),
    // length of this OD (which includes the next 2 tags)
    u16(1),
    // ES_ID = 1
    u8(0),
    // flags etc = 0
    u32(75530368),
    // TAG(4) = ES Descriptor ([2]) embedded in above OD
    u8(18 + description.byteLength),
    // length of this ESD
    u8(64),
    // MPEG-4 Audio
    u8(21),
    // stream type(6bits)=5 audio, flags(2bits)=1
    u24(0),
    // 24bit buffer size
    u32(130071),
    // max bitrate
    u32(130071),
    // avg bitrate
    u32(92307584),
    // TAG(5) = ASC ([2],[3]) embedded in above OD
    u8(description.byteLength),
    // length
    ...description,
    u32(109084800),
    // TAG(6)
    u8(1),
    // length
    u8(2)
    // data
  ]);
};
var dOps = (track) => {
  let preskip = 3840;
  let gain = 0;
  const description = track.info.decoderConfig?.description;
  if (description) {
    if (description.byteLength < 18) {
      throw new TypeError("Invalid decoder description provided for Opus; must be at least 18 bytes long.");
    }
    const view2 = ArrayBuffer.isView(description) ? new DataView(description.buffer, description.byteOffset, description.byteLength) : new DataView(description);
    preskip = view2.getUint16(10, true);
    gain = view2.getInt16(14, true);
  }
  return box("dOps", [
    u8(0),
    // Version
    u8(track.info.numberOfChannels),
    // OutputChannelCount
    u16(preskip),
    u32(track.info.sampleRate),
    // InputSampleRate
    fixed_8_8(gain),
    // OutputGain
    u8(0)
    // ChannelMappingFamily
  ]);
};
var stts = (track) => {
  return fullBox("stts", 0, 0, [
    u32(track.timeToSampleTable.length),
    // Number of entries
    track.timeToSampleTable.map((x) => [
      // Time-to-sample table
      u32(x.sampleCount),
      // Sample count
      u32(x.sampleDelta)
      // Sample duration
    ])
  ]);
};
var stss = (track) => {
  if (track.samples.every((x) => x.type === "key"))
    return null;
  let keySamples = [...track.samples.entries()].filter(([, sample]) => sample.type === "key");
  return fullBox("stss", 0, 0, [
    u32(keySamples.length),
    // Number of entries
    keySamples.map(([index]) => u32(index + 1))
    // Sync sample table
  ]);
};
var stsc = (track) => {
  return fullBox("stsc", 0, 0, [
    u32(track.compactlyCodedChunkTable.length),
    // Number of entries
    track.compactlyCodedChunkTable.map((x) => [
      // Sample-to-chunk table
      u32(x.firstChunk),
      // First chunk
      u32(x.samplesPerChunk),
      // Samples per chunk
      u32(1)
      // Sample description index
    ])
  ]);
};
var stsz = (track) => fullBox("stsz", 0, 0, [
  u32(0),
  // Sample size (0 means non-constant size)
  u32(track.samples.length),
  // Number of entries
  track.samples.map((x) => u32(x.size))
  // Sample size table
]);
var stco = (track) => {
  if (track.finalizedChunks.length > 0 && last(track.finalizedChunks).offset >= 2 ** 32) {
    return fullBox("co64", 0, 0, [
      u32(track.finalizedChunks.length),
      // Number of entries
      track.finalizedChunks.map((x) => u64(x.offset))
      // Chunk offset table
    ]);
  }
  return fullBox("stco", 0, 0, [
    u32(track.finalizedChunks.length),
    // Number of entries
    track.finalizedChunks.map((x) => u32(x.offset))
    // Chunk offset table
  ]);
};
var ctts = (track) => {
  return fullBox("ctts", 0, 0, [
    u32(track.compositionTimeOffsetTable.length),
    // Number of entries
    track.compositionTimeOffsetTable.map((x) => [
      // Time-to-sample table
      u32(x.sampleCount),
      // Sample count
      u32(x.sampleCompositionTimeOffset)
      // Sample offset
    ])
  ]);
};
var mvex = (tracks) => {
  return box("mvex", null, tracks.map(trex));
};
var trex = (track) => {
  return fullBox("trex", 0, 0, [
    u32(track.id),
    // Track ID
    u32(1),
    // Default sample description index
    u32(0),
    // Default sample duration
    u32(0),
    // Default sample size
    u32(0)
    // Default sample flags
  ]);
};
var moof = (sequenceNumber, tracks) => {
  return box("moof", null, [
    mfhd(sequenceNumber),
    ...tracks.map(traf)
  ]);
};
var mfhd = (sequenceNumber) => {
  return fullBox("mfhd", 0, 0, [
    u32(sequenceNumber)
    // Sequence number
  ]);
};
var fragmentSampleFlags = (sample) => {
  let byte1 = 0;
  let byte2 = 0;
  let byte3 = 0;
  let byte4 = 0;
  let sampleIsDifferenceSample = sample.type === "delta";
  byte2 |= +sampleIsDifferenceSample;
  if (sampleIsDifferenceSample) {
    byte1 |= 1;
  } else {
    byte1 |= 2;
  }
  return byte1 << 24 | byte2 << 16 | byte3 << 8 | byte4;
};
var traf = (track) => {
  return box("traf", null, [
    tfhd(track),
    tfdt(track),
    trun(track)
  ]);
};
var tfhd = (track) => {
  let tfFlags = 0;
  tfFlags |= 8;
  tfFlags |= 16;
  tfFlags |= 32;
  tfFlags |= 131072;
  let referenceSample = track.currentChunk.samples[1] ?? track.currentChunk.samples[0];
  let referenceSampleInfo = {
    duration: referenceSample.timescaleUnitsToNextSample,
    size: referenceSample.size,
    flags: fragmentSampleFlags(referenceSample)
  };
  return fullBox("tfhd", 0, tfFlags, [
    u32(track.id),
    // Track ID
    u32(referenceSampleInfo.duration),
    // Default sample duration
    u32(referenceSampleInfo.size),
    // Default sample size
    u32(referenceSampleInfo.flags)
    // Default sample flags
  ]);
};
var tfdt = (track) => {
  return fullBox("tfdt", 1, 0, [
    u64(intoTimescale(track.currentChunk.startTimestamp, track.timescale))
    // Base Media Decode Time
  ]);
};
var trun = (track) => {
  let allSampleDurations = track.currentChunk.samples.map((x) => x.timescaleUnitsToNextSample);
  let allSampleSizes = track.currentChunk.samples.map((x) => x.size);
  let allSampleFlags = track.currentChunk.samples.map(fragmentSampleFlags);
  let allSampleCompositionTimeOffsets = track.currentChunk.samples.map((x) => intoTimescale(x.presentationTimestamp - x.decodeTimestamp, track.timescale));
  let uniqueSampleDurations = new Set(allSampleDurations);
  let uniqueSampleSizes = new Set(allSampleSizes);
  let uniqueSampleFlags = new Set(allSampleFlags);
  let uniqueSampleCompositionTimeOffsets = new Set(allSampleCompositionTimeOffsets);
  let firstSampleFlagsPresent = uniqueSampleFlags.size === 2 && allSampleFlags[0] !== allSampleFlags[1];
  let sampleDurationPresent = uniqueSampleDurations.size > 1;
  let sampleSizePresent = uniqueSampleSizes.size > 1;
  let sampleFlagsPresent = !firstSampleFlagsPresent && uniqueSampleFlags.size > 1;
  let sampleCompositionTimeOffsetsPresent = uniqueSampleCompositionTimeOffsets.size > 1 || [...uniqueSampleCompositionTimeOffsets].some((x) => x !== 0);
  let flags = 0;
  flags |= 1;
  flags |= 4 * +firstSampleFlagsPresent;
  flags |= 256 * +sampleDurationPresent;
  flags |= 512 * +sampleSizePresent;
  flags |= 1024 * +sampleFlagsPresent;
  flags |= 2048 * +sampleCompositionTimeOffsetsPresent;
  return fullBox("trun", 1, flags, [
    u32(track.currentChunk.samples.length),
    // Sample count
    u32(track.currentChunk.offset - track.currentChunk.moofOffset || 0),
    // Data offset
    firstSampleFlagsPresent ? u32(allSampleFlags[0]) : [],
    track.currentChunk.samples.map((_, i) => [
      sampleDurationPresent ? u32(allSampleDurations[i]) : [],
      // Sample duration
      sampleSizePresent ? u32(allSampleSizes[i]) : [],
      // Sample size
      sampleFlagsPresent ? u32(allSampleFlags[i]) : [],
      // Sample flags
      // Sample composition time offsets
      sampleCompositionTimeOffsetsPresent ? i32(allSampleCompositionTimeOffsets[i]) : []
    ])
  ]);
};
var mfra = (tracks) => {
  return box("mfra", null, [
    ...tracks.map(tfra),
    mfro()
  ]);
};
var tfra = (track, trackIndex) => {
  let version = 1;
  return fullBox("tfra", version, 0, [
    u32(track.id),
    // Track ID
    u32(63),
    // This specifies that traf number, trun number and sample number are 32-bit ints
    u32(track.finalizedChunks.length),
    // Number of entries
    track.finalizedChunks.map((chunk) => [
      u64(intoTimescale(chunk.startTimestamp, track.timescale)),
      // Time
      u64(chunk.moofOffset),
      // moof offset
      u32(trackIndex + 1),
      // traf number
      u32(1),
      // trun number
      u32(1)
      // Sample number
    ])
  ]);
};
var mfro = () => {
  return fullBox("mfro", 0, 0, [
    // This value needs to be overwritten manually from the outside, where the actual size of the enclosing mfra box
    // is known
    u32(0)
    // Size
  ]);
};
var VIDEO_CODEC_TO_BOX_NAME = {
  "avc": "avc1",
  "hevc": "hvc1",
  "vp9": "vp09",
  "av1": "av01"
};
var VIDEO_CODEC_TO_CONFIGURATION_BOX = {
  "avc": avcC,
  "hevc": hvcC,
  "vp9": vpcC,
  "av1": av1C
};
var AUDIO_CODEC_TO_BOX_NAME = {
  "aac": "mp4a",
  "opus": "Opus"
};
var AUDIO_CODEC_TO_CONFIGURATION_BOX = {
  "aac": esds,
  "opus": dOps
};

// src/target.ts
var isTarget = Symbol("isTarget");
var Target = class {
};
isTarget;
var ArrayBufferTarget = class extends Target {
  constructor() {
    super(...arguments);
    this.buffer = null;
  }
};
var StreamTarget = class extends Target {
  constructor(options) {
    super();
    this.options = options;
    if (typeof options !== "object") {
      throw new TypeError("StreamTarget requires an options object to be passed to its constructor.");
    }
    if (options.onData) {
      if (typeof options.onData !== "function") {
        throw new TypeError("options.onData, when provided, must be a function.");
      }
      if (options.onData.length < 2) {
        throw new TypeError(
          "options.onData, when provided, must be a function that takes in at least two arguments (data and position). Ignoring the position argument, which specifies the byte offset at which the data is to be written, can lead to broken outputs."
        );
      }
    }
    if (options.chunked !== void 0 && typeof options.chunked !== "boolean") {
      throw new TypeError("options.chunked, when provided, must be a boolean.");
    }
    if (options.chunkSize !== void 0 && (!Number.isInteger(options.chunkSize) || options.chunkSize < 1024)) {
      throw new TypeError("options.chunkSize, when provided, must be an integer and not smaller than 1024.");
    }
  }
};
var FileSystemWritableFileStreamTarget = class extends Target {
  constructor(stream, options) {
    super();
    this.stream = stream;
    this.options = options;
    if (!(stream instanceof FileSystemWritableFileStream)) {
      throw new TypeError("FileSystemWritableFileStreamTarget requires a FileSystemWritableFileStream instance.");
    }
    if (options !== void 0 && typeof options !== "object") {
      throw new TypeError("FileSystemWritableFileStreamTarget's options, when provided, must be an object.");
    }
    if (options) {
      if (options.chunkSize !== void 0 && (!Number.isInteger(options.chunkSize) || options.chunkSize <= 0)) {
        throw new TypeError("options.chunkSize, when provided, must be a positive integer");
      }
    }
  }
};

// src/writer.ts
var _helper, _helperView;
var Writer = class {
  constructor() {
    this.pos = 0;
    __privateAdd(this, _helper, new Uint8Array(8));
    __privateAdd(this, _helperView, new DataView(__privateGet(this, _helper).buffer));
    /**
     * Stores the position from the start of the file to where boxes elements have been written. This is used to
     * rewrite/edit elements that were already added before, and to measure sizes of things.
     */
    this.offsets = /* @__PURE__ */ new WeakMap();
  }
  /** Sets the current position for future writes to a new one. */
  seek(newPos) {
    this.pos = newPos;
  }
  writeU32(value) {
    __privateGet(this, _helperView).setUint32(0, value, false);
    this.write(__privateGet(this, _helper).subarray(0, 4));
  }
  writeU64(value) {
    __privateGet(this, _helperView).setUint32(0, Math.floor(value / 2 ** 32), false);
    __privateGet(this, _helperView).setUint32(4, value, false);
    this.write(__privateGet(this, _helper).subarray(0, 8));
  }
  writeAscii(text) {
    for (let i = 0; i < text.length; i++) {
      __privateGet(this, _helperView).setUint8(i % 8, text.charCodeAt(i));
      if (i % 8 === 7)
        this.write(__privateGet(this, _helper));
    }
    if (text.length % 8 !== 0) {
      this.write(__privateGet(this, _helper).subarray(0, text.length % 8));
    }
  }
  writeBox(box2) {
    this.offsets.set(box2, this.pos);
    if (box2.contents && !box2.children) {
      this.writeBoxHeader(box2, box2.size ?? box2.contents.byteLength + 8);
      this.write(box2.contents);
    } else {
      let startPos = this.pos;
      this.writeBoxHeader(box2, 0);
      if (box2.contents)
        this.write(box2.contents);
      if (box2.children) {
        for (let child of box2.children)
          if (child)
            this.writeBox(child);
      }
      let endPos = this.pos;
      let size = box2.size ?? endPos - startPos;
      this.seek(startPos);
      this.writeBoxHeader(box2, size);
      this.seek(endPos);
    }
  }
  writeBoxHeader(box2, size) {
    this.writeU32(box2.largeSize ? 1 : size);
    this.writeAscii(box2.type);
    if (box2.largeSize)
      this.writeU64(size);
  }
  measureBoxHeader(box2) {
    return 8 + (box2.largeSize ? 8 : 0);
  }
  patchBox(box2) {
    let endPos = this.pos;
    this.seek(this.offsets.get(box2));
    this.writeBox(box2);
    this.seek(endPos);
  }
  measureBox(box2) {
    if (box2.contents && !box2.children) {
      let headerSize = this.measureBoxHeader(box2);
      return headerSize + box2.contents.byteLength;
    } else {
      let result = this.measureBoxHeader(box2);
      if (box2.contents)
        result += box2.contents.byteLength;
      if (box2.children) {
        for (let child of box2.children)
          if (child)
            result += this.measureBox(child);
      }
      return result;
    }
  }
};
_helper = new WeakMap();
_helperView = new WeakMap();
var _target, _buffer, _bytes, _maxPos, _ensureSize, ensureSize_fn;
var ArrayBufferTargetWriter = class extends Writer {
  constructor(target) {
    super();
    __privateAdd(this, _ensureSize);
    __privateAdd(this, _target, void 0);
    __privateAdd(this, _buffer, new ArrayBuffer(2 ** 16));
    __privateAdd(this, _bytes, new Uint8Array(__privateGet(this, _buffer)));
    __privateAdd(this, _maxPos, 0);
    __privateSet(this, _target, target);
  }
  write(data) {
    __privateMethod(this, _ensureSize, ensureSize_fn).call(this, this.pos + data.byteLength);
    __privateGet(this, _bytes).set(data, this.pos);
    this.pos += data.byteLength;
    __privateSet(this, _maxPos, Math.max(__privateGet(this, _maxPos), this.pos));
  }
  finalize() {
    __privateMethod(this, _ensureSize, ensureSize_fn).call(this, this.pos);
    __privateGet(this, _target).buffer = __privateGet(this, _buffer).slice(0, Math.max(__privateGet(this, _maxPos), this.pos));
  }
};
_target = new WeakMap();
_buffer = new WeakMap();
_bytes = new WeakMap();
_maxPos = new WeakMap();
_ensureSize = new WeakSet();
ensureSize_fn = function(size) {
  let newLength = __privateGet(this, _buffer).byteLength;
  while (newLength < size)
    newLength *= 2;
  if (newLength === __privateGet(this, _buffer).byteLength)
    return;
  let newBuffer = new ArrayBuffer(newLength);
  let newBytes = new Uint8Array(newBuffer);
  newBytes.set(__privateGet(this, _bytes), 0);
  __privateSet(this, _buffer, newBuffer);
  __privateSet(this, _bytes, newBytes);
};
var DEFAULT_CHUNK_SIZE = 2 ** 24;
var MAX_CHUNKS_AT_ONCE = 2;
var _target2, _sections, _chunked, _chunkSize, _chunks, _writeDataIntoChunks, writeDataIntoChunks_fn, _insertSectionIntoChunk, insertSectionIntoChunk_fn, _createChunk, createChunk_fn, _flushChunks, flushChunks_fn;
var StreamTargetWriter = class extends Writer {
  constructor(target) {
    super();
    __privateAdd(this, _writeDataIntoChunks);
    __privateAdd(this, _insertSectionIntoChunk);
    __privateAdd(this, _createChunk);
    __privateAdd(this, _flushChunks);
    __privateAdd(this, _target2, void 0);
    __privateAdd(this, _sections, []);
    __privateAdd(this, _chunked, void 0);
    __privateAdd(this, _chunkSize, void 0);
    /**
     * The data is divided up into fixed-size chunks, whose contents are first filled in RAM and then flushed out.
     * A chunk is flushed if all of its contents have been written.
     */
    __privateAdd(this, _chunks, []);
    __privateSet(this, _target2, target);
    __privateSet(this, _chunked, target.options?.chunked ?? false);
    __privateSet(this, _chunkSize, target.options?.chunkSize ?? DEFAULT_CHUNK_SIZE);
  }
  write(data) {
    __privateGet(this, _sections).push({
      data: data.slice(),
      start: this.pos
    });
    this.pos += data.byteLength;
  }
  flush() {
    if (__privateGet(this, _sections).length === 0)
      return;
    let chunks = [];
    let sorted = [...__privateGet(this, _sections)].sort((a, b) => a.start - b.start);
    chunks.push({
      start: sorted[0].start,
      size: sorted[0].data.byteLength
    });
    for (let i = 1; i < sorted.length; i++) {
      let lastChunk = chunks[chunks.length - 1];
      let section = sorted[i];
      if (section.start <= lastChunk.start + lastChunk.size) {
        lastChunk.size = Math.max(lastChunk.size, section.start + section.data.byteLength - lastChunk.start);
      } else {
        chunks.push({
          start: section.start,
          size: section.data.byteLength
        });
      }
    }
    for (let chunk of chunks) {
      chunk.data = new Uint8Array(chunk.size);
      for (let section of __privateGet(this, _sections)) {
        if (chunk.start <= section.start && section.start < chunk.start + chunk.size) {
          chunk.data.set(section.data, section.start - chunk.start);
        }
      }
      if (__privateGet(this, _chunked)) {
        __privateMethod(this, _writeDataIntoChunks, writeDataIntoChunks_fn).call(this, chunk.data, chunk.start);
        __privateMethod(this, _flushChunks, flushChunks_fn).call(this);
      } else {
        __privateGet(this, _target2).options.onData?.(chunk.data, chunk.start);
      }
    }
    __privateGet(this, _sections).length = 0;
  }
  finalize() {
    if (__privateGet(this, _chunked)) {
      __privateMethod(this, _flushChunks, flushChunks_fn).call(this, true);
    }
  }
};
_target2 = new WeakMap();
_sections = new WeakMap();
_chunked = new WeakMap();
_chunkSize = new WeakMap();
_chunks = new WeakMap();
_writeDataIntoChunks = new WeakSet();
writeDataIntoChunks_fn = function(data, position) {
  let chunkIndex = __privateGet(this, _chunks).findIndex((x) => x.start <= position && position < x.start + __privateGet(this, _chunkSize));
  if (chunkIndex === -1)
    chunkIndex = __privateMethod(this, _createChunk, createChunk_fn).call(this, position);
  let chunk = __privateGet(this, _chunks)[chunkIndex];
  let relativePosition = position - chunk.start;
  let toWrite = data.subarray(0, Math.min(__privateGet(this, _chunkSize) - relativePosition, data.byteLength));
  chunk.data.set(toWrite, relativePosition);
  let section = {
    start: relativePosition,
    end: relativePosition + toWrite.byteLength
  };
  __privateMethod(this, _insertSectionIntoChunk, insertSectionIntoChunk_fn).call(this, chunk, section);
  if (chunk.written[0].start === 0 && chunk.written[0].end === __privateGet(this, _chunkSize)) {
    chunk.shouldFlush = true;
  }
  if (__privateGet(this, _chunks).length > MAX_CHUNKS_AT_ONCE) {
    for (let i = 0; i < __privateGet(this, _chunks).length - 1; i++) {
      __privateGet(this, _chunks)[i].shouldFlush = true;
    }
    __privateMethod(this, _flushChunks, flushChunks_fn).call(this);
  }
  if (toWrite.byteLength < data.byteLength) {
    __privateMethod(this, _writeDataIntoChunks, writeDataIntoChunks_fn).call(this, data.subarray(toWrite.byteLength), position + toWrite.byteLength);
  }
};
_insertSectionIntoChunk = new WeakSet();
insertSectionIntoChunk_fn = function(chunk, section) {
  let low = 0;
  let high = chunk.written.length - 1;
  let index = -1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low + 1) / 2);
    if (chunk.written[mid].start <= section.start) {
      low = mid + 1;
      index = mid;
    } else {
      high = mid - 1;
    }
  }
  chunk.written.splice(index + 1, 0, section);
  if (index === -1 || chunk.written[index].end < section.start)
    index++;
  while (index < chunk.written.length - 1 && chunk.written[index].end >= chunk.written[index + 1].start) {
    chunk.written[index].end = Math.max(chunk.written[index].end, chunk.written[index + 1].end);
    chunk.written.splice(index + 1, 1);
  }
};
_createChunk = new WeakSet();
createChunk_fn = function(includesPosition) {
  let start = Math.floor(includesPosition / __privateGet(this, _chunkSize)) * __privateGet(this, _chunkSize);
  let chunk = {
    start,
    data: new Uint8Array(__privateGet(this, _chunkSize)),
    written: [],
    shouldFlush: false
  };
  __privateGet(this, _chunks).push(chunk);
  __privateGet(this, _chunks).sort((a, b) => a.start - b.start);
  return __privateGet(this, _chunks).indexOf(chunk);
};
_flushChunks = new WeakSet();
flushChunks_fn = function(force = false) {
  for (let i = 0; i < __privateGet(this, _chunks).length; i++) {
    let chunk = __privateGet(this, _chunks)[i];
    if (!chunk.shouldFlush && !force)
      continue;
    for (let section of chunk.written) {
      __privateGet(this, _target2).options.onData?.(
        chunk.data.subarray(section.start, section.end),
        chunk.start + section.start
      );
    }
    __privateGet(this, _chunks).splice(i--, 1);
  }
};
var FileSystemWritableFileStreamTargetWriter = class extends StreamTargetWriter {
  constructor(target) {
    super(new StreamTarget({
      onData: (data, position) => target.stream.write({
        type: "write",
        data,
        position
      }),
      chunked: true,
      chunkSize: target.options?.chunkSize
    }));
  }
};

// src/muxer.ts
var GLOBAL_TIMESCALE = 1e3;
var SUPPORTED_VIDEO_CODECS = ["avc", "hevc", "vp9", "av1"];
var SUPPORTED_AUDIO_CODECS = ["aac", "opus"];
var TIMESTAMP_OFFSET = 2082844800;
var FIRST_TIMESTAMP_BEHAVIORS = ["strict", "offset", "cross-track-offset"];
var _options, _writer, _ftypSize, _mdat, _videoTrack, _audioTrack, _creationTime, _finalizedChunks, _nextFragmentNumber, _videoSampleQueue, _audioSampleQueue, _finalized, _validateOptions, validateOptions_fn, _writeHeader, writeHeader_fn, _computeMoovSizeUpperBound, computeMoovSizeUpperBound_fn, _prepareTracks, prepareTracks_fn, _generateMpeg4AudioSpecificConfig, generateMpeg4AudioSpecificConfig_fn, _createSampleForTrack, createSampleForTrack_fn, _addSampleToTrack, addSampleToTrack_fn, _validateTimestamp, validateTimestamp_fn, _finalizeCurrentChunk, finalizeCurrentChunk_fn, _finalizeFragment, finalizeFragment_fn, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn, _ensureNotFinalized, ensureNotFinalized_fn;
var Muxer = class {
  constructor(options) {
    __privateAdd(this, _validateOptions);
    __privateAdd(this, _writeHeader);
    __privateAdd(this, _computeMoovSizeUpperBound);
    __privateAdd(this, _prepareTracks);
    // https://wiki.multimedia.cx/index.php/MPEG-4_Audio
    __privateAdd(this, _generateMpeg4AudioSpecificConfig);
    __privateAdd(this, _createSampleForTrack);
    __privateAdd(this, _addSampleToTrack);
    __privateAdd(this, _validateTimestamp);
    __privateAdd(this, _finalizeCurrentChunk);
    __privateAdd(this, _finalizeFragment);
    __privateAdd(this, _maybeFlushStreamingTargetWriter);
    __privateAdd(this, _ensureNotFinalized);
    __privateAdd(this, _options, void 0);
    __privateAdd(this, _writer, void 0);
    __privateAdd(this, _ftypSize, void 0);
    __privateAdd(this, _mdat, void 0);
    __privateAdd(this, _videoTrack, null);
    __privateAdd(this, _audioTrack, null);
    __privateAdd(this, _creationTime, Math.floor(Date.now() / 1e3) + TIMESTAMP_OFFSET);
    __privateAdd(this, _finalizedChunks, []);
    // Fields for fragmented MP4:
    __privateAdd(this, _nextFragmentNumber, 1);
    __privateAdd(this, _videoSampleQueue, []);
    __privateAdd(this, _audioSampleQueue, []);
    __privateAdd(this, _finalized, false);
    __privateMethod(this, _validateOptions, validateOptions_fn).call(this, options);
    options.video = deepClone(options.video);
    options.audio = deepClone(options.audio);
    options.fastStart = deepClone(options.fastStart);
    this.target = options.target;
    __privateSet(this, _options, {
      firstTimestampBehavior: "strict",
      ...options
    });
    if (options.target instanceof ArrayBufferTarget) {
      __privateSet(this, _writer, new ArrayBufferTargetWriter(options.target));
    } else if (options.target instanceof StreamTarget) {
      __privateSet(this, _writer, new StreamTargetWriter(options.target));
    } else if (options.target instanceof FileSystemWritableFileStreamTarget) {
      __privateSet(this, _writer, new FileSystemWritableFileStreamTargetWriter(options.target));
    } else {
      throw new Error(\`Invalid target: \${options.target}\`);
    }
    __privateMethod(this, _prepareTracks, prepareTracks_fn).call(this);
    __privateMethod(this, _writeHeader, writeHeader_fn).call(this);
  }
  addVideoChunk(sample, meta, timestamp, compositionTimeOffset) {
    if (!(sample instanceof EncodedVideoChunk)) {
      throw new TypeError("addVideoChunk's first argument (sample) must be of type EncodedVideoChunk.");
    }
    if (meta && typeof meta !== "object") {
      throw new TypeError("addVideoChunk's second argument (meta), when provided, must be an object.");
    }
    if (timestamp !== void 0 && (!Number.isFinite(timestamp) || timestamp < 0)) {
      throw new TypeError(
        "addVideoChunk's third argument (timestamp), when provided, must be a non-negative real number."
      );
    }
    if (compositionTimeOffset !== void 0 && !Number.isFinite(compositionTimeOffset)) {
      throw new TypeError(
        "addVideoChunk's fourth argument (compositionTimeOffset), when provided, must be a real number."
      );
    }
    let data = new Uint8Array(sample.byteLength);
    sample.copyTo(data);
    this.addVideoChunkRaw(
      data,
      sample.type,
      timestamp ?? sample.timestamp,
      sample.duration,
      meta,
      compositionTimeOffset
    );
  }
  addVideoChunkRaw(data, type, timestamp, duration, meta, compositionTimeOffset) {
    if (!(data instanceof Uint8Array)) {
      throw new TypeError("addVideoChunkRaw's first argument (data) must be an instance of Uint8Array.");
    }
    if (type !== "key" && type !== "delta") {
      throw new TypeError("addVideoChunkRaw's second argument (type) must be either 'key' or 'delta'.");
    }
    if (!Number.isFinite(timestamp) || timestamp < 0) {
      throw new TypeError("addVideoChunkRaw's third argument (timestamp) must be a non-negative real number.");
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError("addVideoChunkRaw's fourth argument (duration) must be a non-negative real number.");
    }
    if (meta && typeof meta !== "object") {
      throw new TypeError("addVideoChunkRaw's fifth argument (meta), when provided, must be an object.");
    }
    if (compositionTimeOffset !== void 0 && !Number.isFinite(compositionTimeOffset)) {
      throw new TypeError(
        "addVideoChunkRaw's sixth argument (compositionTimeOffset), when provided, must be a real number."
      );
    }
    __privateMethod(this, _ensureNotFinalized, ensureNotFinalized_fn).call(this);
    if (!__privateGet(this, _options).video)
      throw new Error("No video track declared.");
    if (typeof __privateGet(this, _options).fastStart === "object" && __privateGet(this, _videoTrack).samples.length === __privateGet(this, _options).fastStart.expectedVideoChunks) {
      throw new Error(\`Cannot add more video chunks than specified in 'fastStart' (\${__privateGet(this, _options).fastStart.expectedVideoChunks}).\`);
    }
    let videoSample = __privateMethod(this, _createSampleForTrack, createSampleForTrack_fn).call(this, __privateGet(this, _videoTrack), data, type, timestamp, duration, meta, compositionTimeOffset);
    if (__privateGet(this, _options).fastStart === "fragmented" && __privateGet(this, _audioTrack)) {
      while (__privateGet(this, _audioSampleQueue).length > 0 && __privateGet(this, _audioSampleQueue)[0].decodeTimestamp <= videoSample.decodeTimestamp) {
        let audioSample = __privateGet(this, _audioSampleQueue).shift();
        __privateMethod(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet(this, _audioTrack), audioSample);
      }
      if (videoSample.decodeTimestamp <= __privateGet(this, _audioTrack).lastDecodeTimestamp) {
        __privateMethod(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet(this, _videoTrack), videoSample);
      } else {
        __privateGet(this, _videoSampleQueue).push(videoSample);
      }
    } else {
      __privateMethod(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet(this, _videoTrack), videoSample);
    }
  }
  addAudioChunk(sample, meta, timestamp) {
    if (!(sample instanceof EncodedAudioChunk)) {
      throw new TypeError("addAudioChunk's first argument (sample) must be of type EncodedAudioChunk.");
    }
    if (meta && typeof meta !== "object") {
      throw new TypeError("addAudioChunk's second argument (meta), when provided, must be an object.");
    }
    if (timestamp !== void 0 && (!Number.isFinite(timestamp) || timestamp < 0)) {
      throw new TypeError(
        "addAudioChunk's third argument (timestamp), when provided, must be a non-negative real number."
      );
    }
    let data = new Uint8Array(sample.byteLength);
    sample.copyTo(data);
    this.addAudioChunkRaw(data, sample.type, timestamp ?? sample.timestamp, sample.duration, meta);
  }
  addAudioChunkRaw(data, type, timestamp, duration, meta) {
    if (!(data instanceof Uint8Array)) {
      throw new TypeError("addAudioChunkRaw's first argument (data) must be an instance of Uint8Array.");
    }
    if (type !== "key" && type !== "delta") {
      throw new TypeError("addAudioChunkRaw's second argument (type) must be either 'key' or 'delta'.");
    }
    if (!Number.isFinite(timestamp) || timestamp < 0) {
      throw new TypeError("addAudioChunkRaw's third argument (timestamp) must be a non-negative real number.");
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError("addAudioChunkRaw's fourth argument (duration) must be a non-negative real number.");
    }
    if (meta && typeof meta !== "object") {
      throw new TypeError("addAudioChunkRaw's fifth argument (meta), when provided, must be an object.");
    }
    __privateMethod(this, _ensureNotFinalized, ensureNotFinalized_fn).call(this);
    if (!__privateGet(this, _options).audio)
      throw new Error("No audio track declared.");
    if (typeof __privateGet(this, _options).fastStart === "object" && __privateGet(this, _audioTrack).samples.length === __privateGet(this, _options).fastStart.expectedAudioChunks) {
      throw new Error(\`Cannot add more audio chunks than specified in 'fastStart' (\${__privateGet(this, _options).fastStart.expectedAudioChunks}).\`);
    }
    let audioSample = __privateMethod(this, _createSampleForTrack, createSampleForTrack_fn).call(this, __privateGet(this, _audioTrack), data, type, timestamp, duration, meta);
    if (__privateGet(this, _options).fastStart === "fragmented" && __privateGet(this, _videoTrack)) {
      while (__privateGet(this, _videoSampleQueue).length > 0 && __privateGet(this, _videoSampleQueue)[0].decodeTimestamp <= audioSample.decodeTimestamp) {
        let videoSample = __privateGet(this, _videoSampleQueue).shift();
        __privateMethod(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet(this, _videoTrack), videoSample);
      }
      if (audioSample.decodeTimestamp <= __privateGet(this, _videoTrack).lastDecodeTimestamp) {
        __privateMethod(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet(this, _audioTrack), audioSample);
      } else {
        __privateGet(this, _audioSampleQueue).push(audioSample);
      }
    } else {
      __privateMethod(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet(this, _audioTrack), audioSample);
    }
  }
  /** Finalizes the file, making it ready for use. Must be called after all video and audio chunks have been added. */
  finalize() {
    if (__privateGet(this, _finalized)) {
      throw new Error("Cannot finalize a muxer more than once.");
    }
    if (__privateGet(this, _options).fastStart === "fragmented") {
      for (let videoSample of __privateGet(this, _videoSampleQueue))
        __privateMethod(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet(this, _videoTrack), videoSample);
      for (let audioSample of __privateGet(this, _audioSampleQueue))
        __privateMethod(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet(this, _audioTrack), audioSample);
      __privateMethod(this, _finalizeFragment, finalizeFragment_fn).call(this, false);
    } else {
      if (__privateGet(this, _videoTrack))
        __privateMethod(this, _finalizeCurrentChunk, finalizeCurrentChunk_fn).call(this, __privateGet(this, _videoTrack));
      if (__privateGet(this, _audioTrack))
        __privateMethod(this, _finalizeCurrentChunk, finalizeCurrentChunk_fn).call(this, __privateGet(this, _audioTrack));
    }
    let tracks = [__privateGet(this, _videoTrack), __privateGet(this, _audioTrack)].filter(Boolean);
    if (__privateGet(this, _options).fastStart === "in-memory") {
      let mdatSize;
      for (let i = 0; i < 2; i++) {
        let movieBox2 = moov(tracks, __privateGet(this, _creationTime));
        let movieBoxSize = __privateGet(this, _writer).measureBox(movieBox2);
        mdatSize = __privateGet(this, _writer).measureBox(__privateGet(this, _mdat));
        let currentChunkPos = __privateGet(this, _writer).pos + movieBoxSize + mdatSize;
        for (let chunk of __privateGet(this, _finalizedChunks)) {
          chunk.offset = currentChunkPos;
          for (let { data } of chunk.samples) {
            currentChunkPos += data.byteLength;
            mdatSize += data.byteLength;
          }
        }
        if (currentChunkPos < 2 ** 32)
          break;
        if (mdatSize >= 2 ** 32)
          __privateGet(this, _mdat).largeSize = true;
      }
      let movieBox = moov(tracks, __privateGet(this, _creationTime));
      __privateGet(this, _writer).writeBox(movieBox);
      __privateGet(this, _mdat).size = mdatSize;
      __privateGet(this, _writer).writeBox(__privateGet(this, _mdat));
      for (let chunk of __privateGet(this, _finalizedChunks)) {
        for (let sample of chunk.samples) {
          __privateGet(this, _writer).write(sample.data);
          sample.data = null;
        }
      }
    } else if (__privateGet(this, _options).fastStart === "fragmented") {
      let startPos = __privateGet(this, _writer).pos;
      let mfraBox = mfra(tracks);
      __privateGet(this, _writer).writeBox(mfraBox);
      let mfraBoxSize = __privateGet(this, _writer).pos - startPos;
      __privateGet(this, _writer).seek(__privateGet(this, _writer).pos - 4);
      __privateGet(this, _writer).writeU32(mfraBoxSize);
    } else {
      let mdatPos = __privateGet(this, _writer).offsets.get(__privateGet(this, _mdat));
      let mdatSize = __privateGet(this, _writer).pos - mdatPos;
      __privateGet(this, _mdat).size = mdatSize;
      __privateGet(this, _mdat).largeSize = mdatSize >= 2 ** 32;
      __privateGet(this, _writer).patchBox(__privateGet(this, _mdat));
      let movieBox = moov(tracks, __privateGet(this, _creationTime));
      if (typeof __privateGet(this, _options).fastStart === "object") {
        __privateGet(this, _writer).seek(__privateGet(this, _ftypSize));
        __privateGet(this, _writer).writeBox(movieBox);
        let remainingBytes = mdatPos - __privateGet(this, _writer).pos;
        __privateGet(this, _writer).writeBox(free(remainingBytes));
      } else {
        __privateGet(this, _writer).writeBox(movieBox);
      }
    }
    __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
    __privateGet(this, _writer).finalize();
    __privateSet(this, _finalized, true);
  }
};
_options = new WeakMap();
_writer = new WeakMap();
_ftypSize = new WeakMap();
_mdat = new WeakMap();
_videoTrack = new WeakMap();
_audioTrack = new WeakMap();
_creationTime = new WeakMap();
_finalizedChunks = new WeakMap();
_nextFragmentNumber = new WeakMap();
_videoSampleQueue = new WeakMap();
_audioSampleQueue = new WeakMap();
_finalized = new WeakMap();
_validateOptions = new WeakSet();
validateOptions_fn = function(options) {
  if (typeof options !== "object") {
    throw new TypeError("The muxer requires an options object to be passed to its constructor.");
  }
  if (!(options.target instanceof Target)) {
    throw new TypeError("The target must be provided and an instance of Target.");
  }
  if (options.video) {
    if (!SUPPORTED_VIDEO_CODECS.includes(options.video.codec)) {
      throw new TypeError(\`Unsupported video codec: \${options.video.codec}\`);
    }
    if (!Number.isInteger(options.video.width) || options.video.width <= 0) {
      throw new TypeError(\`Invalid video width: \${options.video.width}. Must be a positive integer.\`);
    }
    if (!Number.isInteger(options.video.height) || options.video.height <= 0) {
      throw new TypeError(\`Invalid video height: \${options.video.height}. Must be a positive integer.\`);
    }
    const videoRotation = options.video.rotation;
    if (typeof videoRotation === "number" && ![0, 90, 180, 270].includes(videoRotation)) {
      throw new TypeError(\`Invalid video rotation: \${videoRotation}. Has to be 0, 90, 180 or 270.\`);
    } else if (Array.isArray(videoRotation) && (videoRotation.length !== 9 || videoRotation.some((value) => typeof value !== "number"))) {
      throw new TypeError(\`Invalid video transformation matrix: \${videoRotation.join()}\`);
    }
    if (options.video.frameRate !== void 0 && (!Number.isInteger(options.video.frameRate) || options.video.frameRate <= 0)) {
      throw new TypeError(
        \`Invalid video frame rate: \${options.video.frameRate}. Must be a positive integer.\`
      );
    }
  }
  if (options.audio) {
    if (!SUPPORTED_AUDIO_CODECS.includes(options.audio.codec)) {
      throw new TypeError(\`Unsupported audio codec: \${options.audio.codec}\`);
    }
    if (!Number.isInteger(options.audio.numberOfChannels) || options.audio.numberOfChannels <= 0) {
      throw new TypeError(
        \`Invalid number of audio channels: \${options.audio.numberOfChannels}. Must be a positive integer.\`
      );
    }
    if (!Number.isInteger(options.audio.sampleRate) || options.audio.sampleRate <= 0) {
      throw new TypeError(
        \`Invalid audio sample rate: \${options.audio.sampleRate}. Must be a positive integer.\`
      );
    }
  }
  if (options.firstTimestampBehavior && !FIRST_TIMESTAMP_BEHAVIORS.includes(options.firstTimestampBehavior)) {
    throw new TypeError(\`Invalid first timestamp behavior: \${options.firstTimestampBehavior}\`);
  }
  if (typeof options.fastStart === "object") {
    if (options.video) {
      if (options.fastStart.expectedVideoChunks === void 0) {
        throw new TypeError(\`'fastStart' is an object but is missing property 'expectedVideoChunks'.\`);
      } else if (!Number.isInteger(options.fastStart.expectedVideoChunks) || options.fastStart.expectedVideoChunks < 0) {
        throw new TypeError(\`'expectedVideoChunks' must be a non-negative integer.\`);
      }
    }
    if (options.audio) {
      if (options.fastStart.expectedAudioChunks === void 0) {
        throw new TypeError(\`'fastStart' is an object but is missing property 'expectedAudioChunks'.\`);
      } else if (!Number.isInteger(options.fastStart.expectedAudioChunks) || options.fastStart.expectedAudioChunks < 0) {
        throw new TypeError(\`'expectedAudioChunks' must be a non-negative integer.\`);
      }
    }
  } else if (![false, "in-memory", "fragmented"].includes(options.fastStart)) {
    throw new TypeError(\`'fastStart' option must be false, 'in-memory', 'fragmented' or an object.\`);
  }
  if (options.minFragmentDuration !== void 0 && (!Number.isFinite(options.minFragmentDuration) || options.minFragmentDuration < 0)) {
    throw new TypeError(\`'minFragmentDuration' must be a non-negative number.\`);
  }
};
_writeHeader = new WeakSet();
writeHeader_fn = function() {
  __privateGet(this, _writer).writeBox(ftyp({
    holdsAvc: __privateGet(this, _options).video?.codec === "avc",
    fragmented: __privateGet(this, _options).fastStart === "fragmented"
  }));
  __privateSet(this, _ftypSize, __privateGet(this, _writer).pos);
  if (__privateGet(this, _options).fastStart === "in-memory") {
    __privateSet(this, _mdat, mdat(false));
  } else if (__privateGet(this, _options).fastStart === "fragmented") {
  } else {
    if (typeof __privateGet(this, _options).fastStart === "object") {
      let moovSizeUpperBound = __privateMethod(this, _computeMoovSizeUpperBound, computeMoovSizeUpperBound_fn).call(this);
      __privateGet(this, _writer).seek(__privateGet(this, _writer).pos + moovSizeUpperBound);
    }
    __privateSet(this, _mdat, mdat(true));
    __privateGet(this, _writer).writeBox(__privateGet(this, _mdat));
  }
  __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
};
_computeMoovSizeUpperBound = new WeakSet();
computeMoovSizeUpperBound_fn = function() {
  if (typeof __privateGet(this, _options).fastStart !== "object")
    return;
  let upperBound = 0;
  let sampleCounts = [
    __privateGet(this, _options).fastStart.expectedVideoChunks,
    __privateGet(this, _options).fastStart.expectedAudioChunks
  ];
  for (let n of sampleCounts) {
    if (!n)
      continue;
    upperBound += (4 + 4) * Math.ceil(2 / 3 * n);
    upperBound += 4 * n;
    upperBound += (4 + 4 + 4) * Math.ceil(2 / 3 * n);
    upperBound += 4 * n;
    upperBound += 8 * n;
  }
  upperBound += 4096;
  return upperBound;
};
_prepareTracks = new WeakSet();
prepareTracks_fn = function() {
  if (__privateGet(this, _options).video) {
    __privateSet(this, _videoTrack, {
      id: 1,
      info: {
        type: "video",
        codec: __privateGet(this, _options).video.codec,
        width: __privateGet(this, _options).video.width,
        height: __privateGet(this, _options).video.height,
        rotation: __privateGet(this, _options).video.rotation ?? 0,
        decoderConfig: null
      },
      // The fallback contains many common frame rates as factors
      timescale: __privateGet(this, _options).video.frameRate ?? 57600,
      samples: [],
      finalizedChunks: [],
      currentChunk: null,
      firstDecodeTimestamp: void 0,
      lastDecodeTimestamp: -1,
      timeToSampleTable: [],
      compositionTimeOffsetTable: [],
      lastTimescaleUnits: null,
      lastSample: null,
      compactlyCodedChunkTable: []
    });
  }
  if (__privateGet(this, _options).audio) {
    __privateSet(this, _audioTrack, {
      id: __privateGet(this, _options).video ? 2 : 1,
      info: {
        type: "audio",
        codec: __privateGet(this, _options).audio.codec,
        numberOfChannels: __privateGet(this, _options).audio.numberOfChannels,
        sampleRate: __privateGet(this, _options).audio.sampleRate,
        decoderConfig: null
      },
      timescale: __privateGet(this, _options).audio.sampleRate,
      samples: [],
      finalizedChunks: [],
      currentChunk: null,
      firstDecodeTimestamp: void 0,
      lastDecodeTimestamp: -1,
      timeToSampleTable: [],
      compositionTimeOffsetTable: [],
      lastTimescaleUnits: null,
      lastSample: null,
      compactlyCodedChunkTable: []
    });
    if (__privateGet(this, _options).audio.codec === "aac") {
      let guessedCodecPrivate = __privateMethod(this, _generateMpeg4AudioSpecificConfig, generateMpeg4AudioSpecificConfig_fn).call(
        this,
        2,
        // Object type for AAC-LC, since it's the most common
        __privateGet(this, _options).audio.sampleRate,
        __privateGet(this, _options).audio.numberOfChannels
      );
      __privateGet(this, _audioTrack).info.decoderConfig = {
        codec: __privateGet(this, _options).audio.codec,
        description: guessedCodecPrivate,
        numberOfChannels: __privateGet(this, _options).audio.numberOfChannels,
        sampleRate: __privateGet(this, _options).audio.sampleRate
      };
    }
  }
};
_generateMpeg4AudioSpecificConfig = new WeakSet();
generateMpeg4AudioSpecificConfig_fn = function(objectType, sampleRate, numberOfChannels) {
  let frequencyIndices = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
  let frequencyIndex = frequencyIndices.indexOf(sampleRate);
  let channelConfig = numberOfChannels;
  let configBits = "";
  configBits += objectType.toString(2).padStart(5, "0");
  configBits += frequencyIndex.toString(2).padStart(4, "0");
  if (frequencyIndex === 15)
    configBits += sampleRate.toString(2).padStart(24, "0");
  configBits += channelConfig.toString(2).padStart(4, "0");
  let paddingLength = Math.ceil(configBits.length / 8) * 8;
  configBits = configBits.padEnd(paddingLength, "0");
  let configBytes = new Uint8Array(configBits.length / 8);
  for (let i = 0; i < configBits.length; i += 8) {
    configBytes[i / 8] = parseInt(configBits.slice(i, i + 8), 2);
  }
  return configBytes;
};
_createSampleForTrack = new WeakSet();
createSampleForTrack_fn = function(track, data, type, timestamp, duration, meta, compositionTimeOffset) {
  let presentationTimestampInSeconds = timestamp / 1e6;
  let decodeTimestampInSeconds = (timestamp - (compositionTimeOffset ?? 0)) / 1e6;
  let durationInSeconds = duration / 1e6;
  let adjusted = __privateMethod(this, _validateTimestamp, validateTimestamp_fn).call(this, presentationTimestampInSeconds, decodeTimestampInSeconds, track);
  presentationTimestampInSeconds = adjusted.presentationTimestamp;
  decodeTimestampInSeconds = adjusted.decodeTimestamp;
  if (meta?.decoderConfig) {
    if (track.info.decoderConfig === null) {
      track.info.decoderConfig = meta.decoderConfig;
    } else {
      Object.assign(track.info.decoderConfig, meta.decoderConfig);
    }
  }
  let sample = {
    presentationTimestamp: presentationTimestampInSeconds,
    decodeTimestamp: decodeTimestampInSeconds,
    duration: durationInSeconds,
    data,
    size: data.byteLength,
    type,
    // Will be refined once the next sample comes in
    timescaleUnitsToNextSample: intoTimescale(durationInSeconds, track.timescale)
  };
  return sample;
};
_addSampleToTrack = new WeakSet();
addSampleToTrack_fn = function(track, sample) {
  if (__privateGet(this, _options).fastStart !== "fragmented") {
    track.samples.push(sample);
  }
  const sampleCompositionTimeOffset = intoTimescale(sample.presentationTimestamp - sample.decodeTimestamp, track.timescale);
  if (track.lastTimescaleUnits !== null) {
    let timescaleUnits = intoTimescale(sample.decodeTimestamp, track.timescale, false);
    let delta = Math.round(timescaleUnits - track.lastTimescaleUnits);
    track.lastTimescaleUnits += delta;
    track.lastSample.timescaleUnitsToNextSample = delta;
    if (__privateGet(this, _options).fastStart !== "fragmented") {
      let lastTableEntry = last(track.timeToSampleTable);
      if (lastTableEntry.sampleCount === 1) {
        lastTableEntry.sampleDelta = delta;
        lastTableEntry.sampleCount++;
      } else if (lastTableEntry.sampleDelta === delta) {
        lastTableEntry.sampleCount++;
      } else {
        lastTableEntry.sampleCount--;
        track.timeToSampleTable.push({
          sampleCount: 2,
          sampleDelta: delta
        });
      }
      const lastCompositionTimeOffsetTableEntry = last(track.compositionTimeOffsetTable);
      if (lastCompositionTimeOffsetTableEntry.sampleCompositionTimeOffset === sampleCompositionTimeOffset) {
        lastCompositionTimeOffsetTableEntry.sampleCount++;
      } else {
        track.compositionTimeOffsetTable.push({
          sampleCount: 1,
          sampleCompositionTimeOffset
        });
      }
    }
  } else {
    track.lastTimescaleUnits = 0;
    if (__privateGet(this, _options).fastStart !== "fragmented") {
      track.timeToSampleTable.push({
        sampleCount: 1,
        sampleDelta: intoTimescale(sample.duration, track.timescale)
      });
      track.compositionTimeOffsetTable.push({
        sampleCount: 1,
        sampleCompositionTimeOffset
      });
    }
  }
  track.lastSample = sample;
  let beginNewChunk = false;
  if (!track.currentChunk) {
    beginNewChunk = true;
  } else {
    let currentChunkDuration = sample.presentationTimestamp - track.currentChunk.startTimestamp;
    if (__privateGet(this, _options).fastStart === "fragmented") {
      let mostImportantTrack = __privateGet(this, _videoTrack) ?? __privateGet(this, _audioTrack);
      const chunkDuration = __privateGet(this, _options).minFragmentDuration ?? 1;
      if (track === mostImportantTrack && sample.type === "key" && currentChunkDuration >= chunkDuration) {
        beginNewChunk = true;
        __privateMethod(this, _finalizeFragment, finalizeFragment_fn).call(this);
      }
    } else {
      beginNewChunk = currentChunkDuration >= 0.5;
    }
  }
  if (beginNewChunk) {
    if (track.currentChunk) {
      __privateMethod(this, _finalizeCurrentChunk, finalizeCurrentChunk_fn).call(this, track);
    }
    track.currentChunk = {
      startTimestamp: sample.presentationTimestamp,
      samples: []
    };
  }
  track.currentChunk.samples.push(sample);
};
_validateTimestamp = new WeakSet();
validateTimestamp_fn = function(presentationTimestamp, decodeTimestamp, track) {
  const strictTimestampBehavior = __privateGet(this, _options).firstTimestampBehavior === "strict";
  const noLastDecodeTimestamp = track.lastDecodeTimestamp === -1;
  const timestampNonZero = decodeTimestamp !== 0;
  if (strictTimestampBehavior && noLastDecodeTimestamp && timestampNonZero) {
    throw new Error(
      \`The first chunk for your media track must have a timestamp of 0 (received DTS=\${decodeTimestamp}).Non-zero first timestamps are often caused by directly piping frames or audio data from a MediaStreamTrack into the encoder. Their timestamps are typically relative to the age of thedocument, which is probably what you want.

If you want to offset all timestamps of a track such that the first one is zero, set firstTimestampBehavior: 'offset' in the options.
\`
    );
  } else if (__privateGet(this, _options).firstTimestampBehavior === "offset" || __privateGet(this, _options).firstTimestampBehavior === "cross-track-offset") {
    if (track.firstDecodeTimestamp === void 0) {
      track.firstDecodeTimestamp = decodeTimestamp;
    }
    let baseDecodeTimestamp;
    if (__privateGet(this, _options).firstTimestampBehavior === "offset") {
      baseDecodeTimestamp = track.firstDecodeTimestamp;
    } else {
      baseDecodeTimestamp = Math.min(
        __privateGet(this, _videoTrack)?.firstDecodeTimestamp ?? Infinity,
        __privateGet(this, _audioTrack)?.firstDecodeTimestamp ?? Infinity
      );
    }
    decodeTimestamp -= baseDecodeTimestamp;
    presentationTimestamp -= baseDecodeTimestamp;
  }
  if (decodeTimestamp < track.lastDecodeTimestamp) {
    throw new Error(
      \`Timestamps must be monotonically increasing (DTS went from \${track.lastDecodeTimestamp * 1e6} to \${decodeTimestamp * 1e6}).\`
    );
  }
  track.lastDecodeTimestamp = decodeTimestamp;
  return { presentationTimestamp, decodeTimestamp };
};
_finalizeCurrentChunk = new WeakSet();
finalizeCurrentChunk_fn = function(track) {
  if (__privateGet(this, _options).fastStart === "fragmented") {
    throw new Error("Can't finalize individual chunks if 'fastStart' is set to 'fragmented'.");
  }
  if (!track.currentChunk)
    return;
  track.finalizedChunks.push(track.currentChunk);
  __privateGet(this, _finalizedChunks).push(track.currentChunk);
  if (track.compactlyCodedChunkTable.length === 0 || last(track.compactlyCodedChunkTable).samplesPerChunk !== track.currentChunk.samples.length) {
    track.compactlyCodedChunkTable.push({
      firstChunk: track.finalizedChunks.length,
      // 1-indexed
      samplesPerChunk: track.currentChunk.samples.length
    });
  }
  if (__privateGet(this, _options).fastStart === "in-memory") {
    track.currentChunk.offset = 0;
    return;
  }
  track.currentChunk.offset = __privateGet(this, _writer).pos;
  for (let sample of track.currentChunk.samples) {
    __privateGet(this, _writer).write(sample.data);
    sample.data = null;
  }
  __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
};
_finalizeFragment = new WeakSet();
finalizeFragment_fn = function(flushStreamingWriter = true) {
  if (__privateGet(this, _options).fastStart !== "fragmented") {
    throw new Error("Can't finalize a fragment unless 'fastStart' is set to 'fragmented'.");
  }
  let tracks = [__privateGet(this, _videoTrack), __privateGet(this, _audioTrack)].filter((track) => track && track.currentChunk);
  if (tracks.length === 0)
    return;
  let fragmentNumber = __privateWrapper(this, _nextFragmentNumber)._++;
  if (fragmentNumber === 1) {
    let movieBox = moov(tracks, __privateGet(this, _creationTime), true);
    __privateGet(this, _writer).writeBox(movieBox);
  }
  let moofOffset = __privateGet(this, _writer).pos;
  let moofBox = moof(fragmentNumber, tracks);
  __privateGet(this, _writer).writeBox(moofBox);
  {
    let mdatBox = mdat(false);
    let totalTrackSampleSize = 0;
    for (let track of tracks) {
      for (let sample of track.currentChunk.samples) {
        totalTrackSampleSize += sample.size;
      }
    }
    let mdatSize = __privateGet(this, _writer).measureBox(mdatBox) + totalTrackSampleSize;
    if (mdatSize >= 2 ** 32) {
      mdatBox.largeSize = true;
      mdatSize = __privateGet(this, _writer).measureBox(mdatBox) + totalTrackSampleSize;
    }
    mdatBox.size = mdatSize;
    __privateGet(this, _writer).writeBox(mdatBox);
  }
  for (let track of tracks) {
    track.currentChunk.offset = __privateGet(this, _writer).pos;
    track.currentChunk.moofOffset = moofOffset;
    for (let sample of track.currentChunk.samples) {
      __privateGet(this, _writer).write(sample.data);
      sample.data = null;
    }
  }
  let endPos = __privateGet(this, _writer).pos;
  __privateGet(this, _writer).seek(__privateGet(this, _writer).offsets.get(moofBox));
  let newMoofBox = moof(fragmentNumber, tracks);
  __privateGet(this, _writer).writeBox(newMoofBox);
  __privateGet(this, _writer).seek(endPos);
  for (let track of tracks) {
    track.finalizedChunks.push(track.currentChunk);
    __privateGet(this, _finalizedChunks).push(track.currentChunk);
    track.currentChunk = null;
  }
  if (flushStreamingWriter) {
    __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
  }
};
_maybeFlushStreamingTargetWriter = new WeakSet();
maybeFlushStreamingTargetWriter_fn = function() {
  if (__privateGet(this, _writer) instanceof StreamTargetWriter) {
    __privateGet(this, _writer).flush();
  }
};
_ensureNotFinalized = new WeakSet();
ensureNotFinalized_fn = function() {
  if (__privateGet(this, _finalized)) {
    throw new Error("Cannot add new video or audio chunks after the file has been finalized.");
  }
};
export {
  ArrayBufferTarget,
  FileSystemWritableFileStreamTarget,
  Muxer,
  StreamTarget
};
`, type: "text/javascript; charset=utf-8" } };

// server/worker.js
var MAX_PART = 8 * 1024 * 1024;
var HASH = /^[a-f0-9]{64}$/;
var ID = /^[a-f0-9-]{36}$/;
var LIVE_DEFAULT = "https://raw.githubusercontent.com/Kevin04261004/bugcol_youtube_studio/live/dist";
var LIVE_PATH = /^\/(?!server\/)(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(html|css|js|json|svg|png|jpe?g|webp|woff2|ico|map)$/i;
var LIVE_TYPES = { html: "text/html; charset=utf-8", css: "text/css; charset=utf-8", js: "text/javascript; charset=utf-8", json: "application/json; charset=utf-8", map: "application/json; charset=utf-8", svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", woff2: "font/woff2", ico: "image/x-icon" };
var BUNDLED = typeof define_STATIC_FILES_default === "object" ? define_STATIC_FILES_default : {};
var BUILD = true ? "6f240d333433" : "dev";
var liveBase = (env) => {
  const base = env?.LIVE_SOURCE ?? LIVE_DEFAULT;
  return base && base !== "off" ? base.replace(/\/$/, "") : null;
};
var LIVE_WINDOW = 3e4;
async function liveGet(env, path) {
  const base = liveBase(env);
  if (!base) return null;
  try {
    const bust = (path.includes("?") ? "&" : "?") + "t=" + Math.floor(Date.now() / LIVE_WINDOW);
    const r = await fetch(base + path + bust, { signal: AbortSignal.timeout(2500), cf: { cacheTtl: 30, cacheEverything: true } });
    if (!r.ok) return null;
    const bytes = new Uint8Array(await r.arrayBuffer());
    return bytes.length ? bytes : null;
  } catch {
    return null;
  }
}
var json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers } });
var fail = (status, message) => Object.assign(new Error(message), { status });
async function digest(data) {
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", data))].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function limitedBody(req, max) {
  if (Number(req.headers.get("content-length")) > max) throw fail(413, "\uD30C\uC77C \uC870\uAC01\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4.");
  const reader = req.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks = [];
  let size = 0;
  for (; ; ) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw fail(413, "\uC694\uCCAD \uD06C\uAE30\uAC00 \uB108\uBB34 \uD07D\uB2C8\uB2E4.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let off = 0;
  for (const c of chunks) {
    bytes.set(c, off);
    off += c.length;
  }
  return bytes;
}
function validateManifest(doc) {
  if (doc?.version !== 1 || typeof doc.name !== "string" || doc.name.length > 200 || !Array.isArray(doc.sentences) || doc.sentences.length > 2e3 || !doc.assets || Array.isArray(doc.assets)) throw fail(400, "\uC791\uC5C5 \uD3F4\uB354 \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
  const parts = /* @__PURE__ */ new Set(), ids = /* @__PURE__ */ new Set();
  const file = (f) => {
    if (!f || !Number.isInteger(f.size) || f.size < 0 || !Array.isArray(f.parts) || f.parts.length > 2048 || f.parts.length !== Math.ceil(f.size / MAX_PART)) throw fail(400, "\uC18C\uC7AC \uC815\uBCF4 \uC624\uB958");
    for (const p of f.parts) {
      if (!HASH.test(p)) throw fail(400, "\uD30C\uC77C ID \uC624\uB958");
      parts.add(p);
    }
  };
  for (const [name, f] of Object.entries(doc.assets)) {
    if (name.length > 300 || /(^|\/)\.\.(\/|$)|^\/|\\/.test(name)) throw fail(400, "\uC18C\uC7AC \uACBD\uB85C \uC624\uB958");
    file(f);
  }
  for (const s of doc.sentences) {
    if (!Number.isInteger(s.id) || s.id < 1 || ids.has(s.id) || typeof s.text !== "string" || s.text.length > 2e4 || !s.scene) throw fail(400, "\uBB38\uC7A5 \uC815\uBCF4 \uC624\uB958");
    ids.add(s.id);
    if (s.audio) {
      file(s.audio);
      if (!Number.isInteger(s.audio.samples) || s.audio.samples * 4 !== s.audio.size) throw fail(400, "\uB179\uC74C \uC815\uBCF4 \uC624\uB958");
    }
    if (s.scene.asset && !Object.hasOwn(doc.assets, s.scene.asset)) throw fail(400, "\uC7A5\uBA74 \uC18C\uC7AC \uB204\uB77D");
  }
  if (parts.size > 1e4) throw fail(413, "\uC791\uC5C5\uC744 \uC5EC\uB7EC \uD3F4\uB354\uB85C \uB098\uB204\uC5B4 \uC8FC\uC138\uC694.");
  return [...parts];
}
async function api(req, env) {
  const u = new URL(req.url), path = u.pathname, uid = req.headers.get("oai-authenticated-user-id"), email = req.headers.get("oai-authenticated-user-email");
  if (path === "/api/session") return json({ user: uid && email ? { id: uid, email } : null });
  if (path === "/api/version") {
    const bytes = await liveGet(env, "/build-id.txt"), live = bytes ? new TextDecoder().decode(bytes).trim() : null;
    return json({ bundled: BUILD, live, source: live && live !== BUILD ? "live" : "bundled" });
  }
  if (!uid || !email) return json({ error: "\uC11C\uBC84 \uC791\uC5C5 \uD3F4\uB354\uB97C \uC0AC\uC6A9\uD558\uB824\uBA74 ChatGPT\uB85C \uB85C\uADF8\uC778\uD558\uC138\uC694." }, 401);
  if (!["GET", "HEAD"].includes(req.method) && req.headers.get("origin") !== u.origin) return json({ error: "\uAC19\uC740 \uC0AC\uC774\uD2B8\uC5D0\uC11C\uB9CC \uC800\uC7A5\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }, 403);
  if (!env.BUCKET) return json({ error: "\uC11C\uBC84 \uC800\uC7A5\uC18C\uB97C \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4. \uD604\uC7AC \uC791\uC5C5\uC740 \uAE30\uAE30\uC5D0 \uC720\uC9C0\uB429\uB2C8\uB2E4." }, 503);
  const owner = await digest(new TextEncoder().encode(uid)), prefix = `users/${owner}/`, bucket = env.BUCKET;
  if (path === "/api/folders" && req.method === "GET") {
    const data = await bucket.list({ prefix: prefix + "folders/", limit: 100, cursor: u.searchParams.get("cursor") || void 0, include: ["customMetadata"] });
    return json({ folders: data.objects.map((o) => ({ id: o.key.split("/").pop().replace(".json", ""), name: o.customMetadata?.name || "\uC791\uC5C5 \uD3F4\uB354", updatedAt: o.customMetadata?.updatedAt || o.uploaded, etag: o.etag, count: Number(o.customMetadata?.count || 0) })), cursor: data.truncated ? data.cursor : null });
  }
  const media = path.match(/^\/api\/media\/([a-f0-9]{64})$/);
  if (media) {
    const key = prefix + "media/" + media[1];
    if (req.method === "HEAD") {
      const o = await bucket.head(key);
      return new Response(null, { status: o ? 200 : 404, headers: { "Cache-Control": "no-store" } });
    }
    if (req.method === "GET") {
      const o = await bucket.get(key);
      return o ? new Response(o.body, { headers: { "Content-Type": "application/octet-stream", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } }) : json({ error: "\uC18C\uC7AC\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }, 404);
    }
    if (req.method === "PUT") {
      const bytes = await limitedBody(req, MAX_PART);
      if (await digest(bytes) !== media[1]) throw fail(400, "\uD30C\uC77C \uAC80\uC99D \uC2E4\uD328");
      await bucket.put(key, bytes, { onlyIf: { etagDoesNotMatch: "*" }, httpMetadata: { contentType: "application/octet-stream" } });
      return json({ saved: true });
    }
  }
  const folder = path.match(/^\/api\/folders\/([a-f0-9-]{36})$/);
  if (folder && ID.test(folder[1])) {
    const key = prefix + "folders/" + folder[1] + ".json";
    if (req.method === "GET") {
      const o = await bucket.get(key);
      if (!o) return json({ error: "\uC791\uC5C5 \uD3F4\uB354\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }, 404);
      return json({ project: await o.json(), etag: o.etag });
    }
    if (req.method === "DELETE") {
      if (!await bucket.head(key)) return json({ error: "\uC791\uC5C5 \uD3F4\uB354\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }, 404);
      await bucket.delete(key);
      return json({ deleted: true });
    }
    if (req.method === "PUT") {
      let doc;
      try {
        doc = JSON.parse(new TextDecoder().decode(await limitedBody(req, 4 * 1024 * 1024)));
      } catch (e) {
        if (e.status) throw e;
        throw fail(400, "\uC791\uC5C5 \uC815\uBCF4\uAC00 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
      }
      const refs = validateManifest(doc);
      for (let i = 0; i < refs.length; i += 16) {
        const found = await Promise.all(refs.slice(i, i + 16).map((p) => bucket.head(prefix + "media/" + p)));
        if (found.some((x) => !x)) throw fail(400, "\uC544\uC9C1 \uC5C5\uB85C\uB4DC\uD558\uC9C0 \uBABB\uD55C \uC18C\uC7AC\uAC00 \uC788\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC800\uC7A5\uD558\uC138\uC694.");
      }
      const etag = req.headers.get("if-match"), create = req.headers.get("if-none-match") === "*";
      if (!etag && !create) throw fail(428, "\uC774\uC804 \uC800\uC7A5 \uBC84\uC804\uC744 \uD655\uC778\uD574\uC57C \uD569\uB2C8\uB2E4.");
      doc.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const saved = await bucket.put(key, JSON.stringify(doc), { onlyIf: etag ? { etagMatches: etag.replaceAll('"', "") } : { etagDoesNotMatch: "*" }, httpMetadata: { contentType: "application/json" }, customMetadata: { name: doc.name, updatedAt: doc.updatedAt, count: String(doc.sentences.length) } });
      if (!saved) return json({ error: "\uB2E4\uB978 \uAE30\uAE30\uC5D0\uC11C \uC774 \uD3F4\uB354\uB97C \uC218\uC815\uD588\uC2B5\uB2C8\uB2E4. \uC0C8 \uD3F4\uB354\uB85C \uC800\uC7A5\uD558\uAC70\uB098 \uC11C\uBC84 \uBC84\uC804\uC744 \uB2E4\uC2DC \uC5F4\uC5B4 \uC8FC\uC138\uC694." }, 409);
      return json({ etag: saved.etag, updatedAt: doc.updatedAt });
    }
  }
  return json({ error: "\uC694\uCCAD\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }, 404);
}
var worker_default = { async fetch(req, env) {
  try {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/")) return await api(req, env);
    const path = url.pathname === "/" ? "/index.html" : url.pathname, bundled = BUNDLED[path];
    if (!bundled && !LIVE_PATH.test(path)) return new Response("Not found", { status: 404 });
    const live = await liveGet(env, path);
    if (!live && !bundled) return new Response("Not found", { status: 404 });
    const type = bundled ? bundled.type : LIVE_TYPES[path.split(".").pop().toLowerCase()];
    return new Response(req.method === "HEAD" ? null : live ?? bundled.body, { headers: { "Content-Type": type, "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff", "X-Studio-Source": live ? "live" : "bundled" } });
  } catch (e) {
    console.error("Storage request failed", e.message);
    return json({ error: e.status ? e.message : "\uC11C\uBC84 \uC800\uC7A5\uC744 \uC644\uB8CC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uAE30\uC758 \uC791\uC5C5\uC740 \uC720\uC9C0\uB429\uB2C8\uB2E4." }, e.status || 503);
  }
} };
export {
  api,
  worker_default as default
};
