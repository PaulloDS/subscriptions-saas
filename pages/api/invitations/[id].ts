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

  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { status } = req.body;

      if (status !== "accepted" && status !== "rejected") {
        return res.status(400).json({ message: "Invalid status" });
      }

      const invitation = await prisma.invitation.findUnique({
        where: { id: String(id) },
        include: { subscription: true },
      });

      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }

      if (invitation.receiverId !== session.user.id) {
        return res
          .status(403)
          .json({ message: "You can only respond to your own invitations" });
      }

      const updatedInvitation = await prisma.invitation.update({
        where: { id: String(id) },
        data: { status },
      });

      if (status === "accepted") {
        await prisma.sharedSubscription.create({
          data: {
            subscriptionId: invitation.subscriptionId,
            userId: session.user.id,
            sharePercentage:
              100 / (invitation.subscription.sharedSubscriptions.length + 1),
          },
        });

        // Update share percentages for existing members
        await prisma.sharedSubscription.updateMany({
          where: { subscriptionId: invitation.subscriptionId },
          data: {
            sharePercentage: {
              divide: invitation.subscription.sharedSubscriptions.length + 1,
            },
          },
        });
      }

      res.status(200).json(updatedInvitation);
    } catch (error) {
      console.error("Error updating invitation:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
