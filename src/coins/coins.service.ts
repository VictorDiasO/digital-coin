import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import * as schema from '../database/schema';
import { and, eq, gte } from 'drizzle-orm';
import { PurchaseItemDto, RewardCoinsDto, TransferCoinsDto } from './dto';

@Injectable()
export class CoinsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getBalance(userId: string) {
    const db = this.supabase.getClient();
    console.log(userId);
    const [balance] = await db
      .select()
      .from(schema.userBalances)
      .where(eq(schema.userBalances.userId, userId));
    return balance?.coins || 0;
  }

  async transferCoins(dto: TransferCoinsDto) {
    const db = this.supabase.getClient();
    return db.transaction(async (tx) => {
      // Check sender balance
      const [sender] = await tx
        .select()
        .from(schema.userBalances)
        .where(eq(schema.userBalances.userId, dto.fromUserId));

      if (!sender || sender.coins < dto.amount) {
        throw new Error('Insufficient funds');
      }

      // Update balances
      await tx
        .update(schema.userBalances)
        .set({ coins: sender.coins - dto.amount })
        .where(eq(schema.userBalances.userId, dto.fromUserId));

      await tx
        .update(schema.userBalances)
        .set({ coins: () => `coins + ${dto.amount}` })
        .where(eq(schema.userBalances.userId, dto.toUserId));

      // Create transaction
      await tx.insert(schema.transactions).values({
        fromUserId: dto.fromUserId,
        toUserId: dto.toUserId,
        amount: dto.amount,
        type: 'transfer',
      });

      return { success: true };
    });
  }

  async rewardCoins(dto: RewardCoinsDto) {
    const db = this.supabase.getClient();
    return db.transaction(async (tx) => {
      // Update balance
      await tx
        .update(schema.userBalances)
        .set({ coins: () => `coins + ${dto.amount}` })
        .where(eq(schema.userBalances.userId, dto.userId));

      // Create transaction
      await tx.insert(schema.transactions).values({
        toUserId: dto.userId,
        amount: dto.amount,
        type: 'reward',
      });

      return { success: true };
    });
  }

  async purchaseItem(marketItemId: string, dto: PurchaseItemDto) {
    const db = this.supabase.getClient();
    return db.transaction(async (tx) => {
      // Get market item
      const [item] = await tx
        .select()
        .from(schema.marketItems)
        .where(eq(schema.marketItems.id, marketItemId));

      if (!item) throw new Error('Item not found');
      if (item.stockLimit !== null && item.stockLimit < dto.quantity) {
        throw new Error('Insufficient stock');
      }

      // Check buyer balance
      const totalPrice = item.price * dto.quantity;
      const [buyer] = await tx
        .select()
        .from(schema.userBalances)
        .where(eq(schema.userBalances.userId, dto.buyerId));

      if (!buyer || buyer.coins < totalPrice) {
        throw new Error('Insufficient funds');
      }

      // Update balances
      await tx
        .update(schema.userBalances)
        .set({ coins: buyer.coins - totalPrice })
        .where(eq(schema.userBalances.userId, dto.buyerId));

      await tx
        .update(schema.userBalances)
        .set({ coins: () => `coins + ${totalPrice}` })
        .where(eq(schema.userBalances.userId, item.sellerId));

      // Update inventory
      await tx.insert(schema.userInventory).values({
        userId: dto.buyerId,
        itemId: item.itemId,
        quantity: dto.quantity,
      });

      // Record sale
      await tx.insert(schema.marketSales).values({
        buyerId: dto.buyerId,
        sellerId: item.sellerId,
        itemId: item.itemId,
        pricePaid: totalPrice,
        quantity: dto.quantity,
      });

      // Update stock
      if (item.stockLimit !== null) {
        const newStock = item.stockLimit - dto.quantity;
        if (newStock <= 0) {
          await tx
            .delete(schema.marketItems)
            .where(eq(schema.marketItems.id, marketItemId));
        } else {
          await tx
            .update(schema.marketItems)
            .set({ stockLimit: newStock })
            .where(eq(schema.marketItems.id, marketItemId));
        }
      }

      return { success: true };
    });
  }
}
