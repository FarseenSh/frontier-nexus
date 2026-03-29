import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Cpu } from "lucide-react";
import { useGalaxyData } from "../../hooks/use-galaxy-data";
import { useTribes, useShips } from "../../hooks/use-world-api";
import { useJumpEvents, useKillEvents } from "../../hooks/use-sui-events";
import { useAssemblies } from "../../hooks/use-assemblies";
import { queryData } from "../../lib/ai-client";
import { cn } from "../../lib/cn";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatPanel = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { systems } = useGalaxyData();
  const { data: tribesData } = useTribes();
  const { data: shipsData } = useShips();
  const { data: jumpEvents = [] } = useJumpEvents();
  const { data: killEvents = [] } = useKillEvents();
  const { data: ssus } = useAssemblies("storageUnit");
  const { data: gates } = useAssemblies("gate");
  const { data: turrets } = useAssemblies("turret");
  const { data: nodes } = useAssemblies("networkNode");

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const question = input.trim();
    setInput("");

    const response = queryData(question, {
      systems,
      tribes: tribesData?.data ?? [],
      ships: shipsData?.data ?? [],
      assemblies: {
        storageUnits: ssus?.objects ?? [],
        gates: gates?.objects ?? [],
        turrets: turrets?.objects ?? [],
        networkNodes: nodes?.objects ?? [],
      },
      events: [...killEvents, ...jumpEvents],
    });

    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: "assistant", content: response },
    ]);
  }, [input, systems, tribesData, jumpEvents, killEvents, ssus, gates, turrets, nodes]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (q: string) => {
    setInput(q);
    // Auto-send after a tick
    setTimeout(() => {
      const response = queryData(q, {
        systems,
        tribes: tribesData?.data ?? [],
        ships: shipsData?.data ?? [],
        assemblies: {
          storageUnits: ssus?.objects ?? [],
          gates: gates?.objects ?? [],
          turrets: turrets?.objects ?? [],
          networkNodes: nodes?.objects ?? [],
        },
        events: [...killEvents, ...jumpEvents],
      });
      setMessages((prev) => [
        ...prev,
        { role: "user", content: q },
        { role: "assistant", content: response },
      ]);
      setInput("");
    }, 100);
  };

  return (
    <>
      {/* Float button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-cyan/20 border border-cyan/40 flex items-center justify-center text-cyan hover:bg-cyan/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all z-50"
        >
          <MessageCircle size={20} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[500px] glass-card flex flex-col z-50 animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyan/10">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-cyan" />
              <span className="font-orbitron text-xs text-primary tracking-wider">
                NEXUS INTEL
              </span>
              <span className="text-[9px] text-muted font-jetbrains bg-cyan/10 px-1.5 py-0.5 rounded">
                LIVE DATA
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted hover:text-primary transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <Cpu size={32} className="text-cyan/30 mx-auto mb-3" />
                <p className="text-secondary text-sm mb-1">Nexus Intel</p>
                <p className="text-muted text-xs">Query live Frontier data</p>
                <div className="mt-4 space-y-2">
                  {[
                    "How many tribes are there?",
                    "Show online storage units",
                    "Most active addresses",
                    "Recent events",
                    "Find systems in constellation 20000005",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestion(q)}
                      className="block w-full text-left text-xs text-muted hover:text-cyan bg-elevated/30 rounded px-3 py-2 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2",
                  msg.role === "user"
                    ? "ml-auto bg-cyan/20 text-primary"
                    : "mr-auto bg-elevated/50 text-secondary",
                )}
              >
                <p className="whitespace-pre-wrap text-xs leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-cyan/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the Frontier..."
                className="flex-1 bg-elevated/50 border border-cyan/10 rounded px-3 py-2 text-xs text-primary font-outfit outline-none focus:border-cyan/30 placeholder:text-muted"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 text-cyan hover:bg-cyan/10 rounded transition-colors disabled:opacity-30"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
