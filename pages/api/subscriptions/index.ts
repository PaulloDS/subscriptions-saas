import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const subscriptions = await prisma.subscription.findMany({
        where: { userId: session.user.id },
      });
      return res.status(200).json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return res.status(500).json({ message: "Error fetching subscriptions" });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        name,
        description,
        price,
        billingCycle,
        category,
        status,
        nextBillingDate,
      } = req.body;

      if (!name || !price || !billingCycle || !category || !status) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const subscription = await prisma.subscription.create({
        data: {
          name,
          description: description || "",
          price: parseFloat(price),
          billingCycle,
          category,
          status,
          nextBillingDate: new Date(nextBillingDate || Date.now()),
          userId: session.user.id,
        },
      });

      return res.status(201).json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      return res.status(500).json({ message: "Error creating subscription" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
