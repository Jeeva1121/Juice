import { useState } from 'react'
import PixelTrail from '../components/PixelTrail'

const STATEMENTS = [
  {
    id: 'vitality',
    label: 'Vitality',
    text: 'COLD-PRESSED RAW\nNEVER PASTEURIZED',
    subtext: 'Every drop cold-extracted below 4°C to preserve 100% living enzymes and cellular electrolytes.',
  },
  {
    id: 'interactive',
    label: 'Interactive',
    text: 'WATCH THE FLAVORS\nCOME ALIVE',
    subtext: 'Move your cursor or finger across the grid to ignite the organic harvest pixel pulse.',
  },
  {
    id: 'purity',
    label: 'Purity',
    text: 'ZERO HEAT APPLIED\nUNFILTERED BOTANICALS',
    subtext: 'Single-origin orchards, no artificial sugars, and immediate nitrogen-chilled cold-chain delivery.',
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
      {/* Top Editorial Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800/80">
        <div>
          <span className="font-jakarta text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-300">
            Interactive Harvest Pulse
          </span>
        </div>

        {/* Interactive Statement Switcher Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {STATEMENTS.map((stmt, idx) => (
            <button
              key={stmt.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`font-jakarta text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3.5 sm:px-5 py-2 transition-all cursor-pointer rounded-none border ${
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

      {/* Main Interactive Canvas Area (Pixel Trail Component) */}
      <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] lg:h-[600px] cursor-crosshair">
        <PixelTrail
          key={currentStatement.id}
          text={currentStatement.text}
          background="#000000"
          textColor="#FFFFFF"
          invert={true}
          columns={26}
          font={{
            fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
            fontSize: 78,
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
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

      {/* Bottom Editorial Metrics Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div>
          <div className="font-jakarta text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
            Thermal Control
          </div>
          <p className="font-jakarta text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Pioneering cold micro-extraction at 3.8°C with zero flash pasteurization to guarantee raw nutrient bioavailability.
          </p>
        </div>
        <div>
          <div className="font-jakarta text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
            Living Osmotic Matrix
          </div>
          <p className="font-jakarta text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Electrolyte rock salts and young green coconut water synergize for direct cellular-level hydration without sugar crashes.
          </p>
        </div>
        <div>
          <div className="font-jakarta text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
            Harvest To Door
          </div>
          <p className="font-jakarta text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Bottled at dawn and dispatched in recyclable refrigerated insulation within 24 hours of orchard picking.
          </p>
        </div>
      </div>
    </section>
  )
}
