import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { SupabaseService } from './supabase.service';

@Module({
  exports: [SupabaseService],
  // controllers: [DatabaseController],
  providers: [SupabaseService],
})
export class DatabaseModule {}
