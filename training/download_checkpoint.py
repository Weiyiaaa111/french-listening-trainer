"""Fetch an official French Piper medium checkpoint at a resolved immutable revision."""
import argparse
import hashlib
import json
from pathlib import Path


def main():
    from huggingface_hub import HfApi, hf_hub_download
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--voice', default='siwis')
    a = p.parse_args()
    repo = 'rhasspy/piper-checkpoints'
    api = HfApi()
    revision = api.repo_info(repo, repo_type='dataset').sha
    paths = api.list_repo_files(repo, repo_type='dataset', revision=revision)
    matching = sorted(path for path in paths if path.endswith('.ckpt') and
                      (f'fr_FR/{a.voice}/medium/' in path or f'fr_FR-{a.voice}-medium' in path))
    if not matching:
        raise SystemExit(f'No official French medium checkpoint matched voice {a.voice!r}; do not substitute an arbitrary checkpoint.')
    if len(matching) > 1:
        raise SystemExit('Multiple checkpoints matched. Select an exact official file before training:\n' + '\n'.join(matching))
    downloaded = Path(hf_hub_download(repo, matching[0], repo_type='dataset', revision=revision))
    a.output.mkdir(parents=True, exist_ok=True)
    dest = a.output / 'base.ckpt'
    import shutil
    shutil.copyfile(downloaded, dest)
    provenance = {'repository': repo, 'revision': revision, 'file': matching[0],
                  'sha256': hashlib.sha256(dest.read_bytes()).hexdigest(), 'local_path': str(dest.resolve())}
    (a.output / 'provenance.json').write_text(json.dumps(provenance, indent=2) + '\n')
    print(json.dumps(provenance, indent=2))


if __name__ == '__main__':
    main()
