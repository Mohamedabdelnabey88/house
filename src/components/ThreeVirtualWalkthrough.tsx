import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomId } from '../types';
import { ROOMS_DATA } from '../data/apartmentData';
import { 
  Compass, 
  Maximize2, 
  RotateCcw, 
  RotateCw, 
  Sun, 
  Moon, 
  Eye, 
  Home, 
  Layers, 
  HelpCircle,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Tv,
  Utensils,
  Bed,
  Bath,
  Flame
} from 'lucide-react';

interface ThreeVirtualWalkthroughProps {
  selectedRoomId: RoomId | null;
  onSelectRoom: (roomId: RoomId) => void;
  bathroomVariant?: 'shower' | 'jacuzzi';
}

interface CameraTarget {
  pos: THREE.Vector3;
  target: THREE.Vector3;
  name: string;
  desc: string;
}

export const ThreeVirtualWalkthrough: React.FC<ThreeVirtualWalkthroughProps> = ({
  selectedRoomId,
  onSelectRoom,
  bathroomVariant = 'jacuzzi',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<'dollhouse' | 'first_person' | 'isometric'>('dollhouse');
  const [currentLocationName, setCurrentLocationName] = useState<string>('نظرة شاملة من أعلى (Dollhouse)');
  const [currentLocationDesc, setCurrentLocationDesc] = useState<string>('عرض كامل للشقة والجدران وتوزيع العفش');

  // Animation & Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 14, 12));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Mouse interaction state
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const spherical = useRef<THREE.Spherical>(new THREE.Spherical(18, Math.PI / 3.5, 0));

  // Camera targets for each room
  const roomCameraPositions: Record<RoomId | 'overview', CameraTarget> = {
    overview: {
      pos: new THREE.Vector3(0, 14, 12),
      target: new THREE.Vector3(0, 0, 0),
      name: 'نظرة مجسمة شاملة (Dollhouse 3D)',
      desc: 'رؤية علوية لمخطط الشقة بالكامل ومطابقة المساحات والفرش'
    },
    lounge: {
      pos: new THREE.Vector3(3.2, 1.8, 0.8),
      target: new THREE.Vector3(3.2, 1.2, -2.5),
      name: 'الصالة والاستقبال والسفرة',
      desc: 'تجول أمام الركنة المودرن والسفرة 6 كراسي والبار المفتوح'
    },
    master_suite: {
      pos: new THREE.Vector3(-1.8, 1.8, -1.2),
      target: new THREE.Vector3(-3.5, 1.3, -3.2),
      name: 'جناح الماستر الملكي والدريسنج',
      desc: 'استكشاف السرير الكينج الفندقي والدريسنج والجاكوزي الخاص'
    },
    kitchen_new: {
      pos: new THREE.Vector3(-4.0, 1.8, 1.5),
      target: new THREE.Vector3(-2.8, 1.2, 2.5),
      name: 'المطبخ المودرن وبار الإفطار',
      desc: 'كاونترات المطبخ الإيطالي المطور وبار الإفطار الأمريكي'
    },
    kids_room: {
      pos: new THREE.Vector3(-1.5, 1.8, 2.0),
      target: new THREE.Vector3(-2.0, 1.2, 4.0),
      name: 'غرفة نوم الأطفال والشباب',
      desc: 'سريرين منفصلين ودولاب مدمج ومكتب دراسة ثنائي'
    },
    kitchen_old: {
      pos: new THREE.Vector3(0.8, 1.8, 2.0),
      target: new THREE.Vector3(1.2, 1.2, 3.8),
      name: 'غرفة المعيشة العائلية المستقلة',
      desc: 'جلسة سينمائية خاصة معزولة بشاشة وبانوهات خشبية'
    },
    balcony: {
      pos: new THREE.Vector3(3.2, 1.8, 4.2),
      target: new THREE.Vector3(3.2, 1.2, 5.8),
      name: 'البلكونة والفرن البلدي الفخاري',
      desc: 'استكشاف الفرن الفخاري ذو القبة والمدخنة وجلسة الروقان'
    },
    bathroom_main: {
      pos: new THREE.Vector3(-4.2, 1.8, -1.2),
      target: new THREE.Vector3(-4.2, 1.2, -2.2),
      name: 'الحمام الرئيسي الموسع',
      desc: 'كابينة الشاور الإيطالية الزجاجية والتواليت المعلق'
    },
    shaft_1: {
      pos: new THREE.Vector3(-4.0, 3.0, -3.5),
      target: new THREE.Vector3(-4.0, 0, -3.5),
      name: 'منور 1 للتهوية',
      desc: 'صاعد التهوية الطبيعية ومسار صرف الماستر والحمام'
    },
    shaft_2: {
      pos: new THREE.Vector3(-2.8, 3.0, 2.5),
      target: new THREE.Vector3(-2.8, 0, 2.5),
      name: 'منور 2 للتهوية',
      desc: 'صاعد تهوية المطبخ الجديد وغرفة الأطفال'
    },
    corridor: {
      pos: new THREE.Vector3(-0.2, 1.8, 0.5),
      target: new THREE.Vector3(-0.2, 1.2, -1.5),
      name: 'الممر الداخلي',
      desc: 'موزع غرف النوم والحمام بدون أي هدر في المساحة'
    }
  };

  // Teleport to room function
  const teleportTo = useCallback((rId: RoomId | 'overview') => {
    const targetInfo = roomCameraPositions[rId];
    if (!targetInfo) return;

    targetCamPos.current.copy(targetInfo.pos);
    targetLookAt.current.copy(targetInfo.target);
    setCurrentLocationName(targetInfo.name);
    setCurrentLocationDesc(targetInfo.desc);

    if (rId !== 'overview' && rId !== 'shaft_1' && rId !== 'shaft_2' && rId !== 'corridor') {
      onSelectRoom(rId as RoomId);
    }
  }, [onSelectRoom]);

  // Handle selectedRoomId changes from parent
  useEffect(() => {
    if (selectedRoomId && roomCameraPositions[selectedRoomId]) {
      teleportTo(selectedRoomId);
    }
  }, [selectedRoomId, teleportTo]);

  // Set up Three.js Scene, Camera, Lights, Geometries, Materials
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNightMode ? 0x080c18 : 0x0f172a);
    scene.fog = new THREE.FogExp2(isNightMode ? 0x080c18 : 0x0f172a, 0.025);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.copy(targetCamPos.current);
    camera.lookAt(targetLookAt.current);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous children if any
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(
      isNightMode ? 0x1e293b : 0xffffff, 
      isNightMode ? 0.7 : 0.9
    );
    scene.add(ambientLight);

    // Main Directional Sun Light (coming from Balcony side: North-East / +X, +Z)
    const sunLight = new THREE.DirectionalLight(
      isNightMode ? 0x60a5fa : 0xfffaed, 
      isNightMode ? 0.4 : 1.4
    );
    sunLight.position.set(10, 16, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // Warm Interior Accent Lights
    // Living room chandelier warm spot
    const livingSpot = new THREE.SpotLight(0xfbbf24, 1.6, 9, Math.PI / 3, 0.3);
    livingSpot.position.set(3.2, 3.2, -1.0);
    livingSpot.target.position.set(3.2, 0, -1.0);
    scene.add(livingSpot);
    scene.add(livingSpot.target);

    // Master Bedroom bedside warm point light
    const masterLamp = new THREE.PointLight(0xf59e0b, 1.2, 5);
    masterLamp.position.set(-2.0, 1.2, -3.2);
    scene.add(masterLamp);

    // Kitchen counter bar pendant light
    const barLight = new THREE.PointLight(0x38bdf8, 1.2, 5);
    barLight.position.set(-3.0, 2.2, 1.8);
    scene.add(barLight);

    // Jacuzzi soft turquoise glow
    const jacuzziLight = new THREE.PointLight(0x06b6d4, 1.5, 4);
    jacuzziLight.position.set(-4.0, 0.8, -3.0);
    scene.add(jacuzziLight);

    // Balcony oven ember glow
    const ovenLight = new THREE.PointLight(0xf97316, 2.0, 3.5);
    ovenLight.position.set(3.2, 0.8, 5.8);
    scene.add(ovenLight);

    // 5. Materials
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x292524, // Dark warm wood parquet
      roughness: 0.4,
      metalness: 0.1,
    });

    const marbleMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Polished white marble for lounge & bathrooms
      roughness: 0.2,
      metalness: 0.1,
    });

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.7,
      metalness: 0.05,
    });

    const featureWallMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Deep slate accent wall
      roughness: 0.5,
    });

    const woodFurnitureMaterial = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Walnut wood
      roughness: 0.5,
    });

    const fabricSofaMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155, // Charcoal/Navy modern upholstery
      roughness: 0.8,
    });

    const bedLinenMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.9,
    });

    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      ior: 1.333,
    });

    const brickMaterial = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Clay terracotta brick for traditional oven
      roughness: 0.9,
    });

    // 6. Build the 3D Apartment
    const aptGroup = new THREE.Group();

    // Base Floor (Overall Apartment: width 11m, length 12m)
    const baseFloorGeo = new THREE.BoxGeometry(11, 0.2, 13);
    const baseFloor = new THREE.Mesh(baseFloorGeo, floorMaterial);
    baseFloor.position.set(0, -0.1, 1);
    baseFloor.receiveShadow = true;
    aptGroup.add(baseFloor);

    // Lounge Marble Floor Area (Right side: x = 1.0 to 5.5, z = -4.5 to 4.0)
    const loungeFloorGeo = new THREE.BoxGeometry(4.5, 0.22, 8.5);
    const loungeFloor = new THREE.Mesh(loungeFloorGeo, marbleMaterial);
    loungeFloor.position.set(3.25, -0.09, -0.25);
    loungeFloor.receiveShadow = true;
    aptGroup.add(loungeFloor);

    // Balcony Floor with outdoor stone texture
    const balconyFloorGeo = new THREE.BoxGeometry(4.5, 0.22, 2.5);
    const balconyFloorMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.8 });
    const balconyFloor = new THREE.Mesh(balconyFloorGeo, balconyFloorMat);
    balconyFloor.position.set(3.25, -0.09, 5.25);
    balconyFloor.receiveShadow = true;
    aptGroup.add(balconyFloor);

    // helper to create walls (cutaway height 1.8m so interior is visible from bird's eye)
    const wallH = 1.8;
    const wallT = 0.2;

    const createWall = (w: number, d: number, x: number, z: number, mat: THREE.Material = wallMaterial) => {
      const geo = new THREE.BoxGeometry(w, wallH, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, wallH / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      aptGroup.add(mesh);
      return mesh;
    };

    // --- EXTERIOR WALLS ---
    // North wall (top)
    createWall(11, wallT, 0, -4.5);
    // East wall (right)
    createWall(wallT, 13, 5.5, 1);
    // West wall (left)
    createWall(wallT, 13, -5.5, 1);
    // South wall (bottom - except balcony opening)
    createWall(6.5, wallT, -2.25, 6.5);
    createWall(1.0, wallT, 5.0, 6.5);

    // --- INTERIOR ROOM PARTITIONS ---
    // Central Spine Wall separating Lounge from Left Bedrooms (with door opening)
    createWall(wallT, 4.0, 1.0, -2.5);
    createWall(wallT, 3.2, 1.0, 2.5);

    // Master Suite walls (creating 4.80m x 4.21m suite)
    createWall(5.0, wallT, -2.5, -0.5); // Wall between Master and Kids/Corridor
    createWall(wallT, 4.0, -1.0, -2.5); // Enclosure wall

    // Master Bathroom & Dressing partition
    createWall(2.0, wallT, -4.5, -2.2);

    // Kids Room Wall
    createWall(4.0, wallT, -3.0, 4.5);

    // Living Room (Old Kitchen) wall
    createWall(3.0, wallT, -0.5, 4.5);

    // --- 7. FURNITURE & SPECIAL FIXTURES IN 3D ---

    // A. MASTER SUITE:
    // 1. King Bed
    const bedGroup = new THREE.Group();
    // Bed frame
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.4, 2.2), woodFurnitureMaterial);
    bedFrame.position.set(0, 0.2, 0);
    bedGroup.add(bedFrame);
    // Mattress
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.35, 2.0), bedLinenMaterial);
    mattress.position.set(0, 0.5, 0);
    bedGroup.add(mattress);
    // Headboard
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.15), fabricSofaMaterial);
    headboard.position.set(0, 0.8, -1.05);
    bedGroup.add(headboard);
    // Pillows
    const pillowGeo = new THREE.BoxGeometry(0.7, 0.12, 0.45);
    const pillow1 = new THREE.Mesh(pillowGeo, bedLinenMaterial);
    pillow1.position.set(-0.5, 0.75, -0.75);
    const pillow2 = new THREE.Mesh(pillowGeo, bedLinenMaterial);
    pillow2.position.set(0.5, 0.75, -0.75);
    bedGroup.add(pillow1);
    bedGroup.add(pillow2);
    // Duvet
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.1, 1.4), new THREE.MeshStandardMaterial({ color: 0x9333ea }));
    duvet.position.set(0, 0.7, 0.3);
    bedGroup.add(duvet);

    bedGroup.position.set(-2.5, 0, -2.8);
    aptGroup.add(bedGroup);

    // 2. Master Walk-in Dressing Wardrobe
    const dressingGeo = new THREE.BoxGeometry(2.4, 1.7, 0.65);
    const dressingMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3 });
    const dressingMesh = new THREE.Mesh(dressingGeo, dressingMat);
    dressingMesh.position.set(-2.5, 0.85, -0.85);
    aptGroup.add(dressingMesh);

    // 3. Master Jacuzzi Tub (Water + Acrylic surround)
    const jacuzziGroup = new THREE.Group();
    const tubRim = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 1.5), marbleMaterial);
    tubRim.position.set(0, 0.35, 0);
    jacuzziGroup.add(tubRim);
    const waterPlane = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 1.3), waterMaterial);
    waterPlane.position.set(0, 0.65, 0);
    jacuzziGroup.add(waterPlane);
    // Chrome faucets
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 }));
    faucet.position.set(0, 0.8, -0.6);
    jacuzziGroup.add(faucet);

    jacuzziGroup.position.set(-4.5, 0, -3.2);
    aptGroup.add(jacuzziGroup);

    // B. LOUNGE & DINING:
    // 1. Modern L-Sectional Sofa
    const sofaGroup = new THREE.Group();
    const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 1.0), fabricSofaMaterial);
    sofaMain.position.set(0, 0.25, 0);
    sofaGroup.add(sofaMain);
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 0.25), fabricSofaMaterial);
    sofaBack.position.set(0, 0.65, -0.4);
    sofaGroup.add(sofaBack);
    // L-chaise
    const chaise = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 1.6), fabricSofaMaterial);
    chaise.position.set(1.05, 0.25, 1.1);
    sofaGroup.add(chaise);
    // Coffee Table
    const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 0.8), marbleMaterial);
    coffeeTable.position.set(-0.2, 0.2, 0.8);
    sofaGroup.add(coffeeTable);

    sofaGroup.position.set(3.2, 0, 1.2);
    aptGroup.add(sofaGroup);

    // 2. Large TV on Feature Acoustic Slat Wall
    const tvFeatureWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.6, 2.4), featureWallMaterial);
    tvFeatureWall.position.set(5.35, 0.8, 1.2);
    aptGroup.add(tvFeatureWall);

    const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 1.5), new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1 }));
    tvScreen.position.set(5.28, 1.1, 1.2);
    aptGroup.add(tvScreen);

    // 3. Dining Table with 6 Chairs
    const diningGroup = new THREE.Group();
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 1.0), woodFurnitureMaterial);
    tableTop.position.set(0, 0.75, 0);
    diningGroup.add(tableTop);
    // Table legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.75);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, metalness: 0.8 });
    [[-0.85, -0.4], [0.85, -0.4], [-0.85, 0.4], [0.85, 0.4]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, 0.375, lz);
      diningGroup.add(leg);
    });

    // 6 Chairs
    const chairGeo = new THREE.BoxGeometry(0.42, 0.45, 0.42);
    [[-0.6, -0.65], [0, -0.65], [0.6, -0.65], [-0.6, 0.65], [0, 0.65], [0.6, 0.65]].forEach(([cx, cz]) => {
      const chair = new THREE.Mesh(chairGeo, fabricSofaMaterial);
      chair.position.set(cx, 0.25, cz);
      diningGroup.add(chair);
    });

    diningGroup.position.set(3.2, 0, -2.4);
    aptGroup.add(diningGroup);

    // C. KITCHEN & AMERICAN BREAKFAST BAR:
    const kitchenGroup = new THREE.Group();
    // U-shaped counters
    const counter1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 0.65), marbleMaterial);
    counter1.position.set(-4.0, 0.45, 3.8);
    kitchenGroup.add(counter1);
    const counter2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.9, 2.5), marbleMaterial);
    counter2.position.set(-5.0, 0.45, 2.4);
    kitchenGroup.add(counter2);
    // American Bar counter separating kitchen from hallway/lounge
    const barMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 0.5), woodFurnitureMaterial);
    barMesh.position.set(-2.8, 0.55, 1.5);
    kitchenGroup.add(barMesh);

    // High bar stools
    for (let i = -0.6; i <= 0.6; i += 0.6) {
      const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.75), fabricSofaMaterial);
      stool.position.set(-2.2, 0.4, 1.5 + i);
      kitchenGroup.add(stool);
    }
    aptGroup.add(kitchenGroup);

    // D. BALCONY & TRADITIONAL DOME OVEN (فرن بلدي فخاري بمدخنة):
    const ovenGroup = new THREE.Group();
    // Terracotta base
    const ovenBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.75, 1.0), brickMaterial);
    ovenBase.position.set(0, 0.375, 0);
    ovenGroup.add(ovenBase);
    // Dome (Hemisphere)
    const domeGeo = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, brickMaterial);
    domeMesh.position.set(0, 0.75, 0);
    ovenGroup.add(domeMesh);
    // Chimney pipe
    const chimneyGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2);
    const chimneyMesh = new THREE.Mesh(chimneyGeo, new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 }));
    chimneyMesh.position.set(0.3, 1.2, -0.2);
    ovenGroup.add(chimneyMesh);
    // Glowing fire opening
    const fireOpening = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.1), new THREE.MeshBasicMaterial({ color: 0xff5722 }));
    fireOpening.position.set(0, 0.75, 0.46);
    ovenGroup.add(fireOpening);

    // Traditional rustic tabliya table & cushions
    const tabliya = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.25), woodFurnitureMaterial);
    tabliya.position.set(1.4, 0.125, 0);
    ovenGroup.add(tabliya);

    ovenGroup.position.set(2.4, 0, 5.2);
    aptGroup.add(ovenGroup);

    // E. KIDS ROOM: Twin Beds & Desk
    const kidsGroup = new THREE.Group();
    const kidBed1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 2.0), bedLinenMaterial);
    kidBed1.position.set(-1.8, 0.25, 3.2);
    const kidBed2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 2.0), bedLinenMaterial);
    kidBed2.position.set(-3.4, 0.25, 3.2);
    kidsGroup.add(kidBed1);
    kidsGroup.add(kidBed2);
    // Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 0.6), woodFurnitureMaterial);
    desk.position.set(-2.6, 0.375, 5.0);
    kidsGroup.add(desk);
    aptGroup.add(kidsGroup);

    scene.add(aptGroup);

    // 8. Animation & Render Loop with Smooth Camera Lerping
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth camera interpolation towards target position and lookAt
      camera.position.lerp(targetCamPos.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
      camera.lookAt(currentLookAt.current);

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Handling via ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [isNightMode, bathroomVariant]);

  // Orbit & Pan Controls via Mouse / Touch Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !cameraRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };

    // Orbit calculation
    const rotSpeed = 0.006;
    const offset = targetCamPos.current.clone().sub(targetLookAt.current);

    spherical.current.setFromVector3(offset);
    spherical.current.theta -= deltaX * rotSpeed;
    spherical.current.phi = Math.max(0.15, Math.min(Math.PI / 2.05, spherical.current.phi - deltaY * rotSpeed));

    targetCamPos.current.copy(
      new THREE.Vector3().setFromSpherical(spherical.current).add(targetLookAt.current)
    );
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.0025;
    const offset = targetCamPos.current.clone().sub(targetLookAt.current);
    const dist = offset.length();
    const newDist = Math.max(2.5, Math.min(30, dist + e.deltaY * zoomSpeed * (dist * 0.1)));
    offset.setLength(newDist);
    targetCamPos.current.copy(targetLookAt.current.clone().add(offset));
  };

  // Preset switchers
  const applyPreset = (preset: 'dollhouse' | 'first_person' | 'isometric') => {
    setCameraPreset(preset);
    if (preset === 'dollhouse') {
      targetCamPos.current.set(0, 14, 12);
      targetLookAt.current.set(0, 0, 0);
      setCurrentLocationName('نظرة شاملة من أعلى (Dollhouse)');
      setCurrentLocationDesc('رؤية ثلاثية الأبعاد كاملة لجميع الغرف والعفش');
    } else if (preset === 'isometric') {
      targetCamPos.current.set(12, 10, 12);
      targetLookAt.current.set(0, 0, 0);
      setCurrentLocationName('منظور أيزومتري 45°');
      setCurrentLocationDesc('زاوية معمارية هندسية واضحة للارتفاعات والعمق');
    } else {
      // First person inside current selected room or lounge
      teleportTo(selectedRoomId || 'lounge');
    }
  };

  // On-screen manual navigation buttons
  const moveCamera = (direction: 'forward' | 'back' | 'left' | 'right' | 'up' | 'down') => {
    const step = 1.2;
    if (direction === 'forward') {
      targetCamPos.current.z -= step;
      targetLookAt.current.z -= step;
    } else if (direction === 'back') {
      targetCamPos.current.z += step;
      targetLookAt.current.z += step;
    } else if (direction === 'left') {
      targetCamPos.current.x -= step;
      targetLookAt.current.x -= step;
    } else if (direction === 'right') {
      targetCamPos.current.x += step;
      targetLookAt.current.x += step;
    } else if (direction === 'up') {
      targetCamPos.current.y += step;
    } else if (direction === 'down') {
      targetCamPos.current.y = Math.max(1.2, targetCamPos.current.y - step);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 rounded-2xl border border-stone-800 shadow-2xl overflow-hidden select-none">
      
      {/* 1. Header Toolbar */}
      <div className="bg-stone-900/95 backdrop-blur-md border-b border-stone-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        
        {/* Title & Current Location info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-stone-200 font-bold flex items-center gap-1.5">
              تجول افتراضي ثلاثي الأبعاد تفاعلي (Three.js WebGL)
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
            <span className="text-amber-400 font-bold">{currentLocationName}</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-400 text-[11px]">{currentLocationDesc}</span>
          </div>
        </div>

        {/* View Presets & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Presets buttons */}
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              id="cam-preset-dollhouse"
              onClick={() => applyPreset('dollhouse')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                cameraPreset === 'dollhouse'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="نظرة شاملة من أعلى"
            >
              شامل (Dollhouse)
            </button>

            <button
              id="cam-preset-isometric"
              onClick={() => applyPreset('isometric')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                cameraPreset === 'isometric'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="أيزومتري 45 درجة"
            >
              أيزومتري 45°
            </button>

            <button
              id="cam-preset-walk"
              onClick={() => applyPreset('first_person')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                cameraPreset === 'first_person'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="تجول داخلي بالعين المجردة"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>تجول داخلي</span>
            </button>
          </div>

          {/* Day / Night Toggle */}
          <button
            id="three-day-night-toggle"
            onClick={() => setIsNightMode(!isNightMode)}
            className={`p-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              isNightMode 
                ? 'bg-indigo-950 text-indigo-300 border-indigo-700' 
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
            title="تبديل الإضاءة النهارية والليلية للغرف"
          >
            {isNightMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline">{isNightMode ? 'إضاءة ليلية دافئة' : 'إضاءة نهارية طبيعية'}</span>
          </button>

        </div>

      </div>

      {/* 2. WebGL 3D Canvas Mount */}
      <div 
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
      />

      {/* 3. Room Quick Teleport Dock (Bottom Bar) */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        
        {/* Room Teleport Pills (Clickable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full bg-stone-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800 pointer-events-auto shadow-2xl">
          <button
            onClick={() => teleportTo('overview')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 transition-all flex items-center gap-1 shrink-0"
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>نظرة عامة</span>
          </button>

          <button
            onClick={() => teleportTo('lounge')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              selectedRoomId === 'lounge' ? 'bg-amber-500 text-stone-950 shadow' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>الصالة والسفرة</span>
          </button>

          <button
            onClick={() => teleportTo('master_suite')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              selectedRoomId === 'master_suite' ? 'bg-amber-500 text-stone-950 shadow' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Bed className="w-3.5 h-3.5 text-purple-400" />
            <span>جناح الماستر والجاكوزي</span>
          </button>

          <button
            onClick={() => teleportTo('kitchen_new')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              selectedRoomId === 'kitchen_new' ? 'bg-amber-500 text-stone-950 shadow' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-emerald-400" />
            <span>المطبخ والبار</span>
          </button>

          <button
            onClick={() => teleportTo('balcony')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              selectedRoomId === 'balcony' ? 'bg-amber-500 text-stone-950 shadow' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>البلكونة والفرن البلدي</span>
          </button>

          <button
            onClick={() => teleportTo('kids_room')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              selectedRoomId === 'kids_room' ? 'bg-amber-500 text-stone-950 shadow' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Bed className="w-3.5 h-3.5 text-teal-400" />
            <span>غرفة الأطفال</span>
          </button>

          <button
            onClick={() => teleportTo('bathroom_main')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              selectedRoomId === 'bathroom_main' ? 'bg-amber-500 text-stone-950 shadow' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Bath className="w-3.5 h-3.5 text-cyan-400" />
            <span>الحمام الرئيسي</span>
          </button>
        </div>

        {/* On-Screen Camera Navigation Controls Pad (Clickable) */}
        <div className="flex items-center gap-1.5 bg-stone-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800 pointer-events-auto shadow-2xl">
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              onClick={() => moveCamera('forward')}
              className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg"
              title="التقدم للأمام"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <div />
            <button
              onClick={() => moveCamera('left')}
              className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg"
              title="التحرك يساراً"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => moveCamera('back')}
              className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg"
              title="الرجوع للخلف"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => moveCamera('right')}
              className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg"
              title="التحرك يميناً"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-1 border-r border-stone-800 pr-1 mr-1">
            <button
              onClick={() => moveCamera('up')}
              className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg"
              title="رفع زاوية الرؤية للأعلى"
            >
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
            </button>
            <button
              onClick={() => moveCamera('down')}
              className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg"
              title="خفض زاوية الرؤية"
            >
              <ZoomOut className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>

      </div>

      {/* 4. Interactive Navigation Hint Overlay (Top Left) */}
      <div className="absolute top-14 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 bg-stone-950/75 backdrop-blur border border-stone-800/80 px-3 py-1.5 rounded-xl text-[11px] text-stone-400">
        <Move className="w-3.5 h-3.5 text-amber-400" />
        <span>اسحب بالماوس للتدوير 360° • عجلة الفأرة للتقريب والتبعيد • انقر أي غرفة للانتقال فوراً</span>
      </div>

    </div>
  );
};
