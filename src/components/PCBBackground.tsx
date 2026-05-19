import { useState, useEffect } from "react";
import "../styles/pcb.css";

type Node = [cx: number, cy: number, colorVar: string];

// Using CSS variables instead of hardcoded hex values so colors adapt to the active theme
const nodes: Node[] = [
  [450,  170,  "var(--cyan)"],      [740,  130,  "var(--cyan)"],
  [260,  640,  "var(--cyan)"],      [660,  240,  "var(--purple)"],
  [390,  660,  "var(--purple)"],    [1140, 760,  "var(--purple)"],
  [500,  450,  "var(--green)"],     [840,  410,  "var(--green)"],
  [210,  1090, "var(--green)"],     [760,  1940, "var(--cyan)"],
  [340,  2760, "var(--cyan)"],      [1140, 2860, "var(--cyan)"],
  [640,  2310, "var(--purple)"],    [1110, 3240, "var(--purple)"],
  [310,  3390, "var(--purple)"],    [440,  1560, "var(--green)"],
  [1240, 1660, "var(--green)"],     [390,  3360, "var(--green)"],
  [960,  3640, "var(--cyan)"],      [160,  3840, "var(--cyan)"],
];

const ringNodes: Node[] = [
  [450,  170,  "var(--cyan)"],
  [840,  410,  "var(--green)"],
  [640,  2310, "var(--purple)"],
  [960,  3640, "var(--cyan)"],
];

export default function PCBBackground() {
  const [burstActive, setBurstActive] = useState(false);
  const [scanActive, setScanActive] = useState(false);

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.detail?.type;
      
      if (type === "burst") {
        setBurstActive(true);
        setTimeout(() => setBurstActive(false), 2000);
      } else if (type === "scan") {
        setScanActive(true);
        setTimeout(() => setScanActive(false), 4000);
      }
    };

    window.addEventListener("pcb-trigger", handleTrigger);
    return () => window.removeEventListener("pcb-trigger", handleTrigger);
  }, []);

  const handleNodeClick = () => {
    // Trigger local burst on click
    setBurstActive(true);
    setTimeout(() => setBurstActive(false), 1500);
  };

  return (
    <>
      {/* Horizontal scan line sweeping down */}
      <div className={`scan-line ${scanActive ? "scan-line-active" : ""}`} />

      <svg
        className={`pcb-bg ${burstActive ? "pcb-burst-mode" : ""} ${scanActive ? "pcb-scan-mode" : ""}`}
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
          <path d="M0 120 H400 L450 170 H700 L740 130 H1440"                              stroke="var(--cyan)"      strokeWidth="1.5" className="trace-anim-1" />
          <path d="M1440 400 H1100 L1060 440 H800 L760 400 H500 V600 H300 L260 640 H0"   stroke="var(--cyan)"      strokeWidth="1.5" className="trace-anim-2" />
          <path d="M0 1000 H200 L240 960 H600 V1100 H900 L940 1060 H1440"                stroke="var(--cyan)"      strokeWidth="1.5" className="trace-anim-3" />
          <path d="M1440 1800 H1200 V1900 H800 L760 1940 H400 V2100 H0"                  stroke="var(--cyan)"      strokeWidth="1.5" className="trace-anim-1" />
          <path d="M0 2800 H300 L340 2760 H700 V2900 H1100 L1140 2860 H1440"             stroke="var(--cyan)"      strokeWidth="1.5" className="trace-anim-2" />
          <path d="M1440 3600 H1000 L960 3640 H600 V3800 H200 L160 3840 H0"              stroke="var(--cyan)"      strokeWidth="1.5" className="trace-anim-3" />
        </g>

        {/* Purple traces */}
        <g filter="url(#glow-purple)" opacity="0.3">
          <path d="M1440 80 H1000 V200 H700 L660 240 H300 V350 H0"                       stroke="var(--purple)"    strokeWidth="1.5" className="trace-anim-2" />
          <path d="M0 700 H350 L390 660 H800 V800 H1100 L1140 760 H1440"                 stroke="var(--purple)"    strokeWidth="1.5" className="trace-anim-3" />
          <path d="M1440 1400 H1100 L1060 1440 H700 V1550 H400 L360 1590 H0"             stroke="var(--purple)"    strokeWidth="1.5" className="trace-anim-1" />
          <path d="M0 2200 H250 V2350 H600 L640 2310 H1000 V2450 H1440"                  stroke="var(--purple)"    strokeWidth="1.5" className="trace-anim-2" />
          <path d="M1440 3200 H1150 L1110 3240 H750 V3350 H350 L310 3390 H0"             stroke="var(--purple)"    strokeWidth="1.5" className="trace-anim-3" />
        </g>

        {/* Green traces */}
        <g filter="url(#glow-green)" opacity="0.3">
          <path d="M0 300 H500 V450 H800 L840 410 H1200 V500 H1440"                      stroke="var(--green)" strokeWidth="1.5" className="trace-anim-3" />
          <path d="M1440 900 H1050 L1010 940 H600 V1050 H250 L210 1090 H0"               stroke="var(--green)" strokeWidth="1.5" className="trace-anim-1" />
          <path d="M0 1600 H400 L440 1560 H850 V1700 H1200 L1240 1660 H1440"             stroke="var(--green)" strokeWidth="1.5" className="trace-anim-2" />
          <path d="M1440 2500 H1100 V2600 H700 L660 2640 H300 V2750 H0"                  stroke="var(--green)" strokeWidth="1.5" className="trace-anim-3" />
          <path d="M0 3400 H350 L390 3360 H800 V3500 H1150 L1190 3460 H1440"             stroke="var(--green)" strokeWidth="1.5" className="trace-anim-1" />
        </g>

        {/* Circuit nodes (interactive clicks) */}
        {nodes.map(([cx, cy, colorVar], i) => (
          <g key={i} className="pcb-node-interactive" onClick={handleNodeClick}>
            <circle cx={cx} cy={cy} r="4" fill={colorVar} opacity="0.7" className="node-pulse" />
            <circle cx={cx} cy={cy} r="8" fill="none" stroke={colorVar} strokeWidth="0.5" opacity="0.3" className="node-pulse" />
            {/* Larger transparent hover target */}
            <circle cx={cx} cy={cy} r="18" fill="transparent" style={{ cursor: "pointer" }} />
          </g>
        ))}

        {/* Ring pulses expanding from key nodes */}
        {ringNodes.map(([cx, cy, colorVar], i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r="6"
            fill="none"
            stroke={colorVar}
            strokeWidth="1.5"
            className={`node-ring nr-d${i + 1}`}
          />
        ))}

        {/* Data packets flowing along traces */}
        <g filter="url(#glow-packet)">
          <path
            d="M0 120 H400 L450 170 H700 L740 130 H1440"
            stroke="var(--cyan)" strokeWidth="3" fill="none"
            pathLength="1000" strokeDasharray="28 972"
            className="data-packet dp-1"
          />
          <path
            d="M0 300 H500 V450 H800 L840 410 H1200 V500 H1440"
            stroke="var(--green)" strokeWidth="3" fill="none"
            pathLength="1000" strokeDasharray="28 972"
            className="data-packet dp-2"
          />
          <path
            d="M1440 80 H1000 V200 H700 L660 240 H300 V350 H0"
            stroke="var(--purple)" strokeWidth="3" fill="none"
            pathLength="1000" strokeDasharray="28 972"
            className="data-packet dp-3"
          />
          <path
            d="M0 2800 H300 L340 2760 H700 V2900 H1100 L1140 2860 H1440"
            stroke="var(--cyan)" strokeWidth="3" fill="none"
            pathLength="1000" strokeDasharray="28 972"
            className="data-packet dp-4"
          />
        </g>
      </svg>
    </>
  );
}
