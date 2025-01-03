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
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let invitations;
    if (user.isHeadOfFamily) {
      invitations = await prisma.invitation.findMany({
        where: { senderId: user.id },
        include: {
          subscription: true,
          receiver: true,
        },
      });
    } else {
      invitations = await prisma.invitation.findMany({
        where: { receiverId: user.id },
        include: {
          subscription: true,
          sender: true,
        },
      });
    }

    const formattedInvitations = invitations.map((invite) => ({
      id: invite.id,
      subscriptionName: invite.subscription.name,
      senderName: user.isHeadOfFamily ? user.name : invite.sender.name,
      receiverName: user.isHeadOfFamily ? invite.receiver.name : user.name,
      status: invite.status,
    }));

    res.status(200).json(formattedInvitations);
  } catch (error) {
    console.error("Error in /api/invitations:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
