"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ViewerStructure = { id: string; name: string; description: string | null; meshName: string };
export type ViewerGroup = { url: string; license: string; sourceName: string; structures: ViewerStructure[] };

const DIMMED_OPACITY = 0.12;

/** Un fichier 3D : applique la transparence aux structures masquées et signale la structure cliquée. */
function Model({
  url,
  dimmed,
  onPick,
}: {
  url: string;
  dimmed: Set<string>;
  onPick: (meshName: string) => void;
}) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => {
    const copy = gltf.scene.clone(true);
    copy.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material instanceof THREE.Material) {
        object.material = object.material.clone();
      }
    });
    return copy;
  }, [gltf]);

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || !(object.material instanceof THREE.Material)) return;
      const hidden = dimmed.has(object.name);
      object.material.transparent = hidden;
      object.material.opacity = hidden ? DIMMED_OPACITY : 1;
      object.material.depthWrite = !hidden;
      object.material.needsUpdate = true;
    });
  }, [scene, dimmed]);

  return (
    <primitive
      object={scene}
      onPointerDown={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        onPick(event.object.name);
      }}
    />
  );
}

export function AnatomyViewer({ groups }: { groups: ViewerGroup[] }) {
  const [dimmed, setDimmed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<ViewerStructure | null>(null);

  const structures = groups.flatMap((group) => group.structures.map((structure) => ({ ...structure, group })));
  const toggle = (meshName: string) => {
    setDimmed((current) => {
      const next = new Set(current);
      if (next.has(meshName)) next.delete(meshName);
      else next.add(meshName);
      return next;
    });
  };
  const pick = (meshName: string) => {
    const found = structures.find((structure) => structure.meshName === meshName);
    if (found) setSelected(found);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="relative h-[60vh] min-h-96 overflow-hidden rounded-2xl border border-border bg-card" aria-label="Visionneuse anatomique 3D">
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} />
          <Suspense fallback={null}>
            {groups.map((group) => (
              <Model key={group.url} url={group.url} dimmed={dimmed} onPick={pick} />
            ))}
          </Suspense>
          <OrbitControls makeDefault enablePan enableZoom enableRotate />
        </Canvas>
        <p className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-card/80 px-2 py-1 text-xs text-muted-foreground">
          Glisser : tourner · molette : zoom · clic droit : déplacer · clic sur une structure : détails
        </p>
      </div>

      <aside className="grid content-start gap-4">
        <Card className="p-4">
          <CardTitle className="text-sm">Structures</CardTitle>
          <ul className="mt-3 grid gap-2">
            {structures.map((structure) => {
              const hidden = dimmed.has(structure.meshName);
              return (
                <li key={structure.id} className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(structure)}
                    className={cn("cursor-pointer text-left text-sm hover:underline", selected?.id === structure.id ? "font-medium text-primary" : "text-foreground")}
                  >
                    {structure.name}
                  </button>
                  <Button variant="ghost" size="sm" onClick={() => toggle(structure.meshName)} aria-pressed={hidden} aria-label={`${hidden ? "Afficher" : "Estomper"} ${structure.name}`}>
                    {hidden ? "Afficher" : "Estomper"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-4">
          {selected ? (
            <>
              <CardTitle className="text-sm">{selected.name}</CardTitle>
              <CardDescription className="mt-2">{selected.description ?? "Aucune description pour cette structure."}</CardDescription>
            </>
          ) : (
            <CardDescription>Clique sur une structure du modèle ou dans la liste pour afficher son explication.</CardDescription>
          )}
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
            Source : {groups[0]?.sourceName ?? "—"} · Licence : {groups[0]?.license ?? "—"}
          </p>
        </Card>
      </aside>
    </div>
  );
}
