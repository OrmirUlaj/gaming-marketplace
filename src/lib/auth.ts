import { hash, compare } from "bcryptjs";
import { getUsersCollection } from "@/models/User";

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  const collection = await getUsersCollection();
  const existingUser = await collection.findOne({ email });
  if (existingUser) throw new Error("User already exists");
  const hashedPassword = await hash(password, 12);
  const result = await collection.insertOne({
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { id: result.insertedId.toString() };
}

export async function validateUser(email: string, password: string) {
  const collection = await getUsersCollection();
  const user = await collection.findOne({ email });
  if (!user) throw new Error("User not found");
  const isValid = await compare(password, user.password);
  if (!isValid) throw new Error("Invalid password");
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
