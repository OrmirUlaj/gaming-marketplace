import { getProductsCollection } from '@/models/Product';
import { Product } from '@/types/models/Product';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const collection = await getProductsCollection();

  switch (req.method) {
    case 'GET':
      const products = await collection.find({}).toArray();
      return res.status(200).json(products);

    case 'POST':
      const product: Product = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await collection.insertOne(product);
      return res.status(201).json({ id: result.insertedId });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}