import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const dbPath = join(
	process.cwd(),
	process.env.MODE === 'prod' ? '/db' : '/../shared/db',
	'/tables.sqlite'
);

console.log('dbPath', dbPath);
if (!existsSync(dbPath)) mkdirSync(dirname(dbPath), { recursive: true });

export const initTables = <T extends DB>(db: T) => {
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

	return db;
};

export const querys = {
	add_match: `
                  INSERT INTO matches (user_id, latitude, longitude)
                  VALUES (?, ?, ?)
            `,
	add_player: `
                  INSERT INTO players (user_id, latitude, longitude)
                  VALUES (?, ?, ?)
            `,
};

interface DB {
	run: (sql: string, ...args: any[]) => any;
}
