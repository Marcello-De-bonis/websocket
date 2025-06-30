// src/index.ts
import http from 'http';
import { join } from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { env } from 'process';

import { Server } from 'socket.io';
import { Database } from 'sqlite3';
import { dbPath, initTables, querys } from '@/lib/db';

dotenv.config({ path: join(process.cwd(), __dirname + '/../.env.local') });

console.log('process.env.NODE_ENV', process.env);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*', // setta origin con criterio in prod
	},
});

const db = initTables(new Database(dbPath));

const addMatch = db.prepare(querys.add_match),
	addPlayer = db.prepare(querys.add_player);

io.on('connection', socket => {
	console.log('Socket connected:', socket.id);

	socket.on('join', (room: string) => {
		socket.join(room);
		console.log(`Socket ${socket.id} joined room ${room}`);
	});

	socket.on(
		'move',
		async (payload: {
			room: string;
			user_id: string;
			latitude: number;
			longitude: number;
		}) => {
			const { room, user_id, latitude, longitude } = payload;

			// Broadcast agli altri client nella stessa room
			socket.to(room).emit('move', {
				user_id,
				latitude,
				longitude,
			});

			// Salva su DB se richiesto
			// @ts-ignore
			if (process.env.TO_STORE_COORDINATES === 1) {
				db.run(
					'INSERT INTO user_coordinates (user_id, latitude, longitude) VALUES (?, ?, ?)',
					user_id,
					latitude,
					longitude
				);

				// Placeholder: chiama handler esterno
				// await saveCoordinate(payload);
			}
		}
	);
});

const PORT = env.PORT ?? 8080;
server.listen(PORT, () => {
	console.log(`Socket.IO server running at http://localhost:${PORT}`);
});
