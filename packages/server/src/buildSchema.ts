import path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

buildSchema({
  resolvers: [path.join(__dirname, '/modules/**/*.resolver.{ts,js}')],
  emitSchemaFile: 'dist/schema.gql',
});
