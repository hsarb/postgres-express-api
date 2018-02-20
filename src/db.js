// @flow
import bluebird from 'bluebird';
import config from '../config';
import pg from 'pg-promise';

const options = {
  promiseLib: bluebird,
};

export const pgp = pg(options);

const db = pgp(config.db);

export default db;
