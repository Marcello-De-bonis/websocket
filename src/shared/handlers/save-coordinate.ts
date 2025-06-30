import { existsSync } from 'fs';
import { writeFile, readFile, mkdir } from 'fs/promises';

export default async (data: any) => {
	const dbPath = __dirname + '/../db/data.json';
	if (!existsSync(dbPath)) await mkdir(dbPath);

	try {
		const prev = JSON.parse(await readFile(dbPath, 'utf-8'));

		if (!Array.isArray(prev)) {
			await writeFile(dbPath, JSON.stringify([data]));
			return [data];
		}

		prev.push(data);
		await writeFile(dbPath, JSON.stringify(prev));
		return prev;
	} catch (error) {}
};
