import { pgTable, foreignKey, unique, text, timestamp, numeric, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const adminUsers = pgTable("admin_users", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	role: text().default('admin'),
	permissions: text().array().default([""]),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "admin_users_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("admin_users_userId_unique").on(table.userId),
]);

export const orders = pgTable("orders", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }).notNull(),
	status: text().default('pending'),
	paymentMethod: text("payment_method"),
	paymentId: text("payment_id"),
	shippingAddress: text("shipping_address"),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "orders_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const orderItems = pgTable("order_items", {
	id: text().primaryKey().notNull(),
	orderId: text().notNull(),
	productId: text().notNull(),
	quantity: integer().notNull(),
	priceAtPurchase: numeric("price_at_purchase", { precision: 10, scale:  2 }).notNull(),
	size: text(),
	color: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_orderId_orders_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "order_items_productId_products_id_fk"
		}).onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	password: text().notNull(),
	role: text().default('user').notNull(),
	photo: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const cartItems = pgTable("cart_items", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	productId: text().notNull(),
	quantity: integer().default(1).notNull(),
	size: text(),
	color: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "cart_items_userId_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "cart_items_productId_products_id_fk"
		}).onDelete("cascade"),
]);

export const products = pgTable("products", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	imageUrl: text("image_url"),
	category: text(),
	sizes: text().array().default([""]),
	colors: text().array().default([""]),
	stock: integer().default(0),
	createdBy: text("created_by").notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});
