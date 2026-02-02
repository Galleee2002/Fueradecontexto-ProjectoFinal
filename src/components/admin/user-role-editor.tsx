"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserCog } from "lucide-react"
import { UserRoleDialog } from "@/components/admin/user-role-dialog"
import { User } from "@/types"

interface UserRoleEditorProps {
  userId: string
  currentRole: User["role"]
  userName: string
}

export function UserRoleEditor({
  userId,
  currentRole,
  userName,
}: UserRoleEditorProps) {
  const [open, setOpen] = useState(false)

  // Create minimal user object for dialog
  const user: User = {
    id: userId,
    role: currentRole,
    fullName: userName,
  } as User

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <UserCog className="h-4 w-4 mr-2" />
        Cambiar Rol
      </Button>

      <UserRoleDialog user={user} open={open} onOpenChange={setOpen} />
    </>
  )
}
