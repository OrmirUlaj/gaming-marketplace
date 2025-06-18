import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
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
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "GET") {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = await db.collection("users").find({}).toArray();
    return res.status(200).json(users);
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withErrorHandler(handler);