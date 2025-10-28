export function StatsSection() {
  const stats = [
    { value: "127", label: "Published Articles" },
    { value: "45", label: "Contributing Authors" },
    { value: "12", label: "Years Publishing" },
    { value: "15k+", label: "Annual Readers" },
  ];

  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
