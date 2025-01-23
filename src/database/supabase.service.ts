import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_KEY ?? '',
    );
  }

  onModuleInit() {
    console.log('Supabase Client Connected');
  }

  // Example: Get User Balance
  async getUserBalance(userId: string) {
    const { data, error } = await this.supabase
      .from('user_balances')
      .select('coins')
      .eq('userId', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Example: Transfer Coins
  async transferCoins(fromUserId: string, toUserId: string, amount: number) {
    const { data: sender } = await this.supabase
      .from('user_balances')
      .select('coins')
      .eq('userId', fromUserId)
      .single();

    if (!sender || sender.coins < amount) {
      throw new Error('Insufficient balance');
    }

    const { error: deductError } = await this.supabase
      .from('user_balances')
      .update({ coins: sender.coins - amount })
      .eq('userId', fromUserId);

    if (deductError) throw deductError;

    const { data: receiver } = await this.supabase
      .from('user_balances')
      .select('coins')
      .eq('userId', toUserId)
      .single();

    const { error: addError } = await this.supabase
      .from('user_balances')
      .update({ coins: receiver?.coins + amount })
      .eq('userId', toUserId);

    if (addError) throw addError;

    return { message: 'Transfer successful' };
  }
}
