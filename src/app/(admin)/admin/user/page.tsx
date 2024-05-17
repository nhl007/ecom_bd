"use client";

import { deleteUserById, getAllUsers } from "@/actions/authentication";
import FullScreenModal from "@/components/FullScreenModal";
import LoadingSpinner from "@/components/Loading";
import { RegisterForm } from "@/components/RegisterUser";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/configs/auth";
import { users } from "@/db/users.schema";
import { ArrowRight, DeleteIcon, FileEditIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

const AdminUsers = () => {
  const session = useSession();
  const [userList, setUsersList] = useState<(typeof users.$inferSelect)[]>([]);
  const [newUsers, setNewUsers] = useState<typeof users.$inferSelect>({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
    emailVerified: null,
    id: "",
    image: null,
  });
  const [edit, setEdit] = useState(false);

  const [pending, startTransition] = useTransition();

  const initCat = async () => {
    startTransition(async () => {
      const cat = await getAllUsers();
      if (cat) return setUsersList(cat);
      toast({
        title: "Error Occurred!",
        variant: "destructive",
      });
    });
  };

  useEffect(() => {
    initCat();
  }, []);

  return (
    <div>
      {pending && <LoadingSpinner />}
      {edit && (
        <FullScreenModal<boolean> modalCloseValue={false} setModal={setEdit}>
          <RegisterForm
            setUser={setNewUsers}
            setUsersList={setUsersList}
            user={newUsers}
            userList={userList}
            setModal={setEdit}
          />
        </FullScreenModal>
      )}
      <div className=" flex text-xs gap-2 font-semibold items-center">
        <Link href="/admin">Home</Link>
        <ArrowRight size={15} />
        <span className=" text-main_accent">Users</span>
      </div>
      <h1 className="text-xl font-semibold  mt-2 mb-4 text-main_accent">
        Users
      </h1>
      <Button onClick={() => setEdit(true)}>Add New Users</Button>
      <Table className=" mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.name}</TableCell>
              <TableCell>{cat.email}</TableCell>
              <TableCell>{cat.role}</TableCell>

              <TableCell className="flex gap-1 items-center ">
                {/* @ts-ignore */}
                {session.data?.user.role === "Admin" ? (
                  <>
                    <Button
                      onClick={() => {
                        setEdit(true);
                        setNewUsers({
                          name: cat.name,
                          email: cat.email,
                          password: "",
                          role: cat.role,
                          image: null,
                          id: cat.id,
                          emailVerified: null,
                        });
                      }}
                      variant="ghost"
                    >
                      <FileEditIcon size={18} color="orange" />
                    </Button>
                    <Button
                      onClick={async () => {
                        const suc = await deleteUserById(cat.id);
                        if (suc) {
                          const filter = userList.filter(
                            (c) => c.name !== cat.name
                          );
                          setUsersList(() => filter);
                        } else
                          return toast({
                            title: "Error Occurred!",
                            variant: "destructive",
                          });
                      }}
                      variant="ghost"
                    >
                      <DeleteIcon size={18} color="red" />
                    </Button>
                  </>
                ) : (
                  <p>Only Admins Allowed</p>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUsers;
