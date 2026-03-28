import { NextRequest } from "next/server";
import { syncDB, Cart, CartItem, Product } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

async function getOrCreateCart(userId?: number, sessionId?: string) {
  if (userId) {
    const [cart] = await Cart.findOrCreate({ where: { userId }, defaults: { userId } });
    return cart;
  }
  if (sessionId) {
    const [cart] = await Cart.findOrCreate({ where: { sessionId }, defaults: { sessionId } });
    return cart;
  }
  throw new Error("No user or session");
}

export async function GET(req: NextRequest) {
  await ensureDB();
  const session = await getServerSession(authOptions);
  const sessionId = req.cookies.get("sessionId")?.value;

  const cart = await (session?.user?.id
    ? Cart.findOne({ where: { userId: session.user.id } })
    : Cart.findOne({ where: { sessionId } }));

  if (!cart) return apiResponse({ cart: null, items: [] });

  const items = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [{ model: Product, as: "product", attributes: ["id", "name", "price", "images", "stock", "slug"] }],
  });

  return apiResponse({ cart, items });
}

export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await getServerSession(authOptions);
  const sessionId = req.cookies.get("sessionId")?.value || `guest-${Date.now()}`;
  const body = await req.json();
  const { productId, quantity = 1 } = body;

  if (!productId) return apiError("productId is required");

  const product = await Product.findByPk(productId);
  if (!product || !product.isActive) return apiError("Product not found", 404);
  if (product.stock < quantity) return apiError("Insufficient stock");

  const cart = await getOrCreateCart(
    session?.user?.id ? parseInt(session.user.id) : undefined,
    sessionId
  );

  const existingItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (existingItem) {
    await existingItem.update({ quantity: existingItem.quantity + quantity });
    return apiResponse(existingItem);
  }

  const item = await CartItem.create({ cartId: cart.id, productId, quantity });
  return apiResponse(item, 201);
}

export async function PUT(req: NextRequest) {
  await ensureDB();
  const body = await req.json();
  const { itemId, quantity } = body;
  if (!itemId || quantity === undefined) return apiError("itemId and quantity are required");

  const item = await CartItem.findByPk(itemId);
  if (!item) return apiError("Cart item not found", 404);

  if (quantity <= 0) {
    await item.destroy();
    return apiResponse({ message: "Item removed" });
  }

  await item.update({ quantity });
  return apiResponse(item);
}

export async function DELETE(req: NextRequest) {
  await ensureDB();
  const session = await getServerSession(authOptions);
  const sessionId = req.cookies.get("sessionId")?.value;

  const cart = await (session?.user?.id
    ? Cart.findOne({ where: { userId: session.user.id } })
    : Cart.findOne({ where: { sessionId } }));

  if (cart) {
    await CartItem.destroy({ where: { cartId: cart.id } });
  }

  return apiResponse({ message: "Cart cleared" });
}
