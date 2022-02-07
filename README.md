# discord-xbot

A Discord Bot

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
-   Happy hacking!.

## Important links

-   [Redis client](https://tedis.silkjs.org/api/)
-   [Prisma Docs](https://www.prisma.io/docs/)

## Todos

-   CONSIDER MAKING THIS AN ENVIRONMENT VARIABLE in matchAdd (Temi)(done)
-   Check this and what should be done if the error is not trusted. in error.ts (Temi)
-   THIS FIELD SHOULD BE ACCESSED FROM THE MATCH RESPONSE in index.controller of bot (Temi)(done)
-   ADD MATCHCHANNEL TO MATCH TABLE in notifier.ts (Temi)(done)
-   CHANGE serverId to dGuildId on Match table in notifier.ts (Temi)(done)
-   Only retrieve matches that have status Active. We can create another job that polls to check if
    any nextMatchDate is in the past when status is not paused. This tells us that the worker failed
    to work properly in notifier.ts (Temi)
-   COMMENT THIS OUT TO START SCHEDULER in app.ts (Temi)
-   Deploy Lambda function and grant it internet access. (Wole)
-   Fix Lambda commented code in notifier file (Wole)

-   Make final db schema changes (Temi)(done)
-   Setup deployment environment (done)
-   Test the application (All)
-   Add all environment variables to config vars in heroku (Wole)
-   Delete pool from cache after matching (Wole)
