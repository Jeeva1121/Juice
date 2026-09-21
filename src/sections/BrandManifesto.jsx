import { useState } from 'react'
import PixelTrail from '../components/PixelTrail'

const STATEMENTS = [
  {
    id: 'vitality',
    label: 'Vitality',
    text: 'COLD-PRESSED RAW\nNEVER PASTEURIZED',
  },
  {
    id: 'interactive',
    label: 'Interactive',
    text: 'WATCH THE FLAVORS\nCOME ALIVE',
  },
  {
    id: 'purity',
    label: 'Purity',
    text: 'ZERO HEAT APPLIED\nUNFILTERED BOTANICALS',
  },
]

export default function BrandManifesto() {
  const [activeTab, setActiveTab] = useState(0)
  const currentStatement = STATEMENTS[activeTab]

  return (
    <section
      id="manifesto"
      className="relative w-full bg-black text-white border-y border-neutral-900 overflow-hidden select-none"
      aria-label="Brand Manifesto Interactive Showcase"
    >
      {/* Top Bar - Minimalist statement switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-4 flex items-center justify-end border-b border-neutral-900">
        <div className="flex items-center gap-2 flex-wrap">
          {STATEMENTS.map((stmt, idx) => (
            <button
              key={stmt.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`font-poppins text-[11px] sm:text-xs font-semibold uppercase tracking-wider px-4 sm:px-5 py-2 transition-all cursor-pointer rounded-none border ${
                activeTab === idx
                  ? 'bg-white text-black border-white shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
              }`}
            >
              {stmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Canvas Area (Pixel Trail Component with Vagnola luxury font) */}
      <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] lg:h-[580px] cursor-crosshair">
        <PixelTrail
          key={currentStatement.id}
          text={currentStatement.text}
          background="#000000"
          textColor="#FFFFFF"
          invert={true}
          columns={26}
          font={{
            fontFamily: "'Vagnola', 'Vagnola Demo', Georgia, serif",
            fontSize: 74,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.06,
            textTransform: 'uppercase',
          }}
          pixel={{
            color: '#FFFFFF',
            gap: 1,
            radius: 0,
          }}
          trail={{
            hold: 0.35,
            fade: 0.55,
            reach: 0,
          }}
          className="w-full h-full"
        />
      </div>
    </section>
  )
}
