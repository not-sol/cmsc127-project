import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmail, signUpNewUser, signOut } from "@/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, session, loading } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormValues) => signInWithEmail(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterFormValues) => signUpNewUser(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    user,
    session,
    isLoading: loading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
  };
}
