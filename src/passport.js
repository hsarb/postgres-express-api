import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../../config';
import db from './db';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.jwt.secret,
};

export default passport =>
  passport.use(
    new Strategy(options, (payload, done) => {
      db
        .one('SELECT id from postgres_user where id=$1', [payload.id])
        .then(user => {
          if (user) return done(null, user);

          return done(null, false);
        })
        .catch(error => done(error, false));
    }),
  );
