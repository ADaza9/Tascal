import { config} from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: 'env.local'}); // Load environment variables from .env file


export default defineConfig({
  out: './drizzle',
  schema: './src/db/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});