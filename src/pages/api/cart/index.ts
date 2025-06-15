import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authConfig } from "../auth/[...nextauth]"; // adjust path as needed

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authConfig);
  if (!session) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  if (req.method === "POST") {
    // Add or update an item in the cart
    const { userId, gameId, quantity } = req.body;
    if (!userId || !gameId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      // Use upsert: if the user's cart exists, update it; otherwise, create a new one.
      await db.collection("cart").updateOne(
        { userId },
        {
          $set: { userId },
          $addToSet: { items: { gameId, quantity } },
          $currentDate: { updatedAt: true },
        },
        { upsert: true }
      );
      return res.status(200).json({ message: "Cart updated" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  } else if (req.method === "GET") {
    // Retrieve the user's cart based on a query parameter
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      return res
        .status(400)
        .json({ message: "Missing userId query parameter" });
    }
    try {
      const cart = await db.collection("cart").findOne({ userId });
      return res.status(200).json(cart);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
