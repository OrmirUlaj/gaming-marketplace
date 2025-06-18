import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import authConfig from "../auth/[...nextauth]";
import { withErrorHandler } from "@/utils/apiErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authConfig);
  if (!session) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  if (req.method === "POST") {
    const { userId, gameId, quantity, items } = req.body;
    
    // If items array is provided, replace entire cart
    if (items !== undefined) {
      await db.collection("cart").updateOne(
        { userId },
        {
          $set: { 
            userId, 
            items: items,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
      res.status(200).json({ message: "Cart updated" });
      return;
    }
    
    // Handle individual item addition/update
    if (!userId || !gameId || quantity === undefined) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Find existing cart
    const existingCart = await db.collection("cart").findOne({ userId });
    let updatedItems = [];
    
    if (existingCart && existingCart.items) {
      // Update existing item quantity or add new item
      const itemIndex = existingCart.items.findIndex((item: any) => item.gameId === gameId);
      
      if (itemIndex >= 0) {
        // Update existing item
        updatedItems = [...existingCart.items];
        updatedItems[itemIndex] = { gameId, quantity };
      } else {
        // Add new item
        updatedItems = [...existingCart.items, { gameId, quantity }];
      }
    } else {
      // First item in cart
      updatedItems = [{ gameId, quantity }];
    }

    await db.collection("cart").updateOne(
      { userId },
      {
        $set: { 
          userId,
          items: updatedItems,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    res.status(200).json({ message: "Cart updated" });
    return;
  } else if (req.method === "DELETE") {
    const { userId, gameId } = req.body;
    if (!userId || !gameId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Find existing cart and remove the item
    const existingCart = await db.collection("cart").findOne({ userId });
    if (existingCart && existingCart.items) {
      const updatedItems = existingCart.items.filter((item: any) => item.gameId !== gameId);
      
      await db.collection("cart").updateOne(
        { userId },
        {
          $set: { 
            items: updatedItems,
            updatedAt: new Date()
          }
        }
      );
    }
    
    res.status(200).json({ message: "Item removed from cart" });
    return;
  } else if (req.method === "GET") {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ message: "Missing userId query parameter" });
      return;
    }
    const cart = await db.collection("cart").findOne({ userId });
    res.status(200).json(cart);
    return;
  } else {    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
}

export default withErrorHandler(handler);
