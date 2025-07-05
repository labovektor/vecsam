"use client";

import UpdateAdminForm from "@/features/admin-auth/forms/UpdateAdminForm";
import { api } from "@/trpc/react";
import React from "react";

const ProfilePage = () => {
  const { data: user } = api.adminAuth.get.useQuery();

  return (
    <div>
      <UpdateAdminForm cValue={{ name: user?.name, email: user?.email }} />
    </div>
  );
};

export default ProfilePage;
