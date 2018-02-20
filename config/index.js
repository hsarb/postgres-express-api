export default {
  db: {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
  },
  port: process.env.PORT || '8080',
  host: process.env.HOST || 'localhost',
  jwt: {
    secret: 'thisisverysecret', // you should change this
  },
};
