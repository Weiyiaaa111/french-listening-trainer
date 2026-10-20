"""Prepare separate-speaker candidate datasets; no model training is claimed here."""
import argparse
import csv
import hashlib
import json
import math
import wave
import re
import subprocess
from pathlib import Path


def prepare(lesson_path: Path, audio_path: Path, output: Path, speaker: str):
    lesson = json.loads(lesson_path.read_text(encoding='utf-8'))
    output.mkdir(parents=True, exist_ok=True)
    wav_dir = output / 'wav'
    wav_dir.mkdir(exist_ok=True)
    accepted, excluded = [], []
    for i, sentence in enumerate(lesson['sentences'], 1):
        if sentence['speaker'] != speaker:
            continue
        text = sentence['text'].strip()
        start, end = sentence['start'], sentence['end']
        if not all(isinstance(t, (int, float)) and math.isfinite(t) for t in (start, end)) or not 0 <= start < end:
            raise ValueError('Invalid source timing at sentence ' + str(i))
        duration = end - start
        reason = None
        if re.search(r'\[|\.\.\.|…', text):
            reason = 'Transcript omission, hesitation or self-correction needs listening review'
        elif not 1.0 <= duration <= 15.0:
            reason = 'Outside the 1–15 second candidate range'
        elif '|' in text or '\n' in text:
            reason = 'Invalid metadata delimiter'
        if reason:
            excluded.append({'sentence': i, 'reason': reason})
            continue
        name = f'piste37_{i:03d}.wav'
        target = wav_dir / name
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', str(audio_path),
                        '-ss', str(sentence['start']), '-t', str(duration),
                        '-ac', '1', '-ar', '22050', '-c:a', 'pcm_s16le', str(target)], check=True)
        with wave.open(str(target)) as f:
            if f.getframerate() != 22050 or f.getnchannels() != 1 or abs(f.getnframes() / 22050 - duration) > .05:
                raise ValueError('Decoded clip length or format mismatch: ' + name)
        accepted.append({'file': name, 'text': text, 'speaker': speaker, 'source_sentence': i,
                         'start': sentence['start'], 'end': sentence['end'], 'seconds': round(duration, 3),
                         'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
                         'alignment_status': 'automatic_unreviewed'})
    with (output / 'metadata.csv').open('w', encoding='utf-8', newline='') as f:
        csv.writer(f, delimiter='|').writerows((r['file'], r['text']) for r in accepted)
    report = {'status': 'candidate_dataset_not_a_trained_model', 'speaker': speaker,
              'source_audio_sha256': hashlib.sha256(audio_path.read_bytes()).hexdigest(),
              'sample_rate': 22050, 'channels': 1, 'clips': len(accepted),
              'seconds': round(sum(r['seconds'] for r in accepted), 3),
              'warnings': ['Automatic alignment has not been manually checked.',
                           'Tiny, single-recording data cannot establish stable prosody generalization.',
                           'Keep speakers separate. Do not deploy an experimental checkpoint as validated audio.'],
              'items': accepted, 'excluded': excluded}
    (output / 'manifest.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return report


def main():
    p = argparse.ArgumentParser(description=__doc__)
    root = Path(__file__).resolve().parents[1]
    p.add_argument('--lesson', type=Path, default=root / 'src/lessons/piste37.json')
    p.add_argument('--audio', type=Path, default=root / 'public/audio/piste37.mp3')
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--speaker', required=True)
    a = p.parse_args()
    report = prepare(a.lesson, a.audio, a.output, a.speaker)
    print(json.dumps({k: report[k] for k in ('status', 'speaker', 'clips', 'seconds')}, ensure_ascii=False))
    if report['clips'] == 0:
        raise SystemExit('No usable candidate clips for this speaker')


if __name__ == '__main__':
    main()
