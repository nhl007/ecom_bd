"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import {
  registerUser,
  resetPassword,
  signInUser,
} from "@/actions/authentication";
import useAlertState from "@/hooks/useAlertState";
import { AlertTriangleIcon } from "lucide-react";
import isEmail from "validator/lib/isEmail";

export function LoginForm() {
  const [passwordReset, setPasswordReset] = useState(false);

  const [alertMain, setAlertMain] = useAlertState<string>(null);

  const [pending, startTransition] = useTransition();

  const [user, setUser] = useState<Omit<TUser, "name">>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const loginSubmit = () => {
    startTransition(async () => {
      if (user.email === "") return setAlertMain("No email Provided!");
      if (user.password === "") return setAlertMain("No password Provided!");
      const result = await signInUser(user);
      // const result = await registerUser({
      //   email: "admin@oasis.com",
      //   name: "Super Admin",
      //   password: "oasis@123456",
      // });
      if (result) {
        setAlertMain(typeof result == "string" ? result : result.message);
      }
    });
  };

  const passwordResetSubmit = () => {
    startTransition(async () => {
      if (user.email === "") return setAlertMain("No email Provided!");
      if (!isEmail(user.email)) return setAlertMain("Not a valid email!");

      const result = await resetPassword(user.email);
      if (result) {
        setAlertMain(result);
      }
    });
  };

  return (
    <Card className=" mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {passwordReset ? "Password Reset" : "Login"}
        </CardTitle>
        <CardDescription>
          {passwordReset
            ? "Enter your email below to reset your password"
            : "Enter your email below to login to your account"}
        </CardDescription>
      </CardHeader>
      {!passwordReset ? (
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                type="email"
                onChange={handleChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  className=" ml-auto"
                  onClick={() => setPasswordReset(true)}
                  variant="link"
                >
                  Forgot your password?
                </Button>
              </div>
              <Input
                onChange={handleChange}
                name="password"
                type="password"
                required
              />
              {alertMain && (
                <p className="text-white font-semibold rounded-md flex gap-2 bg-red-400 text-sm py-2 mt-1 px-2 text-center">
                  <AlertTriangleIcon size={16} /> {alertMain}
                </p>
              )}
            </div>
            <Button
              disabled={pending}
              onClick={loginSubmit}
              type="submit"
              className="w-full"
              loader={pending}
            >
              Login
            </Button>
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <div className="grid gap-4">
            <Input onChange={handleChange} name="email" type="email" required />
            {alertMain && (
              <p className="text-white font-semibold rounded-md flex gap-2 bg-red-400 text-sm py-2 mt-1 px-2 text-center">
                <AlertTriangleIcon size={16} /> {alertMain}
              </p>
            )}
            <Button
              disabled={pending}
              onClick={passwordResetSubmit}
              type="submit"
              className="w-full"
              loader={pending}
            >
              Login
            </Button>
          </div>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => setPasswordReset(false)} variant="link">
              Go Back
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
