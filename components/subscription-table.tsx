import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const subscriptions = [
  {
    name: "Netflix",
    price: "$15.99",
    status: "active",
    nextPayment: "Aug 1, 2023",
    logo: "/placeholder.svg",
  },
  {
    name: "Spotify",
    price: "$9.99",
    status: "active",
    nextPayment: "Aug 15, 2023",
    logo: "/placeholder.svg",
  },
  {
    name: "Adobe CC",
    price: "$52.99",
    status: "pending",
    nextPayment: "Aug 23, 2023",
    logo: "/placeholder.svg",
  },
]

export function SubscriptionTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Next Payment</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((subscription) => (
          <TableRow key={subscription.name}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={subscription.logo} />
                  <AvatarFallback>{subscription.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{subscription.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={subscription.status === "active" ? "default" : "secondary"}
              >
                {subscription.status}
              </Badge>
            </TableCell>
            <TableCell>{subscription.nextPayment}</TableCell>
            <TableCell className="text-right font-medium">
              {subscription.price}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

