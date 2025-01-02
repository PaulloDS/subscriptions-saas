"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Mail, MessageSquare } from 'lucide-react'

const notificationTypes = [
  { id: "email", name: "Email", icon: Mail },
  { id: "push", name: "Notificações Push", icon: Bell },
  { id: "sms", name: "SMS", icon: MessageSquare },
]

const notificationEvents = [
  { id: "upcoming_payments", name: "Pagamentos Próximos" },
  { id: "price_changes", name: "Mudanças de Preço" },
  { id: "new_features", name: "Novos Recursos" },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  })

  const [events, setEvents] = useState({
    upcoming_payments: true,
    price_changes: true,
    new_features: false,
  })

  const handleNotificationChange = (id: string) => {
    setNotifications(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }))
  }

  const handleEventChange = (id: string) => {
    setEvents(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Configurações de Notificações</h1>
        <p className="text-muted-foreground">
          Gerencie como e quando você recebe notificações.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Notificação</CardTitle>
            <CardDescription>Escolha como deseja receber notificações.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {notificationTypes.map(({ id, name, icon: Icon }) => (
              <div key={id} className="flex items-center space-x-4">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor={id} className="flex-1">
                  {name}
                </Label>
                <Switch
                  id={id}
                  checked={notifications[id as keyof typeof notifications]}
                  onCheckedChange={() => handleNotificationChange(id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos de Notificação</CardTitle>
            <CardDescription>Selecione os eventos sobre os quais deseja ser notificado.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {notificationEvents.map(({ id, name }) => (
              <div key={id} className="flex items-center space-x-4">
                <Label htmlFor={id} className="flex-1">
                  {name}
                </Label>
                <Switch
                  id={id}
                  checked={events[id as keyof typeof events]}
                  onCheckedChange={() => handleEventChange(id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

