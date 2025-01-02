"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle, Check, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FamilyMember {
  id: string
  name: string
  email: string
  role: string
}

interface SharedSubscription {
  id: string
  name: string
  plan: string
  totalCost: number
  yourShare: number
  members: string[]
  memberAvatars: string[]
}

interface PendingInvite {
  id: string
  service: string
  from: string
  yourShare: number
}

const FamilyPage = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [sharedSubscriptions, setSharedSubscriptions] = useState<SharedSubscription[]>([])
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")

  useEffect(() => {
    // Fetch family members
    const fetchFamilyMembers = async () => {
      // Replace with actual API call
      const response = await fetch('/api/family-members')
      if (response.ok) {
        const data = await response.json()
        setFamilyMembers(data)
      }
    }

    // Fetch shared subscriptions
    const fetchSharedSubscriptions = async () => {
      const response = await fetch('/api/shared-subscriptions')
      if (response.ok) {
        const data = await response.json()
        setSharedSubscriptions(data)
      }
    }

    // Fetch pending invites
    const fetchPendingInvites = async () => {
      // Replace with actual API call
      const response = await fetch('/api/pending-invites')
      if (response.ok) {
        const data = await response.json()
        setPendingInvites(data)
      }
    }

    fetchFamilyMembers()
    fetchSharedSubscriptions()
    fetchPendingInvites()
  }, [])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    // Replace with actual API call
    const response = await fetch('/api/family-members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newMemberName, email: newMemberEmail }),
    })

    if (response.ok) {
      const newMember = await response.json()
      setFamilyMembers([...familyMembers, newMember])
      setNewMemberName("")
      setNewMemberEmail("")
    }
  }

  const handleShareSubscription = async (subscriptionId: string, memberId: string) => {
    // Replace with actual API call
    const response = await fetch('/api/shared-subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId, userId: memberId }),
    })

    if (response.ok) {
      // Refresh shared subscriptions
      const updatedSubscriptions = await fetch('/api/shared-subscriptions').then(res => res.json())
      setSharedSubscriptions(updatedSubscriptions)
    }
  }

  const handleAcceptInvite = async (inviteId: string) => {
    // Replace with actual API call
    const response = await fetch(`/api/pending-invites/${inviteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'accepted' }),
    })

    if (response.ok) {
      // Remove the accepted invite from pending invites
      setPendingInvites(pendingInvites.filter(invite => invite.id !== inviteId))
      // Refresh shared subscriptions
      const updatedSubscriptions = await fetch('/api/shared-subscriptions').then(res => res.json())
      setSharedSubscriptions(updatedSubscriptions)
    }
  }

  const handleRejectInvite = async (inviteId: string) => {
    // Replace with actual API call
    const response = await fetch(`/api/pending-invites/${inviteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'rejected' }),
    })

    if (response.ok) {
      // Remove the rejected invite from pending invites
      setPendingInvites(pendingInvites.filter(invite => invite.id !== inviteId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Gerenciamento Familiar</h1>
          <p className="text-gray-400">
            Gerencie membros da família e assinaturas compartilhadas.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Membros da Família */}
        <Card className="bg-[#111113] border-[#1F1F22]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Membros da Família</CardTitle>
              <CardDescription className="text-gray-400">Gerencie os membros da sua família.</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Membro
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111113] border-[#1F1F22]">
                <DialogHeader>
                  <DialogTitle className="text-white">Adicionar Novo Membro</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Adicione um novo membro à sua família.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMember}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-white">Nome</Label>
                      <Input
                        id="name"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="bg-[#0A0A0B] border-[#1F1F22] text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="bg-[#0A0A0B] border-[#1F1F22] text-white"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Adicionar Membro</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                  <div className="text-sm text-gray-400">{member.role}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compartilhamento */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Assinaturas Compartilhadas */}
          <Card className="bg-[#111113] border-[#1F1F22]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">Assinaturas Compartilhadas</CardTitle>
                <CardDescription className="text-gray-400">
                  Suas assinaturas compartilhadas com a família
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Compartilhar Assinatura
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#111113] border-[#1F1F22]">
                  <DialogHeader>
                    <DialogTitle className="text-white">Compartilhar Assinatura</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Selecione uma assinatura para compartilhar com a família.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="subscription" className="text-white">Assinatura</Label>
                      <Select>
                        <SelectTrigger className="bg-[#0A0A0B] border-[#1F1F22] text-white">
                          <SelectValue placeholder="Selecione uma assinatura" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111113] border-[#1F1F22]">
                          <SelectItem value="netflix">Netflix</SelectItem>
                          <SelectItem value="spotify">Spotify</SelectItem>
                          <SelectItem value="disney">Disney+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="members" className="text-white">Membros</Label>
                      <Select>
                        <SelectTrigger className="bg-[#0A0A0B] border-[#1F1F22] text-white">
                          <SelectValue placeholder="Selecione os membros" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111113] border-[#1F1F22]">
                          {familyMembers.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="bg-blue-600 hover:bg-blue-700">Compartilhar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sharedSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{subscription.name}</h3>
                        <p className="text-sm text-gray-400">{subscription.plan}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Custo Total</p>
                        <p className="text-lg font-semibold text-white">
                          R$ {subscription.totalCost.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {subscription.memberAvatars.map((avatar, index) => (
                          <Avatar key={index} className="border-2 border-[#111113]">
                            <AvatarImage src={avatar} />
                            <AvatarFallback>{subscription.members[index]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Sua Parte</p>
                        <p className="text-lg font-semibold text-green-400">
                          R$ {subscription.yourShare.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Convites Pendentes */}
          <Card className="bg-[#111113] border-[#1F1F22]">
            <CardHeader>
              <CardTitle className="text-white">Convites Pendentes</CardTitle>
              <CardDescription className="text-gray-400">
                Convites para compartilhamento de assinaturas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingInvites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B]">
                    <div>
                      <h3 className="text-sm font-medium text-white">{invite.service}</h3>
                      <p className="text-sm text-gray-400">Convite de {invite.from}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Sua Parte</p>
                        <p className="text-lg font-semibold text-white">
                          R$ {invite.yourShare.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" className="w-24" onClick={() => handleRejectInvite(invite.id)}>
                          <X className="mr-2 h-4 w-4" />
                          Recusar
                        </Button>
                        <Button size="sm" className="w-24 bg-green-600 hover:bg-green-700" onClick={() => handleAcceptInvite(invite.id)}>
                          <Check className="mr-2 h-4 w-4" />
                          Aceitar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default FamilyPage

