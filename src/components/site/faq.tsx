'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Section } from './section'
import { faqs } from '@/lib/content'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="faq" tone="paper">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.7fr] lg:gap-12">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">FAQ</p><h2 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">Frequently asked questions</h2></div>
        <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q}>
                <h3>
                  <button type="button" id={`faq-btn-${i}`} aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? null : i)} className="flex min-h-[3.5rem] w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading text-base font-bold leading-snug text-ink hover:bg-paper/60 sm:text-lg">
                    {f.q}<ChevronDown aria-hidden className={`h-5 w-5 shrink-0 text-accent transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`faq-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-base leading-7 text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
