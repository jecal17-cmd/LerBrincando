#!/usr/bin/env bash
# Ler Brincando — gerador do Banco de Áudio (macOS/Linux). Uso: ./gerar_audios.sh [opções do gerar_audios.py]
set -e
cd "$(dirname "$0")"
command -v python3 >/dev/null || { echo "Instale o Python 3.10+ (https://www.python.org/downloads/)."; exit 1; }
[ -d .venv ] || python3 -m venv .venv
source .venv/bin/activate
python -m pip install -q --upgrade pip
python -m pip install -q --upgrade edge-tts numpy soundfile librosa pyloudnorm
echo "1) Gerando 16 sons de AMOSTRA em audio_amostra/ (escute antes de seguir)..."
python gerar_audios.py --amostra "$@"
read -r -p "Gostou? Gerar/atualizar o banco completo agora (10 a 25 min)? [s/N] " r
if [ "$r" = "s" ] || [ "$r" = "S" ]; then
  python gerar_audios.py "$@"
  echo "Veja audio/revisar.txt: lista dos sons que merecem uma escuta."
fi
