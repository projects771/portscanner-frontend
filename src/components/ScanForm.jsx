import { useState } from "react";

const PRESETS = [
  { id: "top20", label: "Top 20", desc: "Most common ports" },
  { id: "top100", label: "Top 100", desc: "Extended common ports" },
  { id: "web", label: "Web", desc: "HTTP/HTTPS ports" },
  { id: "database", label: "Database", desc: "DB service ports" },
  { id: "remote", label: "Remote", desc: "SSH, RDP, VNC" },
];

export default function ScanForm({ onScan, scanning, onCancel }) {
  const [host, setHost] = useState("");
  const [mode, setMode] = useState("preset");
  const [preset, setPreset] = useState("top20");
  const [rangeStart, setRangeStart] = useState("1");
  const [rangeEnd, setRangeEnd] = useState("1024");
  const [hostError, setHostError] = useState("");

  const handleSubmit = () => {
    const trimmed = host.trim();
    if (!trimmed) {
      setHostError("Enter an IP address or hostname");
      return;
    }
    setHostError("");
    onScan({ host: trimmed, mode, preset, rangeStart, rangeEnd });
  };

  return (
    <div className="bg-panel border border-border rounded-xl p-6 space-y-6">
      {/* Host input */}
      <div>
        <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-2">
          Target Host
        </label>
        <input
          type="text"
          value={host}
          onChange={(e) => { setHost(e.target.value); setHostError(""); }}
          onKeyDown={(e) => e.key === "Enter" && !scanning && handleSubmit()}
          placeholder="localhost · 192.168.1.1 · example.com"
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 font-mono text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
          disabled={scanning}
          spellCheck={false}
        />
        {hostError && <p className="mt-1.5 text-xs text-danger font-mono">{hostError}</p>}
      </div>

      {/* Mode toggle */}
      <div>
        <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-3">
          Scan Mode
        </label>
        <div className="flex gap-2">
          {["preset", "range"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              disabled={scanning}
              className={`flex-1 py-2 rounded-lg text-sm font-mono font-medium transition-all ${
                mode === m
                  ? "bg-accent text-surface"
                  : "bg-surface border border-border text-muted hover:border-accent hover:text-text"
              }`}
            >
              {m === "preset" ? "Preset" : "Custom Range"}
            </button>
          ))}
        </div>
      </div>

      {/* Preset selector */}
      {mode === "preset" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 fade-in">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              disabled={scanning}
              className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
                preset === p.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:border-accent/50 hover:text-text"
              }`}
            >
              <div className="text-sm font-mono font-semibold">{p.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{p.desc}</div>
            </button>
          ))}
        </div>
      )}

      {/* Range inputs */}
      {mode === "range" && (
        <div className="flex gap-3 items-center fade-in">
          <div className="flex-1">
            <label className="block text-xs font-mono text-muted mb-1.5">Start Port</label>
            <input
              type="number"
              min="1"
              max="65535"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              disabled={scanning}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 font-mono text-sm text-text focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="text-muted font-mono mt-5">—</div>
          <div className="flex-1">
            <label className="block text-xs font-mono text-muted mb-1.5">End Port</label>
            <input
              type="number"
              min="1"
              max="65535"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              disabled={scanning}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 font-mono text-sm text-text focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {!scanning ? (
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-accent hover:bg-accent-dim text-surface font-mono font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-lg">⌁</span>
            Start Scan
          </button>
        ) : (
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30 font-mono font-semibold rounded-lg transition-colors"
          >
            ✕ Cancel Scan
          </button>
        )}
      </div>

      <p className="text-xs text-muted font-mono text-center leading-relaxed">
        Only scan hosts you own or have explicit permission to scan.
      </p>
    </div>
  );
}
