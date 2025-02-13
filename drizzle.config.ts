import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({
	path: '.env.local'
});

export default defineConfig({
	schema: './lib/db/schema.ts',
	out: './lib/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		// @ts-expect-error -- This is a required environment variable
		url: process.env.POSTGRES_URL!
	}
});
