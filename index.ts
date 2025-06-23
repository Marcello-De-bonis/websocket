import 'module-alias/register';
import _ from './types/global';

import { env, runtime } from '@/lib/utils';

const { default: server } = require(`./src/server/socket.${runtime}.ts`);

server.listen(env.PORT ?? 8080, () => console.log(`Server running on port ${env.PORT}`));
