export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 sm:px-8 py-12 animate-pulse">
      <div className="max-w-4xl">
        <div className="h-4 w-24 bg-[#f0f0f0]/5 mb-8" />
        <div className="flex gap-2 mb-6">
          <div className="h-5 w-16 bg-[#ff6600]/10" />
          <div className="h-5 w-20 bg-[#ff6600]/10" />
          <div className="h-5 w-14 bg-[#ff6600]/10" />
        </div>
        <div className="h-10 w-3/4 bg-[#f0f0f0]/5 mb-4" />
        <div className="h-10 w-1/2 bg-[#f0f0f0]/5 mb-8" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-[#f0f0f0]/5" />
          <div className="h-4 w-full bg-[#f0f0f0]/5" />
          <div className="h-4 w-5/6 bg-[#f0f0f0]/5" />
          <div className="h-4 w-full bg-[#f0f0f0]/5" />
          <div className="h-4 w-3/4 bg-[#f0f0f0]/5" />
        </div>
      </div>
    </div>
  );
}
