export default function Loading() {
  return (
    <div className="min-h-screen bg-[#05050a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#00f0ff", borderTopColor: "transparent" }}
        />
        <span
          className="text-[10px] uppercase tracking-widest animate-pulse"
          style={{ color: "#00f0ff80" }}
        >
          Loading...
        </span>
      </div>
    </div>
  );
}
