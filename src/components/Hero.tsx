import { ArrowRight, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Background image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('https://www.ppic.org/wp-content/uploads/2017/04/UCLACampusWithFountain.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      />
      {/* Semi-transparent overlay */}
      <div
        className="absolute inset-0 bg-background/70 z-10"
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 z-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {/*
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-background/50 backdrop-blur mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs">
              ISSN 9999-999X • Volume 12, 2025
            </span>
          </div>
          */}

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight">
            UCLA Undergraduate
            <br />
            <span className="text-muted-foreground">
              Law Journal
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            UCLA's premier undergraduate law journal.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative bg-white dark:bg-gray-950 rounded-full shadow-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by topic, author, or keyword..."
                className="h-14 pl-12 pr-32 bg-white dark:bg-gray-950 border-0 rounded-[2rem] focus-visible:ring-offset-0"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-medium text-foreground cursor-pointer hover:text-primary">
                Search
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="group">
              Read Latest Issue
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              Submission Guidelines
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}