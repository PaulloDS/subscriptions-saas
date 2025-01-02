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
      const sharedSubscriptions = await prisma.sharedSubscription.findMany({
        where: { userId: session.user?.id },
        include: { subscription: true },
      });
      res.status(200).json(sharedSubscriptions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching shared subscriptions" });
    }
  } else if (req.method === "POST") {
    const { subscriptionId, userId, sharePercentage } = req.body;

    try {
      const sharedSubscription = await prisma.sharedSubscription.create({
        data: {
          subscriptionId,
          userId,
          sharePercentage: parseFloat(sharePercentage),
        },
      });
      res.status(201).json(sharedSubscription);
    } catch (error) {
      res.status(500).json({ message: "Error creating shared subscription" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
