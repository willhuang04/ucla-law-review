import { useUser, useOrganization, useOrganizationList } from "@clerk/clerk-react";
import { useEffect } from "react";

// Your UCLA organization ID (you'll need to get this from Clerk dashboard)
const UCLA_ORG_ID = "org_YOUR_UCLA_ORG_ID"; // Replace with your actual org ID

export function AutoJoinOrganization() {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization } = useOrganization();
  const { setActive, isLoaded: orgListLoaded } = useOrganizationList();

  useEffect(() => {
    async function autoJoinUCLA() {
      // Wait for everything to be loaded
      if (!userLoaded || !orgListLoaded || !user || !setActive) return;
      
      // If user is already in an organization, skip
      if (organization) return;

      try {
        // Try to set the UCLA organization as active
        await setActive({ organization: UCLA_ORG_ID });
        console.log("User automatically joined UCLA organization");
      } catch (error) {
        console.log("Could not auto-join organization:", error);
      }
    }

    autoJoinUCLA();
  }, [userLoaded, orgListLoaded, user, organization, setActive]);

  return null; // This component doesn't render anything
}
