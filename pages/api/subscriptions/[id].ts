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

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id: String(id) },
      });
      if (!subscription || subscription.userId !== session.user?.id) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      res.status(200).json(subscription);
    } catch (error) {
      res.status(500).json({ message: "Error fetching subscription" });
    }
  } else if (req.method === "PUT") {
    const {
      name,
      description,
      price,
      billingCycle,
      category,
      status,
      nextBillingDate,
    } = req.body;

    try {
      const updatedSubscription = await prisma.subscription.update({
        where: { id: String(id) },
        data: {
          name,
          description,
          price: parseFloat(price),
          billingCycle,
          category,
          status,
          nextBillingDate: new Date(nextBillingDate),
        },
      });
      res.status(200).json(updatedSubscription);
    } catch (error) {
      res.status(500).json({ message: "Error updating subscription" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.subscription.delete({
        where: { id: String(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting subscription" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
