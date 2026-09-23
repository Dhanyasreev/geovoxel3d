import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  AlertTriangle,
  Building2,
  LandPlot,
  Hand,
  Move,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Compass,
  Check,
  Search,
  Layers,
  X,
  Eye,
  Sliders,
} from 'lucide-react';
import {
  CadastralBuilding,
  LandParcel,
  PropertyUnit,
  BuildingElevator,
  BuildingUtilityRiser,
} from '../types/gis';
import { InspectionMode } from './LayerPanel';
import { MapDimension } from './Header';

interface MapViewProps {
  parcels: LandParcel[];
  buildings: CadastralBuilding[];
  elevators?: BuildingElevator[];
  buildingUtilities?: BuildingUtilityRiser[];
  selectedParcel: LandParcel | null;
  selectedBuilding: CadastralBuilding | null;
  selectedFloor: number | null;
  selectedUnit: PropertyUnit | null;
  selectedElevator?: BuildingElevator | null;
  selectedBuildingUtility?: BuildingUtilityRiser | null;
  activeConflictId?: string;
  inspectionMode: InspectionMode;
  mapDimension: MapDimension;
  onSelectParcel: (parcel: LandParcel) => void;
  onSelectBuilding: (building: CadastralBuilding) => void;
  onSelectFloor: (floorNumber: number, building: CadastralBuilding) => void;
  onSelectUnit: (unit: PropertyUnit, building: CadastralBuilding) => void;
  onSelectElevator?: (elevator: BuildingElevator) => void;
  onSelectBuildingUtility?: (utility: BuildingUtilityRiser) => void;
  onSelectConflict?: (conflictId: string) => void;
  onOpenHierarchy?: () => void;
}

// -------------------------------------------------------------
// 3D PROCEDURAL ASSETS FOR BASEMENT & PARKING INFRASTRUCTURE
// -------------------------------------------------------------
function createCarMesh(color = '#2563EB') {
  const carGroup = new THREE.Group();

  // Car Body Chassis
  const bodyGeo = new THREE.BoxGeometry(2.1, 0.65, 4.2);
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.45 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.5;
  body.castShadow = true;
  carGroup.add(body);

  // Car Cabin / Windshield
  const cabinGeo = new THREE.BoxGeometry(1.8, 0.6, 2.3);
  const cabinMat = new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.1, metalness: 0.8 });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(0, 1.05, -0.2);
  carGroup.add(cabin);

  // Headlights
  const lightMat = new THREE.MeshBasicMaterial({ color: '#FEF08A' });
  [-0.7, 0.7].forEach((lx) => {
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.05), lightMat);
    light.position.set(lx, 0.55, 2.12);
    carGroup.add(light);
  });

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.22, 10);
  const wheelMat = new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.9 });
  const wheelPositions: [number, number, number][] = [
    [-1.02, 0.3, 1.2],
    [1.02, 0.3, 1.2],
    [-1.02, 0.3, -1.2],
    [1.02, 0.3, -1.2],
  ];
  wheelPositions.forEach(([wx, wy, wz]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, wy, wz);
    carGroup.add(wheel);
  });

  return carGroup;
}

function createStaircase(flY = 0) {
  const stairGroup = new THREE.Group();
  stairGroup.position.y = flY;

  // Staircase enclosure tower
  const wallMat = new THREE.MeshStandardMaterial({
    color: '#475569',
    roughness: 0.7,
    transparent: true,
    opacity: 0.8,
  });
  const towerBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.9, 0.2), wallMat);
  towerBack.position.set(0, 1.45, -1.8);
  stairGroup.add(towerBack);

  // Stair Treads (Concrete steps)
  const stepMat = new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.6 });
  for (let i = 0; i < 7; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 0.38), stepMat);
    step.position.set(-0.6, 0.2 + i * 0.36, -1.2 + i * 0.4);
    stairGroup.add(step);
  }

  // Safety Handrail
  const railMat = new THREE.MeshStandardMaterial({ color: '#F59E0B', metalness: 0.6, roughness: 0.3 });
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.2, 8), railMat);
  rail.position.set(0.25, 1.5, 0.1);
  rail.rotation.x = -Math.PI / 4.6;
  stairGroup.add(rail);

  // Illuminated Green Emergency Exit Sign
  const exitMat = new THREE.MeshBasicMaterial({ color: '#16A34A' });
  const exitSign = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.08), exitMat);
  exitSign.position.set(0, 2.5, -1.65);
  stairGroup.add(exitSign);

  return stairGroup;
}

export const MapView: React.FC<MapViewProps> = ({
  parcels,
  buildings,
  elevators = [],
  buildingUtilities = [],
  selectedParcel,
  selectedBuilding,
  selectedFloor,
  selectedUnit,
  selectedElevator,
  selectedBuildingUtility,
  activeConflictId = 'enc-flat-402',
  inspectionMode,
  mapDimension,
  onSelectParcel,
  onSelectBuilding,
  onSelectFloor,
  onSelectUnit,
  onSelectElevator,
  onSelectBuildingUtility,
  onSelectConflict,
  onOpenHierarchy,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const groundMeshRef = useRef<THREE.Mesh | null>(null);
  const groundMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Group references
  const groundGroupRef = useRef<THREE.Group>(new THREE.Group());
  const roadsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const parcelsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const buildingsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const elevatorsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const utilitiesGroupRef = useRef<THREE.Group>(new THREE.Group());

  // Interactive meshes mapping
  const interactiveMeshesRef = useRef<Map<THREE.Object3D, any>>(new Map());

  // Mouse interaction state (Orbit vs Pan tool)
  const [toolMode, setToolMode] = useState<'orbit' | 'pan'>('orbit');

  // Quick Flat Selector popover state
  const [showFlatPicker, setShowFlatPicker] = useState<boolean>(false);
  const [pickerBldgId, setPickerBldgId] = useState<string>(selectedBuilding?.id || 'bldg-a');

  // Tooltip state
  const [hoverInfo, setHoverInfo] = useState<{ title: string; subtitle: string; x: number; y: number } | null>(null);

  // Drag detection ref (to prevent accidental click selection while rotating/panning)
  const pointerStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  // Camera Animation Target
  const cameraAnimRef = useRef<{
    active: boolean;
    startCam: THREE.Vector3;
    targetCam: THREE.Vector3;
    startTarget: THREE.Vector3;
    targetTarget: THREE.Vector3;
    startTime: number;
    duration: number;
  }>({
    active: false,
    startCam: new THREE.Vector3(),
    targetCam: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    targetTarget: new THREE.Vector3(),
    startTime: 0,
    duration: 900,
  });

  const animateCameraTo = (camPos: THREE.Vector3, targetPos: THREE.Vector3, duration = 850) => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraAnimRef.current = {
      active: true,
      startCam: cameraRef.current.position.clone(),
      targetCam: camPos.clone(),
      startTarget: controlsRef.current.target.clone(),
      targetTarget: targetPos.clone(),
      startTime: performance.now(),
      duration,
    };
  };

  // -------------------------------------------------------------
  // NAVIGATION CONTROLS: PAN (MOVE LEFT/RIGHT/UP/DOWN)
  // -------------------------------------------------------------
  const panScreen = useCallback((deltaScreenX: number, deltaScreenY: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    // Right vector in screen space
    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    // Screen Up vector
    const up = camera.up.clone().normalize();

    const offset = right.clone().multiplyScalar(deltaScreenX).add(up.clone().multiplyScalar(deltaScreenY));
    camera.position.add(offset);
    controls.target.add(offset);
    controls.update();
  }, []);

  // -------------------------------------------------------------
  // NAVIGATION CONTROLS: ROTATE LEFT / RIGHT / PITCH
  // -------------------------------------------------------------
  const rotateYaw = useCallback((angleDelta: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const target = controls.target;

    const offset = camera.position.clone().sub(target);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleDelta);
    camera.position.copy(target).add(offset);
    camera.lookAt(target);
    controls.update();
  }, []);

  const rotatePitch = useCallback((angleDelta: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const target = controls.target;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    const offset = camera.position.clone().sub(target);
    offset.applyAxisAngle(right, angleDelta);
    if (offset.y > 2) {
      camera.position.copy(target).add(offset);
      camera.lookAt(target);
      controls.update();
    }
  }, []);

  // -------------------------------------------------------------
  // NAVIGATION CONTROLS: ZOOM IN / ZOOM OUT
  // -------------------------------------------------------------
  const zoomBy = useCallback((factor: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const target = controls.target;

    const offset = camera.position.clone().sub(target);
    const currentDist = offset.length();
    const newDist = Math.max(3, Math.min(360, currentDist * factor));
    offset.setLength(newDist);
    camera.position.copy(target).add(offset);
    controls.update();
  }, []);

  const handleResetCamera = useCallback(() => {
    if (mapDimension === '2d') {
      animateCameraTo(new THREE.Vector3(0, 160, 0), new THREE.Vector3(0, 0, 0), 800);
    } else {
      animateCameraTo(new THREE.Vector3(0, 95, 120), new THREE.Vector3(0, 0, 0), 800);
    }
  }, [mapDimension]);

  // -------------------------------------------------------------
  // 1. INITIALIZE THREE.JS SCENE
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F8FAFC');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1200);
    camera.position.set(0, 95, 120);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 2.5;
    controls.maxDistance = 380;
    controls.enablePan = true;
    controls.screenSpacePanning = true; // Screen-relative panning for intuitive left/right movement
    controls.panSpeed = 1.3;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Set mouse & touch interaction (left drag: rotate, right drag: pan, two-finger drag on touch: pan)
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.PAN,
    };

    // TWO-FINGER TOUCHPAD MOVEMENT
    // Moving 2 fingers on laptop touchpad moves map left, right, up, down naturally without buttons
    const handleTouchpadWheel = (e: WheelEvent) => {
      // Pinch to zoom on trackpad produces wheel with ctrlKey=true
      if (e.ctrlKey) {
        return; // OrbitControls handles pinch-to-zoom
      }

      // Trackpad 2-finger swipe:
      // deltaX moves horizontally (left / right)
      // deltaY moves vertically (up / down) in deltaMode === 0 (pixel mode typical of touchpads)
      if (Math.abs(e.deltaX) > 0.2 || (e.deltaMode === 0 && Math.abs(e.deltaY) < 70)) {
        e.preventDefault();
        e.stopPropagation();

        const panFactor = 0.055;
        panScreen(e.deltaX * panFactor, -e.deltaY * panFactor);
      }
    };

    renderer.domElement.addEventListener('wheel', handleTouchpadWheel, { passive: false });

    // LIGHTING
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 1.05);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#FFFFFF', 1.35);
    sunLight.position.set(65, 130, 85);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 350;
    sunLight.shadow.camera.left = -110;
    sunLight.shadow.camera.right = 110;
    sunLight.shadow.camera.top = 110;
    sunLight.shadow.camera.bottom = -110;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight('#EFF6FF', '#E2E8F0', 0.65);
    scene.add(hemiLight);

    // GROUPS
    scene.add(groundGroupRef.current);
    scene.add(roadsGroupRef.current);
    scene.add(parcelsGroupRef.current);
    scene.add(buildingsGroupRef.current);
    scene.add(elevatorsGroupRef.current);
    scene.add(utilitiesGroupRef.current);

    // Ground Plane
    const groundGeo = new THREE.PlaneGeometry(280, 280);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#F1F5F9',
      roughness: 0.9,
      metalness: 0.05,
    });
    groundMatRef.current = groundMat;
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.05;
    groundMesh.receiveShadow = true;
    groundMeshRef.current = groundMesh;
    groundGroupRef.current.add(groundMesh);

    // Subtle Cadastral Grid
    const grid = new THREE.GridHelper(280, 56, '#CBD5E1', '#E2E8F0');
    grid.position.y = 0.01;
    groundGroupRef.current.add(grid);

    // Central Access Road (Z axis)
    const roadMat = new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.8,
      metalness: 0.1,
    });
    const roadGeoNS = new THREE.PlaneGeometry(12, 240);
    const roadMeshNS = new THREE.Mesh(roadGeoNS, roadMat);
    roadMeshNS.rotation.x = -Math.PI / 2;
    roadMeshNS.position.set(0, 0.02, 0);
    roadMeshNS.receiveShadow = true;
    roadsGroupRef.current.add(roadMeshNS);

    // Crossroad 1 (Z = -22.5)
    const roadGeoEW1 = new THREE.PlaneGeometry(240, 11);
    const roadMeshEW1 = new THREE.Mesh(roadGeoEW1, roadMat);
    roadMeshEW1.rotation.x = -Math.PI / 2;
    roadMeshEW1.position.set(0, 0.02, -22.5);
    roadMeshEW1.receiveShadow = true;
    roadsGroupRef.current.add(roadMeshEW1);

    // Crossroad 2 (Z = 22.5)
    const roadGeoEW2 = new THREE.PlaneGeometry(240, 11);
    const roadMeshEW2 = new THREE.Mesh(roadGeoEW2, roadMat);
    roadMeshEW2.rotation.x = -Math.PI / 2;
    roadMeshEW2.position.set(0, 0.02, 22.5);
    roadMeshEW2.receiveShadow = true;
    roadsGroupRef.current.add(roadMeshEW2);

    // White Lane Markings
    const stripeMat = new THREE.MeshBasicMaterial({ color: '#F8FAFC' });
    for (let z = -100; z <= 100; z += 6) {
      if (Math.abs(z - (-22.5)) < 6 || Math.abs(z - 22.5) < 6) continue;
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 3), stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(0, 0.03, z);
      roadsGroupRef.current.add(stripe);
    }

    // ANIMATION LOOP
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (cameraAnimRef.current.active && cameraRef.current && controlsRef.current) {
        const { startCam, targetCam, startTarget, targetTarget, startTime, duration } =
          cameraAnimRef.current;
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1.0);
        const ease = 1 - Math.pow(1 - progress, 3);

        cameraRef.current.position.lerpVectors(startCam, targetCam, ease);
        controlsRef.current.target.lerpVectors(startTarget, targetTarget, ease);

        if (progress >= 1.0) {
          cameraAnimRef.current.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('wheel', handleTouchpadWheel);
      cancelAnimationFrame(reqId);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // -------------------------------------------------------------
  // TOOL MODE SYNC (ORBIT ROTATE vs HAND PAN)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    if (toolMode === 'pan') {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      };
      controls.touches = {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };
    } else {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };
    }
  }, [toolMode]);

  // -------------------------------------------------------------
  // KEYBOARD NAVIGATION: ARROWS / WASD TO PAN & MOVE LEFT/RIGHT
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        panScreen(-8, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        panScreen(8, 0);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        panScreen(0, 8);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        panScreen(0, -8);
      } else if (e.key === '+' || e.key === '=') {
        zoomBy(0.8);
      } else if (e.key === '-' || e.key === '_') {
        zoomBy(1.25);
      } else if (e.key === 'q' || e.key === 'Q') {
        rotateYaw(-Math.PI / 12);
      } else if (e.key === 'e' || e.key === 'E') {
        rotateYaw(Math.PI / 12);
      } else if (e.code === 'Space') {
        e.preventDefault();
        setToolMode((prev) => (prev === 'orbit' ? 'pan' : 'orbit'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panScreen, rotateYaw, zoomBy]);

  // -------------------------------------------------------------
  // 2. 2D vs 3D VIEW TOGGLE
  // -------------------------------------------------------------
  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;

    if (mapDimension === '2d') {
      controlsRef.current.maxPolarAngle = 0.01;
      controlsRef.current.minPolarAngle = 0.00;
      animateCameraTo(new THREE.Vector3(0, 160, 0), new THREE.Vector3(0, 0, 0), 800);
    } else {
      controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.02;
      controlsRef.current.minPolarAngle = 0.05;

      if (selectedUnit && selectedBuilding) {
        const bx = selectedBuilding.position.x;
        const bz = selectedBuilding.position.z;
        const flY = (selectedFloor !== null ? selectedFloor : selectedUnit.floorNumber) * 3.0;
        animateCameraTo(
          new THREE.Vector3(bx + 14, flY + 8, bz + 14),
          new THREE.Vector3(bx, flY + 1.5, bz),
          800
        );
      } else if (selectedBuilding) {
        const bx = selectedBuilding.position.x;
        const bz = selectedBuilding.position.z;
        animateCameraTo(
          new THREE.Vector3(bx + 26, 22, bz + 30),
          new THREE.Vector3(bx, 9.0, bz),
          800
        );
      } else {
        animateCameraTo(new THREE.Vector3(0, 95, 120), new THREE.Vector3(0, 0, 0), 800);
      }
    }
  }, [mapDimension]);

  // -------------------------------------------------------------
  // 3. BUILD GEOMETRY FOR PARCELS, BLOCKS, FLATS & UTILITIES
  // -------------------------------------------------------------
  useEffect(() => {
    if (!sceneRef.current) return;

    parcelsGroupRef.current.clear();
    buildingsGroupRef.current.clear();
    elevatorsGroupRef.current.clear();
    utilitiesGroupRef.current.clear();
    interactiveMeshesRef.current.clear();

    // -------------------------------------------------------------
    // 3A. PARCELS
    // -------------------------------------------------------------
    parcels.forEach((parcel) => {
      const coords = parcel.boundaryCoordinates;
      if (!coords || coords.length < 3) return;

      const minX = Math.min(...coords.map((c) => c[0]));
      const maxX = Math.max(...coords.map((c) => c[0]));
      const minZ = Math.min(...coords.map((c) => c[1]));
      const maxZ = Math.max(...coords.map((c) => c[1]));
      const width = maxX - minX;
      const depth = maxZ - minZ;
      const centerX = (minX + maxX) / 2;
      const centerZ = (minZ + maxZ) / 2;

      const isEmptyParcel = parcel.buildingIds.length === 0;
      const isSelected = selectedParcel?.id === parcel.id;

      // Parcel Surface
      const padGeo = new THREE.PlaneGeometry(width, depth);
      const padMat = new THREE.MeshStandardMaterial({
        color: isEmptyParcel
          ? isSelected
            ? '#FDE68A'
            : '#FEF3C7'
          : isSelected
          ? '#EFF6FF'
          : '#FFFFFF',
        roughness: 0.95,
      });
      const padMesh = new THREE.Mesh(padGeo, padMat);
      padMesh.rotation.x = -Math.PI / 2;
      padMesh.position.set(centerX, 0.015, centerZ);
      padMesh.receiveShadow = true;
      parcelsGroupRef.current.add(padMesh);

      // Boundary Line
      const pts = coords.map((c) => new THREE.Vector3(c[0], 0.05, c[1]));
      pts.push(pts[0].clone());
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: isEmptyParcel ? '#D97706' : isSelected ? '#2563EB' : '#94A3B8',
        linewidth: isEmptyParcel ? 3 : 2,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      parcelsGroupRef.current.add(line);

      // Boundary Pegs for Empty Parcel
      if (isEmptyParcel) {
        coords.forEach(([cx, cz]) => {
          const pegGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
          const pegMat = new THREE.MeshStandardMaterial({ color: '#D97706', roughness: 0.5 });
          const peg = new THREE.Mesh(pegGeo, pegMat);
          peg.position.set(cx, 0.6, cz);
          parcelsGroupRef.current.add(peg);
        });
      }

      interactiveMeshesRef.current.set(padMesh, {
        type: 'parcel',
        parcel,
        name: `${parcel.surveyNumber} ${isEmptyParcel ? '(Vacant Land)' : ''}`,
        info: `${parcel.areaSqMeters} m² · ${parcel.ownerName}`,
      });
    });

    // -------------------------------------------------------------
    // 3B. THE 6 BLOCKS WITH INTEGRAL FLAT GEOMETRIES
    // -------------------------------------------------------------
    buildings.forEach((bldg) => {
      const isSelectedBldg = selectedBuilding?.id === bldg.id;
      const bldgGroup = new THREE.Group();
      bldgGroup.position.set(bldg.position.x, 0, bldg.position.z);
      bldgGroup.name = bldg.id;

      // Transparency for inner inspections
      let shellOpacity = 0.9;
      if (inspectionMode === 'elevators' || inspectionMode === 'pipelines') {
        shellOpacity = bldg.id === 'bldg-a' ? 0.12 : 0.3;
      } else if (inspectionMode === 'basements') {
        shellOpacity = bldg.id === 'bldg-a' ? 0.08 : 0.8;
      }

      // -------------------------------------------------------------
      // BLOCK A: Full vertical structure with Basements, Elevators & Flats
      // -------------------------------------------------------------
      if (bldg.id === 'bldg-a') {
        // =============================================================
        // BASEMENT 2 (-6.0m): VISITOR & EV PARKING, BOOSTER PUMPS, FIRE SUMP
        // Strictly infrastructure and equipment - Zero residential flats
        // =============================================================
        const b2Group = new THREE.Group();
        b2Group.position.y = -6.0;

        // B2 Structural Floor Slab
        const b2SlabGeo = new THREE.BoxGeometry(19, 0.4, 19);
        const b2SlabMat = new THREE.MeshStandardMaterial({
          color: selectedFloor === -2 && isSelectedBldg ? '#1D4ED8' : '#334155',
          roughness: 0.8,
        });
        const b2Slab = new THREE.Mesh(b2SlabGeo, b2SlabMat);
        b2Group.add(b2Slab);

        // Subterranean Excavation Retaining Walls (semi-open so interior is clearly seen from underground view)
        const wallMatB2 = new THREE.MeshStandardMaterial({
          color: '#1E293B',
          transparent: true,
          opacity: 0.65,
          roughness: 0.9,
        });
        const backWallB2 = new THREE.Mesh(new THREE.BoxGeometry(19, 2.8, 0.4), wallMatB2);
        backWallB2.position.set(0, 1.4, -9.3);
        b2Group.add(backWallB2);
        const leftWallB2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 19), wallMatB2);
        leftWallB2.position.set(-9.3, 1.4, 0);
        b2Group.add(leftWallB2);

        // 1. Demarcated EV Charging Bays on B2 with green floor striping & charging pedestals
        const evBayMat = new THREE.LineBasicMaterial({ color: '#10B981', linewidth: 2 });
        [-6.0, -2.0, 2.0, 6.0].forEach((px) => {
          const bayPts = [
            new THREE.Vector3(px - 1.4, 0.22, -8.0),
            new THREE.Vector3(px - 1.4, 0.22, -3.2),
            new THREE.Vector3(px + 1.4, 0.22, -3.2),
            new THREE.Vector3(px + 1.4, 0.22, -8.0),
          ];
          const bayGeo = new THREE.BufferGeometry().setFromPoints(bayPts);
          b2Group.add(new THREE.Line(bayGeo, evBayMat));

          // EV Charging Pedestal
          const evPostGeo = new THREE.BoxGeometry(0.35, 1.4, 0.35);
          const evPostMat = new THREE.MeshStandardMaterial({ color: '#0F766E', roughness: 0.3 });
          const evPost = new THREE.Mesh(evPostGeo, evPostMat);
          evPost.position.set(px, 0.7, -8.3);
          b2Group.add(evPost);

          // Glowing LED light bar on charger
          const ledGeo = new THREE.BoxGeometry(0.12, 0.6, 0.05);
          const ledMat = new THREE.MeshBasicMaterial({ color: '#34D399' });
          const led = new THREE.Mesh(ledGeo, ledMat);
          led.position.set(px, 0.8, -8.1);
          b2Group.add(led);
        });

        // Parked EV Cars on B2
        const evCar1 = createCarMesh('#059669');
        evCar1.position.set(-2.0, 0.2, -5.6);
        b2Group.add(evCar1);

        const evCar2 = createCarMesh('#0284C7');
        evCar2.position.set(2.0, 0.2, -5.6);
        b2Group.add(evCar2);

        // 2. Hydro-Pneumatic Water Booster Pumps (3 industrial pumps with fire manifold)
        const pumpGroup = new THREE.Group();
        pumpGroup.position.set(4.5, 0.2, 4.0);
        [-1.4, 0, 1.4].forEach((offX) => {
          // Blue pump body
          const pGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.1, 12);
          const pMat = new THREE.MeshStandardMaterial({ color: '#0284C7', metalness: 0.6, roughness: 0.3 });
          const pMesh = new THREE.Mesh(pGeo, pMat);
          pMesh.position.set(offX, 0.55, 0);
          pumpGroup.add(pMesh);

          // Motor head
          const mGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 12);
          const mMat = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.7 });
          const mMesh = new THREE.Mesh(mGeo, mMat);
          mMesh.position.set(offX, 1.35, 0);
          pumpGroup.add(mMesh);
        });

        // Red Fire Protection Manifold Header Pipe
        const pipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.2, 12);
        const pipeMat = new THREE.MeshStandardMaterial({ color: '#DC2626', roughness: 0.3, metalness: 0.5 });
        const manifold = new THREE.Mesh(pipeGeo, pipeMat);
        manifold.rotation.z = Math.PI / 2;
        manifold.position.set(0, 1.1, 0.6);
        pumpGroup.add(manifold);
        b2Group.add(pumpGroup);

        // 3. 100,000L Underground Fire Sump Pit
        const sumpGeo = new THREE.BoxGeometry(4.8, 0.2, 4.8);
        const sumpMat = new THREE.MeshStandardMaterial({ color: '#1E3A8A', roughness: 0.1, metalness: 0.8 });
        const sumpMesh = new THREE.Mesh(sumpGeo, sumpMat);
        sumpMesh.position.set(-4.5, 0.1, 4.0);
        b2Group.add(sumpMesh);
        // Steel Grille over sump
        const grilleGeo = new THREE.PlaneGeometry(4.8, 4.8);
        const grilleMat = new THREE.MeshStandardMaterial({ color: '#64748B', wireframe: true });
        const grille = new THREE.Mesh(grilleGeo, grilleMat);
        grille.rotation.x = -Math.PI / 2;
        grille.position.set(-4.5, 0.22, 4.0);
        b2Group.add(grille);

        // 4. Concrete Emergency Fire Staircase Core (B2 base flight)
        const b2Stair = createStaircase(0);
        b2Stair.position.set(-6.5, 0.2, -0.5);
        b2Group.add(b2Stair);

        interactiveMeshesRef.current.set(b2Slab, {
          type: 'floor',
          floorNum: -2,
          building: bldg,
          name: 'Basement 2 (-6.0m Subterranean)',
          info: 'EV Charging Bays · Booster Pumps · 100,000L Fire Sump · Emergency Stairs (No Flats)',
        });
        bldgGroup.add(b2Group);

        // =============================================================
        // BASEMENT 1 (-3.0m): RESIDENT PARKING, STANDBY DG GENERATOR, 11kV SUBSTATION, STAIRS
        // Strictly infrastructure and equipment - Zero residential flats
        // =============================================================
        const b1Group = new THREE.Group();
        b1Group.position.y = -3.0;

        // B1 Floor Slab
        const b1SlabGeo = new THREE.BoxGeometry(19, 0.4, 19);
        const b1SlabMat = new THREE.MeshStandardMaterial({
          color: selectedFloor === -1 && isSelectedBldg ? '#1D4ED8' : '#475569',
          roughness: 0.8,
        });
        const b1Slab = new THREE.Mesh(b1SlabGeo, b1SlabMat);
        b1Group.add(b1Slab);

        // Subterranean Excavation Retaining Walls
        const wallMatB1 = new THREE.MeshStandardMaterial({
          color: '#334155',
          transparent: true,
          opacity: 0.65,
          roughness: 0.9,
        });
        const backWallB1 = new THREE.Mesh(new THREE.BoxGeometry(19, 2.8, 0.4), wallMatB1);
        backWallB1.position.set(0, 1.4, -9.3);
        b1Group.add(backWallB1);
        const leftWallB1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 19), wallMatB1);
        leftWallB1.position.set(-9.3, 1.4, 0);
        b1Group.add(leftWallB1);

        // 1. Demarcated Resident Parking Bays on B1
        const parkBayMat = new THREE.LineBasicMaterial({ color: '#FACC15', linewidth: 2 });
        [-6.0, -2.0, 2.0, 6.0].forEach((px) => {
          const bayPts = [
            new THREE.Vector3(px - 1.4, 0.22, -8.0),
            new THREE.Vector3(px - 1.4, 0.22, -3.2),
            new THREE.Vector3(px + 1.4, 0.22, -3.2),
            new THREE.Vector3(px + 1.4, 0.22, -8.0),
          ];
          const bayGeo = new THREE.BufferGeometry().setFromPoints(bayPts);
          b1Group.add(new THREE.Line(bayGeo, parkBayMat));

          // Concrete wheel bumper
          const bumpGeo = new THREE.BoxGeometry(2.2, 0.16, 0.2);
          const bumpMat = new THREE.MeshStandardMaterial({ color: '#CBD5E1' });
          const bumper = new THREE.Mesh(bumpGeo, bumpMat);
          bumper.position.set(px, 0.1, -7.6);
          b1Group.add(bumper);
        });

        // Parked Resident Cars on B1
        const car1 = createCarMesh('#2563EB');
        car1.position.set(-6.0, 0.2, -5.6);
        b1Group.add(car1);

        const car2 = createCarMesh('#475569');
        car2.position.set(6.0, 0.2, -5.6);
        b1Group.add(car2);

        // 2. STANDBY DG GENERATOR (Diesel Generator Set 500 kVA)
        const dgGroup = new THREE.Group();
        dgGroup.position.set(4.8, 0.2, 4.0);

        // Industrial Soundproof Canopy in generator green
        const canopyGeo = new THREE.BoxGeometry(4.6, 2.2, 2.4);
        const canopyMat = new THREE.MeshStandardMaterial({
          color: '#15803D',
          roughness: 0.35,
          metalness: 0.4,
        });
        const canopy = new THREE.Mesh(canopyGeo, canopyMat);
        canopy.position.y = 1.1;
        canopy.castShadow = true;
        dgGroup.add(canopy);

        // Radiator Cooling Louvers on front
        const louverGeo = new THREE.BoxGeometry(1.6, 1.4, 0.1);
        const louverMat = new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.8 });
        const louver = new THREE.Mesh(louverGeo, louverMat);
        louver.position.set(-1.2, 1.1, 1.25);
        dgGroup.add(louver);

        // Control Panel with Status Display
        const panelGeo = new THREE.BoxGeometry(0.8, 0.8, 0.1);
        const panelMat = new THREE.MeshStandardMaterial({ color: '#0284C7', metalness: 0.6 });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.set(1.4, 1.2, 1.25);
        dgGroup.add(panel);

        // Status LED Light
        const ledDgGeo = new THREE.BoxGeometry(0.1, 0.1, 0.05);
        const ledDgMat = new THREE.MeshBasicMaterial({ color: '#22C55E' });
        const ledDg = new THREE.Mesh(ledDgGeo, ledDgMat);
        ledDg.position.set(1.4, 1.45, 1.32);
        dgGroup.add(ledDg);

        // Twin Vertical Exhaust Silencer Pipes rising up to the ventilation riser
        [-0.4, 0.4].forEach((px) => {
          const exGeo = new THREE.CylinderGeometry(0.14, 0.14, 3.2, 12);
          const exMat = new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.5, metalness: 0.8 });
          const exPipe = new THREE.Mesh(exGeo, exMat);
          exPipe.position.set(px, 2.2, -0.6);
          dgGroup.add(exPipe);
        });

        // Yellow & Black Hazard Border surrounding the DG set
        const dgBorderGeo = new THREE.BoxGeometry(5.2, 0.08, 3.0);
        const dgBorderMat = new THREE.MeshStandardMaterial({ color: '#F59E0B' });
        const dgBorder = new THREE.Mesh(dgBorderGeo, dgBorderMat);
        dgBorder.position.y = 0.04;
        dgGroup.add(dgBorder);
        b1Group.add(dgGroup);

        // 3. 11kV ELECTRICAL SUBSTATION & TRANSFORMER
        const subGroup = new THREE.Group();
        subGroup.position.set(-4.5, 0.2, 4.0);

        // Transformer Core Body
        const transGeo = new THREE.BoxGeometry(2.6, 2.0, 2.2);
        const transMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.4, metalness: 0.5 });
        const transMesh = new THREE.Mesh(transGeo, transMat);
        transMesh.position.y = 1.0;
        subGroup.add(transMesh);

        // Transformer Cooling Radiator Fins
        [-1.1, 1.1].forEach((finX) => {
          const finGeo = new THREE.BoxGeometry(0.25, 1.6, 2.4);
          const finMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.6 });
          const fin = new THREE.Mesh(finGeo, finMat);
          fin.position.set(finX, 1.0, 0);
          subGroup.add(fin);
        });

        // Main Electrical Distribution Switchgear
        const switchGeo = new THREE.BoxGeometry(1.6, 2.2, 0.6);
        const switchMat = new THREE.MeshStandardMaterial({ color: '#D97706', roughness: 0.3 });
        const switchboard = new THREE.Mesh(switchGeo, switchMat);
        switchboard.position.set(0, 1.1, -1.6);
        subGroup.add(switchboard);
        b1Group.add(subGroup);

        // 4. Concrete Emergency Fire Staircase Core (B1 flight ascending to ground floor)
        const b1Stair = createStaircase(0);
        b1Stair.position.set(-6.5, 0.2, -0.5);
        b1Group.add(b1Stair);

        interactiveMeshesRef.current.set(b1Slab, {
          type: 'floor',
          floorNum: -1,
          building: bldg,
          name: 'Basement 1 (-3.0m Subterranean)',
          info: '500 kVA Standby Diesel Generator · 11kV Substation · Resident Parking · Stairs (No Flats)',
        });
        bldgGroup.add(b1Group);

        // --- FLOORS 0 TO 5 WITH VISIBLE FLAT INTEGRITY ---
        for (let fl = 0; fl <= 5; fl++) {
          const flY = fl * 3.0;
          const flGroup = new THREE.Group();
          flGroup.position.y = flY;

          // Floor Slab
          const isFloorActive = selectedFloor === fl && isSelectedBldg;
          const slabGeo = new THREE.BoxGeometry(18.6, 0.3, 18.6);
          const slabMat = new THREE.MeshStandardMaterial({
            color: isFloorActive ? '#DBEAFE' : '#CBD5E1',
            roughness: 0.5,
            transparent: shellOpacity < 0.8,
            opacity: shellOpacity,
          });
          const slabMesh = new THREE.Mesh(slabGeo, slabMat);
          flGroup.add(slabMesh);

          interactiveMeshesRef.current.set(slabMesh, {
            type: 'floor',
            floorNum: fl,
            building: bldg,
            name: fl === 0 ? 'Ground Floor' : `Floor ${fl}`,
            info: fl === 0 ? 'Elevation +0.0m (Strictly 2 Flats & Grand Lobby)' : `Elevation +${flY}m`,
          });

          // FLATS WITH STRUCTURAL INTEGRITY
          // Rule: Ground floor (fl === 0) has STRICTLY 2 flats, while upper floors have 4 flats
          const floorUnits = bldg.floors.find((f) => f.floorNumber === fl)?.units || [];
          const unitCoords = fl === 0
            ? [
                { x: -4.5, z: -4.5 },
                { x: 4.5, z: -4.5 },
              ]
            : [
                { x: -4.5, z: -4.5 },
                { x: 4.5, z: -4.5 },
                { x: -4.5, z: 4.5 },
                { x: 4.5, z: 4.5 },
              ];

          // If Ground Floor, render Grand Entrance Lobby on the front half (z > 0)
          if (fl === 0) {
            const lobbyGeo = new THREE.BoxGeometry(17.2, 2.6, 8.2);
            const lobbyMat = new THREE.MeshStandardMaterial({
              color: '#E0F2FE',
              roughness: 0.1,
              metalness: 0.2,
              transparent: true,
              opacity: 0.65,
            });
            const lobbyMesh = new THREE.Mesh(lobbyGeo, lobbyMat);
            lobbyMesh.position.set(0, 1.45, 4.5);
            flGroup.add(lobbyMesh);

            // Front glass door entrance portal
            const doorGeo = new THREE.BoxGeometry(4.0, 2.4, 0.4);
            const doorMat = new THREE.MeshStandardMaterial({ color: '#0284C7', metalness: 0.8, roughness: 0.2 });
            const doorMesh = new THREE.Mesh(doorGeo, doorMat);
            doorMesh.position.set(0, 1.3, 8.6);
            flGroup.add(doorMesh);

            // Concierge / Reception Desk
            const deskGeo = new THREE.BoxGeometry(2.4, 0.9, 1.2);
            const deskMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.4 });
            const deskMesh = new THREE.Mesh(deskGeo, deskMat);
            deskMesh.position.set(0, 0.6, 4.0);
            flGroup.add(deskMesh);

            interactiveMeshesRef.current.set(lobbyMesh, {
              type: 'floor',
              floorNum: 0,
              building: bldg,
              name: 'Ground Floor Grand Entrance Lobby',
              info: 'Concierge Desk · Access Gates · Mail Room (Strictly 2 Residential Flats on Ground Floor)',
            });
          }

          floorUnits.forEach((u, uIdx) => {
            const pos = unitCoords[uIdx % unitCoords.length];
            const isConflictUnit = u.unitNumber === '402' || u.hasConflict;
            const isUnitSelected = selectedUnit?.id === u.id;

            const unitGeo = new THREE.BoxGeometry(8.2, 2.6, 8.2);
            const unitMat = new THREE.MeshStandardMaterial({
              color: isConflictUnit
                ? '#DC2626' // BOLD RED FOR CONFLICT FLAT 402
                : isUnitSelected
                ? '#2563EB' // Cadastral Blue for selected flat
                : '#E2E8F0',
              emissive: isConflictUnit
                ? new THREE.Color('#DC2626')
                : isUnitSelected
                ? new THREE.Color('#1D4ED8')
                : new THREE.Color('#000000'),
              emissiveIntensity: isConflictUnit ? 0.45 : isUnitSelected ? 0.45 : 0.0,
              roughness: 0.3,
              metalness: isConflictUnit ? 0.2 : 0.05,
              transparent: true,
              opacity: isConflictUnit
                ? 0.96
                : isUnitSelected
                ? 0.95
                : shellOpacity > 0.5
                ? 0.85
                : 0.25,
            });
            const unitMesh = new THREE.Mesh(unitGeo, unitMat);
            unitMesh.position.set(pos.x, 1.45, pos.z);
            unitMesh.castShadow = true;
            flGroup.add(unitMesh);

            // Unit Edge Wireframe for visual integrity
            const edgeGeo = new THREE.EdgesGeometry(unitGeo);
            const edgeMat = new THREE.LineBasicMaterial({
              color: isConflictUnit ? '#EF4444' : isUnitSelected ? '#93C5FD' : '#94A3B8',
              linewidth: isUnitSelected || isConflictUnit ? 2.5 : 1,
            });
            const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
            edgeLine.position.set(pos.x, 1.45, pos.z);
            flGroup.add(edgeLine);

            // =============================================================
            // 3D SPATIAL ENCROACHMENT VISUALIZATION FOR FLAT 402
            // Protrudes +1.6m beyond building facade & crosses parcel boundary!
            // =============================================================
            if (isConflictUnit) {
              // 1. Glowing translucent encroachment box extending 1.6m out of the North-East facade
              const overHangGeo = new THREE.BoxGeometry(1.6, 2.6, 8.2);
              const overHangMat = new THREE.MeshStandardMaterial({
                color: '#DC2626',
                emissive: new THREE.Color('#DC2626'),
                emissiveIntensity: 0.7,
                roughness: 0.2,
                transparent: true,
                opacity: 0.85,
              });
              const overHang = new THREE.Mesh(overHangGeo, overHangMat);
              // Building A boundary is at x = 4.5 + 4.1 = 8.6; overhang center is 8.6 + 0.8 = 9.4
              overHang.position.set(4.5 + 4.1 + 0.8, 1.45, -4.5);
              flGroup.add(overHang);

              // 2. Bright wireframe outline around the encroachment box
              const overHangEdgeGeo = new THREE.EdgesGeometry(overHangGeo);
              const overHangEdgeMat = new THREE.LineBasicMaterial({ color: '#FEF2F2', linewidth: 3 });
              const overHangEdge = new THREE.LineSegments(overHangEdgeGeo, overHangEdgeMat);
              overHangEdge.position.copy(overHang.position);
              flGroup.add(overHangEdge);

              // 3. Vertical Plumb Laser Lines dropping from outer corners down to ground parcel boundary
              const outerX = 4.5 + 4.1 + 1.6;
              const plumbPts = [
                new THREE.Vector3(outerX, 1.45 - 1.3, -4.5 - 4.1),
                new THREE.Vector3(outerX, -flY, -4.5 - 4.1),
                new THREE.Vector3(outerX, 1.45 - 1.3, -4.5 + 4.1),
                new THREE.Vector3(outerX, -flY, -4.5 + 4.1),
              ];
              const plumbGeo = new THREE.BufferGeometry().setFromPoints(plumbPts);
              const plumbMat = new THREE.LineDashedMaterial({ color: '#DC2626', dashSize: 0.6, gapSize: 0.3 });
              const plumbLine = new THREE.LineSegments(plumbGeo, plumbMat);
              plumbLine.computeLineDistances();
              flGroup.add(plumbLine);

              // 4. Floating 3D Warning Beacon Billboard over Flat 402
              const badgeCanvas = document.createElement('canvas');
              badgeCanvas.width = 440;
              badgeCanvas.height = 100;
              const bCtx = badgeCanvas.getContext('2d');
              if (bCtx) {
                bCtx.fillStyle = '#DC2626';
                bCtx.roundRect(4, 4, 432, 92, 16);
                bCtx.fill();
                bCtx.strokeStyle = '#FFFFFF';
                bCtx.lineWidth = 4;
                bCtx.stroke();
                bCtx.fillStyle = '#FFFFFF';
                bCtx.font = 'bold 24px sans-serif';
                bCtx.textAlign = 'center';
                bCtx.fillText('⚠ 3D SPATIAL CONFLICT (+1.6m Overhang)', 220, 58);
              }
              const badgeTex = new THREE.CanvasTexture(badgeCanvas);
              const badgeMat = new THREE.SpriteMaterial({ map: badgeTex, depthTest: false });
              const badgeSprite = new THREE.Sprite(badgeMat);
              badgeSprite.position.set(pos.x + 1.8, 3.8, pos.z);
              badgeSprite.scale.set(8.5, 2.0, 1);
              flGroup.add(badgeSprite);
            }

            interactiveMeshesRef.current.set(unitMesh, {
              type: 'unit',
              unit: u,
              building: bldg,
              name: isConflictUnit ? `Flat ${u.unitNumber} [ENCROACHMENT CONFLICT]` : `Flat ${u.unitNumber}`,
              info: `${u.ownerName} · ${u.areaSqFt} sq.ft · Elevation +${flY}m · Click to view details`,
            });
          });

          bldgGroup.add(flGroup);
        }

        // --- PENTHOUSE LEVEL (+18.0m) ---
        const phFl = bldg.floors.find((f) => f.floorNumber === 6);
        if (phFl) {
          const phGroup = new THREE.Group();
          phGroup.position.y = 18.0;

          const phSlabGeo = new THREE.BoxGeometry(17, 0.3, 17);
          const isPhActive = selectedFloor === 6 && isSelectedBldg;
          const phSlabMat = new THREE.MeshStandardMaterial({
            color: isPhActive ? '#DBEAFE' : '#CBD5E1',
            roughness: 0.5,
          });
          const phSlab = new THREE.Mesh(phSlabGeo, phSlabMat);
          phGroup.add(phSlab);

          // Penthouse Unit Villa
          const phUnit = phFl.units[0];
          const isPhSelected = selectedUnit?.id === phUnit?.id;
          const phVillaGeo = new THREE.BoxGeometry(15, 3.2, 15);
          const phVillaMat = new THREE.MeshStandardMaterial({
            color: isPhSelected ? '#2563EB' : '#F8FAFC',
            emissive: isPhSelected ? new THREE.Color('#1D4ED8') : new THREE.Color('#000000'),
            emissiveIntensity: isPhSelected ? 0.4 : 0.0,
            roughness: 0.2,
            metalness: 0.1,
            transparent: true,
            opacity: isPhSelected ? 0.95 : 0.85,
          });
          const phVilla = new THREE.Mesh(phVillaGeo, phVillaMat);
          phVilla.position.y = 1.7;
          phGroup.add(phVilla);

          const phEdgeGeo = new THREE.EdgesGeometry(phVillaGeo);
          const phEdgeMat = new THREE.LineBasicMaterial({
            color: isPhSelected ? '#93C5FD' : '#94A3B8',
          });
          const phEdgeLine = new THREE.LineSegments(phEdgeGeo, phEdgeMat);
          phEdgeLine.position.y = 1.7;
          phGroup.add(phEdgeLine);

          if (phUnit) {
            interactiveMeshesRef.current.set(phVilla, {
              type: 'unit',
              unit: phUnit,
              building: bldg,
              name: 'Penthouse (PH-01)',
              info: 'Sky Villa · 2,800 sq.ft · Click to view details',
            });
          }

          bldgGroup.add(phGroup);
        }

        // --- ELEVATORS ---
        elevators.forEach((elev) => {
          const isSelected = selectedElevator?.id === elev.id;
          const isElevMode = inspectionMode === 'elevators';
          const localX = elev.code === 'E-01' ? -1.8 : 1.8;

          const shaftGeo = new THREE.BoxGeometry(2.3, 27.5, 2.3);
          const shaftMat = new THREE.MeshStandardMaterial({
            color: isSelected ? '#2563EB' : '#0284C7',
            transparent: true,
            opacity: isElevMode || isSelected ? 0.65 : 0.15,
          });
          const shaft = new THREE.Mesh(shaftGeo, shaftMat);
          shaft.position.set(localX, 7.75, 0);
          bldgGroup.add(shaft);

          const cabinY = elev.code === 'E-01' ? 9.0 : 0.8;
          const cabinGeo = new THREE.BoxGeometry(1.9, 2.4, 1.9);
          const cabinMat = new THREE.MeshStandardMaterial({
            color: isSelected ? '#2563EB' : '#F59E0B',
            metalness: 0.8,
            roughness: 0.2,
          });
          const cabin = new THREE.Mesh(cabinGeo, cabinMat);
          cabin.position.set(localX, cabinY, 0);
          bldgGroup.add(cabin);

          interactiveMeshesRef.current.set(cabin, {
            type: 'elevator',
            elevator: elev,
            name: elev.name,
            info: `${elev.serves} · Current: ${elev.currentLevel}`,
          });
        });

        // --- PIPELINES ---
        buildingUtilities.forEach((pipe) => {
          const isSelected = selectedBuildingUtility?.id === pipe.id;
          const isPipeMode = inspectionMode === 'pipelines';
          let localX = 0;
          let localZ = 0;
          if (pipe.id === 'W-01') {
            localX = 3.5;
            localZ = 2.0;
          }
          if (pipe.id === 'D-01') {
            localX = -3.5;
            localZ = 2.0;
          }
          if (pipe.id === 'ELC-01') {
            localX = 3.5;
            localZ = -2.0;
          }
          if (pipe.id === 'F-01') {
            localX = -3.5;
            localZ = -2.0;
          }

          const height = 23.5;
          const radius = Math.max(pipe.diameterMm / 1000, 0.12);
          const pipeGeo = new THREE.CylinderGeometry(radius, radius, height, 12);
          const pipeMat = new THREE.MeshStandardMaterial({
            color: isSelected ? '#2563EB' : pipe.color,
            transparent: true,
            opacity: isPipeMode || isSelected ? 1.0 : 0.25,
          });
          const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
          pipeMesh.position.set(localX, 5.75, localZ);
          bldgGroup.add(pipeMesh);

          interactiveMeshesRef.current.set(pipeMesh, {
            type: 'pipeline',
            pipeline: pipe,
            name: pipe.name,
            info: `${pipe.utilityType} · ${pipe.route}`,
          });
        });
      } else if (bldg.buildingType === 'Individual House') {
        // -------------------------------------------------------------
        // INDIVIDUAL HOUSES (NOT IN COMMUNITY - STANDALONE PLOTS)
        // Explicitly: NO ELEVATORS, NO BASEMENTS (Ground foundation),
        // Dedicated PIPELINES, and 2 distinct spatial conflicts!
        // -------------------------------------------------------------
        const isHouse1 = bldg.id === 'bldg-house-1'; // Road Encroachment Error
        const isHouse2 = bldg.id === 'bldg-house-2'; // Demarcated Land Boundary Overstep

        const totalFl = bldg.totalFloors; // 2 floors: Ground Floor & Floor 1
        const bldgW = bldg.dimensions.width;
        const bldgD = bldg.dimensions.depth;

        // 1. Direct Ground Foundation Base Slab (Zero Underground Basement)
        const baseSlabGeo = new THREE.BoxGeometry(bldgW + 1.0, 0.25, bldgD + 1.0);
        const baseSlabMat = new THREE.MeshStandardMaterial({
          color: isSelectedBldg ? '#1D4ED8' : '#64748B',
          roughness: 0.8,
        });
        const baseSlab = new THREE.Mesh(baseSlabGeo, baseSlabMat);
        baseSlab.position.y = 0.12;
        bldgGroup.add(baseSlab);

        // 2. Concrete Staircase Core (Internal stairs connecting Ground to 1st Floor - No Elevators)
        const houseStair = createStaircase(0);
        houseStair.position.set(0, 0.2, 0);
        bldgGroup.add(houseStair);

        // 3. Render Ground Floor and First Floor Living Units
        for (let fl = 0; fl < totalFl; fl++) {
          const flY = fl * 3.4;
          const isFlSelected = selectedFloor === fl && isSelectedBldg;

          // Floor structural slab
          const slabGeo = new THREE.BoxGeometry(bldgW, 0.22, bldgD);
          const slabMat = new THREE.MeshStandardMaterial({
            color: isFlSelected ? '#DBEAFE' : '#E2E8F0',
            roughness: 0.6,
          });
          const slabMesh = new THREE.Mesh(slabGeo, slabMat);
          slabMesh.position.y = flY;
          bldgGroup.add(slabMesh);

          const flObj = bldg.floors.find((f) => f.floorNumber === fl);
          const u = flObj?.units[0];
          if (u) {
            const isUnitSelected = selectedUnit?.id === u.id;
            const isConflictActive =
              (isHouse1 && activeConflictId === 'enc-house-1') ||
              (isHouse2 && activeConflictId === 'enc-house-2');

            // Individual villa living room/wing envelope
            const uGeo = new THREE.BoxGeometry(bldgW - 1.2, 2.9, bldgD - 1.2);
            const uMat = new THREE.MeshStandardMaterial({
              color: isUnitSelected
                ? '#2563EB'
                : isConflictActive
                ? '#FCA5A5'
                : isHouse1
                ? '#F1F5F9'
                : '#F8FAFC',
              emissive: isUnitSelected
                ? new THREE.Color('#1D4ED8')
                : isConflictActive
                ? new THREE.Color('#EF4444')
                : new THREE.Color('#000000'),
              emissiveIntensity: isUnitSelected ? 0.45 : isConflictActive ? 0.25 : 0.0,
              roughness: 0.4,
              metalness: 0.1,
              transparent: true,
              opacity: isUnitSelected || isConflictActive ? 0.95 : 0.88,
            });
            const uMesh = new THREE.Mesh(uGeo, uMat);
            uMesh.position.set(0, flY + 1.55, 0);
            bldgGroup.add(uMesh);

            const uEdgeGeo = new THREE.EdgesGeometry(uGeo);
            const uEdgeMat = new THREE.LineBasicMaterial({
              color: isUnitSelected ? '#93C5FD' : isConflictActive ? '#DC2626' : '#94A3B8',
              linewidth: isUnitSelected || isConflictActive ? 2.5 : 1,
            });
            const uEdge = new THREE.LineSegments(uEdgeGeo, uEdgeMat);
            uEdge.position.copy(uMesh.position);
            bldgGroup.add(uEdge);

            interactiveMeshesRef.current.set(uMesh, {
              type: 'unit',
              unit: u,
              building: bldg,
              name: `${bldg.name} (${u.floorName})`,
              info: `${u.ownerName} · ${u.areaSqFt} sq.ft · Individual House (No Basement, No Elevators)`,
            });
          }
        }

        // 4. Standalone Sloped Pitched Terracotta Roof on Top
        const roofGeo = new THREE.ConeGeometry(bldgW * 0.72, 2.2, 4);
        roofGeo.rotateY(Math.PI / 4);
        const roofMat = new THREE.MeshStandardMaterial({
          color: isHouse1 ? '#B45309' : '#334155', // Warm terracotta for Villa Ananda, Slate for Deshmukh Villa
          roughness: 0.5,
          metalness: 0.1,
        });
        const roofMesh = new THREE.Mesh(roofGeo, roofMat);
        roofMesh.position.set(0, totalFl * 3.4 + 1.1, 0);
        bldgGroup.add(roofMesh);

        // 5. Dedicated Pipelines for Individual House (Water, Drainage, Power)
        const housePipes = buildingUtilities.filter((p) => p.buildingId === bldg.id);
        housePipes.forEach((hp) => {
          const isSelected = selectedBuildingUtility?.id === hp.id;
          const isPipeMode = inspectionMode === 'pipelines';
          const pipeRadius = Math.max(hp.diameterMm / 1000, 0.12);
          const pGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, 5.0, 10);
          const pMat = new THREE.MeshStandardMaterial({
            color: isSelected ? '#2563EB' : hp.color,
            transparent: true,
            opacity: isPipeMode || isSelected ? 1.0 : 0.6,
          });
          const pMesh = new THREE.Mesh(pGeo, pMat);
          const pLocalX = hp.coordinates ? hp.coordinates.x - bldg.position.x : 0;
          const pLocalZ = hp.coordinates ? hp.coordinates.z - bldg.position.z : 0;
          pMesh.position.set(pLocalX, 2.5, pLocalZ);
          bldgGroup.add(pMesh);

          interactiveMeshesRef.current.set(pMesh, {
            type: 'pipeline',
            pipeline: hp,
            name: hp.name,
            info: `${hp.utilityType} · ${hp.route} (Individual House Connection)`,
          });
        });

        // =============================================================
        // CONFLICT 1: HOUSE 1 (VILLA ANANDA) - ROAD ENCROACHMENT ERROR
        // The compound wall, vehicle portico & paved driveway occupy
        // +2.2m into the public street carriageway and sidewalk!
        // =============================================================
        if (isHouse1) {
          // Parcel front boundary ends at Z = -28.0 (local z = +9.0).
          // The house encroaches 2.2m into the street from z = -28.0 to -25.8 (local z = 9.0 to 11.2).
          const encZCenter = 10.1;
          const encDepth = 2.2;
          const encWidth = 15.0;

          // A. Glowing Red Translucent Encroachment Volume on the Road
          const roadEncGeo = new THREE.BoxGeometry(encWidth, 2.4, encDepth);
          const roadEncMat = new THREE.MeshStandardMaterial({
            color: '#DC2626',
            emissive: new THREE.Color('#DC2626'),
            emissiveIntensity: 0.65,
            roughness: 0.2,
            transparent: true,
            opacity: 0.75,
          });
          const roadEncMesh = new THREE.Mesh(roadEncGeo, roadEncMat);
          roadEncMesh.position.set(0, 1.2, encZCenter);
          bldgGroup.add(roadEncMesh);

          // B. Red Wireframe outline
          const roadEncEdgeGeo = new THREE.EdgesGeometry(roadEncGeo);
          const roadEncEdgeMat = new THREE.LineBasicMaterial({ color: '#FEF2F2', linewidth: 3 });
          const roadEncEdge = new THREE.LineSegments(roadEncEdgeGeo, roadEncEdgeMat);
          roadEncEdge.position.copy(roadEncMesh.position);
          bldgGroup.add(roadEncEdge);

          // C. Hazard Stripe Road Curbing (Yellow/Black striped barrier on road)
          const hazardGeo = new THREE.BoxGeometry(encWidth, 0.15, 0.4);
          const hazardMat = new THREE.MeshStandardMaterial({ color: '#F59E0B' });
          const hazardMesh = new THREE.Mesh(hazardGeo, hazardMat);
          hazardMesh.position.set(0, 0.1, 11.2);
          bldgGroup.add(hazardMesh);

          // D. Vertical Plumb Laser Lines dropping down onto road carriageway
          const plumbPts = [
            new THREE.Vector3(-encWidth / 2, 2.4, 11.2),
            new THREE.Vector3(-encWidth / 2, 0, 11.2),
            new THREE.Vector3(encWidth / 2, 2.4, 11.2),
            new THREE.Vector3(encWidth / 2, 0, 11.2),
          ];
          const plumbGeo = new THREE.BufferGeometry().setFromPoints(plumbPts);
          const plumbMat = new THREE.LineDashedMaterial({ color: '#DC2626', dashSize: 0.5, gapSize: 0.25 });
          const plumbLine = new THREE.LineSegments(plumbGeo, plumbMat);
          plumbLine.computeLineDistances();
          bldgGroup.add(plumbLine);

          // E. Floating 3D Warning Beacon Billboard over Road Encroachment
          const rBadgeCanvas = document.createElement('canvas');
          rBadgeCanvas.width = 460;
          rBadgeCanvas.height = 110;
          const rCtx = rBadgeCanvas.getContext('2d');
          if (rCtx) {
            rCtx.fillStyle = '#DC2626';
            rCtx.roundRect(4, 4, 452, 102, 16);
            rCtx.fill();
            rCtx.strokeStyle = '#FFFFFF';
            rCtx.lineWidth = 4;
            rCtx.stroke();
            rCtx.fillStyle = '#FFFFFF';
            rCtx.font = 'bold 22px sans-serif';
            rCtx.textAlign = 'center';
            rCtx.fillText('⚠ ROAD ENCROACHMENT ERROR (+2.2m)', 230, 48);
            rCtx.font = '16px sans-serif';
            rCtx.fillStyle = '#FEE2E2';
            rCtx.fillText('Municipal Corporation Act Sec 231 Violation', 230, 80);
          }
          const rBadgeTex = new THREE.CanvasTexture(rBadgeCanvas);
          const rBadgeMat = new THREE.SpriteMaterial({ map: rBadgeTex, depthTest: false });
          const rBadgeSprite = new THREE.Sprite(rBadgeMat);
          rBadgeSprite.position.set(0, 4.8, encZCenter);
          rBadgeSprite.scale.set(9.5, 2.3, 1);
          bldgGroup.add(rBadgeSprite);

          // Make the road encroachment clickable!
          interactiveMeshesRef.current.set(roadEncMesh, {
            type: 'conflict',
            conflictId: 'enc-house-1',
            building: bldg,
            name: 'Road Encroachment Error (Villa Ananda)',
            info: 'Occupies 2.2m of municipal road right-of-way · Sec 231 Violation · Click to inspect',
          });
        }

        // =============================================================
        // CONFLICT 2: HOUSE 2 (GREEN CREST) - BOUNDARY OVERSTEP
        // The rear residential wing, private patio & boundary wall
        // extend +1.6m beyond demarcated legal survey line!
        // =============================================================
        if (isHouse2) {
          // World: bldg.position is at x = 64, z = 32.
          // Legal parcel eastern boundary ends at X = 74.0 (local x = +10.0).
          // Construction extends 1.6m past boundary from X = 74.0 to 75.6 (local x = 10.0 to 11.6).
          const bndXCenter = 10.8;
          const bndWidth = 1.6;
          const bndDepth = 13.0;

          // A. Glowing Red Translucent Encroachment Box
          const bndEncGeo = new THREE.BoxGeometry(bndWidth, 5.8, bndDepth);
          const bndEncMat = new THREE.MeshStandardMaterial({
            color: '#DC2626',
            emissive: new THREE.Color('#DC2626'),
            emissiveIntensity: 0.65,
            roughness: 0.2,
            transparent: true,
            opacity: 0.75,
          });
          const bndEncMesh = new THREE.Mesh(bndEncGeo, bndEncMat);
          bndEncMesh.position.set(bndXCenter, 2.9, 0);
          bldgGroup.add(bndEncMesh);

          // B. Red Wireframe outline
          const bndEncEdgeGeo = new THREE.EdgesGeometry(bndEncGeo);
          const bndEncEdgeMat = new THREE.LineBasicMaterial({ color: '#FEF2F2', linewidth: 3 });
          const bndEncEdge = new THREE.LineSegments(bndEncEdgeGeo, bndEncEdgeMat);
          bndEncEdge.position.copy(bndEncMesh.position);
          bldgGroup.add(bndEncEdge);

          // C. Ground Demarcation Line (Blue/White dashed line showing true legal boundary)
          const bndLinePts = [
            new THREE.Vector3(10.0, 0.15, -bndDepth / 2 - 2.0),
            new THREE.Vector3(10.0, 0.15, bndDepth / 2 + 2.0),
          ];
          const bndLineGeo = new THREE.BufferGeometry().setFromPoints(bndLinePts);
          const bndLineMat = new THREE.LineDashedMaterial({ color: '#2563EB', dashSize: 0.6, gapSize: 0.3 });
          const bndLine = new THREE.Line(bndLineGeo, bndLineMat);
          bndLine.computeLineDistances();
          bldgGroup.add(bndLine);

          // D. Plumb laser markers from outer transgressed edge
          const bndPlumbPts = [
            new THREE.Vector3(11.6, 5.8, -bndDepth / 2),
            new THREE.Vector3(11.6, 0, -bndDepth / 2),
            new THREE.Vector3(11.6, 5.8, bndDepth / 2),
            new THREE.Vector3(11.6, 0, bndDepth / 2),
          ];
          const bndPlumbGeo = new THREE.BufferGeometry().setFromPoints(bndPlumbPts);
          const bndPlumbMat = new THREE.LineDashedMaterial({ color: '#DC2626', dashSize: 0.5, gapSize: 0.25 });
          const bndPlumb = new THREE.LineSegments(bndPlumbGeo, bndPlumbMat);
          bndPlumb.computeLineDistances();
          bldgGroup.add(bndPlumb);

          // E. Floating 3D Warning Beacon Billboard over Boundary Overstep
          const bBadgeCanvas = document.createElement('canvas');
          bBadgeCanvas.width = 460;
          bBadgeCanvas.height = 110;
          const bCtx = bBadgeCanvas.getContext('2d');
          if (bCtx) {
            rCtx:
            bCtx.fillStyle = '#DC2626';
            bCtx.roundRect(4, 4, 452, 102, 16);
            bCtx.fill();
            bCtx.strokeStyle = '#FFFFFF';
            bCtx.lineWidth = 4;
            bCtx.stroke();
            bCtx.fillStyle = '#FFFFFF';
            bCtx.font = 'bold 22px sans-serif';
            bCtx.textAlign = 'center';
            bCtx.fillText('⚠ BOUNDARY OVERSTEP CONFLICT (+1.6m)', 230, 48);
            bCtx.font = '16px sans-serif';
            bCtx.fillStyle = '#FEE2E2';
            bCtx.fillText('Section 132 Land Revenue Code Violation', 230, 80);
          }
          const bBadgeTex = new THREE.CanvasTexture(bBadgeCanvas);
          const bBadgeMat = new THREE.SpriteMaterial({ map: bBadgeTex, depthTest: false });
          const bBadgeSprite = new THREE.Sprite(bBadgeMat);
          bBadgeSprite.position.set(bndXCenter, 7.2, 0);
          bBadgeSprite.scale.set(9.5, 2.3, 1);
          bldgGroup.add(bBadgeSprite);

          // Make the boundary overstep clickable!
          interactiveMeshesRef.current.set(bndEncMesh, {
            type: 'conflict',
            conflictId: 'enc-house-2',
            building: bldg,
            name: 'Boundary Transgression (Green Crest Villa)',
            info: 'Constructed 1.6m beyond legal survey boundary · Section 132 Violation · Click to inspect',
          });
        }
      } else {
        // -------------------------------------------------------------
        // BLOCKS B THROUGH F WITH VISIBLE FLOOR SLABS & FLAT DIVISIONS
        // -------------------------------------------------------------
        const totalFl = bldg.totalFloors;
        const bldgW = bldg.dimensions.width;
        const bldgD = bldg.dimensions.depth;

        for (let fl = 0; fl < totalFl; fl++) {
          const flY = fl * 3.2;
          const isFlSelected = selectedFloor === fl && isSelectedBldg;

          // Slab
          const slabGeo = new THREE.BoxGeometry(bldgW, 0.25, bldgD);
          const slabMat = new THREE.MeshStandardMaterial({
            color: isFlSelected ? '#DBEAFE' : '#CBD5E1',
            roughness: 0.5,
          });
          const slabMesh = new THREE.Mesh(slabGeo, slabMat);
          slabMesh.position.y = flY;
          bldgGroup.add(slabMesh);

          // Flats inside this floor
          const flObj = bldg.floors.find((f) => f.floorNumber === fl);
          const unitsOnFloor = flObj?.units || [];
          const unitCount = unitsOnFloor.length || 3;

          unitsOnFloor.forEach((u, idx) => {
            const isUnitSelected = selectedUnit?.id === u.id;
            const unitWidth = (bldgW - 1.2) / unitCount;
            const offsetX = -bldgW / 2 + 0.6 + unitWidth / 2 + idx * unitWidth;

            const uGeo = new THREE.BoxGeometry(unitWidth - 0.4, 2.7, bldgD - 0.8);
            const uMat = new THREE.MeshStandardMaterial({
              color: isUnitSelected ? '#2563EB' : '#F1F5F9',
              emissive: isUnitSelected ? new THREE.Color('#1D4ED8') : new THREE.Color('#000000'),
              emissiveIntensity: isUnitSelected ? 0.4 : 0.0,
              roughness: 0.3,
              metalness: 0.1,
              transparent: true,
              opacity: isUnitSelected ? 0.95 : 0.85,
            });
            const uMesh = new THREE.Mesh(uGeo, uMat);
            uMesh.position.set(offsetX, flY + 1.5, 0);
            bldgGroup.add(uMesh);

            // Unit Edge
            const edgeGeo = new THREE.EdgesGeometry(uGeo);
            const edgeMat = new THREE.LineBasicMaterial({
              color: isUnitSelected ? '#93C5FD' : '#94A3B8',
              linewidth: isUnitSelected ? 2 : 1,
            });
            const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
            edgeLine.position.set(offsetX, flY + 1.5, 0);
            bldgGroup.add(edgeLine);

            interactiveMeshesRef.current.set(uMesh, {
              type: 'unit',
              unit: u,
              building: bldg,
              name: `Flat ${u.unitNumber}`,
              info: `${bldg.name} · ${u.areaSqFt} sq.ft · ${u.ownerName}`,
            });
          });
        }
      }

      buildingsGroupRef.current.add(bldgGroup);
    });
  }, [
    parcels,
    buildings,
    elevators,
    buildingUtilities,
    selectedParcel,
    selectedBuilding,
    selectedFloor,
    selectedUnit,
    selectedElevator,
    selectedBuildingUtility,
    inspectionMode,
    mapDimension,
  ]);

  // -------------------------------------------------------------
  // 4. SMOOTH CAMERA FOCUS (UNDERGROUND BASEMENT & FLAT CONFLICT)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current || mapDimension === '2d') return;

    // --- CASE A: SUBTERRANEAN BASEMENT SELECTION (B1: -3.0m, B2: -6.0m) ---
    // Camera dives underground to expose generator, substation, booster pumps, sump & parking
    if (selectedFloor !== null && selectedFloor < 0) {
      const bx = selectedBuilding ? selectedBuilding.position.x : -28;
      const bz = selectedBuilding ? selectedBuilding.position.z : -45;
      const subY = selectedFloor === -2 ? -6.0 : -3.0;

      // Unlock camera to rotate and dive under the ground plane
      controlsRef.current.maxPolarAngle = Math.PI - 0.08;
      controlsRef.current.minPolarAngle = 0.05;

      // Make ground surface transparent to clearly see underground machinery
      if (groundMatRef.current) {
        groundMatRef.current.transparent = true;
        groundMatRef.current.opacity = 0.18;
      }

      animateCameraTo(
        new THREE.Vector3(bx + 12, subY + 1.8, bz + 12),
        new THREE.Vector3(bx, subY + 1.2, bz),
        950
      );
      return;
    }

    // Restore ground opacity & horizon polar angle when viewing above-ground levels
    if (groundMatRef.current) {
      groundMatRef.current.transparent = false;
      groundMatRef.current.opacity = 1.0;
    }
    controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.02;

    // --- CASE B: SPATIAL CONFLICT FOCUS ---
    if (inspectionMode === 'conflict' || (selectedUnit && selectedUnit.hasConflict)) {
      if (activeConflictId === 'enc-house-1' || selectedBuilding?.id === 'bldg-house-1') {
        // Road encroachment in House 1 (Villa Ananda): looking right at the road encroachment
        animateCameraTo(
          new THREE.Vector3(-63 + 12, 7.5, -28 + 14),
          new THREE.Vector3(-63, 1.8, -26.5),
          900
        );
        return;
      }
      if (activeConflictId === 'enc-house-2' || selectedBuilding?.id === 'bldg-house-2') {
        // Boundary transgression in House 2 (Green Crest): looking at the eastern boundary
        animateCameraTo(
          new THREE.Vector3(74 + 14, 8.5, 32 + 10),
          new THREE.Vector3(74, 2.5, 32),
          900
        );
        return;
      }

      // Flat 402 overhang
      const bx = -28;
      const bz = -45;
      const unitX = bx + 4.5;
      const unitY = 12.0 + 1.45;
      const unitZ = bz - 4.5;

      // Position camera directly facing the 1.6m overhang and vertical plumb drop line
      animateCameraTo(
        new THREE.Vector3(unitX + 13.5, unitY + 3.8, unitZ - 8.5),
        new THREE.Vector3(unitX + 1.2, unitY, unitZ),
        900
      );
      return;
    }

    // --- CASE C: REGULAR FLAT SELECTION ---
    if (selectedUnit && selectedBuilding) {
      const bx = selectedBuilding.position.x;
      const bz = selectedBuilding.position.z;
      const fl = selectedFloor !== null ? selectedFloor : selectedUnit.floorNumber;
      const flY = fl * 3.0;

      // Exact flat center offset if Block A
      let flatCenterX = bx;
      let flatCenterZ = bz;
      if (selectedBuilding.id === 'bldg-a') {
        const uNum = selectedUnit.unitNumber;
        if (uNum.endsWith('01') || uNum === 'G01') { flatCenterX += -4.5; flatCenterZ += -4.5; }
        else if (uNum.endsWith('02') || uNum === 'G02') { flatCenterX += 4.5; flatCenterZ += -4.5; }
        else if (uNum.endsWith('03') || uNum === 'G03') { flatCenterX += -4.5; flatCenterZ += 4.5; }
        else if (uNum.endsWith('04') || uNum === 'G04') { flatCenterX += 4.5; flatCenterZ += 4.5; }
      }

      animateCameraTo(
        new THREE.Vector3(flatCenterX + 12, flY + 6, flatCenterZ + 12),
        new THREE.Vector3(flatCenterX, flY + 1.5, flatCenterZ),
        800
      );
    } else if (selectedBuilding) {
      const bx = selectedBuilding.position.x;
      const bz = selectedBuilding.position.z;
      animateCameraTo(
        new THREE.Vector3(bx + 26, 22, bz + 30),
        new THREE.Vector3(bx, 9.0, bz),
        800
      );
    } else if (selectedParcel && selectedParcel.buildingIds.length === 0) {
      const coords = selectedParcel.boundaryCoordinates;
      const minX = Math.min(...coords.map((c) => c[0]));
      const maxX = Math.max(...coords.map((c) => c[0]));
      const minZ = Math.min(...coords.map((c) => c[1]));
      const maxZ = Math.max(...coords.map((c) => c[1]));
      const cx = (minX + maxX) / 2;
      const cz = (minZ + maxZ) / 2;

      animateCameraTo(
        new THREE.Vector3(cx + 20, 24, cz + 24),
        new THREE.Vector3(cx, 0, cz),
        800
      );
    }
  }, [selectedUnit, selectedBuilding, selectedFloor, selectedParcel, activeConflictId, inspectionMode, mapDimension]);

  // -------------------------------------------------------------
  // 5. POINTER DOWN & UP WITH DRAG-AWARE FLAT SELECTION
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    const dist = Math.hypot(dx, dy);

    // If pointer was dragged more than 6px, user was rotating or panning the map.
    // Do NOT trigger selection!
    if (dist > 6) return;

    // Genuine click detected! Raycast to find the clicked flat or object
    if (!mountRef.current || !cameraRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const interactiveList = Array.from(interactiveMeshesRef.current.keys());
    const intersects = raycaster.intersectObjects(interactiveList, true);

    if (intersects.length > 0) {
      // Prioritize Conflict / Unit hits first so clicking near edges always gets the active item!
      let hitData: any = null;
      const conflictHit = intersects.find((hit) => {
        const d = interactiveMeshesRef.current.get(hit.object);
        return d && d.type === 'conflict';
      });
      const unitHit = intersects.find((hit) => {
        const d = interactiveMeshesRef.current.get(hit.object);
        return d && d.type === 'unit';
      });

      if (conflictHit) {
        hitData = interactiveMeshesRef.current.get(conflictHit.object);
      } else if (unitHit) {
        hitData = interactiveMeshesRef.current.get(unitHit.object);
      } else {
        for (const hit of intersects) {
          const d = interactiveMeshesRef.current.get(hit.object);
          if (d) {
            hitData = d;
            break;
          }
        }
      }

      if (hitData) {
        if (hitData.type === 'conflict' && hitData.conflictId) {
          onSelectConflict?.(hitData.conflictId);
          if (hitData.building) {
            onSelectBuilding(hitData.building);
          }
        } else if (hitData.type === 'unit' && hitData.unit) {
          onSelectUnit(hitData.unit, hitData.building);
        } else if (hitData.type === 'elevator' && hitData.elevator) {
          onSelectElevator?.(hitData.elevator);
        } else if (hitData.type === 'pipeline' && hitData.pipeline) {
          onSelectBuildingUtility?.(hitData.pipeline);
        } else if (hitData.type === 'floor' && hitData.building) {
          onSelectFloor(hitData.floorNum, hitData.building);
        } else if (hitData.type === 'building' && hitData.building) {
          onSelectBuilding(hitData.building);
        } else if (hitData.type === 'parcel' && hitData.parcel) {
          onSelectParcel(hitData.parcel);
        }
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const interactiveList = Array.from(interactiveMeshesRef.current.keys());
    const intersects = raycaster.intersectObjects(interactiveList, true);

    if (intersects.length > 0) {
      // Prioritize unit hover info
      let hoverTarget = null;
      const unitHit = intersects.find((hit) => {
        const d = interactiveMeshesRef.current.get(hit.object);
        return d && d.type === 'unit';
      });

      if (unitHit) {
        hoverTarget = interactiveMeshesRef.current.get(unitHit.object);
      } else {
        hoverTarget = interactiveMeshesRef.current.get(intersects[0].object);
      }

      if (hoverTarget) {
        mountRef.current.style.cursor = toolMode === 'pan' ? 'grab' : 'pointer';
        setHoverInfo({
          title: hoverTarget.name || 'Object',
          subtitle: hoverTarget.info || '',
          x: e.clientX,
          y: e.clientY,
        });
        return;
      }
    }

    mountRef.current.style.cursor = toolMode === 'pan' ? 'grab' : 'default';
    setHoverInfo(null);
  };

  // Active building in picker
  const currentPickerBldg = buildings.find((b) => b.id === pickerBldgId) || buildings[0];

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#F8FAFC]">
      {/* 3D WebGL Canvas - Edge-to-edge down to the absolute bottom! */}
      <div
        ref={mountRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className={`w-full h-full ${toolMode === 'pan' ? 'cursor-grab active:cursor-grabbing' : ''}`}
      />

      {/* TOOLTIP ON HOVER */}
      {hoverInfo && (
        <div
          className="fixed pointer-events-none z-50 bg-[#0F172A]/95 backdrop-blur-xs text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700 transition-all"
          style={{
            left: `${hoverInfo.x + 14}px`,
            top: `${hoverInfo.y + 14}px`,
          }}
        >
          <div className="font-bold flex items-center gap-1.5">
            {hoverInfo.title.includes('CONFLICT') && (
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
            )}
            <span>{hoverInfo.title}</span>
          </div>
          {hoverInfo.subtitle && (
            <div className="text-[11px] text-[#94A3B8] mt-0.5">{hoverInfo.subtitle}</div>
          )}
          <div className="text-[9px] text-[#38BDF8] mt-1 font-mono uppercase tracking-wider">
            Click to inspect full details
          </div>
        </div>
      )}

      {/* TOP-LEFT: CHOOSE FLAT QUICK PICKER & MODE BADGE */}
      <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
        {/* Quick Choose Flat Popover Button */}
        <div className="relative">
          <button
            onClick={() => setShowFlatPicker(!showFlatPicker)}
            className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-md border border-[#CBD5E1] shadow-sm hover:bg-white text-xs font-semibold text-[#0F172A] transition-all cursor-pointer"
            title="Click to quickly pick and inspect any Flat"
          >
            <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>
              {selectedUnit
                ? `Flat ${selectedUnit.unitNumber} (${selectedBuilding?.name})`
                : 'Choose Flat ▾'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#64748B] transition-transform ${
                showFlatPicker ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Quick Flat Chooser Dropdown */}
          {showFlatPicker && (
            <div className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 bg-white/98 backdrop-blur-md rounded-xl border border-[#CBD5E1] shadow-2xl z-50 p-3 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <Building2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Select Any Flat to Inspect</span>
                </div>
                <button
                  onClick={() => setShowFlatPicker(false)}
                  className="p-1 hover:bg-[#F1F5F9] rounded text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Building Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-[#E2E8F0] mb-2">
                {buildings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setPickerBldgId(b.id)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium shrink-0 transition-colors cursor-pointer ${
                      pickerBldgId === b.id
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              {/* Flats list for chosen building */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {currentPickerBldg?.floors.map((fl) => (
                  <div key={fl.floorNumber} className="border border-[#F1F5F9] rounded-lg p-2 bg-[#F8FAFC]">
                    <div className="text-[11px] font-bold text-[#64748B] mb-1.5 flex justify-between">
                      <span>{fl.name}</span>
                      <span className="text-[10px] text-[#94A3B8]">+{fl.floorNumber * 3}m elevation</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {fl.units.map((u) => {
                        const isConflict = u.unitNumber === '402' || u.hasConflict;
                        const isSelected = selectedUnit?.id === u.id;

                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSelectUnit(u, currentPickerBldg);
                              setShowFlatPicker(false);
                            }}
                            className={`p-2 rounded-md text-left transition-all border cursor-pointer ${
                              isSelected
                                ? 'bg-[#2563EB] text-white border-[#1D4ED8] shadow-xs'
                                : isConflict
                                ? 'bg-[#FEF2F2] border-[#FECACA] hover:bg-[#FEE2E2]'
                                : 'bg-white border-[#E2E8F0] hover:bg-[#EFF6FF] hover:border-[#BFDBFE]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-bold text-xs ${
                                  isSelected
                                    ? 'text-white'
                                    : isConflict
                                    ? 'text-[#DC2626]'
                                    : 'text-[#0F172A]'
                                }`}
                              >
                                Flat {u.unitNumber}
                              </span>
                              {isConflict && (
                                <span className="text-[9px] px-1 py-0.2 bg-[#DC2626] text-white rounded font-bold">
                                  CONFLICT
                                </span>
                              )}
                            </div>
                            <div
                              className={`text-[10px] truncate mt-0.5 ${
                                isSelected ? 'text-blue-100' : 'text-[#64748B]'
                              }`}
                            >
                              {u.ownerName}
                            </div>
                            <div
                              className={`text-[9px] mt-0.5 font-mono ${
                                isSelected ? 'text-blue-200' : 'text-[#94A3B8]'
                              }`}
                            >
                              {u.areaSqFt} sq.ft
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mode Indicator Pill */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-md border border-[#CBD5E1] shadow-sm text-xs font-semibold text-[#1E293B]">
          <span
            className={`w-2 h-2 rounded-full ${
              mapDimension === '2d' ? 'bg-[#D97706]' : 'bg-[#2563EB]'
            }`}
          />
          <span>{mapDimension === '2d' ? '2D Top-Down View' : '3D Spatial Map'}</span>
        </div>
      </div>

      {/* SUBTLE RE-CENTER COMPASS (NO MOVE BUTTONS) */}
      <div className="absolute right-4 bottom-5 flex flex-col items-end gap-2 z-20">
        <button
          onClick={handleResetCamera}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-md hover:bg-blue-50 text-[#1E293B] hover:text-[#2563EB] text-xs font-semibold rounded-xl border border-[#CBD5E1] shadow-md transition-colors cursor-pointer"
          title="Reset Camera & Center View"
        >
          <Compass className="w-4 h-4 text-[#2563EB]" />
          <span>Reset View</span>
        </button>
      </div>

      {/* BOTTOM-CENTER GESTURE HINT BADGE (NO BLANK SPACE - PURE MAP CANVAS ONLY) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-20 pointer-events-none hidden md:flex items-center gap-2.5 bg-[#0F172A]/85 backdrop-blur-sm text-white text-[11px] font-medium px-4 py-1.5 rounded-full shadow-lg border border-slate-700/50">
        <span>🏢 Click any Flat to view details</span>
        <span className="text-slate-500">•</span>
        <span>✌️ Move: 2 fingers swipe on trackpad (left / right / up / down)</span>
        <span className="text-slate-500">•</span>
        <span>🔄 Rotate: Left-click drag</span>
        <span className="text-slate-500">•</span>
        <span>🔍 Zoom: Pinch or scroll</span>
      </div>
    </div>
  );
};
