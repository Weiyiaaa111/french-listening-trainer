"""Apply an aeneas JSON sync map; reject unusable boundaries instead of inventing times.
Usage: python3 scripts/import_alignment.py src/lessons/piste37.json sync.json
"""
import json
import sys
from pathlib import Path

lesson_path, sync_path = map(Path, sys.argv[1:])
lesson = json.loads(lesson_path.read_text())
fragments = json.loads(sync_path.read_text())["fragments"]
chunks = [chunk for sentence in lesson["sentences"] for chunk in sentence["chunks"]]
if len(fragments) != len(chunks):
    raise ValueError("The sync map and transcript have different chunk counts")
previous_end = 0
for chunk, fragment in zip(chunks, fragments):
    start, end = float(fragment["begin"]), float(fragment["end"])
    if not 0 <= previous_end <= start < end <= lesson["duration"]:
        raise ValueError(f"Invalid boundary: {start}–{end}")
    chunk.update(start=start, end=end)
    previous_end = end
for sentence in lesson["sentences"]:
    sentence.update(start=sentence["chunks"][0]["start"], end=sentence["chunks"][-1]["end"])
lesson_path.write_text(json.dumps(lesson, ensure_ascii=False, indent=2) + "\n")
print(f"Validated {len(lesson['sentences'])} sentences and {len(chunks)} chunks")
