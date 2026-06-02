import { relations } from "drizzle-orm/relations";
import { user, adminUsers, orders, orderItems, products, cartItems } from "./schema";

export const adminUsersRelations = relations(adminUsers, ({one}) => ({
	user: one(user, {
		fields: [adminUsers.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	adminUsers: many(adminUsers),
	orders: many(orders),
	cartItems: many(cartItems),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	user: one(user, {
		fields: [orders.userId],
		references: [user.id]
	}),
	orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	orderItems: many(orderItems),
	cartItems: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({one}) => ({
	user: one(user, {
		fields: [cartItems.userId],
		references: [user.id]
	}),
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id]
	}),
}));