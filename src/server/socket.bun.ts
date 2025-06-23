import { join } from "path";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { Database } from "bun:sqlite";
import { env, serve, randomUUIDv7 } from "bun";
import saveCoordinate from "@/shared/handlers/save-coordinate";

import type { ServerWebSocket } from "bun";

const dbPath = join(import.meta.dir, "/../shared/db", "coordinates.sqlite");
if (!existsSync(dbPath))
   await mkdir(dbPath, { recursive: true });

const PORT = env.PORT ?? 8080;
const rooms = new Map<string, ServerWebSocket>();

const db = new Database(dbPath, {
   create: true,
   readwrite: true,
   strict: false,
});

db.run(`
      DROP TABLE IF EXISTS matches;
      CREATE TABLE IF NOT EXISTS matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
`);

db.run(`
	DROP TABLE IF EXISTS players;
	CREATE TABLE IF NOT EXISTS players (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id TEXT NOT NULL,
			latitude REAL NOT NULL,
			longitude REAL NOT NULL,
			timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
`);


const addMatch = db.prepare(`
      INSERT INTO matches (user_id, latitude, longitude)
      VALUES (?, ?, ?)
`);

const addPlayer = db.prepare(`
	INSERT INTO players (user_id, latitude, longitude)
	VALUES (?, ?, ?)
`);

const server = serve<any, {}>({
   port: PORT,
   fetch(req, server) {
      if (server.upgrade(req)) return;

      // handle HTTP request normally
      return new Response("Hello world!");
   },

   websocket: {
      // Send ping frames to keep connection alive
      sendPings: true,
      // this is called when a message is received
      async message(ws, data) {
         try {
            const { event, ...props } = JSON.parse(data.toString());
            if (!event)
               throw new Error(`Invalid event | event passed => ${event}`);

            switch (event) {
					case "init_room":
                  rooms.set( props.room ?? randomUUIDv7(), ws);
                  break;

               case "join_room":
                  rooms.set(props.room ?? randomUUIDv7(), ws);
                  addPlayer.run(props.user_id, props.latitude, props.longitude);

                  break;
               case "move":
                  const [roomId, socket] =
                     props.room && rooms.has(props.room)
                        ? [props.room, rooms.get(props.room)!]
                        : rooms.entries().next().value!;

                  socket.send(
                     JSON.stringify({
                        event: "move",
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

console.log(
   `Bun WebSocket server running on ws://${server.hostname}:${server.port}`
);
export default server;
