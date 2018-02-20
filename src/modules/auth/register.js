import config from '../../../../config';
import db from '../../../core/db';
import { hash } from 'bcrypt';
import Promise from 'bluebird';

const bcryptHash = Promise.promisify(hash);

export default (req, res, next) => {
  const { email, password } = req.body;

  return bcryptHash(password, config.jwt.secret, 12)
    .then(hashedPassword =>
      db.one('INSERT INTO postgres_user(email, password) values($1, $2, $3) RETURNING id', [
        email,
        hashedPassword,
      ]),
    )
    .then(() => res.status(200).json({ message: 'Registration successful!', success: true }))
    .catch(error => {
      res.status(400).json({
        success: false,
        message: 'That email address is already associated with an account',
      });

      return next(error);
    });
};
