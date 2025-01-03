"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Check, X } from "lucide-react";
import { AddFamilyMemberDialog } from "@/components/add-family-member-dialog";
import { useToast } from "@/hooks/use-toast";

interface FamilyMember {
  id: string;
  name: string;
  email: string;
}

interface SharedSubscription {
  id: string;
  name: string;
  totalCost: number;
  yourShare: number;
  members: { id: string; name: string; sharePercentage: number }[];
}

interface Invitation {
  id: string;
  subscriptionName: string;
  senderName: string;
  receiverName: string;
  status: string;
}

const FamilyPage = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [sharedSubscriptions, setSharedSubscriptions] = useState<
    SharedSubscription[]
  >([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isHeadOfFamily, setIsHeadOfFamily] = useState(false);

  const fetchFamilyData = async () => {
    if (status !== "authenticated") return;

    setIsLoading(true);
    setError(null);
    try {
      const [membersRes, subscriptionsRes, invitationsRes] = await Promise.all([
        fetch("/api/family/members"),
        fetch("/api/shared-subscriptions"),
        fetch("/api/invitations"),
      ]);

      if (!membersRes.ok || !subscriptionsRes.ok || !invitationsRes.ok) {
        throw new Error("Failed to fetch family data");
      }

      const [members, subscriptions, invites] = await Promise.all([
        membersRes.json(),
        subscriptionsRes.json(),
        invitationsRes.json(),
      ]);

      setFamilyMembers(members);
      setSharedSubscriptions(subscriptions);
      setInvitations(invites);
    } catch (error) {
      console.error("Error fetching family data:", error);
      setError("Failed to fetch family data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch family data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchFamilyData();
    }
  }, [status]);

  const handleInvitationResponse = async (
    invitationId: string,
    accept: boolean
  ) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: accept ? "accepted" : "rejected" }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Invitation ${
            accept ? "accepted" : "rejected"
          } successfully`,
        });
        fetchFamilyData();
      } else {
        throw new Error("Failed to update invitation");
      }
    } catch (error) {
      console.error("Error updating invitation:", error);
      toast({
        title: "Error",
        description: "Failed to update invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const checkHeadOfFamily = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch("/api/family/check-head");
          if (response.ok) {
            const { isHeadOfFamily } = await response.json();
            setIsHeadOfFamily(isHeadOfFamily);
          }
        } catch (error) {
          console.error("Error checking head of family status:", error);
        }
      }
    };

    checkHeadOfFamily();
  }, [status, session]);

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Access Denied. Please log in.</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchFamilyData}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Family Management
          </h1>
          <p className="text-gray-400">
            Manage family members and shared subscriptions.
          </p>
        </div>
        {isHeadOfFamily && (
          <AddFamilyMemberDialog onMemberAdded={fetchFamilyData}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
          </AddFamilyMemberDialog>
        )}
      </div>

      <div className="grid gap-6">
        {/* Family Members */}
        <Card className="bg-[#111113] border-[#1F1F22]">
          <CardHeader>
            <CardTitle className="text-white">Family Members</CardTitle>
            <CardDescription className="text-gray-400">
              List of your family members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`}
                    />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                  {member.email === session?.user?.email && (
                    <span className="text-xs text-blue-400">(You)</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shared Subscriptions */}
        <Card className="bg-[#111113] border-[#1F1F22]">
          <CardHeader>
            <CardTitle className="text-white">Shared Subscriptions</CardTitle>
            <CardDescription className="text-gray-400">
              Your shared subscriptions with family members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sharedSubscriptions.map((subscription) => (
                <div key={subscription.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {subscription.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Total: R$ {subscription.totalCost.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {subscription.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-400">{member.name}</span>
                        <span className="text-white">
                          R${" "}
                          {(
                            (subscription.totalCost * member.sharePercentage) /
                            100
                          ).toFixed(2)}
                          ({member.sharePercentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invitations */}
        <Card className="bg-[#111113] border-[#1F1F22]">
          <CardHeader>
            <CardTitle className="text-white">
              {isHeadOfFamily ? "Sent Invitations" : "Pending Invitations"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isHeadOfFamily
                ? "Invitations you've sent to family members"
                : "Invitations to join shared subscriptions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B]"
                >
                  <div>
                    <h3 className="text-sm font-medium text-white">
                      {invite.subscriptionName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {isHeadOfFamily
                        ? `Sent to: ${invite.receiverName}`
                        : `From: ${invite.senderName}`}
                    </p>
                  </div>
                  {!isHeadOfFamily && invite.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleInvitationResponse(invite.id, false)
                        }
                      >
                        <X className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          handleInvitationResponse(invite.id, true)
                        }
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                    </div>
                  )}
                  {(isHeadOfFamily || invite.status !== "pending") && (
                    <span className="text-sm font-medium text-gray-400 capitalize">
                      {invite.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FamilyPage;
