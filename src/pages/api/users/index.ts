import { getUsersCollection } from '@/models/User';
import { User } from '@/types/models/user';
import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { withErrorHandler } from "@/utils/apiErrorHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const collection = await getUsersCollection();

  switch (req.method) {
    case 'POST': {
      const { password, ...userData } = req.body;
      const hashedPassword = await hash(password, 12);

      const user: User = {
        ...userData,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(user);
      res.status(201).json({ id: result.insertedId });
      return;
    }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
  }
}

export default withErrorHandler(handler);