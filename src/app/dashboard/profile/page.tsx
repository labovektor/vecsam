"use client"

import UpdateAdminForm from "@/features/admin-auth/forms/UpdateAdminForm"
import { useTRPC } from "@/trpc/react"
import { useQuery } from "@tanstack/react-query"
import React from "react"

const ProfilePage = () => {
  const trpc = useTRPC()
  const { data: user } = useQuery(trpc.adminAuth.get.queryOptions(undefined))

  return (
    <div>
      <UpdateAdminForm cValue={{ name: user?.name, email: user?.email }} />
    </div>
  )
}

export default ProfilePage
