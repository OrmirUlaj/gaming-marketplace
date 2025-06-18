import type { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/lib/auth";
import { withErrorHandler } from "@/utils/apiErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const user = await createUser(name, email, password);
  res
    .status(201)
    .json({ message: "User created successfully", userId: user.id });
}

export default withErrorHandler(handler);
