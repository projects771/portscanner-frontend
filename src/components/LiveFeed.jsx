export default function LiveFeed({ results, scanning }) {
  if (!scanning && results.length === 0) return null;

  return (
    <div className="bg-panel border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <span className="font-mono text-xs text-muted uppercase tracking-widest">Live Feed</span>
        {scanning && (
          <span className="text-xs font-mono text-muted animate-pulse">streaming...</span>
        )}
      </div>
      <div className="max-h-52 overflow-y-auto font-mono text-xs p-4 space-y-0.5 bg-surface">
        {results.map((r, i) => (
          <div key={i} className="flex gap-3 items-center leading-relaxed">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              r.status === "open" ? "bg-accent" :
              r.status === "closed" ? "bg-border" :
              "bg-warning/60"
            }`} />
            <span className="text-muted w-6 text-right">{r.port}</span>
            <span className={`w-14 ${
              r.status === "open" ? "text-accent" :
              r.status === "closed" ? "text-muted" :
              "text-warning"
            }`}>{r.status}</span>
            {r.status === "open" && (
              <span className="text-text">{r.service}</span>
            )}
            <span className="text-muted/50 ml-auto">{r.responseTime}ms</span>
          </div>
        ))}
      </div>
    </div>
  );
}
