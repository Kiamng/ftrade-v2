import { Account } from "@/types/account";
import defaultUserImg from "@/assets/img/user/default-avatar-icon-of-social-media-user-vector.jpg";
import { format } from "date-fns";
import UserInformationLoading from "./user-information-loading";
interface UserInformationProps {
  user: Account | undefined;
  isLoading: boolean;
}

const UserInformation = ({ user, isLoading }: UserInformationProps) => {
  const formattedDate = user?.joinDate
    ? format(user?.joinDate, "dd/MM/yyyy")
    : "";
  if (isLoading) {
    return <UserInformationLoading />;
  }
  return (
    <div className="w-full flex flex-col items-center space-y-2">
      <img
        src={user?.avatarUrl ? user?.avatarUrl : defaultUserImg.src}
        height={100}
        width={100}
        alt="avatar"
        className="rounded-full"
      ></img>
      <div className="text-center">
        <h1 className="text-3xl font-semibold">{user?.userName}</h1>
        <p className="text-slate-400">{user?.fullName}</p>
        <p className="text-slate-400">Join date : {formattedDate}</p>
      </div>
    </div>
  );
};
export default UserInformation;
