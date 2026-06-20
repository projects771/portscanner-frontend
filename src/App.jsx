import { useScanner } from "./hooks/useScanner";
import ScanForm from "./components/ScanForm";
import ProgressBar from "./components/ProgressBar";
import OpenPortsPanel from "./components/OpenPortsPanel";
import LiveFeed from "./components/LiveFeed";

export default function App() {
  const {
    connected, scanning, scanMeta, results, openPorts,
    progress, completed, total, error, summary, cancelled,
    startScan, cancelScan, resetScan,
  } = useScanner();

  const hasActivity = scanning || scanMeta !== null;

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-accent/40 flex items-center justify-center">
              <span className="text-accent font-mono text-xs font-bold">⌁</span>
            </div>
            <span className="font-mono text-sm font-semibold text-text tracking-tight">PortScan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-accent" : "bg-danger"}`} />
            <span className="font-mono text-xs text-muted">{connected ? "connected" : "offline"}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-text tracking-tight mb-2">Port Scanner</h1>
          <p className="text-muted text-sm font-sans">Discover open ports and running services on any host in real time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <ScanForm onScan={startScan} scanning={scanning} onCancel={cancelScan} />
            {hasActivity && (
              <div className="grid grid-cols-3 gap-2 fade-in">
                {[
                  { label: "Scanned", value: completed.toLocaleString(), color: "text-text" },
                  { label: "Open", value: openPorts.length, color: "text-accent" },
                  { label: "Progress", value: `${progress}%`, color: "text-text" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-panel border border-border rounded-lg p-3 text-center">
                    <div className={`font-mono text-lg font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="font-mono text-xs text-muted mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-4">
            {error && (
              <div className="bg-danger/10 border border-danger/30 rounded-xl px-5 py-4 fade-in">
                <p className="font-mono text-sm text-danger">✕ {error}</p>
              </div>
            )}
            {cancelled && !error && (
              <div className="bg-warning/10 border border-warning/30 rounded-xl px-5 py-4 fade-in">
                <p className="font-mono text-sm text-warning">⚠ Scan cancelled.</p>
              </div>
            )}
            {hasActivity && !error && (
              <ProgressBar progress={progress} completed={completed} total={total}
                scanning={scanning} host={scanMeta?.host} resolvedIP={scanMeta?.resolvedIP} />
            )}
            {hasActivity && !error && (
              <OpenPortsPanel openPorts={openPorts} summary={summary} />
            )}
            {!error && <LiveFeed results={results} scanning={scanning} />}
            {!hasActivity && !error && (
              <div className="bg-panel border border-border rounded-xl p-12 text-center">
                <div className="font-mono text-5xl text-border mb-4">◌</div>
                <p className="font-mono text-sm text-muted mb-1">No scan running</p>
                <p className="font-mono text-xs text-border">Enter a target and start scanning</p>
              </div>
            )}
            {summary && !scanning && (
              <button onClick={resetScan}
                className="w-full py-2.5 border border-border rounded-lg font-mono text-sm text-muted hover:border-accent/50 hover:text-text transition-all fade-in">
                ↺ New Scan
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
