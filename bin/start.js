// @flow
/* eslint-disable no-console */
import bodyParser from 'body-parser';
import chalk from 'chalk';
import config from '../config';
import cors from 'cors';
import events from '../src/events';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import server from '../src/server';
import socket from 'socket.io';

const app = express();

app.use(cors());

console.log(chalk.yellow('[postgres-express-api] Initializing server...'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const httpServer = http.createServer(app);
const io = socket(httpServer);

events(io);
server(app, io);

httpServer.listen(config.port, error => {
  if (error) return console.error(chalk.red(error));

  return console.log(
    chalk.green(`[postgres-express-api] API Listening at http://${config.host}:${config.port}`),
  );
});
/* eslint-enable no-console */
