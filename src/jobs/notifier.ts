import { parentPort } from 'worker_threads';

import { db, cache } from 'src/config/storage';

(async () => {
    // const matches = await db.match.findMany();

    // console.log(matches);

    if (parentPort) parentPort.postMessage('done');
    // eslint-disable-next-line unicorn/no-process-exit
    else process.exit(0);
})();
