import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
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
} from "@/components/ui/card";

export default function LoginCard() {
  const { login, isLoading, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      await login(data);
    } catch (error: any) {
      console.error("Login failed:", error);
      // The error is already handled by the mutation and available via loginError
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="px-8 pt-8 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">Log in</CardTitle>
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

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-primary hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>
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

          {loginError && (
            <p className="text-sm font-medium text-destructive">
              {loginError instanceof Error ? loginError.message : "Login failed"}
            </p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>

        <CardFooter className="justify-center px-8 pt-2 pb-8">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
