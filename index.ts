import 'module-alias/register';
import _ from './types/global';

import { join } from 'path';
import { env, runtime } from '@/lib/utils';

const start = () => require(join(__dirname, `/src/socket/${runtime}/index.ts`));

const build = () => {
	const outdir = join(__dirname, './dist');
	require(`./src/socket/${runtime}/build.ts`).default(outdir);
};

switch (env.MODE) {
	case 'prod':
		build();
		break;
	default:
		start();
}
