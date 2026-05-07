import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validations/auth";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ResetPasswordCard() {
  const { resetPassword, isLoading, resetPasswordError, isResetPasswordSuccess, session } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isResetPasswordSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isResetPasswordSuccess, navigate]);

  async function onSubmit(data: ResetPasswordFormValues) {
    try {
      await resetPassword(data.password);
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  }

  if (!isLoading && !session && !isResetPasswordSuccess) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="px-8 pt-8 pb-4 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Invalid link</CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center px-8 pt-2 pb-8">
          <Link
            to="/login"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (isResetPasswordSuccess) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="px-8 pt-8 pb-4 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Password updated</CardTitle>
          <CardDescription>
            Your password has been successfully reset. Redirecting to login...
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center px-8 pt-2 pb-8">
          <Link
            to="/login"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Go to login now
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="px-8 pt-8 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">New password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 px-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {resetPasswordError && (
            <p className="text-sm font-medium text-destructive">
              {resetPasswordError instanceof Error ? resetPasswordError.message : "Reset failed"}
            </p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Updating password..." : "Update password"}
          </Button>
        </CardContent>

        <CardFooter className="justify-center px-8 pt-2 pb-8">
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-primary underline-offset-4"
          >
            Cancel and go back
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
