import path from 'path';
import { createConnection, getConnectionOptions } from 'typeorm';

const getConnection = async () => {
  const connectionOptions = await getConnectionOptions();

  Object.assign(connectionOptions, {
    entities: [path.join(__dirname, '/entities/*.{ts,js}')],
  });

  return createConnection(connectionOptions);
};

export default getConnection;
