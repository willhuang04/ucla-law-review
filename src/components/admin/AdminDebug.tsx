import { useUser, useOrganization } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export function AdminDebug() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const [memberships, setMemberships] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMemberships() {
      if (organization) {
        try {
          const membersList = await organization.getMemberships();
          setMemberships(membersList.data);
        } catch (error) {
          console.error('Error fetching memberships:', error);
        }
      }
    }
    fetchMemberships();
  }, [organization]);

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-bold mb-4">Admin Debug Info</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold">Current User:</h4>
        <pre className="text-xs bg-white p-2 rounded">
          {JSON.stringify({
            id: user?.id,
            primaryEmailAddress: user?.primaryEmailAddress?.emailAddress,
            emailAddresses: user?.emailAddresses?.map(e => e.emailAddress),
            firstName: user?.firstName,
            lastName: user?.lastName
          }, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Organization:</h4>
        <pre className="text-xs bg-white p-2 rounded">
          {JSON.stringify({
            id: organization?.id,
            name: organization?.name,
            slug: organization?.slug
          }, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-semibold">Organization Memberships:</h4>
        <pre className="text-xs bg-white p-2 rounded max-h-60 overflow-y-auto">
          {JSON.stringify(memberships.map(m => ({
            id: m.id,
            role: m.role,
            userId: m.userId,
            publicUserData: m.publicUserData,
            createdAt: m.createdAt,
            // Show all top-level properties
            allProps: Object.keys(m)
          })), null, 2)}
        </pre>
      </div>
    </div>
  );
}