import {
  pgTable,
  text,
  timestamp,
  boolean,
  decimal,
  integer,
  foreignKey,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

// Better Auth tables (do not modify)
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expiresAt').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    userId: text('userId').notNull(),
  },
  (table) => ({
    userIdIdx: foreignKey({ columns: [table.userId], foreignColumns: [user.id] }).onDelete(
      'cascade'
    ),
  })
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    userId: text('userId').notNull(),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refreshToken: text('refreshToken'),
    accessToken: text('accessToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
    idToken: text('idToken'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: foreignKey({ columns: [table.userId], foreignColumns: [user.id] }).onDelete(
      'cascade'
    ),
    providerIdx: uniqueIndex('account_provider_idx').on(table.provider, table.providerAccountId),
  })
)

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// App tables
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  category: text('category'),
  sizes: text('sizes').array().default([]),
  colors: text('colors').array().default([]),
  stock: integer('stock').default(0),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const adminUsers = pgTable(
  'admin_users',
  {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().unique(),
    role: text('role').default('admin'),
    permissions: text('permissions').array().default([]),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: foreignKey({ columns: [table.userId], foreignColumns: [user.id] }).onDelete(
      'cascade'
    ),
  })
)

export const cartItems = pgTable(
  'cart_items',
  {
    id: text('id').primaryKey(),
    userId: text('userId').notNull(),
    productId: text('productId').notNull(),
    quantity: integer('quantity').notNull().default(1),
    size: text('size'),
    color: text('color'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: foreignKey({ columns: [table.userId], foreignColumns: [user.id] }).onDelete(
      'cascade'
    ),
    productIdIdx: foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
    }).onDelete('cascade'),
  })
)

export const orders = pgTable(
  'orders',
  {
    id: text('id').primaryKey(),
    userId: text('userId').notNull(),
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    status: text('status').default('pending'), // pending, paid, processing, shipped, delivered
    paymentMethod: text('payment_method'),
    paymentId: text('payment_id'),
    shippingAddress: text('shipping_address'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: foreignKey({ columns: [table.userId], foreignColumns: [user.id] }).onDelete(
      'cascade'
    ),
  })
)

export const orderItems = pgTable(
  'order_items',
  {
    id: text('id').primaryKey(),
    orderId: text('orderId').notNull(),
    productId: text('productId').notNull(),
    quantity: integer('quantity').notNull(),
    priceAtPurchase: decimal('price_at_purchase', { precision: 10, scale: 2 }).notNull(),
    size: text('size'),
    color: text('color'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => ({
    orderIdIdx: foreignKey({ columns: [table.orderId], foreignColumns: [orders.id] }).onDelete(
      'cascade'
    ),
    productIdIdx: foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
    }).onDelete('cascade'),
  })
)
