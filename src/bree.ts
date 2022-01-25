import Bree from 'bree';
import path from 'path';
Bree.extend(require('@breejs/ts-worker'));
const bree = new Bree({
    root: path.join(__dirname, 'jobs'),
    defaultExtension: process.env.TS_NODE ? 'ts' : 'js',
    jobs: [
        'job',
        {
            name: 'notifier',
            interval: '5s'
        }
    ],
    acceptedExtensions: ['.ts', '.js']
});

export default bree;
