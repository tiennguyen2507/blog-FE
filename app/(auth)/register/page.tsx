"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import httpRequest from "@/lib/httpRequest";
import { useRouter } from "next/navigation";
import UploadFile from "@/components/ui/UploadFile";
import { Loader } from "lucide-react";

// Custom hook để đăng ký
type RegisterData = z.infer<typeof formSchema>;
function useRegister() {
  const [error, setError] = React.useState<string | null>(null);

  const register = async (data: RegisterData) => {
    setError(null);
    try {
      const response = await httpRequest.post("/auth/register", data);
      return response.data;
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const errorObj = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        setError(
          errorObj.response?.data?.message ||
            errorObj.message ||
            "Đăng ký thất bại"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đăng ký thất bại");
      }
      throw err;
    }
  };

  return { register, error };
}

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  avatar: z.string().optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const [avatarFile, setAvatarFile] = React.useState<File | undefined>(
    undefined
  );
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const { register: registerUser, error } = useRegister();

  async function onSubmit(values: RegisterData) {
    setIsSubmitting(true);
    try {
      let avatar = avatarUrl;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("folder", "avatar");
        const res = await httpRequest.post("/image/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        avatar = res.data?.secure_url || res.data?.url;
        setAvatarUrl(avatar);
      }
      const result = await registerUser({ ...values, avatar });
      if (result && result.access_token && result.refresh_token) {
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("refresh_token", result.refresh_token);
      }
      toast.success("Account created!", {
        description: "Your account has been created successfully.",
      });
      router.push("/dashboard/blogs");
    } catch (err: unknown) {
      let msg: string | null = error;
      if (
        !msg &&
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const errorObj = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        msg = errorObj.response?.data?.message || errorObj.message || null;
      } else if (!msg && err instanceof Error) {
        msg = err.message || null;
      }
      toast.error("Đăng ký thất bại", {
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <UploadFile onChange={setAvatarFile} />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                "Create an account"
              )}
            </Button>
          </form>
        </Form>
        {error && (
          <div className="text-red-500 text-center text-sm mt-2">{error}</div>
        )}
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
