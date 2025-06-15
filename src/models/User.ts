import { Collection } from 'mongodb';
import clientPromise from '../lib/mongodb';
import { User } from '@/types/models/user';

export async function getUsersCollection(): Promise<Collection<User>> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<User>('users');
}