import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CoinsModule } from './coins/coins.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, CoinsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
