'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

interface TooltipProps {
  /** The content rendered inside the floating card. Pass any ReactNode — plain
   *  text, or a small JSX structure for richer layouts. */
  content: ReactNode;
  children: ReactNode;
  /** Which side of the trigger the tooltip appears on. Defaults to 'top'. */
  side?: 'top' | 'bottom';
  /** Max width of the tooltip card in px. Defaults to 260. */
  maxWidth?: number;
}

/**
 * Wraps any inline element. On hover, shows a floating dark card above (or
 * below) the trigger with a small directional arrow. Positioning is
 * CSS-based (absolute, centered on the trigger). Works in any HTML context.
 */
export default function Tooltip({
  content,
  children,
  side = 'top',
  maxWidth = 260,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const isTop = side === 'top';

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}

      {open && (
        <span
          role="tooltip"
          className="pointer-events-none absolute z-50 left-1/2 flex flex-col items-center"
          style={{
            transform: 'translateX(-50%)',
            width: `${maxWidth}px`,
            ...(isTop
              ? { bottom: 'calc(100% + 9px)' }
              : { top: 'calc(100% + 9px)' }),
          }}
        >
          {/* Upward arrow — only shown when tooltip is below the trigger */}
          {!isTop && (
            <span
              aria-hidden
              className="block w-0 h-0 shrink-0"
              style={{
                borderLeft:   '6px solid transparent',
                borderRight:  '6px solid transparent',
                borderBottom: '6px solid #1e1b18',
              }}
            />
          )}

          {/* Tooltip body */}
          <span
            className="font-body block w-full rounded-xl"
            style={{
              backgroundColor: '#1e1b18',
              color: '#faf7f2',
              padding: '10px 13px',
              fontSize: '12px',
              lineHeight: '1.55',
              boxShadow:
                '0 8px 28px rgba(0,0,0,0.24), 0 2px 6px rgba(0,0,0,0.10)',
              animation: isTop
                ? 'tooltip-in-top 130ms ease-out forwards'
                : 'tooltip-in-bottom 130ms ease-out forwards',
            }}
          >
            {content}
          </span>

          {/* Downward arrow — only shown when tooltip is above the trigger */}
          {isTop && (
            <span
              aria-hidden
              className="block w-0 h-0 shrink-0"
              style={{
                borderLeft:  '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop:   '6px solid #1e1b18',
              }}
            />
          )}
        </span>
      )}
    </span>
  );
}

// ─── Convenience sub-components for structured tooltip content ────────────────
// These are optional helpers — callers can always pass raw JSX as `content`.

/** A bold label line, typically the indicator ID + name or tier name. */
export function TooltipTitle({ children }: { children: ReactNode }) {
  return (
    <span className="block font-semibold text-[12px] text-[#faf7f2] mb-1 leading-snug">
      {children}
    </span>
  );
}

/** One or more lines of explanatory body text. */
export function TooltipBody({ children }: { children: ReactNode }) {
  return (
    <span className="block text-[11px] text-[#c8c0b4] leading-relaxed">
      {children}
    </span>
  );
}

/** A small metadata row at the bottom — signal type, weight, source, etc. */
export function TooltipMeta({ children }: { children: ReactNode }) {
  return (
    <span className="block font-mono text-[10px] text-[#8a8070] mt-2 leading-snug uppercase tracking-wide">
      {children}
    </span>
  );
}

/** A styled "→ Read more" link line. */
export function TooltipLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="pointer-events-auto block font-mono text-[10px] uppercase tracking-wide mt-2 text-[#c8c0b4] underline underline-offset-2 hover:text-[#faf7f2] transition-colors"
    >
      {children}
    </a>
  );
}
