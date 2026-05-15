"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { useUsers, useUpdateUserRole, useDeleteUser } from "@/hooks/use-admin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Filter,
  Trash2,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import type { AppRole } from "@/api/profile";

export default function UserManagementForm() {
  const { data: users, isLoading, error } = useUsers();
  const updateRoleMutation = useUpdateUserRole();
  const deleteUserMutation = useDeleteUser();

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredUsers = users?.filter((u) => {
    const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
    const matchSearch =
      !search ||
      fullName.includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      filterRole === "all" || u.role === filterRole;

    return matchSearch && matchRole;
  }) || [];

  async function changeRole(id: string, role: AppRole) {
    try {
      await updateRoleMutation.mutateAsync({ userId: id, role });
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  }

  async function handleDeleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6b0f1a]" />
          <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <p className="text-destructive font-medium">Error loading users</p>
          <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-12 bg-[#6b0f1a]" />

        <div className="flex-1 px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">
            User Management
          </h2>

          {/* Table Card */}
          <div className="rounded-lg border p-4 flex flex-col gap-4 bg-background">

            {/* Toolbar */}
            <div className="flex items-center gap-2">

              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>

                <Input
                  className="pl-8 h-8 text-sm"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              {/* Filters */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-sm"
              >
                <Filter size={13} />
                Filters
              </Button>

              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) =>
                  setFilterRole(e.target.value)
                }
                className="h-8 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="faculty">Faculty</option>
                <option value="department_chair">Dept Chair</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex-1" />
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">
                    User
                  </TableHead>

                  <TableHead className="text-xs font-semibold">
                    Email
                  </TableHead>

                  <TableHead className="text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      Role
                      <ArrowUpDown
                        size={12}
                        className="text-muted-foreground"
                      />
                    </span>
                  </TableHead>

                  <TableHead className="text-xs font-semibold">
                    Employment
                  </TableHead>

                  <TableHead className="text-xs font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>

                    {/* User */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6b0f1a] text-white flex items-center justify-center text-xs font-medium uppercase">
                          {u.first_name?.[0]}{u.last_name?.[0]}
                        </div>

                        <span className="text-sm font-medium">
                          {u.first_name} {u.last_name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-sm">
                      {u.email}
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <select
                        value={u.role}
                        disabled={updateRoleMutation.isPending}
                        onChange={(e) =>
                          changeRole(u.id, e.target.value as AppRole)
                        }
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs disabled:opacity-50"
                      >
                        <option value="faculty">
                          Faculty
                        </option>

                        <option value="department_chair">
                          Dept Chair
                        </option>

                        <option value="admin">
                          Admin
                        </option>
                      </select>
                    </TableCell>

                    {/* Employment */}
                    <TableCell className="text-sm">
                      {u.employment_type || "N/A"}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deleteUserMutation.isPending}
                          className="h-7 w-7 text-destructive hover:text-destructive disabled:opacity-50"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">
                Showing {filteredUsers.length} users
              </span>

              <Pagination className="w-auto mx-0">
                <PaginationContent className="gap-0.5">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      className="h-7 px-2 text-xs"
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive
                      className="h-7 w-7 text-xs"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      className="h-7 px-2 text-xs"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
