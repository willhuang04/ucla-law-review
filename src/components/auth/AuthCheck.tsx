import { SignInButton, UserButton, useUser } from "@clerk/clerk-react"

export function AuthCheck() {
  const { isSignedIn, user } = useUser()

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className="text-sm font-medium hover:text-primary">
          Sign In
        </button>
      </SignInButton>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">
        {user.primaryEmailAddress?.emailAddress}
      </span>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}