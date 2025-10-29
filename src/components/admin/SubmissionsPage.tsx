import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { supabase, type Submission } from "../../lib/supabase";
import { Skeleton } from "../ui/skeleton";
import { CheckCircle, XCircle, Clock, Eye, FileText } from "lucide-react";

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setSubmissions(data || []);
    } catch (err: any) {
      setError('Failed to load submissions. Please try again later.');
      console.error('Fetch submissions error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(submissionId: string) {
    setActionLoading(submissionId);
    try {
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'current_admin' // TODO: Get actual admin ID
        })
        .eq('id', submissionId);

      if (updateError) {
        throw updateError;
      }

      // Refresh submissions
      await fetchSubmissions();
      
    } catch (err: any) {
      setError('Failed to approve submission: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(submissionId: string) {
    if (!confirm('Are you sure you want to reject this submission? This action cannot be undone.')) {
      return;
    }

    setActionLoading(submissionId);
    try {
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ 
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'current_admin' // TODO: Get actual admin ID
        })
        .eq('id', submissionId);

      if (updateError) {
        throw updateError;
      }

      // Refresh submissions
      await fetchSubmissions();
      
    } catch (err: any) {
      setError('Failed to reject submission: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Submissions</h1>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
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
          <h1 className="text-2xl font-bold">Submissions</h1>
        </div>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Submissions</h1>
        <div className="text-sm text-muted-foreground">
          Total: {submissions.length} submissions
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium max-w-xs">
                  <div className="truncate" title={submission.title}>
                    {submission.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 truncate" title={submission.abstract}>
                    {submission.abstract.substring(0, 100)}...
                  </div>
                </TableCell>
                <TableCell>{submission.author_name}</TableCell>
                <TableCell>{submission.author_email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {submission.area}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(submission.status)}</TableCell>
                <TableCell>
                  {new Date(submission.submitted_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {submission.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(submission.id)}
                          disabled={!!actionLoading}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          {actionLoading === submission.id ? (
                            <Clock className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(submission.id)}
                          disabled={!!actionLoading}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          {actionLoading === submission.id ? (
                            <Clock className="h-3 w-3 animate-spin" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          Reject
                        </Button>
                      </>
                    )}
                    {submission.status !== 'pending' && (
                      <Button size="sm" variant="outline" disabled>
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No submissions yet</p>
                    <p className="text-xs">Submissions will appear here when users submit articles</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}