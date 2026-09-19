import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Configuration, Product } from "@/lib/products";

type Props = { product: Product; config: Configuration; fallback?: React.ReactNode };

const MATERIALS: Record<string, { color: string; grain: string; roughness: number }> = {
  Oak: { color: "#b98255", grain: "#75482e", roughness: 0.82 },
  Maple: { color: "#d9b987", grain: "#9b6c3d", roughness: 0.78 },
  Cherry: { color: "#a85f48", grain: "#633426", roughness: 0.76 },
  Walnut: { color: "#634033", grain: "#2f1c17", roughness: 0.72 },
  "Painted White": { color: "#e8e1d7", grain: "#c8bfb2", roughness: 0.62 },
};

function makeWoodTexture(materialName: string, finish: string) {
  const palette = MATERIALS[materialName] ?? MATERIALS.Oak;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = palette.color;
  context.fillRect(0, 0, 256, 256);
  const base = new THREE.Color(palette.color);
  const grain = new THREE.Color(palette.grain);
  for (let x = -40; x < 300; x += 18) {
    context.beginPath();
    context.moveTo(x, 0);
    for (let y = 0; y <= 256; y += 16) context.lineTo(x + Math.sin(y * 0.08 + x) * 7, y);
    context.strokeStyle = `#${grain.getHexString()}`;
    context.globalAlpha = materialName === "Painted White" ? 0.12 : 0.3;
    context.lineWidth = materialName === "Painted White" ? 1 : 2;
    context.stroke();
  }
  context.globalAlpha = 1;
  if (finish === "Glazed") {
    context.fillStyle = "rgba(255,240,210,.13)";
    context.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.6, 1);
  return texture;
}

function createMaterial(materialName: string, finish: string, colorName: string) {
  const palette = MATERIALS[materialName] ?? MATERIALS.Oak;
  const texture = makeWoodTexture(materialName, finish);
  const color = new THREE.Color(palette.color);
  if (colorName === "Navy") color.lerp(new THREE.Color("#273b4d"), 0.7);
  if (colorName === "Gray") color.lerp(new THREE.Color("#8b8a83"), 0.55);
  if (colorName === "White") color.lerp(new THREE.Color("#f4eee5"), 0.74);
  if (colorName === "Honey") color.lerp(new THREE.Color("#c48745"), 0.36);
  if (colorName === "Espresso") color.lerp(new THREE.Color("#2c1c17"), 0.62);
  return new THREE.MeshStandardMaterial({ color, map: texture, roughness: finish === "Painted" ? 0.52 : palette.roughness, metalness: 0.03 });
}

function addBox(group: THREE.Group, material: THREE.Material, size: [number, number, number], position: [number, number, number]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function buildFurniture(product: Product, config: Configuration) {
  const group = new THREE.Group();
  const material = createMaterial(config.material, config.finish, config.color);
  const inner = createMaterial(config.material, config.finish, config.color);
  const metal = new THREE.MeshStandardMaterial({ color: config.hardware === "Handles" ? "#b68b5c" : "#33261f", metalness: 0.7, roughness: 0.25 });
  const glass = new THREE.MeshPhysicalMaterial({ color: "#d7e2df", transparent: true, opacity: 0.25, roughness: 0.08, metalness: 0.05 });
  const width = Math.max(3.4, config.width / 10);
  const height = Math.max(3.2, config.height / 10);
  const depth = Math.max(1.7, config.depth / 10);
  const board = Math.max(0.12, Math.min(0.22, width * 0.035));
  addBox(group, material, [width, board, depth], [0, height / 2, 0]);
  addBox(group, material, [width, board, depth], [0, -height / 2, 0]);
  addBox(group, material, [board, height, depth], [-width / 2, 0, 0]);
  addBox(group, material, [board, height, depth], [width / 2, 0, 0]);
  const shelfMaterial = config.doors === "None" ? inner : material;
  for (let index = 1; index <= config.shelves; index += 1) {
    const y = height / 2 - (height / (config.shelves + 1)) * index;
    addBox(group, shelfMaterial, [width - board * 1.4, board * 0.72, depth - board * 0.8], [0, y, 0]);
  }
  const drawerHeight = Math.min(0.52, height / Math.max(4.5, config.drawers + 2));
  for (let index = 0; index < config.drawers; index += 1) {
    const y = -height / 2 + board + drawerHeight * (index + 0.62);
    addBox(group, material, [width - board * 1.5, drawerHeight * 0.86, depth + 0.025], [0, y, depth * 0.035]);
    if (config.hardware === "Handles") addBox(group, metal, [0.42, 0.045, 0.055], [0, y, depth / 2 + 0.07]);
    else { const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), metal); knob.position.set(0, y, depth / 2 + 0.08); group.add(knob); }
  }
  if (config.doors !== "None") {
    const doorMaterial = config.doors.includes("Glass") ? glass : material;
    const doorWidth = (width - board * 2.3) / 2;
    [-1, 1].forEach((side) => {
      const door = addBox(group, doorMaterial, [doorWidth, height - board * 2.1, board * 0.62], [side * (doorWidth / 2 + board * 0.12), 0.08, depth / 2 + board * 0.35]);
      if (config.doors.includes("Glass")) { door.castShadow = false; }
      const hardwareX = side * (doorWidth * 0.36);
      if (config.hardware === "Handles") addBox(group, metal, [0.045, 0.44, 0.055], [hardwareX, 0.08, depth / 2 + board * 0.78]);
      else { const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), metal); knob.position.set(hardwareX, 0.08, depth / 2 + board * 0.78); group.add(knob); }
    });
  }
  if (config.lighting && product.lighting) {
    const light = new THREE.PointLight("#ffd58f", 1.4, width * 1.3);
    light.position.set(0, height * 0.15, depth * 0.3);
    group.add(light);
    addBox(group, new THREE.MeshStandardMaterial({ color: "#f4c978", emissive: "#f4a83e", emissiveIntensity: 1.4 }), [width - board * 2, 0.05, 0.05], [0, height * 0.38, depth / 2 + 0.02]);
  }
  group.userData.dimensions = { width, height, depth };
  return group;
}

export default function Furniture3D({ product, config, fallback }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const sceneRef = useRef<{ scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; controls: OrbitControls; group: THREE.Group } | null>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#dfd5ca");
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(6.2, 4.8, 7.6);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      if (!renderer.getContext()) throw new Error("WebGL context unavailable");
    } catch (error) {
      console.warn("[3D] WebGL unavailable; using the SVG fallback.", error);
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("[3D] WebGL context lost; using the SVG fallback.");
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);
    mount.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 4.5;
    controls.maxDistance = 12;
    controls.target.set(0, 0, 0);
    scene.add(new THREE.HemisphereLight("#fff8ef", "#856b5a", 2.1));
    const key = new THREE.DirectionalLight("#fff0dc", 3.3);
    key.position.set(4, 8, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(5.4, 64), new THREE.MeshStandardMaterial({ color: "#c9b8a7", roughness: 0.95 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.15;
    floor.receiveShadow = true;
    scene.add(floor);
    const group = buildFurniture(product, config);
    scene.add(group);
    sceneRef.current = { scene, camera, renderer, controls, group };
    let resizeFrame = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    const resize = () => {
      const width = Math.round(mount.getBoundingClientRect().width) || 560;
      const height = Math.round(mount.getBoundingClientRect().height) || 520;
      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const scheduleResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; resize(); });
    };
    scheduleResize();
    const observer = new ResizeObserver(scheduleResize);
    observer.observe(mount);
    let frame = 0;
    const animate = () => { frame = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); };
    animate();
    return () => { cancelAnimationFrame(frame); if (resizeFrame) cancelAnimationFrame(resizeFrame); observer.disconnect(); controls.dispose(); renderer.domElement.removeEventListener("webglcontextlost", handleContextLost); scene.traverse((object) => { const mesh = object as THREE.Mesh; if (mesh.geometry) mesh.geometry.dispose(); if (mesh.material) { const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]; materials.forEach((item) => { const material = item as THREE.MeshStandardMaterial; material.map?.dispose(); material.dispose(); }); } }); renderer.dispose(); renderer.domElement.remove(); sceneRef.current = null; };
  }, []);
  useEffect(() => {
    const state = sceneRef.current;
    if (!state) return;
    const next = buildFurniture(product, config);
    state.scene.remove(state.group);
    state.group.traverse((object) => { const mesh = object as THREE.Mesh; mesh.geometry?.dispose(); });
    state.scene.add(next);
    state.group = next;
  }, [product, config]);
  if (failed) return <>{fallback}</>;
  return <div ref={mountRef} className="three-viewer" aria-label={`${product.name} interactive 3D preview`}><span className="three-viewer-hint">Drag to orbit · Scroll to zoom</span></div>;
}
