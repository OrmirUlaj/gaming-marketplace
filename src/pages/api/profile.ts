import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const update: any = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (password) update.password = await bcrypt.hash(password, 12);
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    update.updatedAt = new Date();
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: update }
    );
    return res.status(200).json({ message: "Profile updated" });
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}