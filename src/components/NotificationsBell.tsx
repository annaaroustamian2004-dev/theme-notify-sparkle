import { useEffect, useMemo, useState } from "react";
import { Bell, Wind, CloudRain, Sun, AlertTriangle, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type NotifType = "air" | "weather";

interface NotificationItem {
  id: string;
  type: NotifType;
  severity: "info" | "warning" | "alert";
  title: string;
  message: string;
  /** ISO date string */
  date: string;
}

const NOW = new Date();
const today = (h: number, m = 0) => {
  const d = new Date(NOW);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
const yesterday = (h: number, m = 0) => {
  const d = new Date(NOW);
  d.setDate(d.getDate() - 1);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    type: "air",
    severity: "warning",
    title: "Air Quality Warning",
    message: "AQI reached 52 in Center City — moderate levels detected.",
    date: today(14, 12),
  },
  {
    id: "n-2",
    type: "weather",
    severity: "info",
    title: "Rain Expected",
    message: "80% chance of rain at 4:00 PM. Bring an umbrella.",
    date: today(11, 30),
  },
  {
    id: "n-3",
    type: "weather",
    severity: "info",
    title: "UV Index Moderate",
    message: "UV index will peak at 6 around noon. Apply sunscreen.",
    date: today(8, 5),
  },
  {
    id: "n-4",
    type: "air",
    severity: "alert",
    title: "PM2.5 Spike",
    message: "PM2.5 levels reached 38 µg/m³ near South Philly.",
    date: yesterday(19, 45),
  },
  {
    id: "n-5",
    type: "weather",
    severity: "info",
    title: "Wind Advisory",
    message: "Sustained winds of 18 mph expected overnight.",
    date: yesterday(15, 20),
  },
  {
    id: "n-6",
    type: "air",
    severity: "info",
    title: "Air Quality Improved",
    message: "AQI dropped to 28 — good conditions across the city.",
    date: yesterday(9, 0),
  },
];

const READ_KEY = "notifications:read";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function severityClasses(sev: NotificationItem["severity"]) {
  switch (sev) {
    case "alert":
      return "text-red-500 bg-red-500/10 ring-red-500/20";
    case "warning":
      return "text-amber-500 bg-amber-500/10 ring-amber-500/20";
    default:
      return "text-blue-500 bg-blue-500/10 ring-blue-500/20";
  }
}

function TypeIcon({ item }: { item: NotificationItem }) {
  if (item.type === "air") {
    return item.severity === "alert" ? (
      <AlertTriangle className="h-4 w-4" />
    ) : (
      <Wind className="h-4 w-4" />
    );
  }
  return item.severity === "info" && /sun|uv/i.test(item.title) ? (
    <Sun className="h-4 w-4" />
  ) : (
    <CloudRain className="h-4 w-4" />
  );
}

export function NotificationsBell() {
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [open, setOpen] = useState(false);

  // Load read status from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(READ_KEY);
      if (raw) setReadIds(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Set<string>) => {
    setReadIds(next);
    try {
      localStorage.setItem(READ_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  };

  const markRead = (id: string) => {
    if (readIds.has(id)) return;
    const next = new Set(readIds);
    next.add(id);
    persist(next);
  };

  const markAllRead = () => {
    persist(new Set(MOCK_NOTIFICATIONS.map((n) => n.id)));
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length;

  const grouped = useMemo(() => {
    const now = new Date();
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const groups: { label: string; items: NotificationItem[] }[] = [
      { label: "Today", items: [] },
      { label: "Yesterday", items: [] },
      { label: "Earlier", items: [] },
    ];
    for (const n of [...MOCK_NOTIFICATIONS].sort(
      (a, b) => +new Date(b.date) - +new Date(a.date),
    )) {
      const d = new Date(n.date);
      if (isSameDay(d, now)) groups[0].items.push(n);
      else if (isSameDay(d, y)) groups[1].items.push(n);
      else groups[2].items.push(n);
    }
    return groups.filter((g) => g.items.length > 0);
  }, []);

  // Mark visible notifications as read on open
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      persist(new Set(MOCK_NOTIFICATIONS.map((n) => n.id)));
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          className="relative text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[360px] p-0 overflow-hidden border-border/60 shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            <p className="text-[11px] text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} new alert${unreadCount > 1 ? "s" : ""}` : "You're all caught up"}
            </p>
          </div>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="text-[11px] font-medium text-blue-500 hover:text-blue-400 disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            Mark all read
          </button>
        </div>

        <ScrollArea className="h-[380px]">
          <div className="p-2">
            {grouped.map((group) => (
              <div key={group.label} className="mb-2 last:mb-0">
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </div>
                <div className="space-y-1">
                  {group.items.map((n) => {
                    const unread = !readIds.has(n.id);
                    return (
                      <button
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={cn(
                          "w-full text-left flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-foreground/5",
                          unread && "bg-foreground/[0.03]",
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1",
                            severityClasses(n.severity),
                          )}
                        >
                          <TypeIcon item={n} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-foreground">
                              {n.title}
                            </p>
                            {unread && (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {n.message}
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground/70">
                            {formatTime(n.date)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {MOCK_NOTIFICATIONS.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Check className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
