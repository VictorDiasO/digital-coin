import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Module({
  exports: [SupabaseService],
  // controllers: [DatabaseController],
  providers: [SupabaseService],
})
export class DatabaseModule {}
