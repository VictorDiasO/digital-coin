import {
  pgTable,
  serial,
  uuid,
  integer,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

// 🏦 Coin Supply Table (Defines Total Coin Supply in the System)
export const coinSupply = pgTable('coin_supply', {
  id: serial('id').primaryKey(),
  totalSupply: integer('total_supply').notNull().default(1_000_000),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 👤 Users Table (Holds User Information)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 💰 User Balances Table (Stores Coin Amounts Separately)
export const userBalances = pgTable('user_balances', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  coins: integer('coins').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 🔄 Transactions Table (Tracks All Coin Movements)
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  fromUserId: uuid('from_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  toUserId: uuid('to_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  type: text('type').notNull(), // "transfer", "reward", "market_purchase"
  createdAt: timestamp('created_at').defaultNow(),
});

// 🛍️ Items Table (Stores Available Items in the System)
export const items = pgTable('items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'), // Example: "UI Pack", "Vibration Pattern"
  createdAt: timestamp('created_at').defaultNow(),
});

// 🎒 User Inventory Table (Stores Items Owned by Users)
export const userInventory = pgTable('user_inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  itemId: uuid('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1), // How many of this item the user owns
  acquiredAt: timestamp('acquired_at').defaultNow(),
});

// 🏪 Marketplace Items (Users Selling Items)
export const marketItems = pgTable('market_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  sellerId: uuid('seller_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  itemId: uuid('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),
  price: integer('price').notNull(), // Price in coins
  isDynamicPricing: boolean('is_dynamic_pricing').notNull().default(false), // True = Price changes
  stockLimit: integer('stock_limit'), // Null = Unlimited stock
  createdAt: timestamp('created_at').defaultNow(),
});

// 📊 Market Sales Table (Tracks Sales)
export const marketSales = pgTable('market_sales', {
  id: uuid('id').defaultRandom().primaryKey(),
  buyerId: uuid('buyer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sellerId: uuid('seller_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  itemId: uuid('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),
  pricePaid: integer('price_paid').notNull(),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow(),
});
