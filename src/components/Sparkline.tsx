export default function Sparkline({ data, className = "" }: { data: number[]; className?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${36 - ((v - min) / (max - min || 1)) * 30}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 40" className={className} preserveAspectRatio="none">
      <polyline points={`0,40 ${pts} 100,40`} fill="var(--green-soft)" stroke="none" opacity="0.7" />
      <polyline points={pts} fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
