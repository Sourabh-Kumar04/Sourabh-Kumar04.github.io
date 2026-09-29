import { useEffect, useRef } from "react";
import * as THREE from "three";

export function CyberBackgroundCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 70;

    // WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      console.warn("WebGL not supported or context lost:", e);
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particle Constellation Geometry
    const particleCount = 260;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color("#ecc246");
    const cyanColor = new THREE.Color("#00e5ff");
    const dimColor = new THREE.Color("#2a3b52");

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const px = (Math.random() - 0.5) * 140;
      const py = (Math.random() - 0.5) * 120;
      const pz = (Math.random() - 0.5) * 100;

      positions[i3] = px;
      positions[i3 + 1] = py;
      positions[i3 + 2] = pz;

      const rand = Math.random();
      const c = rand > 0.65 ? goldColor : rand > 0.35 ? cyanColor : dimColor;

      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.35, "rgba(255,255,255,0.85)");
      gradient.addColorStop(0.7, "rgba(236,194,70,0.4)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);

    // Compute Static Inter-Particle Graph Connections
    const maxLines = particleCount * 6;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    let lineIdx = 0;

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        if (lineIdx >= maxLines) break;

        const p1x = positions[i * 3] ?? 0;
        const p1y = positions[i * 3 + 1] ?? 0;
        const p1z = positions[i * 3 + 2] ?? 0;
        const p2x = positions[j * 3] ?? 0;
        const p2y = positions[j * 3 + 1] ?? 0;
        const p2z = positions[j * 3 + 2] ?? 0;

        const dx = p1x - p2x;
        const dy = p1y - p2y;
        const dz = p1z - p2z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 26) {
          const l6 = lineIdx * 6;
          linePositions[l6] = p1x;
          linePositions[l6 + 1] = p1y;
          linePositions[l6 + 2] = p1z;
          linePositions[l6 + 3] = p2x;
          linePositions[l6 + 4] = p2y;
          linePositions[l6 + 5] = p2z;

          lineColors[l6] = 0.16;
          lineColors[l6 + 1] = 0.25;
          lineColors[l6 + 2] = 0.35;
          lineColors[l6 + 3] = 0.16;
          lineColors[l6 + 4] = 0.25;
          lineColors[l6 + 5] = 0.35;

          lineIdx++;
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions.slice(0, lineIdx * 6), 3),
    );
    lineGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors.slice(0, lineIdx * 6), 3),
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);

    // Subtle 3D Wireframe Icosahedron Core (Static)
    const icoGeometry = new THREE.IcosahedronGeometry(22, 1);
    const icoWireframe = new THREE.WireframeGeometry(icoGeometry);
    const icoMaterial = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
    });
    const icoMesh = new THREE.LineSegments(icoWireframe, icoMaterial);
    icoMesh.position.set(22, -10, -20);
    icoMesh.rotation.set(0.3, 0.4, 0);

    // Group to hold all 3D scene elements
    const graphGroup = new THREE.Group();
    graphGroup.add(particles);
    graphGroup.add(lines);
    graphGroup.add(icoMesh);
    scene.add(graphGroup);

    // Render once statically (zero background motion)
    renderer.render(scene, camera);

    // Handle Window Resize (re-render statically)
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);

      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      icoGeometry.dispose();
      icoWireframe.dispose();
      icoMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50 transition-opacity duration-1000"
    />
  );
}
