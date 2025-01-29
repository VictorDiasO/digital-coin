import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CoinsService } from './coins.service';
import {
  TransferCoinsDto,
  RewardCoinsDto,
  ListMarketItemDto,
  PurchaseItemDto,
} from './dto';
@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Get('balance/:userId')
  async getBalance(@Param('userId') userId: string) {
    return this.coinsService.getBalance(userId);
  }

  @Post('transfer')
  async transferCoins(@Body() dto: TransferCoinsDto) {
    return this.coinsService.transferCoins(dto);
  }

  @Post('reward')
  async rewardCoins(@Body() dto: RewardCoinsDto) {
    return this.coinsService.rewardCoins(dto);
  }

  @Get('transactions/:userId')
  async getTransactions(@Param('userId') userId: string) {
    return this.coinsService.getTransactions(userId);
  }

  @Post('market/list')
  async listMarketItem(@Body() dto: ListMarketItemDto) {
    // Implementation for listing items
  }

  @Post('market/purchase/:marketItemId')
  async purchaseItem(
    @Param('marketItemId') marketItemId: string,
    @Body() dto: PurchaseItemDto,
  ) {
    return this.coinsService.purchaseItem(marketItemId, dto);
  }

  @Get('inventory/:userId')
  async getInventory(@Param('userId') userId: string) {
    return this.coinsService.getInventory(userId);
  }
}
