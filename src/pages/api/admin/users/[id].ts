import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { withErrorHandler } from "@/utils/apiErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (
    !session ||
    typeof session !== "object" ||
    !("user" in session) ||
    typeof (session as any).user !== "object" ||
    (session as any).user.role !== "admin"
  ) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    res.status(400).json({ message: "Invalid user id" });
    return;
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  if (req.method === "DELETE") {
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    res.status(204).end();
    return;
  }

  if (req.method === "PATCH") {
    const { name, role } = req.body;
    const update: any = {};
    if (name) update.name = name;
    if (role) update.role = role;
    if (Object.keys(update).length === 0) {
      res.status(400).json({ message: "No fields to update" });
      return;
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

export default withErrorHandler(handler);