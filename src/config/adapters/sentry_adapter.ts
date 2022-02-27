import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import { BaseErrorMonitoringAdapter } from './base_error_monitoring_adapter';
const { SENTRY_DSN, RELEASE_VERSION } = process.env;

export class SentryMonitoringAdapter extends BaseErrorMonitoringAdapter {
    initialize() {
        Sentry.init({
            dsn: SENTRY_DSN,
            tracesSampleRate: 1.0,
            integrations: [
                new RewriteFrames({
                    root: global.__dirname
                })
            ],
            release: 'x-bot@' + RELEASE_VERSION
        });
    }

    requestHandler() {
        return Sentry.Handlers.requestHandler();
    }

    errorHandler() {
        return Sentry.Handlers.errorHandler();
    }
}
