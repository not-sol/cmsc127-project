import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmail, signUpNewUser, signOut, resetPasswordForEmail, updatePassword } from "@/api/auth";
import { useAuthStore } from "@/store/auth-store";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth";

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

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => resetPasswordForEmail(email),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (password: string) => updatePassword(password),
  });

  return {
    user,
    session,
    isLoading: loading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending || forgotPasswordMutation.isPending || resetPasswordMutation.isPending,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    isForgotPasswordSuccess: forgotPasswordMutation.isSuccess,
    isResetPasswordSuccess: resetPasswordMutation.isSuccess,
  };
}
