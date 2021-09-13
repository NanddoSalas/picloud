import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
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
    sincronize: true,
    entities: [path.join(__dirname, '/entity/**/*.{ts,js}')],
  });

  await createConnection();

  const app = express();

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
