import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
// import * as postgres from 'postgres'; // Changed import syntax
const postgres = require('postgres'); // Changed import syntax
import * as schema from './schema';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabaseClient;
  private drizzleClient;
  private connectionString: string;

  constructor(private configService: ConfigService) {
    this.connectionString =
      this.configService.get<string>('SUPABASE_DB_URL') ?? '';
  }

  async onModuleInit() {
    await this.initializeClients();
    await this.runMigrations();
  }

  private async initializeClients() {
    try {
      // Initialize Supabase client
      this.supabaseClient = createClient(
        this.configService.get<string>('SUPABASE_URL') ?? '',
        this.configService.get<string>('SUPABASE_KEY') ?? '',
      );
      console.log(
        'Supabase client initialized::: ',
        this.configService.get<string>('SUPABASE_URL'),
      );
      console.log(
        'Supabase client initialized::: ',
        this.configService.get<string>('SUPABASE_KEY'),
      );

      // Initialize Drizzle ORM client with correct postgres syntax
      const queryClient = postgres(this.connectionString);
      this.drizzleClient = drizzle(queryClient, { schema });
    } catch (error) {
      console.error('Error initializing database clients:', error);
      throw error;
    }
  }

  private async runMigrations() {
    try {
      // const migrationClient = postgres(this.connectionString, { max: 1 });
      // await migrate(drizzle(migrationClient), {
      //   migrationsFolder: './supabase/migrations',
      // });
      // await migrationClient.end();
    } catch (error) {
      console.error('Error running migrations:', error);
      throw error;
    }
  }

  getClient() {
    return this.drizzleClient;
  }

  getSupabase() {
    return this.supabaseClient;
  }

  // Example of a Supabase storage operation
  async uploadFile(bucketName: string, filePath: string, file: Buffer) {
    const { data, error } = await this.supabaseClient.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) throw error;
    return data;
  }

  // Example of a Supabase auth operation
  async getUserById(userId: string) {
    const { data, error } =
      await this.supabaseClient.auth.admin.getUserById(userId);
    if (error) throw error;
    return data.user;
  }
}
