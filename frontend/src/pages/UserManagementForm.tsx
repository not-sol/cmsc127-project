"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/sidebar";
import { useUsers, useUpdateUserRole, useDeleteUser, useDepartments, useUpdateUserDepartment } from "@/hooks/use-admin";

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
  Trash2,
  Loader2,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserMinus,
  ArrowRightLeft,
} from "lucide-react";
import type { AppRole, UserProfile } from "@/api/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GroupedUser = UserProfile & { departments: { department_name: string } | null };

export default function UserManagementForm() {
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers();
  const { data: departments, isLoading: deptsLoading, error: deptsError } = useDepartments();
  const updateRoleMutation = useUpdateUserRole();
  const updateDeptMutation = useUpdateUserDepartment();
  const deleteUserMutation = useDeleteUser();

  const [search, setSearch] = useState("");
  const [expandedDepts, setExpandedDepts] = useState<Record<number, boolean>>({});

  const groupedData = useMemo(() => {
    if (!users || !departments) return [];

    const searchLower = search.toLowerCase();

    return departments.map(dept => {
      const deptUsers = users.filter(u => u.department_id === dept.department_id);

      const filteredUsers = deptUsers.filter(u => {
        const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
        return !search || fullName.includes(searchLower) || u.email.toLowerCase().includes(searchLower);
      });

      const chair = filteredUsers.find(u => u.role === "department_chair");
      const faculty = filteredUsers.filter(u => u.role === "faculty" || u.role === "admin");

      return {
        ...dept,
        chair,
        faculty,
        totalInDept: filteredUsers.length
      };
    }).filter(dept => dept.totalInDept > 0 || !search);
  }, [users, departments, search]);

  const toggleDept = (id: number) => {
    setExpandedDepts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  async function handleRoleChange(userId: string, newRole: AppRole) {
    try {
      await updateRoleMutation.mutateAsync({ userId, role: newRole });
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update role. A department might already have a chair.");
    }
  }

  async function handleDeptChange(userId: string, newDeptId: string) {
    try {
      await updateDeptMutation.mutateAsync({ userId, departmentId: parseInt(newDeptId) });
    } catch (err) {
      console.error("Failed to update department:", err);
      alert("Failed to update department.");
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

  if (usersLoading || deptsLoading) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6b0f1a]" />
          <p className="mt-2 text-sm text-muted-foreground">Loading management data...</p>
        </main>
      </div>
    );
  }

  if (usersError || deptsError) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <p className="text-destructive font-medium">Error loading data</p>
          <p className="text-sm text-muted-foreground">
            {((usersError || deptsError) as Error).message}
          </p>
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

        <div className="flex-1 px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              User Management
            </h2>

            <div className="relative w-72">
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
                className="pl-8 h-9 text-sm"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {groupedData.map((dept) => (
              <Card key={dept.department_id} className="overflow-hidden border-none shadow-sm">
                <CardHeader
                  className="bg-background hover:bg-muted/50 transition-colors cursor-pointer py-4 px-6 select-none"
                  onClick={() => toggleDept(dept.department_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#6b0f1a]/10 rounded-lg text-[#6b0f1a]">
                        <User size={18} />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">{dept.department_name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {dept.totalInDept} members • {dept.chair ? "Chair assigned" : "No chair assigned"}
                        </p>
                      </div>
                    </div>
                    {expandedDepts[dept.department_id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </CardHeader>

                {expandedDepts[dept.department_id] && (
                  <CardContent className="p-6 bg-muted/10 border-t">
                    <div className="space-y-8">
                      {/* Department Chair Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <ShieldCheck size={16} className="text-[#6b0f1a]" />
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Department Chair
                          </h3>
                        </div>

                        {dept.chair ? (
                          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-[#6b0f1a]/20 shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#6b0f1a] text-white flex items-center justify-center font-bold">
                                {dept.chair.first_name?.[0]}{dept.chair.last_name?.[0]}
                              </div>
                              <div>
                                <p className="font-semibold">{dept.chair.first_name} {dept.chair.last_name}</p>
                                <p className="text-sm text-muted-foreground">{dept.chair.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={dept.chair.department_id?.toString()}
                                    onValueChange={(val) => handleDeptChange(dept.chair!.id, val)}
                                >
                                    <SelectTrigger className="w-[200px] h-8 text-xs">
                                        <ArrowRightLeft size={12} className="mr-2" />
                                        <SelectValue placeholder="Move Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments?.map((d) => (
                                            <SelectItem key={d.department_id} value={d.department_id.toString()}>
                                                {d.department_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-2 text-xs"
                                  disabled={updateRoleMutation.isPending}
                                  onClick={() => handleRoleChange(dept.chair!.id, 'faculty')}
                                >
                                  <UserMinus size={14} />
                                  Demote
                                </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-background/50 border border-dashed rounded-lg text-center">
                            <p className="text-sm text-muted-foreground">No chair assigned to this department.</p>
                          </div>
                        )}
                      </div>

                      {/* Faculty List Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <User size={16} className="text-muted-foreground" />
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Faculty Members
                          </h3>
                        </div>

                        <div className="rounded-lg border bg-background overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent bg-muted/50">
                                <TableHead className="w-[250px] text-xs font-bold uppercase py-3">Name</TableHead>
                                <TableHead className="text-xs font-bold uppercase py-3">Email</TableHead>
                                <TableHead className="w-[180px] text-xs font-bold uppercase py-3">Move Dept</TableHead>
                                <TableHead className="text-right text-xs font-bold uppercase py-3">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dept.faculty.length > 0 ? (
                                (dept.faculty as GroupedUser[]).map((f) => (
                                  <TableRow key={f.id} className="hover:bg-muted/5">
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                                          {f.first_name?.[0]}{f.last_name?.[0]}
                                        </div>
                                        <span className="text-sm font-medium">{f.first_name} {f.last_name}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{f.email}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={f.department_id?.toString()}
                                            onValueChange={(val) => handleDeptChange(f.id, val)}
                                        >
                                            <SelectTrigger className="w-full h-8 text-xs bg-transparent border-dashed">
                                                <SelectValue placeholder="Move" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments?.map((d) => (
                                                    <SelectItem key={d.department_id} value={d.department_id.toString()}>
                                                        {d.department_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 gap-1.5 text-xs hover:bg-[#6b0f1a]/5 hover:text-[#6b0f1a]"
                                          disabled={updateRoleMutation.isPending || !!dept.chair}
                                          onClick={() => handleRoleChange(f.id, 'department_chair')}
                                          title={dept.chair ? "Demote current chair first" : "Promote to Chair"}
                                        >
                                          <UserPlus size={14} />
                                          Promote
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-destructive hover:bg-destructive/5 hover:text-destructive"
                                          disabled={deleteUserMutation.isPending}
                                          onClick={() => handleDeleteUser(f.id)}
                                        >
                                          <Trash2 size={14} />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No other faculty members found.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            {groupedData.length === 0 && !usersLoading && (
              <div className="text-center py-20 bg-background rounded-lg border border-dashed">
                <p className="text-muted-foreground">No users found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
