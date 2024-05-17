interface IPasswordResetParams {
  searchParams: { token: string };
}

const page = ({ searchParams: { token } }: IPasswordResetParams) => {
  console.log(token);
  return <div>{token}</div>;
};

export default page;
