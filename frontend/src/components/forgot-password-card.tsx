import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth";
import { Link } from "react-router-dom";

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

export default function ForgotPasswordCard() {
  const { forgotPassword, isLoading, forgotPasswordError, isForgotPasswordSuccess } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      await forgotPassword(data.email);
    } catch (error) {
      console.error("Forgot password request failed:", error);
    }
  }

  if (isForgotPasswordSuccess) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="px-8 pt-8 pb-4 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
          <CardDescription>
            We've sent a password reset link to your email address.
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

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="px-8 pt-8 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 px-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">UP Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {forgotPasswordError && (
            <p className="text-sm font-medium text-destructive">
              {forgotPasswordError instanceof Error ? forgotPasswordError.message : "Request failed"}
            </p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Sending link..." : "Send reset link"}
          </Button>
        </CardContent>

        <CardFooter className="justify-center px-8 pt-2 pb-8">
          <p className="text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
