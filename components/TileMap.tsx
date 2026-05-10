'use client';

import { STATE_POSITIONS } from '@/lib/data';
import type { StateData } from '@/lib/data';

interface Props {
  states: StateData[];
  selected: string;
  onSelect: (code: string) => void;
  hover: string | null;
  onHover: (code: string | null) => void;
}

export default function TileMap({ states, selected, onSelect, hover, onHover }: Props) {
  const tileSize = 48;
  const gap = 5;
  const maxCol = 12;
  const maxRow = 7;
  const width = (maxCol + 1) * (tileSize + gap);
  const height = (maxRow + 1) * (tileSize + gap);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {states.map((s) => {
        const [row, col] = STATE_POSITIONS[s.code];
        const x = col * (tileSize + gap);
        const y = row * (tileSize + gap);
        const isSelected = selected === s.code;
        const isHover = hover === s.code;
        return (
          <g
            key={s.code}
            onMouseEnter={() => onHover(s.code)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(s.code)}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x={x} y={y} width={tileSize} height={tileSize} rx={10} ry={10}
              fill={s.tier.color}
              opacity={isSelected ? 1 : isHover ? 0.94 : 0.82}
              stroke={isSelected ? '#1a1a1a' : 'transparent'}
              strokeWidth={isSelected ? 2.5 : 0}
              style={{ transition: 'opacity 140ms, stroke-width 140ms' }}
            />
            {isSelected && (
              <rect
                x={x - 3} y={y - 3} width={tileSize + 6} height={tileSize + 6} rx={13} ry={13}
                fill="none" stroke="#1a1a1a" strokeWidth={1} opacity={0.25}
              />
            )}
            <text
              x={x + tileSize / 2} y={y + tileSize / 2 - 3}
              textAnchor="middle" dominantBaseline="middle"
              fill="#faf7f2" fontSize="13"
              fontFamily="JetBrains Mono, monospace" fontWeight="600"
              style={{ pointerEvents: 'none' }}
            >
              {s.code}
            </text>
            <text
              x={x + tileSize / 2} y={y + tileSize / 2 + 12}
              textAnchor="middle" dominantBaseline="middle"
              fill="#faf7f2" fontSize="10.5" opacity="0.88"
              fontFamily="JetBrains Mono, monospace"
              style={{ pointerEvents: 'none' }}
            >
              {s.score.toFixed(0)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
