import { Collection } from 'mongodb';
import clientPromise from '../lib/mongodb';
import { Product } from '@/types/models/Product';

export async function getProductsCollection(): Promise<Collection<Product>> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Product>('products');
}