"use client"

export function HeroBanner() {
  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center text-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {/* Placeholder for background image */}
        <div className="absolute inset-0 bg-gray-300 opacity-20" /> {/* You can replace bg-gray-300 with an actual image via CSS background-image */}
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-4">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter">
          NO SEGUIMOS <span className="text-accent">TENDENCIAS</span>
          <br />
          CREAMOS PRENDAS QUE
          <br />
          CUENTAN TU <span className="text-accent">HISTORIA</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          El detalle <span className="text-accent">hace la diferencia</span>
        </p>
      </div>
    </section>
  )
}
