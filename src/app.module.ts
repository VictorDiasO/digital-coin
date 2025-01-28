import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CoinsModule } from './coins/coins.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './database/supabase.service';

@Module({
  imports: [
    DatabaseModule,
    CoinsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
  exports: [SupabaseService],
})
export class AppModule {}
