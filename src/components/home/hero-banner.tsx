"use client"

export function HeroBanner() {
  return (
    <section className="relative w-full min-h-screen -mt-20 flex items-center justify-center text-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10">
        {/* Placeholder for background image */}
        <div className="absolute inset-0 bg-muted/20" />
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-4">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter uppercase">
          <span className="block">NO SEGUIMOS <span className="text-primary">TENDENCIAS</span></span>
          <span className="block">CREAMOS PRENDAS QUE</span>
          <span className="block">CUENTAN TU <span className="text-primary">HISTORIA</span>.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground uppercase tracking-widest">
          El detalle hace la <span className="text-primary">diferencia</span>.
        </p>
      </div>
    </section>
  )
}
