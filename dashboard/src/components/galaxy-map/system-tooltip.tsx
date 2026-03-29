interface SystemTooltipProps {
  name: string;
  constellationId: number;
  x: number;
  y: number;
  containerWidth: number;
}

export const SystemTooltip = ({
  name,
  constellationId,
  x,
  y,
  containerWidth,
}: SystemTooltipProps) => {
  const flipX = x > containerWidth - 180;

  return (
    <div
      className="absolute glass-card px-3 py-2 pointer-events-none z-30"
      style={{
        left: flipX ? x - 160 : x + 12,
        top: y + 12,
      }}
    >
      <p className="font-orbitron text-xs text-cyan whitespace-nowrap">
        {name}
      </p>
      <p className="font-jetbrains text-xs text-muted mt-0.5">
        Constellation {constellationId}
      </p>
    </div>
  );
};
