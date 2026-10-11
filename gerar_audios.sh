#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
[ -d .venv ] || python3 -m venv .venv
source .venv/bin/activate
python -m pip install -q --upgrade pip
python -m pip install -q --upgrade edge-tts numpy soundfile librosa pyloudnorm
python gerar_audios.py --amostra "$@"
read -p "Gerar/atualizar o banco completo? [s/N] " r
[ "$r" = "s" ] && python gerar_audios.py "$@"
