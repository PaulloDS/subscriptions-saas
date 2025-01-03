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
        familyMembers: true,
        familyHead: {
          include: {
            familyMembers: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let familyMembers = [];
    if (user.isHeadOfFamily) {
      familyMembers = [user, ...user.familyMembers];
    } else if (user.familyHead) {
      familyMembers = [
        user.familyHead,
        user,
        ...user.familyHead.familyMembers.filter(
          (member) => member.id !== user.id
        ),
      ];
    } else {
      familyMembers = [user];
    }

    res.status(200).json(
      familyMembers.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
      }))
    );
  } catch (error) {
    console.error("Error in /api/family/members:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
