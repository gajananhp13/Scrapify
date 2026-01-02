"use client"

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JsonViewerProps {
  data: any;
  initialExpanded?: boolean;
  title?: string;
}

const JsonNode: React.FC<{ nodeKey: string; value: any; level: number; defaultExpanded?: boolean }> = ({ nodeKey, value, level, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0 ? true : defaultExpanded);
  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
  const isArray = Array.isArray(value);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const renderValue = () => {
    if (value === null) return <span className="text-purple-500 dark:text-purple-400">null</span>;
    if (typeof value === 'string') return <span className="text-green-600 dark:text-green-400">{`"${value}"`}</span>;
    if (typeof value === 'number') return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-red-600 dark:text-red-400">{String(value)}</span>;
    return null;
  };

  if (isObject || isArray) {
    return (
      <div style={{ marginLeft: `${level * 15}px` }} className="font-code text-sm">
        <div onClick={toggleExpand} className="cursor-pointer flex items-center py-0.5 hover:bg-muted/50 rounded">
          {isExpanded ? <ChevronDown size={16} className="mr-1 shrink-0" /> : <ChevronRight size={16} className="mr-1 shrink-0" />}
          <span className="text-foreground/80">{nodeKey}:</span>
          {!isExpanded && <span className="ml-1 text-muted-foreground">{isArray ? `Array(${value.length})` : `Object`}</span>}
        </div>
        {isExpanded && (
          <div className="pl-4 border-l border-border ml-[7px]">
            {Object.entries(value).map(([key, val]) => (
              <JsonNode key={key} nodeKey={key} value={val} level={level + 1} defaultExpanded={level < 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginLeft: `${level * 15}px` }} className="font-code text-sm py-0.5">
      <span className="text-foreground/80">{nodeKey}: </span>
      {renderValue()}
    </div>
  );
};

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, initialExpanded = true, title = "JSON Data" }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full p-3 border rounded-md bg-muted/20">
          <JsonNode nodeKey={typeof data === 'object' && data !== null && !Array.isArray(data) ? "root" : "data"} value={data} level={0} defaultExpanded={initialExpanded} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
