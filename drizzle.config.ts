import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  extensionsFilters: ['postgis'],
  dbCredentials: {
    url:
      process.env.DIRECT_DATABASE_URL ||
      process.env.DATABASE_URL ||
      'postgresql://atlas:atlas_polar_dev_2026@localhost:5432/antarctica_atlas'
  }
});
