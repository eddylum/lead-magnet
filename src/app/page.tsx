import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#edfffe] to-[#81ebdf] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#075650] mb-6">
          Simulateur URSSAF CSE
        </h1>
        <p className="text-lg text-[#075650] mb-8 max-w-2xl">
          Vérifiez la conformité de vos avantages sociaux avec les règles URSSAF 2025
        </p>
        <Link 
          href="/tools/cse-simulator"
          className="inline-block bg-gradient-to-r from-[#01debb] to-[#075650] hover:from-[#81ebdf] hover:to-[#075650] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          🧮 Commencer l&apos;audit
        </Link>
      </div>
    </div>
  );
}
