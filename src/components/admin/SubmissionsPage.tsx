import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { Submission } from "../../types/submission";

// This will come from your API later
const mockSubmissions: Submission[] = [
  {
    id: "1",
    title: "The Evolution of Privacy Law in the Digital Age",
    author: "Jane Smith",
    submittedDate: "2025-10-25",
    status: "pending",
  },
  {
    id: "2",
    title: "Constitutional Implications of AI Governance",
    author: "John Doe",
    submittedDate: "2025-10-24",
    status: "approved",
  },
];

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState(mockSubmissions);

  const handleApprove = (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, status: "approved" } : sub
      )
    );
  };

  const handleReject = (id: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, status: "rejected" } : sub
      )
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="font-medium">{submission.title}</TableCell>
              <TableCell>{submission.author}</TableCell>
              <TableCell>{submission.submittedDate}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    submission.status === "approved"
                      ? "success"
                      : submission.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {submission.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(submission.id)}
                    disabled={submission.status === "approved"}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(submission.id)}
                    disabled={submission.status === "rejected"}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}