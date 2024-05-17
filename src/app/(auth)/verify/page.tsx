import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/configs/db";
import { verificationTokens } from "@/db/users.schema";
import { eq } from "drizzle-orm";
import { ArrowLeftCircleIcon, CheckCircle2, X } from "lucide-react";
import Link from "next/link";

interface IEmailVerificationParams {
  searchParams: { token: string };
}

const page = async ({ searchParams: { token } }: IEmailVerificationParams) => {
  const vT = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token));

  if (!vT.length)
    return (
      <div className=" flex justify-center items-center min-h-screen min-w-full">
        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              Thank you for signing up with daart!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <p className=" flex gap-2">
              <X color="red" /> Invalid Token
            </p>
          </CardContent>
          <CardFooter className=" text-sm">
            <Link
              className="flex items-center gap-2 mx-auto hover:underline"
              href="/sign-in"
            >
              <ArrowLeftCircleIcon size={14} /> Go Back
            </Link>
          </CardFooter>
        </Card>
      </div>
    );

  const expired = new Date(vT[0].expires) < new Date();

  if (expired)
    return (
      <div className=" flex justify-center items-center min-h-screen min-w-full">
        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              Thank you for signing up with daart!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <p className=" flex gap-2">
              <X color="red" /> Token Expired
            </p>
          </CardContent>
          <CardFooter className=" text-sm">
            <Link
              className="flex items-center gap-2 mx-auto hover:underline"
              href="/sign-in"
            >
              <ArrowLeftCircleIcon size={14} /> Go Back
            </Link>
          </CardFooter>
        </Card>
      </div>
    );

  const tokenMatch = vT[0].token === token;

  if (tokenMatch)
    return (
      <div className=" flex justify-center items-center min-h-screen min-w-full">
        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              Thank you for signing up with daart!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <p className=" flex gap-2">
              <CheckCircle2 color="green" /> Token Verified
            </p>
          </CardContent>
          <CardFooter className=" text-sm">
            <Link
              className="flex items-center gap-2 mx-auto hover:underline"
              href="/sign-in"
            >
              <ArrowLeftCircleIcon size={14} /> Go Back
            </Link>
          </CardFooter>
        </Card>
      </div>
    );

  return <p>System Error</p>;
};

export default page;
