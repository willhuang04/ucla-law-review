export interface Submission {
  id: string;
  title: string;
  author: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
}