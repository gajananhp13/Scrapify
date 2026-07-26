"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, Copy, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ── Token colours ────────────────────────────── */
const TOKENS = {
  string:  "hsl(158, 64%, 58%)",
  number:  "hsl(191, 97%, 60%)",
  boolean: "hsl(43,  96%, 58%)",
  null:    "hsl(258, 90%, 72%)",
  key:     "hsl(210, 40%, 80%)",
  bracket: "hsl(210, 40%, 60%)",
  muted:   "hsl(218, 11%, 50%)",
};

/* ── Copy button ──────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-white/8"
      style={{ color: copied ? "hsl(var(--emerald))" : "hsl(var(--muted-foreground))" }}
      title="Copy JSON"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ── JSON node ────────────────────────────────── */
const JsonNode: React.FC<{
  nodeKey: string; value: any; level: number; defaultExpanded?: boolean;
}> = ({ nodeKey, value, level, defaultExpanded = false }) => {
  const isObj   = typeof value === "object" && value !== null && !Array.isArray(value);
  const isArr   = Array.isArray(value);
  const [open, setOpen] = useState(level === 0 ? true : defaultExpanded);

  const renderScalar = () => {
    if (value === null) return <span style={{ color: TOKENS.null }}>null</span>;
    if (typeof value === "string")  return <span style={{ color: TOKENS.string }}>{`"${value}"`}</span>;
    if (typeof value === "number")  return <span style={{ color: TOKENS.number }}>{value}</span>;
    if (typeof value === "boolean") return <span style={{ color: TOKENS.boolean }}>{String(value)}</span>;
    return null;
  };

  if (isObj || isArr) {
    const childCount = Object.keys(value).length;
    const openBracket  = isArr ? "[" : "{";
    const closeBracket = isArr ? "]" : "}";

    return (
      <div style={{ marginLeft: level > 0 ? 16 : 0 }} className="font-mono-code text-sm leading-6">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-start gap-0.5 hover:bg-white/5 rounded transition-colors w-full text-left py-0.5 px-1 -ml-1 group"
        >
          <span
            className="mt-1 shrink-0 transition-transform duration-150"
            style={{ color: TOKENS.muted }}
          >
            {open ? (
              <ChevronDown className="w-3 h-3 inline" />
            ) : (
              <ChevronRight className="w-3 h-3 inline" />
            )}
          </span>
          <span>
            {level > 0 && (
              <span style={{ color: TOKENS.key }}>{`"${nodeKey}"`}</span>
            )}
            {level > 0 && <span style={{ color: TOKENS.bracket }}>: </span>}
            <span style={{ color: TOKENS.bracket }}>{openBracket}</span>
            {!open && (
              <span style={{ color: TOKENS.muted }} className="text-xs ml-1">
                {isArr ? `${childCount} item${childCount !== 1 ? "s" : ""}` : `${childCount} key${childCount !== 1 ? "s" : ""}`}
              </span>
            )}
            {!open && <span style={{ color: TOKENS.bracket }}>{closeBracket}</span>}
          </span>
        </button>

        {open && (
          <div
            className="border-l ml-3 pl-3"
            style={{ borderColor: "hsl(var(--border)/0.4)" }}
          >
            {Object.entries(value).map(([k, v]) => (
              <JsonNode key={k} nodeKey={k} value={v} level={level + 1} defaultExpanded={level < 1} />
            ))}
            <div className="py-0.5">
              <span style={{ color: TOKENS.bracket }}>{closeBracket}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{ marginLeft: level > 0 ? 16 : 0 }}
      className="font-mono-code text-sm leading-6 py-0.5 px-1 -ml-1 hover:bg-white/5 rounded transition-colors"
    >
      {level > 0 && <span style={{ color: TOKENS.key }}>{`"${nodeKey}"`}</span>}
      {level > 0 && <span style={{ color: TOKENS.bracket }}>: </span>}
      {renderScalar()}
    </div>
  );
};

/* ── Main component ───────────────────────────── */
interface JsonViewerProps {
  data: any;
  initialExpanded?: boolean;
  title?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  initialExpanded = true,
  title = "JSON Data",
}) => {
  const jsonString = JSON.stringify(data, null, 2);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "hsl(226 32% 5%)",
        borderColor: "hsl(var(--border)/0.4)",
        boxShadow: "0 4px 20px -4px hsl(226 32% 5%/0.5)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: "hsl(var(--border)/0.3)", background: "hsl(210 40% 98%/0.03)" }}
      >
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          {["hsl(0,72%,60%)", "hsl(38,92%,50%)", "hsl(142,71%,45%)"].map((c, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
          <span
            className="ml-2 text-xs font-mono"
            style={{ color: "hsl(210 40% 98%/0.35)" }}
          >
            {title}
          </span>
        </div>
        <CopyButton text={jsonString} />
      </div>

      {/* Scrollable content */}
      <ScrollArea className="h-[360px]">
        <div className="p-4">
          <JsonNode
            nodeKey={typeof data === "object" && data !== null && !Array.isArray(data) ? "root" : "data"}
            value={data}
            level={0}
            defaultExpanded={initialExpanded}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
