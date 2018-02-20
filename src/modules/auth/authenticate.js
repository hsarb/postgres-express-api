// @flow
import { compare } from 'bcrypt';
import config from '../../../config';
import db from '../../db';
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';

const bcryptCompare = Promise.promisify(compare);

const comparePasswords = (password, hash) =>
  bcryptCompare(password, hash)
    .then(match => match)
    .catch(error => {
      throw error;
    });

const generateJwt = id => jwt.sign({ id }, config.jwt.secret, { expiresIn: '1h' });

export default (req: Object, res: any, next: any) => {
  const { email, password } = req.body;
  let userInfo = null;
  let passwordMatch = null;

  return db
    .one('SELECT id, password FROM postgres_user WHERE email=$1', [email])
    .then(user => {
      userInfo = user;

      return comparePasswords(password, user.password);
    })
    .then(match => {
      passwordMatch = match;
    })
    .delay(750)
    .then(() => {
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Email or password is incorrect', success: false });
      }

      const { id } = userInfo || {};

      return res.status(200).json({
        message: 'Authentication successful',
        success: true,
        token: `JWT ${generateJwt(id)}`,
      });
    })
    .catch(error => {
      res.status(400).json({ success: false, message: 'Email or password is incorrect' });

      return next(error);
    });
};
