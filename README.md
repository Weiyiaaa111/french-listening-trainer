# Écoute · 法语意群听力训练

React 19 + TypeScript + Vite 的响应式单页网站，无后端、无登录、无需收费 API。

## 本地开发与验证

需要 Node.js 22+（本次使用 Node 24）。

```sh
npm ci
npm run dev
npm run build
npm test
npx playwright install chromium
npm run test:e2e
npm run preview
```

开发服务默认端口 5173，预览端口 4173。使用开发服务器输出的地址访问。云端应通过平台转发端口预览；外网录音必须使用 HTTPS。若 npm 默认缓存不可写，可添加 `--cache /tmp/ecoute-npm-cache`。Linux 若缺浏览器系统库，执行 `npx playwright install --with-deps chromium`。

## 第一版功能

- DALF C1、工程法语、日常法语，均可按日期筛选。
- 23 道明确标为示例的练习（含三篇各 12 句的长篇材料），涵盖 ce qui / ce que / dont、lui / leur / les / la / en / y、过去时、否定、连接词。
- 三阶段：隐藏原文盲听、填写意群、显示参考原句 / 分割 / 中文与语法解析。
- 整句和意群播放、正常与慢速、循环；合成音不可用时有提示。
- 听写提交次数、最后练习时间和听写文本保存在记录中；页面显示累计次数。文本一致性比较仅忽略重音与标点，不是发音或意群评分。
- 错题收藏、已掌握、按模块复习。复习仅列出收藏且未掌握的句子。
- 浏览器真实录音，停止后立即回放与下载；录音最多两分钟，离开句子释放设备。
- JSON 导入题库、导出格式示例、完整学习数据备份和恢复。

## 数据与真人音频

在「题库与数据」下载 JSON 示例；每题包括：

```json
{
  "id": "my-engineering-20261021-1",
  "module": "engineering",
  "date": "2026-10-21",
  "title": "采购确认",
  "translation": "你能把它们送到工地吗？",
  "sample": false,
  "tags": ["les"],
  "audioUrl": "https://example.com/sentence.mp3",
  "chunks": [
    {"text": "Pouvez-vous les livrer sur le chantier ?", "role": "直接宾语 les", "tip": "les 指已提及的物资。", "audioUrl": "https://example.com/chunk.mp3"}
  ]
}
```

导入文件是题目数组；完整备份为 `{ "items": [...], "progress": {...} }`。同 ID 或标准化法语全文重复会跳过，包含同文件内部重复；导入整体校验，错误不会部分保存。若要替换原题请使用新的 ID 和不同文本（本版不提供题目编辑器）。限制 5MB / 2000 题。音频地址须为可公开访问的 HTTP(S)，线上使用 HTTPS，确保有使用授权。整句和意群可以分别指定音频；没有地址时使用法语合成音。真人整句不会自动切分，需另行提供意群音频。

语音合成依赖操作系统和浏览器安装的法语语音包，部分语音需网络。合成音的韵律、连读、弱读不等于真人自然语流。无虚假评分。浏览器可能在首次载入语音时尚未就绪，可稍后重试。不同速度下需重新点击播放。

localStorage 记录不会跨设备同步；清理浏览器数据会丢失。请定期导出完整备份，换设备时导入。恢复时同 ID 练习记录以备份为准。录音只保留本次练习的内存 Blob，不上传，不随 JSON 备份；需要保存请单独下载。浏览器合成语音可能使用厂商在线服务。

## 部署

执行 `npm run build`，将 `dist/` 发布到任何 HTTPS 静态托管服务。

- Vercel / Netlify：构建命令 `npm run build`，输出目录 `dist`；无环境变量。
- GitHub Pages：本仓库内置 GitHub Actions；在仓库 Settings → Pages 选择 GitHub Actions，推送到 main 后构建部署。
- 相对资源路径支持仓库子路径；本项目无客户端多页路由，无需 rewrite。

不要公开暴露 Vite 开发服务作为生产网站。

## 测试范围与限制

Vitest 验证题库字段、导入原子性、去重、无效音频和文本比较。Playwright 验证隐藏原文、听写记录、刷新持久化、复习移除、日期筛选、坏文件提示、麦克风拒绝、真实 MediaRecorder 对测试音轨录制及 audio 回放、手机宽度布局。

自动化测试音轨不能代替实体麦克风。部署后仍需在手机 Safari、Android Chrome 和桌面浏览器上实测：首次授权/拒绝后恢复、蓝牙耳机、噪声环境、长时间录音、真实法语语音和 HTTPS 真人音频。第一版不提供自动发音评分、云同步、录音长期存储或间隔重复调度。

当前云环境已安装系统 Chromium，可直接运行 `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e`，无需下载浏览器。题库与数据窗口可查看每句的练习次数、日期与最近听写。


## 编号精听与录音管理更新

盲听和听辨阶段均可点击 01、02 等编号单独播放，不显示原文。听辨阶段可独立显示和隐藏当前片段的法语原文；「查看原文与解析」再显示全篇。长篇示例按完整句子切分，短句练习按意群切分；长篇时长取决于语音和语速，不声称固定三分钟。原有本地记录保留，新内置题库自动合并。录音回放旁可删除录音，删除会停止回放并释放临时音频地址，可继续重新录制。JSON 为练习文件格式，普通训练无需理解其技术字段。
