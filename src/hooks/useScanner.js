import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

export function useScanner() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanMeta, setScanMeta] = useState(null);
  const [results, setResults] = useState([]);
  const [openPorts, setOpenPorts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("scan-started", (meta) => {
      setScanMeta(meta);
      setResults([]);
      setOpenPorts([]);
      setProgress(0);
      setCompleted(0);
      setTotal(meta.totalPorts);
      setError(null);
      setSummary(null);
      setCancelled(false);
      setScanning(true);
    });

    socket.on("port-result", (result) => {
      setProgress(result.progress);
      setCompleted(result.completed);

      if (result.status === "open") {
        setOpenPorts((prev) => [...prev, result]);
      }

      // Only keep last 200 results in the live feed for performance
      setResults((prev) => {
        const updated = [result, ...prev];
        return updated.slice(0, 200);
      });
    });

    socket.on("scan-complete", (data) => {
      setScanning(false);
      setProgress(100);
      setSummary(data);
    });

    socket.on("scan-error", (data) => {
      setError(data.message);
      setScanning(false);
    });

    socket.on("scan-cancelled", () => {
      setScanning(false);
      setCancelled(true);
    });

    return () => socket.disconnect();
  }, []);

  const startScan = useCallback((payload) => {
    if (!socketRef.current || scanning) return;
    setError(null);
    setSummary(null);
    setCancelled(false);
    socketRef.current.emit("start-scan", payload);
  }, [scanning]);

  const cancelScan = useCallback(() => {
    if (socketRef.current && scanning) {
      socketRef.current.emit("cancel-scan");
    }
  }, [scanning]);

  const resetScan = useCallback(() => {
    setResults([]);
    setOpenPorts([]);
    setProgress(0);
    setCompleted(0);
    setTotal(0);
    setScanMeta(null);
    setSummary(null);
    setError(null);
    setCancelled(false);
  }, []);

  return {
    connected,
    scanning,
    scanMeta,
    results,
    openPorts,
    progress,
    completed,
    total,
    error,
    summary,
    cancelled,
    startScan,
    cancelScan,
    resetScan,
  };
}
