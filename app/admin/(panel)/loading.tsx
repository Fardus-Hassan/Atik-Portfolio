export default function PanelSkeleton() {
  return (
    <div className="animate-pulse" aria-busy>
      <div className="h-10 w-56 rounded-lg bg-white/[0.05]" />
      <div className="mt-4 h-4 w-80 max-w-full rounded bg-white/[0.04]" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-28 rounded-2xl bg-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
