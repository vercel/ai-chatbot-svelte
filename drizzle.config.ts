import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({
	path: '.env.local'
});

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './src/lib/server/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.POSTGRES_URL!
	}
});
