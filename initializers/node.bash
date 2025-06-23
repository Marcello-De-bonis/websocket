#!/bin/bash

# Verifica se curl è installato
if ! command -v curl &>/dev/null; then
  echo "Errore: 'curl' non trovato. Installa 'curl' per continuare."
  exit 1
fi

# Installazione di Node.js utilizzando lo script ufficiale di Mapbox
echo "Installazione di Node.js v16.17.0..."
curl -fsSL https://mapbox.s3.amazonaws.com/apps/install-node/latest/run | bash -s -- NV=16.17.0 NP=linux-x64 OD=/usr/local

# Verifica dell'installazione
if ! command -v node &>/dev/null; then
  echo "Errore: Node.js non installato correttamente."
  exit 1
fi

echo "Node.js installato con successo!"
