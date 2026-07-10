export default function ScoreRing({ score, size = 46 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const filled = (score / 100) * c;
  const color = score >= 85 ? "var(--green)" : score >= 75 ? "var(--gold)" : "var(--steel)";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} title={`Deal score ${score}/100`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--warm)" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c - filled}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-display font-bold"
        style={{ fontSize: size * 0.3, color }}
      >
        {score}
      </span>
    </div>
  );
}
