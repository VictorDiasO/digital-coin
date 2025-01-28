First, run the following command to install the dependencies:

For the .env get your database connection URL from the "connect" button on the top-bar. And use the database that you had created when you was creating the project on supabase.

```bash
npm install
```

Then, generate the Drizzle ORM entities:
```bash
npx drizzle-kit generate
```

Finally, run the migrations:
```bash
npx drizzle-kit migrate
```

Then, run the following command to start the server:

```bash
npm run start:dev
```

Open your browser and navigate to `http://localhost:3000/api/coins`.