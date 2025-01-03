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
      const categoryReport = await prisma.subscription.groupBy({
        by: ["category"],
        _sum: {
          price: true,
        },
        where: {
          userId: session.user.id,
        },
      });

      const formattedReport = categoryReport.map((item) => ({
        name: item.category,
        value: item._sum.price || 0,
      }));

      return res.status(200).json(formattedReport);
    } catch (error) {
      console.error("Error fetching category report:", error);
      return res
        .status(500)
        .json({ message: "Error fetching category report" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
