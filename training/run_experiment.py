"""Run bounded, single-speaker Piper fine-tuning; requires a pretrained checkpoint."""
import argparse
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path


def command(dataset: Path, checkpoint: Path, output: Path, steps: int, accelerator: str):
    if not checkpoint.is_file():
        raise ValueError('Pretrained checkpoint is missing. No training started; random initialization is not a fine-tuned voice.')
    manifest = json.loads((dataset / 'manifest.json').read_text())
    if manifest['clips'] < 5:
        raise ValueError('Fewer than five candidate clips; no meaningful train/validation split.')
    for row in manifest['items']:
        wav = dataset / 'wav' / row['file']
        if hashlib.sha256(wav.read_bytes()).hexdigest() != row['sha256']:
            raise ValueError('Candidate audio changed: ' + row['file'])
        if row['speaker'] != manifest['speaker']:
            raise ValueError('Mixed speakers in a single-speaker run')
    if not 1 <= steps <= 10000:
        raise ValueError('Steps must be between 1 and 10000')
    return [sys.executable, '-m', 'piper.train', 'fit',
            '--seed_everything', '37', '--data.voice_name', 'ecoute-french-experimental',
            '--data.csv_path', str(dataset / 'metadata.csv'), '--data.audio_dir', str(dataset / 'wav'),
            '--data.espeak_voice', 'fr', '--data.cache_dir', str(output / 'cache'),
            '--data.config_path', str(output / 'config.json'), '--data.batch_size', '1',
            '--data.num_workers', '0', '--data.validation_split', '.2', '--data.num_test_examples', '1',
            '--model.sample_rate', '22050', '--model.warmstart_ckpt', str(checkpoint),
            '--model.learning_rate', '0.00002', '--model.learning_rate_d', '0.00001',
            '--model.mos_metric', 'none', '--trainer.accelerator', accelerator, '--trainer.devices', '1',
            '--trainer.precision', '32-true', '--trainer.max_steps', str(steps), '--trainer.max_epochs', '20',
            '--trainer.default_root_dir', str(output), '--trainer.num_sanity_val_steps', '0',
            '--trainer.limit_val_batches', '1', '--trainer.log_every_n_steps', '1']


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--dataset', type=Path, required=True)
    p.add_argument('--checkpoint', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--steps', type=int, default=20)
    p.add_argument('--accelerator', choices=['cpu', 'gpu'], default='cpu')
    a = p.parse_args()
    cmd = command(a.dataset.resolve(), a.checkpoint.resolve(), a.output.resolve(), a.steps, a.accelerator)
    a.output.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((a.dataset / 'manifest.json').read_text())
    report = {'status': 'experiment_starting', 'command': cmd, 'speaker': manifest['speaker'],
              'dataset_seconds': manifest['seconds'], 'alignment_status': 'automatic_unreviewed',
              'validated_for_production': False}
    status = a.output / 'run-status.json'
    status.write_text(json.dumps(report, indent=2))
    env = dict(os.environ, OMP_NUM_THREADS='2', MKL_NUM_THREADS='2')
    with (a.output / 'train.log').open('w') as log:
        result = subprocess.run(cmd, env=env, stdout=log, stderr=subprocess.STDOUT)
    report.update(status='training_process_completed' if result.returncode == 0 else 'training_process_failed',
                  returncode=result.returncode)
    report['checkpoints'] = [str(x) for x in a.output.rglob('*.ckpt')]
    if result.returncode == 0 and not report['checkpoints']:
        report.update(status='no_checkpoint_produced', returncode=1)
    status.write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))
    raise SystemExit(report['returncode'])


if __name__ == '__main__':
    main()
