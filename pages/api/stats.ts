/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const totalSpending = await prisma.subscription.aggregate({
        where: { userId: session.user?.id },
        _sum: { price: true },
      });

      const activeSubscriptions = await prisma.subscription.count({
        where: { userId: session.user?.id, status: "Ativa" },
      });

      const familyMembers = await prisma.user.count({
        where: { id: session.user?.id },
      });

      res.status(200).json({
        totalSpending: totalSpending._sum.price || 0,
        activeSubscriptions,
        familyMembers,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
