import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Camera } from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { NormalizedSystem, GalaxyEdge } from "../../lib/types";
import { SystemTooltip } from "./system-tooltip";

interface GalaxyMapProps {
  systems: NormalizedSystem[];
  edges: GalaxyEdge[];
  onSelectSystem: (system: NormalizedSystem | null) => void;
  selectedSystem: NormalizedSystem | null;
  initialSystemId?: number;
  routeMode?: boolean;
  routeStart?: NormalizedSystem | null;
  routeEnd?: NormalizedSystem | null;
  onRouteClick?: (system: NormalizedSystem) => void;
}

const SCALE = 50; // -50 to 50 range

function systemToPos(s: NormalizedSystem): [number, number, number] {
  return [
    (s.nx - 0.5) * SCALE * 2,
    (s.ny - 0.5) * SCALE * 2,
    (s.nz - 0.5) * SCALE * 2,
  ];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [r + m, g + m, b + m];
}

// Star field component using BufferGeometry Points
const SystemPoints = ({
  systems,
  onHover,
  onClick,
}: {
  systems: NormalizedSystem[];
  onHover: (system: NormalizedSystem | null, event: ThreeEvent<PointerEvent> | null) => void;
  onClick: (system: NormalizedSystem) => void;
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(systems.length * 3);
    const col = new Float32Array(systems.length * 3);
    const siz = new Float32Array(systems.length);

    for (let i = 0; i < systems.length; i++) {
      const s = systems[i];
      const [x, y, z] = systemToPos(s);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const [r, g, b] = hslToRgb(s.hue, 0.7, 0.6);
      col[i * 3] = r;
      col[i * 3 + 1] = g;
      col[i * 3 + 2] = b;

      siz[i] = s.size * 0.15;
    }

    return { positions: pos, colors: col, sizes: siz };
  }, [systems]);

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (e.index !== undefined && e.index < systems.length) {
        onHover(systems[e.index], e);
      }
    },
    [systems, onHover],
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (e.index !== undefined && e.index < systems.length) {
        onClick(systems[e.index]);
      }
    },
    [systems, onClick],
  );

  if (systems.length === 0) return null;

  return (
    <points
      ref={pointsRef}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      onPointerLeave={() => onHover(null, null)}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.4}
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Constellation connection lines
const ConstellationLines = ({
  systems,
  edges,
}: {
  systems: NormalizedSystem[];
  edges: GalaxyEdge[];
}) => {
  const positions = useMemo(() => {
    const pos = new Float32Array(edges.length * 6);
    for (let i = 0; i < edges.length; i++) {
      const from = systems[edges[i].from];
      const to = systems[edges[i].to];
      if (!from || !to) continue;
      const [x1, y1, z1] = systemToPos(from);
      const [x2, y2, z2] = systemToPos(to);
      pos[i * 6] = x1; pos[i * 6 + 1] = y1; pos[i * 6 + 2] = z1;
      pos[i * 6 + 3] = x2; pos[i * 6 + 4] = y2; pos[i * 6 + 5] = z2;
    }
    return pos;
  }, [systems, edges]);

  if (edges.length === 0) return null;

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#00e5ff" transparent opacity={0.04} />
    </lineSegments>
  );
};

// Route line between start and end
const RouteLine = ({
  start,
  end,
}: {
  start: NormalizedSystem | null;
  end: NormalizedSystem | null;
}) => {
  const glowRef = useRef<THREE.Line | null>(null);
  const dashRef = useRef<THREE.Line | null>(null);

  // Create line objects imperatively to avoid JSX <line> vs SVG conflict
  const { glowLine, dashLine } = useMemo(() => {
    if (!start || !end) return { glowLine: null, dashLine: null };

    const [x1, y1, z1] = systemToPos(start);
    const [x2, y2, z2] = systemToPos(end);
    const pts = [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2)];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);

    // Compute line distances for dashing
    const dist = new Float32Array([0, pts[0].distanceTo(pts[1])]);
    geo.setAttribute("lineDistance", new THREE.BufferAttribute(dist, 1));

    const glow = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({ color: "#00e5ff", transparent: true, opacity: 0.2 }),
    );
    const dash = new THREE.Line(
      geo,
      new THREE.LineDashedMaterial({
        color: "#00e5ff",
        transparent: true,
        opacity: 0.8,
        dashSize: 1,
        gapSize: 0.5,
      }),
    );

    return { glowLine: glow, dashLine: dash };
  }, [start, end]);

  useFrame(({ clock }) => {
    if (dashRef.current) {
      // dashOffset exists at runtime but isn't in @types/three
      (dashRef.current.material as unknown as { dashOffset: number }).dashOffset =
        -clock.elapsedTime * 2;
    }
  });

  if (!glowLine || !dashLine) return null;

  return (
    <>
      <primitive ref={glowRef} object={glowLine} />
      <primitive ref={dashRef} object={dashLine} />
    </>
  );
};

// Route markers
const RouteMarker = ({
  system,
  color,
}: {
  system: NormalizedSystem;
  color: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 3) * 0.3;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const [x, y, z] = systemToPos(system);

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <sphereGeometry args={[0.6, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
};

// Selection ring
const SelectionRing = ({ system }: { system: NormalizedSystem }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime;
    }
  });

  const [x, y, z] = systemToPos(system);

  return (
    <mesh ref={ringRef} position={[x, y, z]}>
      <ringGeometry args={[0.8, 1, 32]} />
      <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
};

// Camera zoom to initial system
const InitialZoom = ({
  system,
  systems,
}: {
  system: number | undefined;
  systems: NormalizedSystem[];
}) => {
  const done = useRef(false);
  const cameraRef = useRef<Camera | null>(null);

  useFrame(({ camera }) => {
    cameraRef.current = camera;
  });

  useEffect(() => {
    if (!system || systems.length === 0 || done.current || !cameraRef.current) return;
    const target = systems.find((s) => s.id === system);
    if (!target) return;
    const [x, y, z] = systemToPos(target);
    cameraRef.current.position.set(x + 10, y + 5, z + 10);
    cameraRef.current.lookAt(x, y, z);
    done.current = true;
  }, [system, systems]);

  return null;
};

// Main export
export const GalaxyMap = ({
  systems,
  edges,
  onSelectSystem,
  selectedSystem,
  initialSystemId,
  routeMode = false,
  routeStart = null,
  routeEnd = null,
  onRouteClick,
}: GalaxyMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<{
    system: NormalizedSystem;
    x: number;
    y: number;
  } | null>(null);

  const handleHover = useCallback(
    (system: NormalizedSystem | null, event: ThreeEvent<PointerEvent> | null) => {
      if (system && event) {
        setHovered({
          system,
          x: event.nativeEvent.clientX,
          y: event.nativeEvent.clientY,
        });
      } else {
        setHovered(null);
      }
    },
    [],
  );

  const handleClick = useCallback(
    (system: NormalizedSystem) => {
      if (routeMode && onRouteClick) {
        onRouteClick(system);
      } else {
        onSelectSystem(system);
      }
    },
    [routeMode, onRouteClick, onSelectSystem],
  );

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 40, 80], fov: 60, near: 0.1, far: 500 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#060a12" }}
      >
        <color attach="background" args={["#060a12"]} />
        <ambientLight intensity={0.5} />

        <Stars radius={200} depth={100} count={3000} factor={3} saturation={0} fade speed={0.5} />

        <SystemPoints systems={systems} onHover={handleHover} onClick={handleClick} />
        <ConstellationLines systems={systems} edges={edges} />

        {selectedSystem && <SelectionRing system={selectedSystem} />}
        {routeStart && <RouteMarker system={routeStart} color="#00e676" />}
        {routeEnd && <RouteMarker system={routeEnd} color="#ff1744" />}
        <RouteLine start={routeStart} end={routeEnd} />

        <InitialZoom system={initialSystemId} systems={systems} />

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={200}
          autoRotate
          autoRotateSpeed={0.3}
        />

        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* Tooltip overlay (DOM layer) */}
      {hovered && containerRef.current && (
        <SystemTooltip
          name={hovered.system.name}
          constellationId={hovered.system.constellationId}
          x={hovered.x - containerRef.current.getBoundingClientRect().left}
          y={hovered.y - containerRef.current.getBoundingClientRect().top}
          containerWidth={containerRef.current.clientWidth}
        />
      )}

      {/* System count overlay */}
      <div className="absolute bottom-3 left-3 bg-void/70 px-3 py-2 rounded font-jetbrains text-xs text-muted pointer-events-none select-none">
        {systems.length.toLocaleString()} systems &middot; 3D
      </div>
    </div>
  );
};
