import 'module-alias/register';
import _ from './types/global';

import { join } from 'path';
import { spawnSync } from 'child_process';
import { env, runtime } from '@/lib/utils';
import { rmdir, mkdir, rename, copyFile } from 'fs/promises';

const root = import.meta.dir;
const start = async () => await import(join(root, `/src/server/socket.${runtime}.ts`));

const build = async () => {
	const entry = join(root, `/src/server/socket.${runtime}.ts`),
		outdir = join(root, './dist'),
		filename = entry.split('\\').pop()!.replace('.ts', '.js');

	console.log(entry, outdir);

	await rmdir(outdir, { recursive: true });
	await mkdir(outdir, { recursive: true });
	await copyFile(join(root, '/package.json'), join(outdir, '/package.json'));
	await copyFile(join(root, '/tsconfig.json'), join(outdir, '/tsconfig.json'));

	spawnSync(
		'bun',
		[
			'build',
			`"${entry}"`,
			'--target=bun',
			'--minify',
			'--sourcemap',
			`--outdir "${outdir}"`,
		],
		{ stdio: 'inherit', shell: true, env }
	);

	await rename(join(outdir, filename), join(outdir, 'index.js'));
	await rename(join(outdir, filename + '.map'), join(outdir, 'index.js.map'));

	const { signal, abort } = new AbortController();
	spawnSync('bun install', [`&& bun run "${outdir}\\index.js"`], {
		cwd: outdir,
		stdio: 'inherit',
		shell: true,
		signal,
		env,
	});
};

switch (env.MODE) {
	case 'prod':
		build();
		break;
	default:
		start();
}
