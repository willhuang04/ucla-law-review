import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { useOrganization } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
// import { AdminDebug } from "./AdminDebug";
// import { SupabaseTest } from "./SupabaseTest";

type Member = {
  id: string;
  role: string;
  publicUserData: {
    firstName: string | null;
    lastName: string | null;
    identifier: string;
  };
  createdAt: string;
};

export function UsersPage() {
  const { organization, isLoaded } = useOrganization();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    async function fetchMembers() {
      try {
        setLoading(true);
        setError(null);
        if (!organization) {
          setMembers([]);
          setLoading(false);
          return;
        }
        const membersList = await organization.getMemberships();
        const membersArray = membersList.data.map((member: any) => ({
          id: member.id,
          role: member.role,
          publicUserData: {
            firstName: member.publicUserData?.firstName ?? null,
            lastName: member.publicUserData?.lastName ?? null,
            identifier: member.publicUserData?.identifier ?? ''
          },
          createdAt: new Date(member.createdAt).toISOString()
        }));
        setMembers(membersArray);
      } catch (err) {
        setError('Failed to load members. Please try again later.');
        setMembers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [organization, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
        </div>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
        </div>
        <div>To manage users, you need to create an organization first.</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      {error && (
        <div className="mb-4 text-red-600">{error}</div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  {member.publicUserData.firstName} {member.publicUserData.lastName}
                </TableCell>
                <TableCell>{member.publicUserData.identifier}</TableCell>
                <TableCell>
                  <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(member.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(member.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}