export type Account = {
  accountId: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  userName: string;
  fullName: string;
  phoneNumber: string;
  joinDate: Date;
  roleId: number;
  denyRes: string;
  status: string;
};

export type UpdateAccount = {
  avatarUrl: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  userName: string;
  fullName: string;
  phoneNumber: string;
};
