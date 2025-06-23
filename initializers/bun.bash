#!/bin/bash

# Verifica se unzip è installato
if ! command -v unzip &>/dev/null; then
  echo "Errore: 'unzip' non trovato. Installalo con 'sudo apt install unzip'."
  exit 1
fi

# Installazione di Bun
echo "Installazione di Bun..."
curl -fsSL https://bun.sh/install | bash

# Aggiunge Bun al PATH non presente
if ! grep -q "$HOME/.bun/bin" ~/.bashrc; then
  echo "Aggiungendo Bun al PATH..."
  echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
  source ~/.bashrc
fi

echo "Bun installato con successo!"
