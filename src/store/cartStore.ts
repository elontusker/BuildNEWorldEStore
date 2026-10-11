import type { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
}

let cartItems: CartItem[] = [];
let wishlistItems: WishlistItem[] = [];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export const cartStore = {
  getCart: () => cartItems,
  getWishlist: () => wishlistItems,
  getCartCount: () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
  getCartTotal: () => cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  addToCart: (product: Product, qty = 1) => {
    const existing = cartItems.find((i) => i.product.id === product.id);
    if (existing) {
      cartItems = cartItems.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
    } else {
      cartItems = [...cartItems, { product, quantity: qty }];
    }
    notify();
  },

  removeFromCart: (productId: string) => {
    cartItems = cartItems.filter((i) => i.product.id !== productId);
    notify();
  },

  updateQuantity: (productId: string, qty: number) => {
    if (qty <= 0) { cartStore.removeFromCart(productId); return; }
    cartItems = cartItems.map((i) => i.product.id === productId ? { ...i, quantity: qty } : i);
    notify();
  },

  toggleWishlist: (product: Product) => {
    const exists = wishlistItems.find((i) => i.product.id === product.id);
    wishlistItems = exists
      ? wishlistItems.filter((i) => i.product.id !== product.id)
      : [...wishlistItems, { product }];
    notify();
  },

  isWishlisted: (productId: string) => wishlistItems.some((i) => i.product.id === productId),

  subscribe: (fn: () => void): (() => void) => {
    listeners.push(fn);
    return () => { listeners = listeners.filter((l) => l !== fn); };
  },
};
