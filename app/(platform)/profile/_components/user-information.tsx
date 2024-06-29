import Image from "next/image";
import defaultUserImg from "@/assets/img/user/default-avatar-icon-of-social-media-user-vector.jpg";

const UserInformationPage = () => {
  return (
    <div className="w-full">
      <div className="w-full flex flex-col justify-center">
        <Image
          src={defaultUserImg}
          height={100}
          width={100}
          alt="avatar"
          className="rounded-full"
        ></Image>
        <h1 className="text-3xl font-semibold">userName</h1>
        <p className="text-slate-400">fullName</p>
      </div>
    </div>
  );
};

export default UserInformationPage;
