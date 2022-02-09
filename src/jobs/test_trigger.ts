import { Lambda } from '@aws-sdk/client-lambda';
import logger from '../config/logger';
import { Utils } from '../config/helpers';

const { GUILD_ID, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_LAMBDA_FUNCTION_NAME } =
    process.env;

async function test_trigger() {
    const nextMatchDate = Utils.formatDate(new Date());
    try {
        const lambdaClient = new Lambda({
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID!,
                secretAccessKey: AWS_SECRET_ACCESS_KEY!
            },
            region: AWS_REGION!
        });

        const invocationConfig = {
            FunctionName: AWS_LAMBDA_FUNCTION_NAME!,
            InvocationType: 'Event',
            Payload: new TextEncoder().encode(JSON.stringify({ guildId: GUILD_ID }))
        };

        const invokationResult = await lambdaClient.invoke(invocationConfig);
        console.log(invokationResult);
        console.log(
            `Successfully invoked lambda function to perform matches for match-date ${nextMatchDate}`
        );
        logger.info(
            `Successfully invoked lambda function to perform matches for match-date ${nextMatchDate}`
        );
    } catch (error) {
        console.log(
            `Failed to invoke lambda function to perform matches for match-date ${nextMatchDate}`,
            error
        );
        // logger.error(
        //     `Failed to invoke lambda function to perform matches for match-date ${nextMatchDate}`,
        //     error
        // );
    }
    // Notify AWS LAMBDA to start matching candidates.
    console.log('I logged where LAMBDA SHOULD BE CALLED');
}

test_trigger();
