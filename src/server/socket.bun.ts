import { Database } from 'bun:sqlite';
import { env, serve, randomUUIDv7 } from 'bun';
import { dbPath, initTables, querys } from '@/lib/db';
import saveCoordinate from '@/shared/handlers/save-coordinate';

import type { ServerWebSocket } from 'bun';

const PORT = env.PORT ?? 8080;
const rooms = new Map<string, ServerWebSocket>();

const db = initTables(
	new Database(dbPath, {
		create: true,
		readwrite: true,
		strict: false,
	})
);

const addMatch = db.prepare(querys.add_match),
	addPlayer = db.prepare(querys.add_player);

const server = serve<any, {}>({
	port: PORT,
	fetch(req, server) {
		if (server.upgrade(req)) return;

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
				if (!event) throw new Error(`Invalid event | event passed => ${event}`);

				switch (event) {
					case 'init_room':
						rooms.set(props.room ?? randomUUIDv7(), ws);
						break;

					case 'join_room':
						rooms.set(props.room ?? randomUUIDv7(), ws);
						addPlayer.run(props.user_id, props.latitude, props.longitude);

						break;
					case 'move':
						const [roomId, socket] =
							props.room && rooms.has(props.room)
								? [props.room, rooms.get(props.room)!]
								: rooms.entries().next().value!;

						socket.send(
							JSON.stringify({
								event: 'move',
								...props,
							})
						);

						if (env.TO_STORE_COORDINATES) {
							addMatch.run(
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

console.log(`Bun WebSocket server running on ws://${server.hostname}:${server.port}`);
