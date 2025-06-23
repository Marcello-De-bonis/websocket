# WebSocket Real-time Coordinates sharing

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0%2B-000000.svg?logo=bun&logoColor=white)](https://bun.sh/)

Un servizio WebSocket ad alte prestazioni per il tracciamento in tempo reale della posizione, progettato per scalare orizzontalmente e supportare migliaia di connessioni simultanee.

## Funzionalità Principali

- **Real-time Bidirezionale**: Comunicazione a bassa latenza tramite WebSocket
- **Multi-Runtime**: Supporto nativo per Node.js e Bun
- **Persistenza dei Dati**: Archiviazione delle coordinate in SQLite
- **Ambiente di Produzione**: Build ottimizzata con minificazione e sourcemap
- **Gestione degli Ambienti**: Supporto per ambienti di sviluppo e produzione
- **Type Safety**: Scritto interamente in TypeScript

## Architettura

```
websocket/
├── dist/                    # Build di produzione
├── src/
│   ├── lib/                # Utilità e configurazione
│   ├── server/              # Implementazioni del server
│   └── shared/              # Codice condiviso
│       ├── db/              # Strato di persistenza
│       └── handlers/        # Logica di business
├── initializers/            # Script di inizializzazione
├── types/                   # Definizioni TypeScript
├── .env.local              # Configurazione ambiente
├── index.ts                # Punto di ingresso
└── package.json
```

## Prerequisiti

- Node.js 18+ o Bun 1.0+
- SQLite (incluso in Node.js/Bun)
- npm, yarn o bun come gestore pacchetti

## Installazione

1. Clona il repository
2. Installa le dipendenze:
   ```bash
   # Con Bun (consigliato)
   bun install
   
   # Con npm
   npm install
   ```

## Configurazione

Crea un file `.env.local` nella root del progetto:

```env
PORT=8080
MODE="prod"
TO_STORE_COORDINATES=1
```

## Avvio

### Sviluppo

```bash
# Avvia con Bun (modalità sviluppo)
MODE=dev bun run start:bun

# Avvia con Node.js (modalità sviluppo)
MODE=dev npm run start:node
```

### Produzione

```bash
# Costruisci l'applicazione
bun run build

# Avvia il server di produzione
cd dist && bun install --production
bun start
```

## API WebSocket

### Eventi Supportati

- `join` - Unisci un utente a una stanza
  ```typescript
  {
    event: 'join',
    room: string,
    userId: string
  }
  ```

- `move` - Aggiorna la posizione di un utente
  ```typescript
  {
    event: 'move',
    room: string,
    userId: string,
    position: {
      latitude: number,
      longitude: number
    }
  }
  ```

## Testing

```bash
# Esegui i test con Bun
bun test

# O con Node.js
npm test
```

## Sicurezza

- Validazione degli input su tutti gli eventi WebSocket
- Gestione sicura delle connessioni
- Isolamento tra le stanze

## Metriche e Monitoraggio

Il servizio espone endpoint per il monitoraggio delle metriche:

- `/health` - Health check endpoint
- `/metrics` - Metriche di sistema (se configurato)

## Contributi

I contributi sono ben accetti! Per favore segui le linee guida:

1. Crea un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Fai commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pusha il branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Distribuito con licenza ISC. Vedi `LICENSE` per maggiori informazioni.

## Supporto

Per problemi o domande, apri una issue sul repository.