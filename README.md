# WebSocket Real-time Location Tracking

A real-time location tracking application using WebSockets (Socket.IO) with support for both Node.js and Bun runtimes.

## Project Structure

```
websocket/
├── src/
│   ├── lib/
│   │   └── utils.ts          # Utility functions and environment configuration
│   │
│   ├── server/
│   │   ├── socket.node.ts  # Node.js WebSocket server implementation
│   │   └── socket.bun.ts   # Bun WebSocket server implementation
│   │
│   └── shared/
│       ├── db/
│       │   └── coordinates.json  # JSON database for coordinates (Bun)
│       │
│       └── handlers/
│           └── save-coordinate.ts  # Coordinate saving logic
│
├── initializers/           # Shell scripts for environment setup
├── types/                   # TypeScript type definitions
├── index.ts                 # Application entry point
├── index.node.ts            # Node.js specific entry
├── index.bun.ts             # Bun specific entry
├── package.json
└── tsconfig.json
```

## Features

- Real-time location tracking using WebSockets
- Support for multiple clients in different rooms
- Database persistence of coordinates
- Cross-runtime compatibility (Node.js and Bun)
- TypeScript support

## Prerequisites

- Node.js (v16+) or Bun (v1.0+)
- npm or yarn
- TypeScript (installed via devDependencies)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Using npm
   npm install
   
   # Or using Bun
   bun install
   ```

## Configuration

Create a `.env.local` file in the project root with the following variables:

```env
PORT=8080
NODE_ENV=development
```

## Running the Application

### Development Mode

For Node.js:
```bash
npm run dev:node
```

For Bun:
```bash
bun run dev:bun
```

### Production Mode

For Node.js:
```bash
npm run prod:node
```

For Bun:
```bash
bun run prod:bun
```

## API Endpoints

### WebSocket Events

- `connection`: When a client connects
- `join`: Join a room
  - Parameters: `room` (string)
- `move`: Update user's location
  - Parameters: 
    ```typescript
    {
      room: string;
      user_id: string;
      latitude: number;
      longitude: number;
    }
    ```

## Database

The application uses:
- SQLite for Node.js (stored in `src/db/coordinates.sqlite`)
- JSON file for Bun (stored in `src/shared/db/coordinates.json`)

## Development

### Project Structure

- `src/server/`: Contains server-side WebSocket implementations
- `src/shared/`: Contains shared code between server and potential client
- `src/lib/`: Utility functions and helpers
- `initializers/`: Scripts for environment setup

### TypeScript Configuration

The project uses TypeScript with strict type checking. Configuration can be found in `tsconfig.json`.

## License

ISC License