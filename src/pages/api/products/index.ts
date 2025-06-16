import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  switch (req.method) {
    case 'GET':
      // Use the "games" collection instead of "products"
      const products = await db.collection('games').find({}).toArray();
      return res.status(200).json(products);

    case 'POST':
      const product = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.collection('games').insertOne(product);
      return res.status(201).json({ id: result.insertedId });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}