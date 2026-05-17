import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserRole, deleteUser, getDepartments, updateUserDepartment } from "@/api/admin";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "faculty" | "department_chair" | "admin" }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUserDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, departmentId }: { userId: string; departmentId: number }) =>
      updateUserDepartment(userId, departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
