interface HeroProps {
  title: string;
  description: string;
  className?: string;
}

export function Hero({ title, description, className = "" }: HeroProps) {
  return (
    <section className={`text-center py-6 ${className}`}>
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
