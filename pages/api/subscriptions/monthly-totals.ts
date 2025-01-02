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
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId: session.user?.id,
          createdAt: {
            gte: sixMonthsAgo,
          },
        },
        select: {
          price: true,
          createdAt: true,
        },
      });

      const monthlyTotals = subscriptions.reduce((acc, sub) => {
        const month = sub.createdAt.toLocaleString("default", {
          month: "short",
        });
        acc[month] = (acc[month] || 0) + sub.price;
        return acc;
      }, {} as Record<string, number>);

      const data = Object.entries(monthlyTotals).map(([month, total]) => ({
        month,
        total,
      }));

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching monthly totals" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
