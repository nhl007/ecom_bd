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
import React, { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import isEmail from "validator/lib/isEmail";
import { isStrongPassword } from "validator";
import { cn } from "@/lib/utils";
import { registerUser } from "@/actions/authentication";
import { useToast } from "./ui/use-toast";
import { users } from "@/db/users.schema";

interface IRegisterForm {
  user: typeof users.$inferSelect;
  setUser: React.Dispatch<React.SetStateAction<typeof users.$inferSelect>>;
  userList: (typeof users.$inferSelect)[];
  setUsersList: React.Dispatch<
    React.SetStateAction<(typeof users.$inferSelect)[]>
  >;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RegisterForm({
  user,
  setUser,
  userList,
  setUsersList,
  setModal,
}: IRegisterForm) {
  const { toast } = useToast();

  const [pending, startTransition] = useTransition();

  const [formError, setFormError] = useState<TFormError>({
    name: "",
    email: "",
    password: {
      score: 0,
      message: "",
    },
  });

  const debouncedEmailErrorCheck = useDebouncedCallback<
    (value: string) => void
  >((value) => {
    const isValid = value.length < 60 && isEmail(value);

    if (isValid) {
      setFormError((prev) => ({ ...prev, email: "" }));
    } else
      setFormError((prev) => ({
        ...prev,
        email: "Not a valid email address!",
      }));
  }, 1500);

  const debouncedPasswordErrorCheck = useDebouncedCallback<
    (value: string) => void
  >((value) => {
    if (value.length < 7)
      return setFormError((prev) => ({
        ...prev,
        password: {
          score: 1,
          message: "Minimum 7 characters required!",
        },
      }));

    const score = isStrongPassword(value, {
      minLength: 7,
      returnScore: true,
    });

    setFormError((prev) => ({
      ...prev,
      password: {
        score: score,
        message:
          score > 40
            ? "Strong Password !"
            : score > 25
            ? "Password Can be stronger !"
            : " Weak Password !",
      },
    }));
  }, 1500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "name") {
      if (e.target.value.length < 2)
        setFormError((prev) => ({
          ...prev,
          name: "Username must be at least 2 characters.",
        }));
      else setFormError((prev) => ({ ...prev, name: "" }));
    } else if (e.target.name === "email") {
      debouncedEmailErrorCheck(e.target.value);
    } else {
      debouncedPasswordErrorCheck(e.target.value);
    }

    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const registerSubmit = () => {
    if (!user.name)
      setFormError((prev) => ({
        ...prev,
        name: "Name is required to create an account!",
      }));
    if (!user.email)
      setFormError((prev) => ({
        ...prev,
        email: "Email is required to create an account!",
      }));
    if (!user.password)
      setFormError((prev) => ({
        ...prev,
        password: {
          score: 1,
          message: "Password is required to create an account!",
        },
      }));

    if (formError.email || formError.name || formError.password.score === 1) {
      const errorDes = Object.values(formError)
        .reduce((acc: string[], val) => {
          if (typeof val === "string") {
            if (val.trim() !== "") {
              acc.push(val);
            }
          } else if (typeof val === "object" && val.message) {
            acc.push(val.message);
          }
          return acc;
        }, [])
        .join(", ");

      return toast({
        variant: "destructive",
        title: "Invalid User Details!",
        description: errorDes,
      });
    }
    startTransition(async () => {
      const result = await registerUser(user);
      if (!result.success) {
        toast({
          title: result.message,
          variant: result.success ? "default" : "destructive",
        });
      } else {
        const filterNewCat = userList.filter((c) => c.id !== result.user?.id);
        // @ts-ignore
        setUsersList([...filterNewCat, result.user]);
        setModal(false);
      }
    });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label
              className={formError.name ? "text-red-500" : ""}
              htmlFor="name"
            >
              Name
            </Label>
            <Input
              onChange={handleChange}
              value={user.name}
              name="name"
              placeholder="Max"
              required
            />
            {formError.name && (
              <p className=" text-red-500 text-sm font-medium">
                {formError.name}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              className={formError.email ? "text-red-500" : ""}
              htmlFor="email"
            >
              Email
            </Label>
            <Input
              onChange={handleChange}
              name="email"
              type="email"
              value={user.email}
              placeholder="m@example.com"
              required
            />
            {formError.email && (
              <p className=" text-red-500 text-sm font-medium">
                {formError.email}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label
              className={
                formError.password.score === 0
                  ? ""
                  : formError.password.score > 40
                  ? "text-green-500"
                  : formError.password.score > 25
                  ? " text-yellow-500"
                  : "text-red-500"
              }
              htmlFor="password"
            >
              Password
            </Label>
            <Input onChange={handleChange} name="password" type="password" />
            {!!formError.password.score && (
              <p
                className={cn(
                  "text-sm font-medium",
                  formError.password.score === 0
                    ? ""
                    : formError.password.score > 40
                    ? "text-green-500"
                    : formError.password.score > 25
                    ? " text-yellow-500"
                    : "text-red-500"
                )}
              >
                {formError.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full
          
          "
            disabled={pending}
            loader={pending}
            onClick={registerSubmit}
          >
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
