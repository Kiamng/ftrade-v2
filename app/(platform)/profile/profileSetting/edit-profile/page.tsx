"use client";
import { useSession } from "next-auth/react";
import { AccountInformation } from "./_components/account-information";
import { AccountPassword } from "./_components/account-password";
import { AvatarChanging } from "./_components/avatar-changing";

const EditProfilePage = () => {
  const session = useSession();
  return (
    <div className="flex pb-10 flex-col no-scrollbar w-full gap-y-10">
      <AvatarChanging imgUrl={session.data?.user?.avatarImg} />
      <AccountInformation />
      <AccountPassword />
    </div>
  );
};
export default EditProfilePage;
