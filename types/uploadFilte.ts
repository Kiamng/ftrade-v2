export type uploadFileResponse = {
  status: number;
  message: string;
  data: {
    fileUri: string;
  };
};
