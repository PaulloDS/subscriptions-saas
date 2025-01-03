import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email } = req.body;

    // Check if the current user is the head of the family
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser || !currentUser.isHeadOfFamily) {
      return res
        .status(403)
        .json({ message: "Only the head of the family can add members" });
    }

    // Check if the email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Generate a random password for the new family member
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create the new family member
    const newMember = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        familyHeadId: currentUser.id,
      },
    });

    // In a real-world scenario, you would send an email to the new family member with their login information

    res.status(201).json({
      message: "Family member added successfully",
      memberId: newMember.id,
      temporaryPassword: randomPassword, // Note: In a production environment, never send passwords in the response
    });
  } catch (error) {
    console.error("Error adding family member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
