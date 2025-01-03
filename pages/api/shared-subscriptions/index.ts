import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        sharedSubscriptions: {
          include: {
            subscription: true,
          },
        },
        familyHead: {
          include: {
            sharedSubscriptions: {
              include: {
                subscription: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sharedSubscriptions = user.isHeadOfFamily
      ? user.sharedSubscriptions
      : user.familyHead
      ? user.familyHead.sharedSubscriptions
      : [];

    const formattedSubscriptions = await Promise.all(
      sharedSubscriptions.map(async (shared) => {
        const allShares = await prisma.sharedSubscription.findMany({
          where: { subscriptionId: shared.subscriptionId },
          include: { user: true },
        });

        return {
          id: shared.subscription.id,
          name: shared.subscription.name,
          totalCost: shared.subscription.price,
          yourShare: shared.subscription.price * (shared.sharePercentage / 100),
          members: allShares.map((s) => ({
            id: s.user.id,
            name: s.user.name,
            sharePercentage: s.sharePercentage,
          })),
        };
      })
    );

    res.status(200).json(formattedSubscriptions);
  } catch (error) {
    console.error("Error in /api/shared-subscriptions:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
