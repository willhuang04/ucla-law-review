import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Award, Target, Users, BookOpen } from "lucide-react";

export function AboutPage() {
  const boardMembers = [
    { name: "Dr. Jennifer Martinez", role: "Faculty Advisor", initials: "JM" },
    { name: "Alex Chen", role: "Editor-in-Chief", initials: "AC" },
    { name: "Samantha Williams", role: "Managing Editor", initials: "SW" },
    { name: "Michael Brown", role: "Articles Editor", initials: "MB" },
    { name: "Emily Davis", role: "Research Editor", initials: "ED" },
    { name: "David Kim", role: "Technology Editor", initials: "DK" },
  ];

  const values = [
    {
      icon: Award,
      title: "Academic Excellence",
      description: "Maintaining the highest standards of legal scholarship and rigorous peer review processes."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Encouraging fresh perspectives and interdisciplinary approaches to contemporary legal issues."
    },
    {
      icon: Users,
      title: "Diversity",
      description: "Promoting diverse voices and viewpoints from undergraduate researchers across all backgrounds."
    },
    {
      icon: BookOpen,
      title: "Open Access",
      description: "Ensuring legal scholarship is freely accessible to students, researchers, and the public."
    },
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="mb-6">About UCLA Undergraduate Law Journal</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Founded in 2013, the UCLA Undergraduate Law Journal is the premier publication platform 
            for undergraduate legal scholarship. We provide students with the opportunity to publish 
            rigorous, peer-reviewed research while developing critical thinking and analytical skills 
            essential for future legal careers.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <h2 className="mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To foster undergraduate legal scholarship by providing a platform for students to 
              publish original research, engage with contemporary legal issues, and contribute to 
              academic discourse in law and related fields.
            </p>
          </Card>
          <Card className="p-8">
            <h2 className="mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To be recognized as the leading undergraduate law journal, known for publishing 
              groundbreaking research that shapes legal conversations and prepares the next 
              generation of legal scholars and practitioners.
            </p>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-center mb-12">Our Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <value.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Editorial Board */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center mb-12">Editorial Board</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {boardMembers.map((member, index) => (
            <Card key={index} className="p-6 text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <h4 className="mb-1">{member.name}</h4>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
