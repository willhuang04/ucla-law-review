import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useSecret } from "../lib/secretMode";

export function UnlockPage() {
  const navigate = useNavigate();
  const { unlock, unlocked, lock } = useSecret();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = unlock(password);
    if (ok) {
      navigate("/publications");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError(true);
      setPassword("");
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-sm px-4">
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <h1 className="mb-2 text-center">Who is the best NBA player to ever live?</h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Enter the answer to continue.
          </p>

          {unlocked ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Hidden articles are unlocked for this session.
              </p>
              <div className="flex flex-col gap-2">
                <Button onClick={() => navigate("/publications")}>
                  View Publications
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    lock();
                    setError(false);
                  }}
                >
                  Lock again
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret-password">Passphrase</Label>
                <Input
                  id="secret-password"
                  type="password"
                  autoFocus
                  autoComplete="off"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="••••••"
                />
                {error && (
                  <p className="text-sm text-red-600">Incorrect passphrase.</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Unlock
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
