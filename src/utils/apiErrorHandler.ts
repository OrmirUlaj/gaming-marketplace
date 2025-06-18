import type { NextApiRequest, NextApiResponse } from "next";

export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({
        error: error.message || "Internal Server Error",
      });
    }
  };
}