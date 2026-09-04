// Charger les variables d'environnement AVANT tout import
import dotenv from "dotenv";
dotenv.config({ path: '.env' });

import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'child_process';

async function startDevServer() {
  console.log('Starting MongoDB Memory Server...');
  
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'markethub'
    }
  });

  const uri = mongod.getUri();
  console.log('MongoDB Memory Server running at:', uri);
  
  // Override the MONGODB_URI environment variable
  process.env.MONGODB_URI = uri.replace('/markethub', '/markethub');
  
  console.log('Starting backend server...');
  const server = spawn('node', ['src/index.js'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: { ...process.env, MONGODB_URI: process.env.MONGODB_URI }
  });

  server.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

  // Cleanup on exit
  process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    server.kill();
    await mongod.stop();
    process.exit(0);
  });
}

startDevServer().catch(err => {
  console.error('Error starting dev server:', err);
  process.exit(1);
});
