import { execSync } from 'child_process';

export const detectRuntime = (): Runtime => {
	const { argv } = process;

	try {
		// 1. Tentativo di eseguire il comando "bun"
		execSync('bun --version');
		if (!argv.some(arg => arg.includes('--runtime=node'))) return 'bun';
	} catch (error) {}

	// 2. Se fallisce, tentativo di eseguire il comando "node"
	try {
		execSync('node --version');
		if (!argv.some(arg => arg.includes('--runtime=bun'))) return 'node';
	} catch (error) {}

	if (argv.some(arg => arg.includes('--runtime=bun'))) return 'bun';
	if (argv.some(arg => arg.includes('--runtime=node'))) return 'node';

	// 3. Se entrambi falliscono, restituisce null
	return null;
};

export const { env } = process;
export const runtime = detectRuntime() ?? 'node';

type Runtime = 'node' | 'bun' | null;
