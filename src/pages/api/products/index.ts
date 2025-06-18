import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { withErrorHandler } from "@/utils/apiErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  if (req.method === "GET") {
    const { search = "", category, minPrice, maxPrice } = req.query;

    // Build filter object
    const filter: any = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await db.collection("games").find(filter).toArray();
    return res.status(200).json(products);
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withErrorHandler(handler);