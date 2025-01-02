export function TrustedBy() {
  const companies = ["Microsoft", "Google", "Amazon", "Meta", "Apple", "IBM"];

  return (
    <section className="py-12 border-y">
      <div className="container mx-auto px-4">
        <p className="text-center text-muted-foreground mb-8">
          Trusted by 12,000+ businesses worldwide
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {companies.map((company) => (
            <span
              key={company}
              className="text-xl font-semibold text-muted-foreground/50"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
