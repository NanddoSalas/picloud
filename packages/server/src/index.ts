import dotenv from 'dotenv';
import 'reflect-metadata';
import apolloServer from './apolloServer';
import app from './app';
import getConnection from './getConnection';
import httpServer from './httpServer';

dotenv.config();

const main = async () => {
  await getConnection();

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  httpServer.listen(process.env.PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`Listening at http://localhost:${process.env.PORT}/graphql`);
    }
  });
};

main();
