require('dotenv').config(); // imports the .env file to process.env
import Bree from 'bree';
import path from 'path';
Bree.extend(require('@breejs/ts-worker'));

const { TS_NODE } = process.env;

const bree = new Bree({
    root: path.join(__dirname, 'jobs'),
    defaultExtension: Boolean(TS_NODE) ? 'ts' : 'js',
    jobs: [
        // 'job',
        {
            name: 'notifier',
            // timeout: '1s',
            interval: 'every 30 seconds'
            // interval: 'every day at 3/ am and 6 am'
        }
    ],
    acceptedExtensions: ['.ts', '.js']
});

bree.start();
// export default bree;
