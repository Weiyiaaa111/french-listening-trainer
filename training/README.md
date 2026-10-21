# 法语合成语音微调（独立于静态网站）

目标是让新句子也有自然的法语节奏；不是重放原录音，也不是调整浏览器语速来冒充训练。用户已在对话中确认提供的素材获准用于训练。

## 当前真实状态

- 已安装并验证 CPU PyTorch、Piper 训练 CLI。
- 已实际切出 Christophe Bourseiller 的 11 段候选音频，共 75.32 秒；Anthony Lantian 的 5 段候选音频，共 34.16 秒。说话人分开，省略和明显中断的句子不纳入候选数据。
- 候选 PCM 已验证为单声道、22050Hz、时长正确，并记录 SHA-256。
- 已实际完成主说话人法语音素处理、声学特征缓存和首个训练批次读取。安装脚本和两个工具测试通过。
- **尚未开始模型参数训练，未产生微调模型。** 官方预训练 checkpoint 下载被环境网络代理以 `403 Forbidden` 拦截。
- 时间轴来自自动对齐，尚未逐条人工听校；多人节目可能有串话、背景声。当前数据规模仅适合试验，不能证明新句子的自然度得到改善。
- 当前无 GPU。不使用付费算力；恢复模型下载后先做有界 CPU 微调实验。实验产物不会自动替换网站音源。

## 文件与路径

本次实例的依赖和数据放在 `/workspace/voice-training/`，未将虚拟环境、分割音频、缓存和模型提交到 Git。网站仍使用原来的真人材料和浏览器备用语音。

```sh
# 项目根目录下，安装 CPU 环境；不安装 CUDA 版 PyTorch
bash training/install_cpu.sh

# 分开准备候选说话人数据，可重复运行
python3 training/prepare_dataset.py --speaker 'Christophe Bourseiller' --output /workspace/voice-training/datasets/christophe
python3 training/prepare_dataset.py --speaker 'Anthony Lantian' --output /workspace/voice-training/datasets/anthony

# 网络放行后，从官方仓库解析不可变 revision，下载法语 medium checkpoint，保存来源和哈希
/workspace/voice-training/venv/bin/python training/download_checkpoint.py --output /workspace/voice-training/base-model

# 首次有界实验；缺少 checkpoint 会立即停止，绝不退回随机模型并宣称微调
/workspace/voice-training/venv/bin/python training/run_experiment.py \
  --dataset /workspace/voice-training/datasets/christophe \
  --checkpoint /workspace/voice-training/base-model/base.ckpt \
  --output /workspace/voice-training/runs/experiment-001 --steps 20 --accelerator cpu

python3 -m unittest discover -s training -p 'test_*.py' -v
```

下载来源为 `rhasspy/piper-checkpoints`。默认筛选 `siwis` 的法语 medium 模型；若官方仓库结构变化或有多个匹配文件，工具会停止并列出情况，不能声称下载已验证。本次环境未能列出实际模型文件，也未能核对该 checkpoint 的许可证；模型接入前应检查官方模型卡和使用条款。数据和基础模型的授权是分开的。

需要的额外网络域名已保存到环境配置草稿：`huggingface.co`、`cdn-lfs.huggingface.co`、`cdn-lfs.hf.co`、`cas-bridge.xethub.hf.co`、`cas-server.xethub.hf.co`、`transfer.xethub.hf.co`。保存草稿不代表当前机器已放行，须在环境设置中保存并发布后重新验证。未覆盖原有软件包下载预设。

## 判断是否真的训练成功

`run-status.json` 区分进程失败、完成但无 checkpoint、产生 checkpoint 等状态。训练日志保存在输出目录。即使产生权重，也不等于语音自然度达标；`validated_for_production` 保持 `false`。

下一步使用 `evaluation-sentences.txt` 中不在训练集里的新句子生成同文本的基础模型/微调模型对照音频，再检查发音、代词连读、停顿、语调及音质。小数据可能过拟合或退化。Piper 的自动 MOS 评价已关闭，不向用户提供虚假的发音分或质量分。当前无任何已训练音频可发布。

候选数据来自同一段录音，随机划分不能证明跨场景泛化。要训练稳定自然的朗读，应补充同一说话人的清晰、完整、已获授权素材，覆盖陈述、提问、从句、列举和工程场景；需要的数量取决于模型与目标，不能承诺靠这约一分钟的数据就学会自然语调。

## 网站音源更新说明

网站已改用公开预训练 Piper/SIWIS 模型生成示例，并提供浏览器量化模型推理。这项更新是预训练模型推理，不是使用用户的 France Inter 访谈进行微调；上述训练 checkpoint 阻塞与尚无自训模型的结论仍然有效。下载的推理模型位于 `/workspace/voice-training/natural-voices/`，样本发布信息见 `src/sample-audio-info.json`。
