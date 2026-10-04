import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Rotate3d, Zap, Layers } from "lucide-react";

export function Interactive3DCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotTextRef = useRef<HTMLSpanElement>(null);
  const [wireframeOnly, setWireframeOnly] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // References for mutable animation objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const coreGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);
  const isPulseActiveRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 320;
    const height = 220;

    // 1. Scene & Camera setup with wider clearance to prevent frustum clipping
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    // 2. WebGL Renderer with ACES Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 3. 3D Model Hierarchy: Neural Tensor Core
    const coreGroup = new THREE.Group();
    coreGroupRef.current = coreGroup;
    scene.add(coreGroup);

    // Inner Geodesic Core (Icosahedron) with true dielectric transmission & dispersion
    const innerGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x15d9c7,
      metalness: 0.0,
      roughness: 0.14,
      transmission: 0.92,
      ior: 1.54,
      thickness: 1.4,
      attenuationColor: new THREE.Color(0x064e47),
      attenuationDistance: 0.7,
      dispersion: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      emissive: 0x08524b,
      emissiveIntensity: 0.45,
      transparent: true,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);
    materialsRef.current.push(innerMat);

    // Outer Lattice Wireframe Cage (Pentagonal Dodecahedron via EdgesGeometry)
    const outerGeo = new THREE.DodecahedronGeometry(1.35, 1);
    const edgesGeo = new THREE.EdgesGeometry(outerGeo, 24);
    const outerWireMat = new THREE.LineBasicMaterial({
      color: 0xecc246,
      transparent: true,
      opacity: 0.55,
    });
    const outerWireMesh = new THREE.LineSegments(edgesGeo, outerWireMat);
    coreGroup.add(outerWireMesh);
    materialsRef.current.push(outerWireMat);

    // Node Vertices / Attention Anchors with Soft Photon Glow Sprites
    const vertexPointsGeo = new THREE.BufferGeometry();
    const posAttr = outerGeo.getAttribute("position");
    vertexPointsGeo.setAttribute("position", posAttr);

    const pointCanvas = document.createElement("canvas");
    pointCanvas.width = 32;
    pointCanvas.height = 32;
    const pctx = pointCanvas.getContext("2d");
    if (pctx) {
      const grad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.35, "rgba(236, 194, 70, 0.9)");
      grad.addColorStop(0.7, "rgba(236, 194, 70, 0.25)");
      grad.addColorStop(1, "rgba(236, 194, 70, 0)");
      pctx.fillStyle = grad;
      pctx.fillRect(0, 0, 32, 32);
    }
    const pointTexture = new THREE.CanvasTexture(pointCanvas);

    const pointMat = new THREE.PointsMaterial({
      map: pointTexture,
      size: 0.16,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const vertexPoints = new THREE.Points(vertexPointsGeo, pointMat);
    coreGroup.add(vertexPoints);
    materialsRef.current.push(pointMat);

    // Concentric Orbital Equatorial Ring
    const ringGeo = new THREE.RingGeometry(1.65, 1.72, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x15d9c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    coreGroup.add(ringMesh);
    materialsRef.current.push(ringMat);

    // Lighting - High-dynamic range chiaroscuro
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xecc246, 3.2, 10);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x15d9c7, 2.8, 10);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    const rimLight = new THREE.DirectionalLight(0x15d9c7, 1.2);
    rimLight.position.set(-4, -3, -2);
    scene.add(rimLight);

    // 4. Interactive Mouse & Drag Physics
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocity = { x: 0.003, y: 0.006 };
    let isVisible = true;
    let animationFrameId: number;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsInteracting(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      velocity = {
        x: deltaY * 0.005,
        y: deltaX * 0.005,
      };

      coreGroup.rotation.y += velocity.y;
      coreGroup.rotation.x += velocity.x;

      previousMousePosition = { x: e.clientX, y: e.clientY };
      if (rotTextRef.current) {
        const px = (coreGroup.rotation.x % (Math.PI * 2)).toFixed(2);
        const py = (coreGroup.rotation.y % (Math.PI * 2)).toFixed(2);
        rotTextRef.current.textContent = `PITCH: ${Number(px) > 0 ? `+${px}` : px} | YAW: ${Number(py) > 0 ? `+${py}` : py}`;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    // Touch support for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        isDragging = true;
        setIsInteracting(true);
        previousMousePosition = { x: touch.clientX, y: touch.clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!isDragging || !touch) return;
      const deltaX = touch.clientX - previousMousePosition.x;
      const deltaY = touch.clientY - previousMousePosition.y;

      velocity = {
        x: deltaY * 0.005,
        y: deltaX * 0.005,
      };

      coreGroup.rotation.y += velocity.y;
      coreGroup.rotation.x += velocity.x;

      previousMousePosition = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // 5. Visibility Observer: Only animate when visible on screen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.1 },
    );
    observer.observe(container);

    // 6. Resize handling
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!container || !renderer || !camera) return;
        width = container.clientWidth || 320;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 100);
    };
    window.addEventListener("resize", handleResize);

    // 7. Render Loop with Smooth Inertia Damping
    const clock = new THREE.Clock();
    let pulseScale = 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();

      if (!isDragging) {
        // Natural rotation and delta-time normalized inertia damping
        coreGroup.rotation.y += velocity.y;
        coreGroup.rotation.x += velocity.x;
        ringMesh.rotation.z += 0.008;

        // Continuous exponential decay: frame-rate independent across 60Hz and 144Hz displays
        const damping = Math.exp(-2.5 * Math.min(delta, 0.1));
        velocity.x *= damping;
        velocity.y = velocity.y * damping + 0.0004 * (Math.min(delta, 0.1) / 0.016);

        if (rotTextRef.current) {
          const px = (coreGroup.rotation.x % (Math.PI * 2)).toFixed(2);
          const py = (coreGroup.rotation.y % (Math.PI * 2)).toFixed(2);
          rotTextRef.current.textContent = `PITCH: ${Number(px) > 0 ? `+${px}` : px} | YAW: ${Number(py) > 0 ? `+${py}` : py}`;
        }
      }

      // Pulse animation dynamics
      if (isPulseActiveRef.current) {
        pulseScale = THREE.MathUtils.lerp(pulseScale, 1.25, 0.15);
        innerMesh.scale.set(pulseScale, pulseScale, pulseScale);
        if (pulseScale > 1.22) {
          isPulseActiveRef.current = false;
        }
      } else {
        pulseScale = THREE.MathUtils.lerp(pulseScale, 1.0, 0.08);
        innerMesh.scale.set(pulseScale, pulseScale, pulseScale);
      }

      renderer.render(scene, camera);
    };

    animate();

    const activeMaterials = materialsRef.current;

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      // Clean disposal
      innerGeo.dispose();
      outerGeo.dispose();
      edgesGeo.dispose();
      vertexPointsGeo.dispose();
      ringGeo.dispose();
      pointTexture.dispose();
      activeMaterials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  // Wireframe toggle effect
  useEffect(() => {
    if (!materialsRef.current[0]) return;
    (materialsRef.current[0] as THREE.MeshPhysicalMaterial).wireframe = wireframeOnly;
  }, [wireframeOnly]);

  const triggerCorePulse = () => {
    isPulseActiveRef.current = true;
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col gap-2 font-mono text-xs select-none relative"
    >
      <div className="flex items-center justify-between border-b border-[#1b2331] pb-2">
        <span className="font-label-telemetry text-[11px] text-primary uppercase font-bold tracking-wider flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary animate-pulse" />
          3D NEURAL TENSOR CORE
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setWireframeOnly((prev) => !prev);
            }}
            className={`px-1.5 py-0.5 rounded-[2px] border text-[9.5px] transition-colors flex items-center gap-1 cursor-pointer ${
              wireframeOnly
                ? "bg-primary text-black border-primary font-bold"
                : "bg-[#0b1018] text-on-surface-variant border-[#1e2a3c] hover:text-white"
            }`}
            title="Toggle Wireframe Shell"
          >
            <Layers size={10} />
            <span>{wireframeOnly ? "SOLID" : "WIREFRAME"}</span>
          </button>
          <button
            type="button"
            onClick={triggerCorePulse}
            className="px-2 py-0.5 rounded-[2px] bg-cyan-spec/10 border border-cyan-spec/30 text-cyan-spec hover:bg-cyan-spec/20 transition-all flex items-center gap-1 text-[9.5px] cursor-pointer"
            title="Inject Activation Energy Pulse"
          >
            <Zap size={10} />
            <span>PULSE</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container with Cursor Guidance */}
      <div className="relative rounded-[2px] border border-[#1b2331] bg-[#06080c] overflow-hidden group">
        <canvas
          ref={canvasRef}
          className="w-full h-[220px] cursor-grab active:cursor-grabbing block"
          title="Click and drag to orbit 3D Neural Core"
        />

        {/* Ambient HUD Coordinates Overlay */}
        <div className="absolute top-2 left-2.5 pointer-events-none flex flex-col gap-0.5 font-mono text-[9px] text-on-surface-variant/80">
          <span className="flex items-center gap-1 text-primary">
            <Rotate3d size={10} />
            <span>ORBIT: DRAG_MOUSE</span>
          </span>
          <span ref={rotTextRef} className="tabular-nums">
            PITCH: +0.00 | YAW: +0.00
          </span>
        </div>

        {/* Hologram Status Indicator */}
        <div className="absolute bottom-2 right-2.5 pointer-events-none flex items-center gap-1.5 font-mono text-[9px]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isInteracting ? "bg-primary animate-ping" : "bg-tertiary"
            }`}
          />
          <span className="text-on-surface-variant">
            {isInteracting ? "MOMENTUM // ACTIVE" : "TENSOR // COHERENT"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-on-surface-variant pt-0.5">
        <span className="text-outline-variant">LATTICE: GEODESIC DODECAHEDRON</span>
        <span className="text-primary font-bold">LATENT DIMS: 1536</span>
      </div>
    </div>
  );
}
