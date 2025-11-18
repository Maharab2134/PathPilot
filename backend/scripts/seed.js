#!/usr/bin/env node
/*
 Lightweight runner so you can run the TypeScript seeder with plain Node:
  $ node scripts/seed.js

This uses `ts-node` to register a TypeScript runtime if available. If
dev dependencies (including `ts-node`) are not installed, the script will
print instructions to install or run via `npx`.
*/
try {
  require('ts-node').register({ transpileOnly: true });
  require('./seed.ts');
} catch (err) {
  console.error('Failed to run seed via ts-node.');
  console.error("If you haven't installed dependencies, run:");
  console.error('  cd backend && npm install');
  console.error('Or run directly with npx:');
  console.error('  npx ts-node scripts/seed.ts');
  console.error('\nError details:');
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}
