import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react"

export function AuthCheck() {
  const { isSignedIn, user } = useUser()

  if (!isSignedIn) {
    return (
      <div className="flex gap-4">
        <SignInButton mode="modal">
          <button className="text-sm font-medium hover:text-primary">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="text-sm font-medium hover:text-primary">
            Sign Up
          </button>
        </SignUpButton>
      </div>
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