import { IsUUID, IsPositive, IsNumber } from 'class-validator';

class ListMarketItemDto {
  sellerId: string;
  itemId: string;
  price: number;
  stockLimit?: number;
}

class PurchaseItemDto {
  buyerId: string;
  quantity: number;
}

class RewardCoinsDto {
  userId: string;
  amount: number;
}

class TransferCoinsDto {
  @IsUUID()
  fromUserId: string;

  @IsUUID()
  toUserId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}

export { ListMarketItemDto, PurchaseItemDto, RewardCoinsDto, TransferCoinsDto };
