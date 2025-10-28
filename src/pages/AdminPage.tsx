import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "../components/admin/AdminLayout";
import { SubmissionsPage } from "../components/admin/SubmissionsPage";
import { UsersPage } from "../components/admin/UsersPage";

export function AdminPage() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/submissions" replace />} />
        <Route path="submissions" element={<SubmissionsPage />} />
        <Route path="users" element={<UsersPage />} />
      </Routes>
    </AdminLayout>
  );
}