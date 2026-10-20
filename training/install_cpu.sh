#!/bin/bash
set -euo pipefail
training_dir="$(cd "$(dirname "$0")" && pwd)"
training_env="${ECOUTE_TRAINING_ENV:-/workspace/voice-training/venv}"
python3 -m venv "$training_env"
"$training_env/bin/python" -m pip install --cache-dir /tmp/ecoute-pip-cache 'torch==2.14.1+cpu' --index-url https://download.pytorch.org/whl/cpu
"$training_env/bin/python" -m pip install --cache-dir /tmp/ecoute-pip-cache -r "$training_dir/requirements-lock.txt"
"$training_env/bin/python" -m pip check
