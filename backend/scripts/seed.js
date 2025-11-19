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
