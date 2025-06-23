import 'module-alias/register';
import _ from './types/global';

import {spawn} from 'child_process';
import { env, runtime } from '@/lib/utils';

if(env.MODE === 'prod') {
    spawn(`bun build ./src/server/socket.bun.ts --target=bun  --minify --sourcemap --outdir dist`, { stdio: 'inherit' }); 
} else {
   const { default: server } = require(`./src/server/socket.${runtime}.ts`);

   server();
}


