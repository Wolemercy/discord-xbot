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
    To do this, run `npx ts-node deploy-commands.ts`. This will register the new command in the
    discord server.
-   Happy hacking!.

## Important links

-   [Redis client](https://tedis.silkjs.org/api/)
-   [Prisma Docs](https://www.prisma.io/docs/)
