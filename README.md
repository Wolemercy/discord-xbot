# discord-xbot

A Discord Bot

## Installation instructions

-   Run `npm i` to install all required packages

## How to run

-   Ensure you have the necessary env variables defined. An env template file has been provided.
-   Run `docker-compose up -d` to start your database
-   Run `npx prisma migrate dev --name "init" --preview-feature` to migrate all changes to the database
-   Run `npx prisma db seed` to seed the databae
-   Run `npm run dev` to start the development server
-   Happy hacking!.
