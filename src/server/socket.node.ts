// src/index.ts
import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import { Database } from 'sqlite3';
import { Server } from 'socket.io';
import { env } from 'process';

dotenv.config({ path: __dirname + '/../.env.local' });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*', // setta origin con criterio in prod
	},
});

const db = new Database('./src/db/coordinates.sqlite');

db.run(`
    DROP TABLE IF EXISTS user_coordinates;
    CREATE TABLE IF NOT EXISTS user_coordinates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

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
			if (process.env.TO_STORE_COORDINATES === 'true') {
				await db.run(
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
