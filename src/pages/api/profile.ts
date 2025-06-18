import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { withErrorHandler } from "@/utils/apiErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const userId = session.user.id;

  if (req.method === "GET") {
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });
    return res.status(200).json(user);
  }

  if (req.method === "PATCH") {
    const { name, email, password } = req.body;

    // Validate inputs
    if (name && (typeof name !== 'string' || name.length < 2)) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }
    if (email && (typeof email !== 'string' || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password && (typeof password !== 'string' || password.length < 6)) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const update: any = {};
    
    // Check email uniqueness if email is being updated
    if (email) {
      const existingUser = await db.collection("users").findOne({ 
        email,
        _id: { $ne: new ObjectId(userId) }
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      update.email = email;
    }

    if (name) update.name = name;
    if (password) update.password = await bcrypt.hash(password, 12);
    
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    
    update.updatedAt = new Date();
    
    try {
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: update }
      );
      return res.status(200).json({ message: "Profile updated" });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ message: "Error updating profile" });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withErrorHandler(handler);