export default function Loading() {
  return (
    <div className="min-h-screen bg-[#05050a] px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="max-w-4xl mx-auto">
        <div className="h-4 w-16 bg-[#00f0ff]/10 mb-8" />
        <div className="h-12 w-3/4 bg-[#00f0ff]/5 mb-4" />
        <div className="h-12 w-1/2 bg-[#00f0ff]/5 mb-8" />
        <div className="border-2 border-[#00f0ff]/10 p-8">
          <div className="space-y-3">
            <div className="h-4 w-full bg-[#00f0ff]/5" />
            <div className="h-4 w-full bg-[#00f0ff]/5" />
            <div className="h-4 w-5/6 bg-[#00f0ff]/5" />
            <div className="h-4 w-full bg-[#00f0ff]/5" />
            <div className="h-4 w-3/4 bg-[#00f0ff]/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
