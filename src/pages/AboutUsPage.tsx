import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Mail } from "lucide-react";
import monicaHeadshot from "../assets/monica_headshot.png";
import williamHeadshot from "../assets/william_headshot.jpeg";
import jacobHeadshot from "../assets/jacob.png";

export function AboutUsPage() {
  const officers = [
    {
      name: "Jacob Rusting",
      title: "Director",
      major: "Political Science and History",
      year: "Class of 2027",
      bio: "",
      email: "Jrusting@ucla.edu",
      initials: "JR",
      image: jacobHeadshot, // No headshot available yet
    },
    {
      name: "Monica McCallin",
      title: "Director",
      major: "Political Science and Environmental Systems & Society Minor",
      year: "Class of 2026",
      bio: "",
      email: "monicamccallin@ucla.edu",
      initials: "MM",
      image: monicaHeadshot,
    },
    {
      name: "William Huang",
      title: "Director",
      major: "Political Science and Computer Science",
      year: "Class of 2026",
      bio: "",
      email: "willhuang04@ucla.edu",
      initials: "WH",
      image: williamHeadshot,
    },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="mb-6">About Us</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our current board members.
          </p>
        </div>

        {/* Officers Grid */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {officers.map((officer, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="grid md:grid-cols-[240px_1fr] gap-0">
                {/* Photo or Placeholder */}
                <div className="relative h-64 md:h-auto bg-muted flex items-center justify-center">
                  {officer.image ? (
                    <img 
                      src={officer.image} 
                      alt={officer.name}
                      className="w-32 h-32 object-cover rounded-full"
                    />
                  ) : (
                    <Avatar className="h-32 w-32 rounded-full">
                      <AvatarImage src={officer.image} className="rounded-full" />
                      <AvatarFallback className="text-4xl rounded-full">{officer.initials}</AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="mb-4">
                    <h3 className="mb-1">{officer.name}</h3>
                    <p className="text-primary">{officer.title}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                      <span>{officer.major}</span>
                      <span>•</span>
                      <span>{officer.year}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {officer.bio}
                  </p>

                  {/* Contact Links */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <a
                      href={`mailto:${officer.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{officer.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
