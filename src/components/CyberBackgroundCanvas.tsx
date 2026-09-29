import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  intensity: number;
}

export function CyberBackgroundCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    const particleCount = 280;
    const initialPositions = new Float32Array(particleCount * 3);
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const baseColors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color("#ecc246");
    const cyanColor = new THREE.Color("#00e5ff");
    const dimColor = new THREE.Color("#2a3b52");

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const px = (Math.random() - 0.5) * 140;
      const py = (Math.random() - 0.5) * 120;
      const pz = (Math.random() - 0.5) * 100;

      initialPositions[i3] = px;
      initialPositions[i3 + 1] = py;
      initialPositions[i3 + 2] = pz;

      positions[i3] = px;
      positions[i3 + 1] = py;
      positions[i3 + 2] = pz;

      const rand = Math.random();
      const c = rand > 0.65 ? goldColor : rand > 0.35 ? cyanColor : dimColor;

      baseColors[i3] = c.r;
      baseColors[i3 + 1] = c.g;
      baseColors[i3 + 2] = c.b;

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
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 2.4,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);

    // Neural Lattice Connections
    const maxConnections = 160;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);
    let lineIdx = 0;

    for (let i = 0; i < particleCount && lineIdx < maxConnections; i++) {
      for (let j = i + 1; j < particleCount && lineIdx < maxConnections; j++) {
        const p1x = initialPositions[i * 3] ?? 0;
        const p1y = initialPositions[i * 3 + 1] ?? 0;
        const p1z = initialPositions[i * 3 + 2] ?? 0;
        const p2x = initialPositions[j * 3] ?? 0;
        const p2y = initialPositions[j * 3 + 1] ?? 0;
        const p2z = initialPositions[j * 3 + 2] ?? 0;

        const dx = p1x - p2x;
        const dy = p1y - p2y;
        const dz = p1z - p2z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 28) {
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
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);

    // Subtle 3D Wireframe Icosahedron Core
    const icoGeometry = new THREE.IcosahedronGeometry(22, 1);
    const icoWireframe = new THREE.WireframeGeometry(icoGeometry);
    const icoMaterial = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const icoMesh = new THREE.LineSegments(icoWireframe, icoMaterial);
    icoMesh.position.set(20, -10, -20);

    // Group to hold all 3D scene elements
    const graphGroup = new THREE.Group();
    graphGroup.add(particles);
    graphGroup.add(lines);
    graphGroup.add(icoMesh);
    scene.add(graphGroup);

    // Interactive Shockwaves queue
    const shockwaves: Shockwave[] = [];

    const handleWindowClick = (e: MouseEvent) => {
      // Create a 3D shockwave origin near the cursor projection
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      shockwaves.push({
        x: normX * 45,
        y: normY * 35,
        radius: 0,
        maxRadius: 85,
        speed: 1.8,
        intensity: 1.0,
      });
    };

    window.addEventListener("click", handleWindowClick, { passive: true });

    // Motion tracking variables
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let scrollOffset = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = mouseX * 0.25;
      targetRotationX = -mouseY * 0.2;
    };

    const handleScroll = () => {
      scrollOffset = window.scrollY || window.pageYOffset;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Continuous ambient rotation
        graphGroup.rotation.y += 0.0006;
        graphGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;

        // Counter-rotation on wireframe core
        icoMesh.rotation.x -= 0.0008;
        icoMesh.rotation.y += 0.001;

        // Mouse orientation lerping
        graphGroup.rotation.y += (targetRotationY - graphGroup.rotation.y) * 0.03;
        graphGroup.rotation.x += (targetRotationX - graphGroup.rotation.x) * 0.03;

        // Scroll translation through 3D space
        const targetCamZ = 70 + ((scrollOffset * 0.02) % 40);
        camera.position.z += (targetCamZ - camera.position.z) * 0.05;
        camera.position.y = -(scrollOffset * 0.015);

        // Process shockwaves on particles
        const posAttr = particleGeometry.getAttribute("position");
        const colAttr = particleGeometry.getAttribute("color");
        const hasActiveShockwaves = shockwaves.length > 0;

        for (let sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
          const sw = shockwaves[sIdx]!;
          sw.radius += sw.speed;
          sw.intensity = Math.max(0, 1 - sw.radius / sw.maxRadius);

          if (sw.radius >= sw.maxRadius) {
            shockwaves.splice(sIdx, 1);
          }
        }

        if (posAttr && colAttr) {
          const currentPos = posAttr.array as Float32Array;
          const currentCol = colAttr.array as Float32Array;

          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const initX = initialPositions[i3] ?? 0;
            const initY = initialPositions[i3 + 1] ?? 0;
            const initZ = initialPositions[i3 + 2] ?? 0;

            let dispX = 0;
            let dispY = 0;
            let dispZ = 0;
            let brightnessBoost = 0;

            if (hasActiveShockwaves) {
              for (const sw of shockwaves) {
                const dx = initX - sw.x;
                const dy = initY - sw.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const waveDiff = Math.abs(dist - sw.radius);

                if (waveDiff < 14) {
                  const factor = (1 - waveDiff / 14) * sw.intensity * 4.5;
                  dispX += (dx / (dist || 1)) * factor;
                  dispY += (dy / (dist || 1)) * factor;
                  dispZ += Math.sin(dist * 0.2) * factor * 2;
                  brightnessBoost += factor * 0.2;
                }
              }
            }

            // Gentle ambient breathing oscillation
            const breathe = Math.sin(elapsedTime * 1.2 + i) * 0.4;
            currentPos[i3] = initX + dispX;
            currentPos[i3 + 1] = initY + dispY + breathe;
            currentPos[i3 + 2] = initZ + dispZ;

            // Dynamic color pulsing
            const baseR = baseColors[i3] ?? 0.5;
            const baseG = baseColors[i3 + 1] ?? 0.5;
            const baseB = baseColors[i3 + 2] ?? 0.5;

            currentCol[i3] = Math.min(1, baseR + brightnessBoost);
            currentCol[i3 + 1] = Math.min(1, baseG + brightnessBoost);
            currentCol[i3 + 2] = Math.min(1, baseB + brightnessBoost);
          }

          posAttr.needsUpdate = true;
          colAttr.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
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
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60 transition-opacity duration-1000"
    />
  );
}
