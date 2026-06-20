export default function ProgressBar({ progress, completed, total, scanning, host, resolvedIP }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {scanning && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
            </span>
          )}
          <span className="font-mono text-sm font-semibold text-text">
            {scanning ? "Scanning..." : progress === 100 ? "Complete" : "Stopped"}
          </span>
        </div>
        <span className="font-mono text-sm text-muted">
          {completed.toLocaleString()} / {total.toLocaleString()} ports
        </span>
      </div>

      {/* Progress track */}
      <div className="relative h-1.5 bg-surface rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
        {scanning && (
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent scan-animation" />
        )}
      </div>

      {/* Target info */}
      {host && (
        <div className="flex flex-wrap gap-4 pt-1">
          <div>
            <span className="text-xs text-muted font-mono">HOST </span>
            <span className="text-xs text-accent font-mono font-semibold">{host}</span>
          </div>
          {resolvedIP && resolvedIP !== host && (
            <div>
              <span className="text-xs text-muted font-mono">IP </span>
              <span className="text-xs text-text font-mono">{resolvedIP}</span>
            </div>
          )}
          <div>
            <span className="text-xs text-muted font-mono">PROGRESS </span>
            <span className="text-xs text-text font-mono">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
