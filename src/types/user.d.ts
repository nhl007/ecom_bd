type TUser = {
  name: string;
  email: string;
  password: string;
};

type TFormError = {
  name: string;
  email: string;
  password: {
    score: number;
    message: string;
  };
};
