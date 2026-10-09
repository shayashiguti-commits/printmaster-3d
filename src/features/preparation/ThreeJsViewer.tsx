import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { checkMeshHealth } from '../../lib/meshHealthChecker.ts';
import { MeshHealthReport } from '../../types/index.ts';

interface ThreeJsViewerProps {
  stlBuffer?: ArrayBuffer | null;
  modelBuffer?: ArrayBuffer | null;
  fileType?: 'stl' | '3mf';
  wireframe?: boolean;
  onModelLoaded?: (info: { triangleCount: number; size: [number, number, number]; meshHealth?: MeshHealthReport }) => void;
}

export const ThreeJsViewer: React.FC<ThreeJsViewerProps> = ({ 
  stlBuffer, 
  modelBuffer, 
  fileType = 'stl', 
  wireframe = false,
  onModelLoaded
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const activeBuffer = modelBuffer || stlBuffer;

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // slate-900
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(150, 150, 200);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(100, 200, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.5);
    dirLight2.position.set(-100, -100, -100);
    scene.add(dirLight2);

    // 5. Grid Build Plate (256x256mm Bambu Bed Simulation)
    const grid = new THREE.GridHelper(256, 32, 0x3b82f6, 0x334155);
    grid.position.y = 0;
    scene.add(grid);

    // Build plate border
    const bedGeo = new THREE.BoxGeometry(256, 1, 256);
    const bedMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, wireframe: true });
    const bedMesh = new THREE.Mesh(bedGeo, bedMat);
    bedMesh.position.y = -0.5;
    scene.add(bedMesh);

    // 6. Simple Interactive Orbit Dragging
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const dom = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      if (meshRef.current) {
        meshRef.current.rotation.y += deltaX * 0.01;
        meshRef.current.rotation.x += deltaY * 0.01;
      }
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(50, Math.min(800, camera.position.z + e.deltaY * 0.5));
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      camera.lookAt(0, 30, 0);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current && dom) {
        mountRef.current.removeChild(dom);
      }
    };
  }, []);

  // Update Geometry when STL or 3MF buffer changes
  useEffect(() => {
    if (!sceneRef.current || !activeBuffer) return;

    // Clean previous mesh / group
    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
      meshRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).geometry?.dispose();
          const mat = (child as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach(m => m.dispose());
          else mat?.dispose();
        }
      });
      meshRef.current = null;
    }

    try {
      if (fileType === '3mf') {
        const loader = new ThreeMFLoader();
        const group = loader.parse(activeBuffer);

        // Calculate bounding box of the parsed 3MF group
        const bbox = new THREE.Box3().setFromObject(group);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        // Center model in X and Z, and place base on build plate (Y=0)
        group.position.x = -center.x;
        group.position.z = -center.z;
        group.position.y = -bbox.min.y;

        let totalTriangles = 0;
        group.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (wireframe && mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach(m => (m as THREE.MeshStandardMaterial).wireframe = true);
              } else {
                (mesh.material as THREE.MeshStandardMaterial).wireframe = true;
              }
            }
            if (mesh.geometry) {
              if (mesh.geometry.index) {
                totalTriangles += mesh.geometry.index.count / 3;
              } else if (mesh.geometry.attributes.position) {
                totalTriangles += mesh.geometry.attributes.position.count / 3;
              }
            }
          }
        });

        meshRef.current = group;
        sceneRef.current.add(group);

        if (onModelLoaded) {
          onModelLoaded({
            triangleCount: Math.round(totalTriangles),
            size: [+(size.x.toFixed(2)), +(size.z.toFixed(2)), +(size.y.toFixed(2))],
          });
        }

        // Adjust camera
        if (cameraRef.current) {
          const maxDim = Math.max(size.x, size.y, size.z, 40);
          cameraRef.current.position.set(maxDim * 1.5, maxDim * 1.3, maxDim * 2.2);
        }
      } else {
        // STL Rendering
        const geometry = parseStlToThreeGeometry(activeBuffer);
        const health = checkMeshHealth(geometry);
        geometry.center();
        geometry.computeVertexNormals();

        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox!;
        const heightOffset = -bbox.min.y;
        const size = new THREE.Vector3();
        bbox.getSize(size);

        // Dynamic material color based on mesh health:
        // perfect = cyan/sky (0x38bdf8), warning = golden amber (0xf59e0b), critical = rose (0xf43f5e)
        let modelColor = 0x38bdf8;
        if (health.overallStatus === 'critical') modelColor = 0xf43f5e;
        else if (health.overallStatus === 'warning') modelColor = 0xf59e0b;

        const material = new THREE.MeshStandardMaterial({
          color: modelColor,
          roughness: 0.35,
          metalness: 0.1,
          wireframe,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = heightOffset;
        meshRef.current = mesh;
        sceneRef.current.add(mesh);

        if (onModelLoaded) {
          onModelLoaded({
            triangleCount: Math.round(geometry.attributes.position.count / 3),
            size: [+(size.x.toFixed(2)), +(size.z.toFixed(2)), +(size.y.toFixed(2))],
            meshHealth: health,
          });
        }

        if (cameraRef.current) {
          const maxDim = Math.max(size.x, size.y, size.z, 40);
          cameraRef.current.position.set(maxDim * 1.5, maxDim * 1.2, maxDim * 2.2);
        }
      }
    } catch (err) {
      console.error('Error rendering 3D model in Three.js:', err);
    }
  }, [activeBuffer, fileType, wireframe]);

  // Rotations
  const rotateObject = (axis: 'x' | 'y' | 'z', degrees: number) => {
    if (!meshRef.current) return;
    const rad = THREE.MathUtils.degToRad(degrees);
    if (axis === 'x') meshRef.current.rotation.x += rad;
    if (axis === 'y') meshRef.current.rotation.y += rad;
    if (axis === 'z') meshRef.current.rotation.z += rad;
  };

  const resetOrientation = () => {
    if (!meshRef.current) return;
    meshRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative w-full h-full min-h-[360px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating Control Toolbar */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-700/80 p-2 rounded-xl text-xs backdrop-blur-md shadow-lg">
        <span className="text-[10px] text-slate-400 font-semibold px-1">Girar Peça:</span>
        <div className="flex gap-1">
          <button
            onClick={() => rotateObject('x', 90)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px]"
            title="Girar 90° em X"
          >
            +90° X
          </button>
          <button
            onClick={() => rotateObject('y', 90)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px]"
            title="Girar 90° em Y"
          >
            +90° Y
          </button>
          <button
            onClick={() => rotateObject('z', 90)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px]"
            title="Girar 90° em Z"
          >
            +90° Z
          </button>
        </div>
        <button
          onClick={resetOrientation}
          className="mt-1 w-full py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold text-[10px] text-center"
        >
          Resetar Posição
        </button>
      </div>

      {/* Bed Legend */}
      <div className="absolute bottom-3 left-3 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] text-slate-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        <span>Mesa de Impressão Bambu Lab (256x256mm)</span>
      </div>
    </div>
  );
};

// Helper: Fast binary & ASCII STL parser into BufferGeometry
function parseStlToThreeGeometry(buffer: ArrayBuffer): THREE.BufferGeometry {
  const dataView = new DataView(buffer);
  const isBinary = buffer.byteLength > 84 && Math.abs(buffer.byteLength - (84 + dataView.getUint32(80, true) * 50)) <= 2;

  const geometry = new THREE.BufferGeometry();

  if (isBinary) {
    const triangles = dataView.getUint32(80, true);
    const positions = new Float32Array(triangles * 3 * 3);
    const normals = new Float32Array(triangles * 3 * 3);

    let offset = 84;
    let posIdx = 0;

    for (let i = 0; i < triangles; i++) {
      if (offset + 50 > buffer.byteLength) break;

      const nx = dataView.getFloat32(offset, true);
      const ny = dataView.getFloat32(offset + 4, true);
      const nz = dataView.getFloat32(offset + 8, true);
      offset += 12;

      for (let v = 0; v < 3; v++) {
        const vx = dataView.getFloat32(offset, true);
        const vy = dataView.getFloat32(offset + 4, true);
        const vz = dataView.getFloat32(offset + 8, true);
        offset += 12;

        positions[posIdx] = vx;
        positions[posIdx + 1] = vy;
        positions[posIdx + 2] = vz;

        normals[posIdx] = nx;
        normals[posIdx + 1] = ny;
        normals[posIdx + 2] = nz;

        posIdx += 3;
      }

      offset += 2; // attribute byte count
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  } else {
    // Basic ASCII STL parser
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(buffer);
    const vertexMatches = text.match(/vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g);

    if (vertexMatches) {
      const positions: number[] = [];
      for (const m of vertexMatches) {
        const parts = m.trim().split(/\s+/);
        positions.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.computeVertexNormals();
    }
  }

  return geometry;
}
