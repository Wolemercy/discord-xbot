require('dotenv').config(); // imports the .env file to process.env
import Bree from 'bree';
import path from 'path';
Bree.extend(require('@breejs/ts-worker'));

const { TS_NODE } = process.env;
const extention = TS_NODE ? (TS_NODE === 'true' ? 'ts' : 'js') : 'js';
const bree = new Bree({
    root: path.join(__dirname, 'jobs'),
    defaultExtension: extention,
    jobs: [
        // 'job',
        {
            name: 'notifier',
            // timeout: '1s',
            // interval: 'every 30 seconds'
            interval: 'every day at 15:42'
        }
    ],
    acceptedExtensions: ['.ts', '.js']
});

bree.start();
// export default bree;
