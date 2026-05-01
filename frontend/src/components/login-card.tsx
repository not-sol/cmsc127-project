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
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="px-8 pt-8 pb-4">
        <CardTitle className="text-2xl">Log in</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">UP Email</Label>
          <Input id="email" type="email" placeholder="username@up.edu.ph" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>

        <Button type="submit" className="w-full mt-2">
          Login with Email
        </Button>
      </CardContent>

      <CardFooter className="justify-center px-8 pt-2 pb-8">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/signup" className="underline">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
