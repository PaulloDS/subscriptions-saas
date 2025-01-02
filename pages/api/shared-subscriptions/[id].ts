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
      const sharedSubscription = await prisma.sharedSubscription.findUnique({
        where: { id: String(id) },
        include: { subscription: true },
      });
      if (
        !sharedSubscription ||
        sharedSubscription.userId !== session.user?.id
      ) {
        return res
          .status(404)
          .json({ message: "Shared subscription not found" });
      }
      res.status(200).json(sharedSubscription);
    } catch (error) {
      res.status(500).json({ message: "Error fetching shared subscription" });
    }
  } else if (req.method === "PUT") {
    const { sharePercentage } = req.body;

    try {
      const updatedSharedSubscription = await prisma.sharedSubscription.update({
        where: { id: String(id) },
        data: {
          sharePercentage: parseFloat(sharePercentage),
        },
      });
      res.status(200).json(updatedSharedSubscription);
    } catch (error) {
      res.status(500).json({ message: "Error updating shared subscription" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.sharedSubscription.delete({
        where: { id: String(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting shared subscription" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
