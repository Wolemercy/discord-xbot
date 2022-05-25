# discord-xbot

A bot built for Discord servers with the goal of solidifying knowledge of authentication,
observability, and bots. A pair matching feature, which matches active members in a Discord server
was implemented using [X-bot Matcher](https://github.com/Wolemercy/xbot-matcher).

## Installation instructions

-   Run `npm i` to install all required packages

## How to run

-   Ensure you have the necessary env variables defined. An env template file has been provided.
-   Run `docker-compose up -d` to start your database
-   Run `npx prisma migrate dev --name "init" --preview-feature` to migrate all changes to the
    database
-   Run `npx prisma db seed` to seed the databae
-   Run `npm run dev` to start the development server
-   If you create a new command in the `command` directory, you'd need to register with discord API/
    To do this, run `npx ts-node ./src/deploy-commands.ts`. This will register the new command in
    the discord server.
-   Happy hacking!

## Important Links

-   [Redis Client](https://tedis.silkjs.org/api/)
-   [Prisma](https://www.prisma.io/docs/)
-   [Sentry](https://docs.sentry.io/platforms/node/)
-   [AWS Lambda](https://aws.amazon.com/lambda/)

### Future Improvements

-   Create command to allow admin to reset match (could be date only or/and historical matches)
-   Create feature to enable setting guild reminders
-   Create feature to enable admins put everyone into a pool at once
-   Create feature to enable computer science trivias
