import "../styles/pcb.css";
import { COLORS } from "../constants/colors";

type Node = [cx: number, cy: number, color: string];

const nodes: Node[] = [
  [450,  170,  COLORS.cyan],      [740,  130,  COLORS.cyan],
  [260,  640,  COLORS.cyan],      [660,  240,  COLORS.purple],
  [390,  660,  COLORS.purple],    [1140, 760,  COLORS.purple],
  [500,  450,  COLORS.neonGreen], [840,  410,  COLORS.neonGreen],
  [210,  1090, COLORS.neonGreen], [760,  1940, COLORS.cyan],
  [340,  2760, COLORS.cyan],      [1140, 2860, COLORS.cyan],
  [640,  2310, COLORS.purple],    [1110, 3240, COLORS.purple],
  [310,  3390, COLORS.purple],    [440,  1560, COLORS.neonGreen],
  [1240, 1660, COLORS.neonGreen], [390,  3360, COLORS.neonGreen],
  [960,  3640, COLORS.cyan],      [160,  3840, COLORS.cyan],
];

// Nodes that emit expanding ring pulses (spread across the page)
const ringNodes: Node[] = [
  [450,  170,  COLORS.cyan],
  [840,  410,  COLORS.neonGreen],
  [640,  2310, COLORS.purple],
  [960,  3640, COLORS.cyan],
];

export default function PCBBackground() {
  return (
    <>
      {/* Horizontal scan line sweeping down */}
      <div className="scan-line" />

      <svg
        className="pcb-bg"
        viewBox="0 0 1440 4800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <filter id="glow-cyan">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-purple">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-packet">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Cyan traces */}
        <g filter="url(#glow-cyan)" opacity="0.35">
          <path d="M0 120 H400 L450 170 H700 L740 130 H1440"                              stroke={COLORS.cyan}      strokeWidth="1.5" className="trace-anim-1" />
          <path d="M1440 400 H1100 L1060 440 H800 L760 400 H500 V600 H300 L260 640 H0"   stroke={COLORS.cyan}      strokeWidth="1.5" className="trace-anim-2" />
          <path d="M0 1000 H200 L240 960 H600 V1100 H900 L940 1060 H1440"                stroke={COLORS.cyan}      strokeWidth="1.5" className="trace-anim-3" />
          <path d="M1440 1800 H1200 V1900 H800 L760 1940 H400 V2100 H0"                  stroke={COLORS.cyan}      strokeWidth="1.5" className="trace-anim-1" />
          <path d="M0 2800 H300 L340 2760 H700 V2900 H1100 L1140 2860 H1440"             stroke={COLORS.cyan}      strokeWidth="1.5" className="trace-anim-2" />
          <path d="M1440 3600 H1000 L960 3640 H600 V3800 H200 L160 3840 H0"              stroke={COLORS.cyan}      strokeWidth="1.5" className="trace-anim-3" />
        </g>

        {/* Purple traces */}
        <g filter="url(#glow-purple)" opacity="0.3">
          <path d="M1440 80 H1000 V200 H700 L660 240 H300 V350 H0"                       stroke={COLORS.purple}    strokeWidth="1.5" className="trace-anim-2" />
          <path d="M0 700 H350 L390 660 H800 V800 H1100 L1140 760 H1440"                 stroke={COLORS.purple}    strokeWidth="1.5" className="trace-anim-3" />
          <path d="M1440 1400 H1100 L1060 1440 H700 V1550 H400 L360 1590 H0"             stroke={COLORS.purple}    strokeWidth="1.5" className="trace-anim-1" />
          <path d="M0 2200 H250 V2350 H600 L640 2310 H1000 V2450 H1440"                  stroke={COLORS.purple}    strokeWidth="1.5" className="trace-anim-2" />
          <path d="M1440 3200 H1150 L1110 3240 H750 V3350 H350 L310 3390 H0"             stroke={COLORS.purple}    strokeWidth="1.5" className="trace-anim-3" />
        </g>

        {/* Green traces */}
        <g filter="url(#glow-green)" opacity="0.3">
          <path d="M0 300 H500 V450 H800 L840 410 H1200 V500 H1440"                      stroke={COLORS.neonGreen} strokeWidth="1.5" className="trace-anim-3" />
          <path d="M1440 900 H1050 L1010 940 H600 V1050 H250 L210 1090 H0"               stroke={COLORS.neonGreen} strokeWidth="1.5" className="trace-anim-1" />
          <path d="M0 1600 H400 L440 1560 H850 V1700 H1200 L1240 1660 H1440"             stroke={COLORS.neonGreen} strokeWidth="1.5" className="trace-anim-2" />
          <path d="M1440 2500 H1100 V2600 H700 L660 2640 H300 V2750 H0"                  stroke={COLORS.neonGreen} strokeWidth="1.5" className="trace-anim-3" />
          <path d="M0 3400 H350 L390 3360 H800 V3500 H1150 L1190 3460 H1440"             stroke={COLORS.neonGreen} strokeWidth="1.5" className="trace-anim-1" />
        </g>

        {/* Circuit nodes */}
        {nodes.map(([cx, cy, color], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="4" fill={color} opacity="0.7" className="node-pulse" />
            <circle cx={cx} cy={cy} r="8" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" className="node-pulse" />
          </g>
        ))}

        {/* Ring pulses expanding from key nodes */}
        {ringNodes.map(([cx, cy, color], i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r="6"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            className={`node-ring nr-d${i + 1}`}
          />
        ))}

        {/* Data packets flowing along traces */}
        <g filter="url(#glow-packet)">
          <path
            d="M0 120 H400 L450 170 H700 L740 130 H1440"
            stroke={COLORS.cyan} strokeWidth="3" fill="none"
            pathLength="1000" strokeDasharray="28 972"
            className="data-packet dp-1"
          />
          <path
            d="M0 300 H500 V450 H800 L840 410 H1200 V500 H1440"
            stroke={COLORS.neonGreen} strokeWidth="3" fill="none"
            pathLength="1000" strokeDasharray="28 972"
            className="data-packet dp-2"
          />
          <path
            d="M1440 80 H1000 V200 H700 L660 240 H300 V350 H0"
            stroke={COLORS.purple} strokeWidth="3" fill="none"
            pathLength="1000" strokeDasharray="28 972"
            className="data-packet dp-3"
          />
          <path
            d="M0 2800 H300 L340 2760 H700 V2900 H1100 L1140 2860 H1440"
            stroke={COLORS.cyan} strokeWidth="3" fill="none"
            pathLength="1000" strokeDasharray="28 972"
            className="data-packet dp-4"
          />
        </g>
      </svg>
    </>
  );
}
