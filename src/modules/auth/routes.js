import authenticate from './authenticate';
import register from './register';

const routes = app => {
  app.post('/auth/login', authenticate);
  app.post('/auth/register', register);
};

export default routes;
