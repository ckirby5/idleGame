import type { Client as PgClient } from 'pg';
const { Client } = require('pg');

const client: PgClient = new Client({
  host: 'localhost',
  port: 5432,
  database: 'idlegame_db',
  user: 'idlegame',
  password: 'password123',
});

client.connect()
  .then(() => {
    console.log('✅ Database connected!');
    return client.query('SELECT NOW()');
  })
  .then(result => {
    console.log('Current time from DB:', result.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('❌ Connection error:', err);
  });