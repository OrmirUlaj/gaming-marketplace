// pages/api/ping.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ pong: true }>
) {
  const client = await clientPromise
  // uses the DB name from process.env.MONGODB_DB
  await client.db().command({ ping: 1 })
  res.status(200).json({ pong: true })
}
