import { Mail, Twitter, Linkedin, Github } from "lucide-react";
import { Separator } from "./ui/separator";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded bg-primary" />
              <div className="flex flex-col">
                <span className="tracking-tight">UCLA</span>
                <span className="text-xs text-muted-foreground tracking-tight">Law Journal</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Publishing cutting-edge legal scholarship from undergraduate researchers.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Journal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("about");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("about");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Editorial Board
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("submit");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Review Process
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("publications");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Archives
                </a>
              </li>
            </ul>
          </div>

          {/* For Authors */}
          <div>
            <h4 className="mb-4">For Authors</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("submit");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Submission Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("submit");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Style Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("submit");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Publication Ethics
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("about");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Open Access Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("home");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("home");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Newsletter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("contact");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("contact");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 UCLA Undergraduate Law Journal • ISSN 9999-999X</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
