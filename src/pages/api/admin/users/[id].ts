import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (
    !session ||
    typeof session !== "object" ||
    !("user" in session) ||
    typeof (session as any).user !== "object" ||
    (session as any).user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  if (req.method === "DELETE") {
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    return res.status(204).end();
  }

  if (req.method === "PATCH") {
    const { name, role } = req.body;
    const update: any = {};
    if (name) update.name = name;
    if (role) update.role = role;
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    update.updatedAt = new Date();
    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    return res.status(200).json({ message: "User updated" });
  }

  res.setHeader("Allow", ["DELETE", "PATCH"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}