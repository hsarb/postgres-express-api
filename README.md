## Postgress Express Boilerplate

Simple starter kit for a Postgres / Express API. This starter kit features a simple authentication system using JWT, and integration with Socket.io

### Technologies Used

* Postgres
* pg-promise
* Express
* Passport
* Bluebird
* Bcrypt
* Socket.io

### Getting started

Make sure you have [Node](https://nodejs.org/en/) (8.9.4), [Yarn](https://yarnpkg.com/en/) and [Postgres](https://www.postgresql.org/) installed before attempting the following steps.

1. Clone the repo

```
  $ git clone git@github.com:hsarb/postgres-express-boilerplate.git yourAppName
  $ cd yourAppName
```

2. Install dependencies

```
  $ make install
```

3. Profit


### Starting the sever

```
  make start
```

### Linting

We follow the [Airbnb](https://github.com/airbnb/javascript) styleguide for javascript.

```
$ yarn lint
```

### Flow

We leverage [Flow](https://flow.org/) for type checking our javascript code. This is ran as a process when you commit. If flow fails, your commit will fail. Same goes for linting. If you need to add a third party library that was not written using flow, make sure you check to see if an interface is available using [flow-typed](https://github.com/flowtype/flow-typed).

```
  $ yarn flow
```

### Using the boilerplate

Logic is separated into modules. These modules should be responsibile for establishing routes, schema and route handlers.

```
.
└── Module             # Module Folder
    ├── schema.sql     # Module schema
    ├── ...handlers.js # Module Route handler
    └── routes.js      # Module Routes
```
