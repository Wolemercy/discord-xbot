require('dotenv').config(); // imports the .env file to process.env
import Bree from 'bree';
import path from 'path';
Bree.extend(require('@breejs/ts-worker'));

const { TS_NODE } = process.env;
const extention = TS_NODE ? (TS_NODE === 'true' ? 'ts' : 'js') : 'js';
console.log('----------Bree just started up');
const bree = new Bree({
    root: path.join(__dirname, 'jobs'),
    defaultExtension: extention,
    jobs: [
        // 'job',
        {
            name: 'notifier',
            // timeout: '1s',
            // interval: 'every 30 seconds'
            interval: 'every day at 17:01 and 18:03'
        }
    ],
    acceptedExtensions: ['.ts', '.js']
});

bree.start();
// export default bree;
