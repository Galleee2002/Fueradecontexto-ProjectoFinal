"use client"

import { Size } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SizeSelectorProps {
  sizes: Size[]
  selected: Size | null
  onSelect: (size: Size) => void
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Talle</span>
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-xs text-primary hover:underline">
              Guia de talles
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Guia de Talles</DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-3 text-left">Talle</th>
                    <th className="py-2 px-3 text-left">Pecho (cm)</th>
                    <th className="py-2 px-3 text-left">Largo (cm)</th>
                    <th className="py-2 px-3 text-left">Hombro (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="py-2 px-3">XS</td><td className="py-2 px-3">86-90</td><td className="py-2 px-3">65</td><td className="py-2 px-3">40</td></tr>
                  <tr className="border-b"><td className="py-2 px-3">S</td><td className="py-2 px-3">90-94</td><td className="py-2 px-3">68</td><td className="py-2 px-3">42</td></tr>
                  <tr className="border-b"><td className="py-2 px-3">M</td><td className="py-2 px-3">94-98</td><td className="py-2 px-3">71</td><td className="py-2 px-3">44</td></tr>
                  <tr className="border-b"><td className="py-2 px-3">L</td><td className="py-2 px-3">98-102</td><td className="py-2 px-3">74</td><td className="py-2 px-3">46</td></tr>
                  <tr className="border-b"><td className="py-2 px-3">XL</td><td className="py-2 px-3">102-106</td><td className="py-2 px-3">77</td><td className="py-2 px-3">48</td></tr>
                  <tr><td className="py-2 px-3">XXL</td><td className="py-2 px-3">106-110</td><td className="py-2 px-3">80</td><td className="py-2 px-3">50</td></tr>
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={cn(
              "h-10 min-w-[2.75rem] px-4 rounded-md border text-sm font-medium transition-colors",
              selected === size
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:border-primary"
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
