import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection, getConnectionOptions } from 'typeorm';
import { getUser } from './utils';

dotenv.config();

const main = async () => {
  const connectionOptions = await getConnectionOptions();

  Object.assign(connectionOptions, {
    entities: [path.join(__dirname, '/entities/*.{ts,js}')],
  });

  await createConnection(connectionOptions);

  const app = express();

  app.use(graphqlUploadExpress());

  const httpServer = createServer(app);

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, '/modules/**/*.resolver.{ts,js}')],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req, res }) => {
      const user = await getUser(req);

      return { req, res, user };
    },
  });

  await server.start();

  server.applyMiddleware({ app });

  httpServer.listen(3000, () => {
    console.log('Listening at http://localhost:3000/graphql');
  });
};

main().catch((err) => console.error(err));
