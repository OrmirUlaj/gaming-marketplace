import type { NextApiRequest, NextApiResponse } from "next";
import { getOrdersCollection } from "@/models/Order"; // uses the Order model from your models folder
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const collection = await getOrdersCollection();

  if (req.method === "POST") {
    // Create a new order
    const { userId, products, totalAmount } = req.body;

    if (!userId || !products || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = {
      id: crypto.randomUUID(),
      userId,
      products, // should be an array with each product: { productId, quantity, price }
      totalAmount,
      status: "pending" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result = await collection.insertOne(order);
      return res
        .status(201)
        .json({ message: "Order created", orderId: result.insertedId });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  } else if (req.method === "GET") {
    // Retrieve orders.
    // Optionally, you could filter by userId by reading from query parameters.
    try {
      const orders = await collection.find({}).toArray();
      return res.status(200).json(orders);
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
