"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";

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
  Plus,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "faculty" | "chair" | "admin";
  dept: string;
  initials: string;
  joined: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juandelacruz@up.edu.ph",
    role: "faculty",
    dept: "DMPCS",
    initials: "JD",
    joined: "05/14/2026",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "mariasantos@up.edu.ph",
    role: "chair",
    dept: "DMPCS",
    initials: "MS",
    joined: "05/10/2026",
  },
];

export default function UserManagementForm() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const [showAdd, setShowAdd] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "faculty",
    dept: "DMPCS",
  });

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      filterRole === "all" || u.role === filterRole;

    return matchSearch && matchRole;
  });

  function changeRole(id: number, role: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, role: role as User["role"] }
          : u
      )
    );
  }

  function deleteUser(id: number) {
    setUsers((prev) =>
      prev.filter((u) => u.id !== id)
    );
  }

  function addUser() {
    const initials =
      newUser.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase() || "NU";

    const user: User = {
      id: Date.now(),
      ...newUser,
      role: newUser.role as User["role"],
      initials,
      joined: new Date().toLocaleDateString(),
    };

    setUsers((prev) => [...prev, user]);

    setNewUser({
      name: "",
      email: "",
      role: "faculty",
      dept: "DMPCS",
    });

    setShowAdd(false);
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
                <option value="chair">Dept Chair</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex-1" />

              {/* Add User */}
              <Button
                size="sm"
                className="h-8 gap-1.5 text-sm bg-foreground text-background hover:bg-foreground/90"
                onClick={() => setShowAdd(true)}
              >
                <Plus size={13} />
                Add User
              </Button>
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
                    Department
                  </TableHead>

                  <TableHead className="text-xs font-semibold">
                    Joined
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
                        <div className="w-8 h-8 rounded-full bg-[#6b0f1a] text-white flex items-center justify-center text-xs font-medium">
                          {u.initials}
                        </div>

                        <span className="text-sm font-medium">
                          {u.name}
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
                        onChange={(e) =>
                          changeRole(u.id, e.target.value)
                        }
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="faculty">
                          Faculty
                        </option>

                        <option value="chair">
                          Dept Chair
                        </option>

                        <option value="admin">
                          Admin
                        </option>
                      </select>
                    </TableCell>

                    {/* Department */}
                    <TableCell className="text-sm">
                      {u.dept}
                    </TableCell>

                    {/* Joined */}
                    <TableCell className="text-sm">
                      {u.joined}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => deleteUser(u.id)}
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

                  {[1, 2, 3].map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === 1}
                        className="h-7 w-7 text-xs"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationEllipsis className="h-7 w-7" />
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

        {/* Add User Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-background rounded-lg border w-full max-w-md p-6 space-y-4">

              <div>
                <h3 className="text-lg font-semibold">
                  Add User
                </h3>

                <p className="text-sm text-muted-foreground">
                  Create a new user account
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />

                <Input
                  placeholder="UP Email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />

                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="faculty">
                    Faculty
                  </option>

                  <option value="chair">
                    Dept Chair
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </Button>

                <Button onClick={addUser}>
                  Add User
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}