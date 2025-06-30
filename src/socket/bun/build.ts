import { env } from 'bun';
import { join } from 'path';
import { existsSync } from 'fs';
import { spawnSync } from 'child_process';
import { rmdir, mkdir, rename, copyFile } from 'fs/promises';

export default async (outdir: string) => {
	const entry = join(__dirname, `/index.ts`),
		filename = entry.split('\\').pop()!.replace('.ts', '.js');

	if (existsSync(outdir)) await rmdir(outdir, { recursive: true });

	await mkdir(outdir, { recursive: true });
	await copyFile(join(__dirname, '/$package.json'), join(outdir, '/package.json'));
	await copyFile(join(__dirname, '/$tsconfig.json'), join(outdir, '/tsconfig.json'));

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
