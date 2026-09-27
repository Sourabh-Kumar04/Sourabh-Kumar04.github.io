import { useEffect, useRef } from "react";
import * as THREE from "three";

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
    renderer.setClearColor(0x000000, 0); // transparent background
    container.appendChild(renderer.domElement);

    // Particle Constellation Geometry
    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color("#ecc246");
    const cyanColor = new THREE.Color("#00e5ff");
    const dimColor = new THREE.Color("#2a3b52");

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 130;
      positions[i3 + 1] = (Math.random() - 0.5) * 110;
      positions[i3 + 2] = (Math.random() - 0.5) * 90;

      // Color variation between gold, cyan, and muted cybernetic blue
      const rand = Math.random();
      const c = rand > 0.7 ? goldColor : rand > 0.4 ? cyanColor : dimColor;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Simple circular particle texture created on an in-memory canvas
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0.8)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Neural Lattice Connections (Lines between close nodes)
    const maxConnections = 140;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);
    let lineIdx = 0;

    // Connect some nearby particles initially
    for (let i = 0; i < particleCount && lineIdx < maxConnections; i++) {
      for (let j = i + 1; j < particleCount && lineIdx < maxConnections; j++) {
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
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Group to rotate together
    const graphGroup = new THREE.Group();
    graphGroup.add(particles);
    graphGroup.add(lines);
    scene.add(graphGroup);

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

    // Render Animation Loop (Persistent movement without waiting for hover!)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Continuous ambient drift
        graphGroup.rotation.y += 0.0006;
        graphGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;

        // Smooth mouse lerping
        graphGroup.rotation.y += (targetRotationY - graphGroup.rotation.y) * 0.03;
        graphGroup.rotation.x += (targetRotationX - graphGroup.rotation.x) * 0.03;

        // Scroll translation through 3D space
        const targetCamZ = 70 + ((scrollOffset * 0.02) % 40);
        camera.position.z += (targetCamZ - camera.position.z) * 0.05;
        camera.position.y = -(scrollOffset * 0.015);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
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
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-55 transition-opacity duration-1000"
    />
  );
}
