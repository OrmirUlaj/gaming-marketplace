import { Collection } from 'mongodb';
import clientPromise from '../lib/mongodb';
import { Order } from '@/types/models/order';

export async function getOrdersCollection(): Promise<Collection<Order>> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Order>('orders');
}