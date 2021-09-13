import { AuthenticationError } from 'apollo-server-errors';
import { createMethodDecorator } from 'type-graphql';
import { Context } from '../types';

function Auth() {
  return createMethodDecorator<Context>(async ({ context }, next) => {
    if (!context.user) throw new AuthenticationError('you must be logged in');
    return next();
  });
}

export default Auth;
