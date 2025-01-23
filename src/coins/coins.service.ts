import { Injectable } from '@nestjs/common';
import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { SupabaseService } from 'src/database/supabase.service';

@Injectable()
export class CoinsService {
  constructor(private readonly supabase: SupabaseService) {}

  create(createCoinDto: CreateCoinDto) {
    return 'This action adds a new coin';
  }

  findAll() {
    return `This action returns all coins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coin`;
  }

  update(id: number, updateCoinDto: UpdateCoinDto) {
    return `This action updates a #${id} coin`;
  }

  remove(id: number) {
    return `This action removes a #${id} coin`;
  }
}
