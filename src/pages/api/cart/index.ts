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
    const { userId, gameId, quantity } = req.body;
    if (!userId || !gameId || !quantity) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    await db.collection("cart").updateOne(
      { userId },
      {
        $set: { userId },
        $addToSet: { items: { gameId, quantity } },
        $currentDate: { updatedAt: true },
      },
      { upsert: true }
    );
    res.status(200).json({ message: "Cart updated" });
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
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
}

export default withErrorHandler(handler);
