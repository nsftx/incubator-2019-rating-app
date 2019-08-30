# incubator-2019-rating-app

Rating application is a simple application that is used for simple rating of experience inside certain facility. It is usually used at exits on airports, restaurants, banks, etc.

# Project setup

### Prerequisites

For this project you will need to install Node.js. Follow the link below on how to download and install using the installer package available from the Node.js web site [Installing Node.js®](https://nodejs.org/en/download/package-manager/)

ORM used on this project is Sequelize. To install sequelize run following command:

```
npm install --save sequelize
```

### Installing

You should have some familiarity with command line instructions to run this application.

After downloading ZIP file, extract content to desired folder. Within that folder open command line and type:

```
npm install
```

This command installs a package, and any packages that it depends on.

### Setting up database

First step is to create `.env` file and configure settings using `.env.example` as guide.

After setting up `.env` file open console and run:

```
node config/db.js
```

This command creates 2 databases. One is used in development environment and other is used for testing environment.

When databases have been created, next step is to run migrations to add tables to databases. Run following two commands to run migrations:

    sequelize db:migrate
    sequelize db:migrate --env test

If you need to populate your database with some data run following commands:

    sequelize db:seed:all
    sequelize db:seed:all --env test
