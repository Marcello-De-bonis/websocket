import { Database } from 'bun:sqlite';
import { env, serve, randomUUIDv7 } from 'bun';
import saveCoordinate from '@/shared/handlers/save-coordinate';

import type { ServerWebSocket } from 'bun';

const db = new Database('../shared/db/coordinates.sqlite', {
	create: true,
	readwrite: true,
	strict: false,
});

const createTable = db.query(`
      DROP TABLE IF EXISTS user_coordinates;
      CREATE TABLE IF NOT EXISTS user_coordinates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
`);

const insert = db.query(
	'INSERT INTO user_coordinates (user_id, latitude, longitude) VALUES (?, ?, ?)'
);

const rooms = new Map<string, ServerWebSocket>();

const server = serve<any, {}>({
	port: env.PORT ?? 8080,
	fetch(req, server) {
		console.log(req);
		const success = server.upgrade(req);
		if (success) {
			// Bun automatically returns a 101 Switching Protocols
			// if the upgrade succeeds
			return undefined;
		}

		// handle HTTP request normally
		return new Response('Hello world!');
	},

	websocket: {
		// Send ping frames to keep connection alive
		sendPings: true,
		// this is called when a message is received
		async message(ws, data) {
			try {
				const { event, ...props } = JSON.parse(data.toString());
				console.log(props);

				if (!event) throw new Error(`Invalid event | event passe => ${event}`);

				switch (event) {
					case 'join':
						createTable.run();
						rooms.set(props.room ?? randomUUIDv7(), ws);
						break;
					case 'move':
						const [roomId, socket] = rooms.entries().next().value;
						socket.send(
							JSON.stringify({
								event: 'move',
								...props,
							})
						);

						if (env.TO_STORE_COORDINATES) {
							insert.run(
								props.user_id ?? roomId,
								props.latitude,
								props.longitude
							);
							await saveCoordinate(props);
						}

						break;
				}
			} catch (error) {
				console.error(error);
			}
		},
	},
});

console.log(`Listening on ${server.hostname}:${server.port}`);
console.log(`Bun WebSocket server running on ws://localhost:${env.PORT ?? 8080}`);
