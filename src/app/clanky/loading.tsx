export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 sm:px-8 py-12 animate-pulse">
      <div className="h-8 w-48 bg-[#ff6600]/10 mb-4" />
      <div className="h-12 w-64 bg-[#f0f0f0]/5 mb-8" />
      <div className="h-12 w-full max-w-xl border-2 border-[#ff6600]/20 mb-8" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-baseline gap-4 py-4 border-b border-[#f0f0f0]/5">
            <div className="h-3 w-20 bg-[#f0f0f0]/5" />
            <div className="h-5 flex-1 bg-[#f0f0f0]/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
