// @flow
/* eslint-disable no-console */
import auth from './modules/auth/routes';
import chalk from 'chalk';
import express from 'express';
import jwtStrategy from './passport';
import passport from 'passport';

export default (app: any, io: any) => {
  const router = express.Router();

  router.get('/', (req, res) => res.send('Postgres Express Api'));

  console.log(chalk.blue('[postgres-express-api] Initializing passport...'));

  app.use(passport.initialize());
  app.use(passport.session());

  jwtStrategy(passport);

  console.log(chalk.blue('[postgres-express-api] Initializing auth routes...'));

  auth(router, passport, io);

  app.use('/', router);
};
/* eslint-enable no-console */
