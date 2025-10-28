import { useUser, useOrganization } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// List of admin user IDs from Clerk
export const ADMIN_IDS: string[] = [
  'user_34hdyqWmC8PkJs1U4j3tatbqQFT',
];

// Helper function to check if a user is an admin
export function isAdmin(userId: string | null): boolean {
  return userId ? ADMIN_IDS.includes(userId) : false;
}

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  const [checkingOrgAdmin, setCheckingOrgAdmin] = useState(true);

  useEffect(() => {
    async function checkOrgAdmin() {
      if (!orgLoaded || !organization || !user) {
        console.log('AdminRoute: Not loaded or missing org/user', { orgLoaded, organization: !!organization, user: !!user });
        setIsOrgAdmin(false);
        setCheckingOrgAdmin(false);
        return;
      }
      
      setCheckingOrgAdmin(true);
      try {
        const memberships = await organization.getMemberships();
        console.log('AdminRoute: Fetched memberships', memberships.data);
        console.log('AdminRoute: Current user ID', user.id);
        console.log('AdminRoute: Current user email', user.primaryEmailAddress?.emailAddress);
        
        // Try multiple ways to find the user's membership
        const userMembership = memberships.data.find((m: any) => {
          console.log('AdminRoute: Checking membership', m);
          return (
            m.publicUserData?.userId === user.id ||
            m.publicUserData?.identifier === user.primaryEmailAddress?.emailAddress ||  
            m.publicUserData?.identifier === user.id ||
            m.userId === user.id
          );
        });
        console.log('AdminRoute: Found user membership', userMembership);
        const isAdmin = userMembership?.role === "org:admin";
        console.log('AdminRoute: Is org admin?', isAdmin, 'Role:', userMembership?.role);
        setIsOrgAdmin(isAdmin);
      } catch (error) {
        console.error('AdminRoute: Error checking org admin', error);
        setIsOrgAdmin(false);
      } finally {
        setCheckingOrgAdmin(false);
      }
    }

    checkOrgAdmin();
  }, [organization, orgLoaded, user]);

  if (!isLoaded || !orgLoaded || checkingOrgAdmin) {
    console.log('AdminRoute: Still loading...', { isLoaded, orgLoaded, checkingOrgAdmin });
    return <div>Loading...</div>;
  }

  // Check if user is application admin OR organization admin
  const isAppAdmin = user && ADMIN_IDS.includes(user.id);
  
  console.log('AdminRoute: Final access check', {
    isSignedIn,
    isAppAdmin,
    isOrgAdmin,
    checkingOrgAdmin,
    userId: user?.id,
    hasAccess: isSignedIn && (isAppAdmin || isOrgAdmin)
  });
  
  if (!isSignedIn || (!isAppAdmin && !isOrgAdmin)) {
    console.log('AdminRoute: Access denied - redirecting to home');
    return <Navigate to="/" />;
  }

  console.log('AdminRoute: Access granted - rendering admin page');
  return <>{children}</>;
}