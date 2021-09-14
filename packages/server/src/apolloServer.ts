import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import path from 'path';
import { buildSchemaSync } from 'type-graphql';
import httpServer from './httpServer';
import { getUser } from './utils';

const schema = buildSchemaSync({
  resolvers: [path.join(__dirname, '/modules/**/*.resolver.{ts,js}')],
  validate: false,
});

const context = async ({ req, res }: ExpressContext) => {
  const user = await getUser(req);

  return { req, res, user };
};

const apolloServer = new ApolloServer({
  schema,
  context,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

export default apolloServer;
