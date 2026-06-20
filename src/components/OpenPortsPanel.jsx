export default function OpenPortsPanel({ openPorts, summary }) {
  const handleExportCSV = () => {
    const headers = ["Port", "Service", "Status", "Response Time (ms)"];
    const rows = openPorts.map((p) => [p.port, p.service, p.status, p.responseTime]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scan-results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-panel border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-text">Open Ports</span>
          <span className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold ${
            openPorts.length > 0 ? "bg-accent/15 text-accent" : "bg-surface text-muted"
          }`}>
            {openPorts.length}
          </span>
        </div>
        {openPorts.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="text-xs font-mono text-muted hover:text-accent transition-colors flex items-center gap-1.5"
          >
            ↓ CSV
          </button>
        )}
      </div>

      {/* Summary row */}
      {summary && (
        <div className="px-5 py-3 border-b border-border bg-surface/50 flex flex-wrap gap-5 fade-in">
          <div>
            <span className="text-xs text-muted font-mono">SCANNED </span>
            <span className="text-xs text-text font-mono font-semibold">{summary.totalScanned.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-muted font-mono">OPEN </span>
            <span className="text-xs text-accent font-mono font-semibold">{openPorts.length}</span>
          </div>
          <div>
            <span className="text-xs text-muted font-mono">DURATION </span>
            <span className="text-xs text-text font-mono font-semibold">{summary.duration}s</span>
          </div>
        </div>
      )}

      {/* Port list */}
      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {openPorts.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <div className="text-2xl mb-2">◌</div>
            <p className="text-sm text-muted font-mono">No open ports found yet</p>
          </div>
        ) : (
          openPorts.map((port, i) => (
            <div
              key={`${port.port}-${i}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-surface/50 transition-colors port-pop"
            >
              <div className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                <span className="font-mono text-sm font-bold text-accent w-14">{port.port}</span>
                <span className="font-mono text-sm text-text">{port.service}</span>
              </div>
              <span className="font-mono text-xs text-muted">{port.responseTime}ms</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
