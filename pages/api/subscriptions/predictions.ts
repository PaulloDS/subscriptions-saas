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
        select: { price: true, billingCycle: true },
      });

      const monthlyTotal = subscriptions.reduce((total, sub) => {
        if (sub.billingCycle === "Mensal") {
          return total + sub.price;
        } else if (sub.billingCycle === "Anual") {
          return total + sub.price / 12;
        } else if (sub.billingCycle === "Trimestral") {
          return total + sub.price / 3;
        }
        return total;
      }, 0);

      const predictions = Array.from({ length: 6 }, (_, i) => ({
        month: new Date(
          Date.now() + i * 30 * 24 * 60 * 60 * 1000
        ).toLocaleString("default", { month: "short" }),
        predicted: Number((monthlyTotal * (1 + i * 0.01)).toFixed(2)), // Assuming 1% increase per month
      }));

      return res.status(200).json(predictions);
    } catch (error) {
      console.error("Error generating predictions:", error);
      return res.status(500).json({ message: "Error generating predictions" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
