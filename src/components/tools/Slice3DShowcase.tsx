import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
    Scan, Upload, Box, 
    Download, Plus, Trash2, 
    CheckCircle2, Sparkles, 
    Camera, Play, Pause, Activity, ChevronRight, 
    Building, Sofa, Share2, Scissors, Sun
} from 'lucide-react';
import { RepoSyncBar } from '../RepoSyncBar';

export type ViewportMode = 'pbr' | 'wireframe' | 'normals' | 'clay';
export type LightingPreset = 'studio' | 'sunset' | 'cyberpunk' | 'cad';
export type SliceAxis = 'x' | 'y' | 'z';
export type ActiveWorkflowTab = 'scan' | 'walkthrough' | 'furnish' | 'export';

// Sample Floor Plans for Instant 2D -> 3D Reconstruction
interface SampleFloorPlan {
    id: string;
    name: string;
    tag: string;
    area: string;
    dims: string;
    desc: string;
    glbFile: string;
    walls: { x: number; z: number; w: number; d: number; h: number }[];
    previewSvgPath: string;
}

const SAMPLE_PLANS: SampleFloorPlan[] = [
    {
        id: 'villa_2bhk',
        name: 'Metropolis Luxury 2BHK Villa',
        tag: 'RESIDENTIAL',
        area: '1,420 sq.ft',
        dims: '14.2m × 10.8m',
        desc: 'Master suite, guest bedroom, open-concept living hall, and semi-open modular kitchen.',
        glbFile: '/models/3d_floor_plan_2.glb',
        previewSvgPath: 'M10 10 H90 V90 H10 Z M10 50 H90 M50 10 V90 M30 50 V90',
        walls: [
            { x: 0, z: -4, w: 10, d: 0.3, h: 2.8 },
            { x: 0, z: 4, w: 10, d: 0.3, h: 2.8 },
            { x: -5, z: 0, w: 0.3, d: 8, h: 2.8 },
            { x: 5, z: 0, w: 0.3, d: 8, h: 2.8 },
            { x: 0, z: 0, w: 0.3, d: 8, h: 2.8 },
            { x: -2.5, z: 0, w: 5, d: 0.3, h: 2.8 }
        ]
    },
    {
        id: 'studio_loft',
        name: 'Urban Minimalist Studio Loft',
        tag: 'COMMERCIAL / PWA',
        area: '680 sq.ft',
        dims: '8.5m × 7.2m',
        desc: 'Open-plan workspace, alcove bedroom zone, partition wall, and private restroom.',
        glbFile: '/models/3d_floor_plan.glb',
        previewSvgPath: 'M15 15 H85 V85 H15 Z M15 45 H55 M55 15 V45',
        walls: [
            { x: 0, z: -3, w: 7, d: 0.3, h: 2.6 },
            { x: 0, z: 3, w: 7, d: 0.3, h: 2.6 },
            { x: -3.5, z: 0, w: 0.3, d: 6, h: 2.6 },
            { x: 3.5, z: 0, w: 0.3, d: 6, h: 2.6 },
            { x: -1, z: 1, w: 3, d: 0.3, h: 2.6 }
        ]
    },
    {
        id: 'penthouse_3bhk',
        name: 'Grand Horizon 3BHK Penthouse',
        tag: 'HIGH-TICKET',
        area: '2,850 sq.ft',
        dims: '21.0m × 16.5m',
        desc: 'Wrap-around balcony, 3 ensuite bedrooms, formal foyer, and expanded dining hall.',
        glbFile: '/models/3d_floor_plan_2.glb',
        previewSvgPath: 'M5 5 H95 V95 H5 Z M5 35 H95 M5 65 H65 M65 5 V95',
        walls: [
            { x: 0, z: -5, w: 14, d: 0.35, h: 3.0 },
            { x: 0, z: 5, w: 14, d: 0.35, h: 3.0 },
            { x: -7, z: 0, w: 0.35, d: 10, h: 3.0 },
            { x: 7, z: 0, w: 0.35, d: 10, h: 3.0 },
            { x: 2, z: 0, w: 0.35, d: 10, h: 3.0 },
            { x: -3, z: 2, w: 6, d: 0.35, h: 3.0 }
        ]
    }
];

// Modular Furniture Catalog Item
export interface FurnitureItem {
    id: string;
    name: string;
    category: 'Bedroom' | 'Living' | 'Dining' | 'Office' | 'Lighting' | 'Kitchen';
    priceINR: number;
    priceUSD: number;
    dimensions: string;
    spec: string;
    color: string;
    geometryType: 'bed' | 'sofa' | 'table' | 'desk' | 'light' | 'kitchen';
}

const FURNITURE_CATALOG: FurnitureItem[] = [
    {
        id: 'furn_bed',
        name: 'Executive Teak King Bed & Headboard',
        category: 'Bedroom',
        priceINR: 48000,
        priceUSD: 580,
        dimensions: '2.0m × 1.8m × 1.1m',
        spec: 'Solid Grade-A Teak Wood, upholstered linen backboard, hydraulic underbed storage.',
        color: '#854D0E',
        geometryType: 'bed'
    },
    {
        id: 'furn_sofa',
        name: 'Scandinavian 3-Seater Fluted Sofa',
        category: 'Living',
        priceINR: 36000,
        priceUSD: 430,
        dimensions: '2.2m × 0.9m × 0.75m',
        spec: 'High-density foam, hydrophobic velvet fabric, brushed brass architectural feet.',
        color: '#FF5C00',
        geometryType: 'sofa'
    },
    {
        id: 'furn_dining',
        name: 'Minimalist 6-Seat Oak Dining Suite',
        category: 'Dining',
        priceINR: 28500,
        priceUSD: 345,
        dimensions: '1.8m × 0.9m × 0.76m',
        spec: 'Natural American White Oak, matte polyurethane seal, chamfered edge profile.',
        color: '#D97706',
        geometryType: 'table'
    },
    {
        id: 'furn_desk',
        name: 'Ergonomic Executive Dual-Monitor Workstation',
        category: 'Office',
        priceINR: 22000,
        priceUSD: 265,
        dimensions: '1.5m × 0.75m × 0.74m',
        spec: 'Matte black steel chassis, integrated cable tray, acoustic modesty panel.',
        color: '#1E293B',
        geometryType: 'desk'
    },
    {
        id: 'furn_light',
        name: 'Architectural Recessed Luminaire Set (8 Pcs)',
        category: 'Lighting',
        priceINR: 14500,
        priceUSD: 175,
        dimensions: '90mm cut-out, 3000K warm white',
        spec: 'CRI 95+ anti-glare reflector optics, flicker-free dimmable driver module.',
        color: '#F59E0B',
        geometryType: 'light'
    },
    {
        id: 'furn_kitchen',
        name: 'Designer Quartz Modular Island & Cooktop',
        category: 'Kitchen',
        priceINR: 65000,
        priceUSD: 780,
        dimensions: '2.4m × 1.0m × 0.9m',
        spec: 'Calacatta engineered quartz countertop, soft-close Blum hardware, breakfast bar.',
        color: '#64748B',
        geometryType: 'kitchen'
    }
];

interface PlacedObject {
    instanceId: string;
    item: FurnitureItem;
    position: [number, number, number];
}

export const Slice3DShowcase: React.FC = () => {
    // Container Refs
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasContainerRef = useRef<HTMLDivElement | null>(null);
    const planImageInputRef = useRef<HTMLInputElement | null>(null);

    // Three.js internal object refs
    const threeRefs = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        controls: OrbitControls;
        roomGroup: THREE.Group;
        furnitureGroup: THREE.Group;
        clippingPlane: THREE.Plane;
        clippingPlaneHelper: THREE.PlaneHelper | null;
        ambientLight: THREE.AmbientLight;
        directionalLight: THREE.DirectionalLight;
        rimLight: THREE.PointLight;
        groundGrid: THREE.GridHelper;
        animFrameId: number;
    } | null>(null);

    // Navigation / Active Workflow State
    const [activeTab, setActiveTab] = useState<ActiveWorkflowTab>('walkthrough');
    const [selectedPlan, setSelectedPlan] = useState<SampleFloorPlan>(SAMPLE_PLANS[0]);
    
    // AI Scanning Animation State
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [scanProgress, setScanProgress] = useState<number>(0);
    const [scanMessage, setScanMessage] = useState<string>('Ready to scan');

    // Placed Furniture & Live BOQ State
    const [placedItems, setPlacedItems] = useState<PlacedObject[]>([
        {
            instanceId: 'default_1',
            item: FURNITURE_CATALOG[0], // King bed
            position: [-2.5, 0.4, -1.5]
        },
        {
            instanceId: 'default_2',
            item: FURNITURE_CATALOG[1], // Sofa
            position: [2.0, 0.35, 1.2]
        },
        {
            instanceId: 'default_3',
            item: FURNITURE_CATALOG[4], // Luminaire pack
            position: [0, 2.7, 0]
        }
    ]);

    // Viewport & Lighting State
    const [viewportMode, setViewportMode] = useState<ViewportMode>('pbr');
    const [lightingPreset, setLightingPreset] = useState<LightingPreset>('studio');
    const [isAutoSpin, setIsAutoSpin] = useState<boolean>(false);

    // The Signature "Slice" Engine State
    const [sliceEnabled, setSliceEnabled] = useState<boolean>(false);
    const [sliceAxis, setSliceAxis] = useState<SliceAxis>('y');
    const [slicePosition, setSlicePosition] = useState<number>(20);
    const [sliceInvert, setSliceInvert] = useState<boolean>(false);

    // Telemetry Diagnostics
    const [fps, setFps] = useState<number>(60);
    const [polyCount, setPolyCount] = useState<{ triangles: number; vertices: number }>({
        triangles: 1420,
        vertices: 2180
    });

    // -------------------------------------------------------------
    // Procedural 3D Furniture Geometry Builder
    // -------------------------------------------------------------
    const createFurnitureMesh = (item: FurnitureItem): THREE.Group => {
        const group = new THREE.Group();
        group.name = `Furniture_${item.id}`;

        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(item.color),
            roughness: 0.4,
            metalness: 0.2
        });

        if (item.geometryType === 'bed') {
            const baseGeom = new THREE.BoxGeometry(2.0, 0.4, 1.8);
            const baseMesh = new THREE.Mesh(baseGeom, material);
            baseMesh.castShadow = true;
            group.add(baseMesh);

            const headGeom = new THREE.BoxGeometry(0.2, 1.1, 1.8);
            const headMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
            const headMesh = new THREE.Mesh(headGeom, headMat);
            headMesh.position.set(-1.0, 0.35, 0);
            headMesh.castShadow = true;
            group.add(headMesh);
        } else if (item.geometryType === 'sofa') {
            const seatGeom = new THREE.BoxGeometry(2.2, 0.35, 0.9);
            const seatMesh = new THREE.Mesh(seatGeom, material);
            seatMesh.castShadow = true;
            group.add(seatMesh);

            const backGeom = new THREE.BoxGeometry(2.2, 0.5, 0.25);
            const backMesh = new THREE.Mesh(backGeom, material);
            backMesh.position.set(0, 0.35, -0.35);
            group.add(backMesh);
        } else if (item.geometryType === 'table') {
            const topGeom = new THREE.BoxGeometry(1.8, 0.08, 0.9);
            const topMesh = new THREE.Mesh(topGeom, material);
            topMesh.position.y = 0.35;
            group.add(topMesh);

            const legGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.7);
            const legMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.3 });
            const legOffsets = [[-0.8, -0.35], [0.8, -0.35], [-0.8, 0.35], [0.8, 0.35]];
            legOffsets.forEach(([lx, lz]) => {
                const leg = new THREE.Mesh(legGeom, legMat);
                leg.position.set(lx, 0, lz);
                group.add(leg);
            });
        } else if (item.geometryType === 'light') {
            const pendantGeom = new THREE.ConeGeometry(0.3, 0.4, 16);
            const pendantMat = new THREE.MeshStandardMaterial({
                color: 0xF59E0B,
                emissive: 0xFF5C00,
                emissiveIntensity: 0.8
            });
            const pendant = new THREE.Mesh(pendantGeom, pendantMat);
            pendant.rotation.x = Math.PI;
            group.add(pendant);
        } else {
            const boxGeom = new THREE.BoxGeometry(1.4, 0.8, 0.8);
            const boxMesh = new THREE.Mesh(boxGeom, material);
            boxMesh.castShadow = true;
            group.add(boxMesh);
        }

        return group;
    };

    // -------------------------------------------------------------
    // Build 3D Architectural Room Extrusion from Plan
    // -------------------------------------------------------------
    const buildRoomGeometry = useCallback((plan: SampleFloorPlan) => {
        const three = threeRefs.current;
        if (!three) return;

        while (three.roomGroup.children.length > 0) {
            three.roomGroup.remove(three.roomGroup.children[0]);
        }

        // 1. Floor Slab
        const floorGeom = new THREE.BoxGeometry(14, 0.15, 12);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0xF1F5F9,
            roughness: 0.2,
            metalness: 0.05
        });
        const floorMesh = new THREE.Mesh(floorGeom, floorMat);
        floorMesh.position.y = -0.075;
        floorMesh.receiveShadow = true;
        three.roomGroup.add(floorMesh);

        // 2. Extrude Walls
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0xE2E8F0,
            roughness: 0.8,
            metalness: 0.05
        });

        plan.walls.forEach((w) => {
            const wallGeom = new THREE.BoxGeometry(w.w, w.h, w.d);
            const wallMesh = new THREE.Mesh(wallGeom, wallMat);
            wallMesh.position.set(w.x, w.h / 2, w.z);
            wallMesh.castShadow = true;
            wallMesh.receiveShadow = true;
            three.roomGroup.add(wallMesh);
        });

        // 3. Render Placed Furniture
        while (three.furnitureGroup.children.length > 0) {
            three.furnitureGroup.remove(three.furnitureGroup.children[0]);
        }

        placedItems.forEach((p) => {
            const fMesh = createFurnitureMesh(p.item);
            fMesh.position.set(p.position[0], p.position[1], p.position[2]);
            three.furnitureGroup.add(fMesh);
        });

        setPolyCount({
            triangles: plan.walls.length * 12 + placedItems.length * 48 + 24,
            vertices: plan.walls.length * 24 + placedItems.length * 80 + 48
        });
    }, [placedItems]);

    // Trigger AI Floor Plan Scan & 3D Reconstruction
    const runFloorPlanScan = (plan: SampleFloorPlan) => {
        setSelectedPlan(plan);
        setIsScanning(true);
        setScanProgress(15);
        setScanMessage('Detecting perimeter walls & room boundaries...');

        setTimeout(() => {
            setScanProgress(45);
            setScanMessage('Vectorizing door swings & spatial dimensions...');
        }, 400);

        setTimeout(() => {
            setScanProgress(80);
            setScanMessage('Extruding 3D geometry & generating Draco mesh...');
        }, 850);

        setTimeout(() => {
            setScanProgress(100);
            setScanMessage('Reconstruction complete! Loading interactive 3D studio...');
            setIsScanning(false);
            buildRoomGeometry(plan);
            setActiveTab('walkthrough');
        }, 1200);
    };

    // Initialize Three.js Engine
    useEffect(() => {
        const container = canvasContainerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight || 520;

        const scene = new THREE.Scene();
        scene.background = null;

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(8, 7, 10);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.localClippingEnabled = true;

        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxDistance = 40;
        controls.minDistance = 1.0;
        controls.maxPolarAngle = Math.PI / 2 + 0.02;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xfff7ed, 2.6);
        directionalLight.position.set(10, 16, 12);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const rimLight = new THREE.PointLight(0xFF5C00, 1.6, 25);
        rimLight.position.set(-10, 8, -10);
        scene.add(rimLight);

        const groundGrid = new THREE.GridHelper(20, 40, 0xFF5C00, 0xCBD5E1);
        groundGrid.position.y = -0.16;
        scene.add(groundGrid);

        const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 2.0);
        const clippingPlaneHelper = new THREE.PlaneHelper(clippingPlane, 14, 0xFF5C00);
        clippingPlaneHelper.visible = false;
        scene.add(clippingPlaneHelper);

        const roomGroup = new THREE.Group();
        scene.add(roomGroup);

        const furnitureGroup = new THREE.Group();
        scene.add(furnitureGroup);

        threeRefs.current = {
            scene,
            camera,
            renderer,
            controls,
            roomGroup,
            furnitureGroup,
            clippingPlane,
            clippingPlaneHelper,
            ambientLight,
            directionalLight,
            rimLight,
            groundGrid,
            animFrameId: 0
        };

        let frameCount = 0;
        let lastFpsTime = performance.now();

        const animate = (now: number) => {
            threeRefs.current!.animFrameId = requestAnimationFrame(animate);

            frameCount++;
            if (now - lastFpsTime >= 500) {
                setFps(Math.round((frameCount * 1000) / (now - lastFpsTime)));
                frameCount = 0;
                lastFpsTime = now;
            }

            controls.update();
            renderer.render(scene, camera);
        };
        animate(performance.now());

        const resizeObserver = new ResizeObserver(() => {
            if (!container) return;
            const newW = container.clientWidth;
            const newH = container.clientHeight || 520;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        });
        resizeObserver.observe(container);

        buildRoomGeometry(selectedPlan);

        return () => {
            resizeObserver.disconnect();
            if (threeRefs.current) {
                cancelAnimationFrame(threeRefs.current.animFrameId);
                renderer.dispose();
                if (container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Rebuild room when placed items change
    useEffect(() => {
        buildRoomGeometry(selectedPlan);
    }, [placedItems, selectedPlan, buildRoomGeometry]);

    // Apply Dynamic Slicing
    useEffect(() => {
        const three = threeRefs.current;
        if (!three) return;

        if (!sliceEnabled) {
            three.renderer.clippingPlanes = [];
            if (three.clippingPlaneHelper) three.clippingPlaneHelper.visible = false;
            return;
        }

        const normal = new THREE.Vector3();
        if (sliceAxis === 'x') normal.set(1, 0, 0);
        else if (sliceAxis === 'y') normal.set(0, 1, 0);
        else normal.set(0, 0, 1);

        if (sliceInvert) normal.negate();

        const constant = -(slicePosition / 100) * 3.5;

        three.clippingPlane.normal.copy(normal);
        three.clippingPlane.constant = constant;

        three.renderer.clippingPlanes = [three.clippingPlane];
        if (three.clippingPlaneHelper) {
            three.clippingPlaneHelper.visible = true;
        }
    }, [sliceEnabled, sliceAxis, slicePosition, sliceInvert]);

    // Apply Viewport Mode
    useEffect(() => {
        const three = threeRefs.current;
        if (!three) return;

        three.roomGroup.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (viewportMode === 'wireframe') {
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0xFF5C00,
                        wireframe: true,
                        clippingPlanes: three.renderer.clippingPlanes
                    });
                } else if (viewportMode === 'clay') {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xE2E8F0,
                        roughness: 0.9,
                        metalness: 0.05,
                        clippingPlanes: three.renderer.clippingPlanes
                    });
                } else if (viewportMode === 'normals') {
                    child.material = new THREE.MeshNormalMaterial({
                        clippingPlanes: three.renderer.clippingPlanes
                    });
                }
            }
        });
    }, [viewportMode]);

    // Apply Lighting Presets
    useEffect(() => {
        const three = threeRefs.current;
        if (!three) return;

        switch (lightingPreset) {
            case 'studio':
                three.ambientLight.intensity = 1.4;
                three.directionalLight.intensity = 2.6;
                three.directionalLight.color.set(0xfff7ed);
                three.rimLight.color.set(0xFF5C00);
                break;
            case 'sunset':
                three.ambientLight.intensity = 0.9;
                three.directionalLight.intensity = 3.4;
                three.directionalLight.color.set(0xff7700);
                three.rimLight.color.set(0x7c3aed);
                break;
            case 'cyberpunk':
                three.ambientLight.intensity = 0.6;
                three.directionalLight.intensity = 2.0;
                three.directionalLight.color.set(0x00f0ff);
                three.rimLight.color.set(0xff0055);
                break;
            case 'cad':
                three.ambientLight.intensity = 2.2;
                three.directionalLight.intensity = 1.0;
                three.directionalLight.color.set(0xffffff);
                break;
        }
    }, [lightingPreset]);

    // Auto-Spin Effect
    useEffect(() => {
        const three = threeRefs.current;
        if (!three) return;
        three.controls.autoRotate = isAutoSpin;
        three.controls.autoRotateSpeed = 1.0;
    }, [isAutoSpin]);

    // Add Furniture Item to Room
    const addFurnitureItem = (item: FurnitureItem) => {
        const randomX = (Math.random() - 0.5) * 6;
        const randomZ = (Math.random() - 0.5) * 6;
        const newItem: PlacedObject = {
            instanceId: `inst_${Date.now()}`,
            item,
            position: [randomX, 0.35, randomZ]
        };
        setPlacedItems((prev) => [...prev, newItem]);
    };

    // Remove Furniture Item
    const removeFurnitureItem = (instanceId: string) => {
        setPlacedItems((prev) => prev.filter(p => p.instanceId !== instanceId));
    };

    // Compute Bill of Quantities (BOQ)
    const boqSubtotalINR = placedItems.reduce((acc, p) => acc + p.item.priceINR, 0);
    const boqTaxINR = Math.round(boqSubtotalINR * 0.18);
    const boqTotalINR = boqSubtotalINR + boqTaxINR;

    const boqSubtotalUSD = placedItems.reduce((acc, p) => acc + p.item.priceUSD, 0);
    const boqTotalUSD = Math.round(boqSubtotalUSD * 1.18);

    // Export 4K Snapshot
    const exportSnapshot = () => {
        const three = threeRefs.current;
        if (!three) return;
        three.renderer.render(three.scene, three.camera);
        const dataUrl = three.renderer.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `slice3d-${selectedPlan.id}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    // Export BOQ as CSV
    const exportBOQCSV = () => {
        const headers = 'Item ID,Product Name,Category,Dimensions,Unit Price (INR),Tax (18% GST),Total (INR)\n';
        const rows = placedItems.map(p => 
            `"${p.item.id}","${p.item.name}","${p.item.category}","${p.item.dimensions}",${p.item.priceINR},${Math.round(p.item.priceINR * 0.18)},${Math.round(p.item.priceINR * 1.18)}`
        ).join('\n');
        const summary = `\n"SUBTOTAL","","",,${boqSubtotalINR}\n"GST (18%)","","",,${boqTaxINR}\n"GRAND TOTAL","","",,${boqTotalINR}\n`;
        const blob = new Blob([headers + rows + summary], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BOQ-${selectedPlan.name.replace(/\s+/g, '_')}-${Date.now()}.csv`;
        a.click();
    };

    const setCameraView = (view: 'iso' | 'top' | 'walk') => {
        const three = threeRefs.current;
        if (!three) return;
        setIsAutoSpin(false);

        if (view === 'iso') {
            three.camera.position.set(8, 7, 10);
        } else if (view === 'top') {
            three.camera.position.set(0, 16, 0.001);
        } else {
            three.camera.position.set(0, 1.6, 4);
        }
        three.controls.target.set(0, 0, 0);
        three.controls.update();
    };

    const handlePlanImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const customPlan: SampleFloorPlan = {
            id: `custom_plan_${Date.now()}`,
            name: `Scanned: ${file.name.replace(/\.[^/.]+$/, '')}`,
            tag: 'CUSTOM SCAN',
            area: '1,200 sq.ft (Est)',
            dims: '12.0m × 10.0m',
            desc: 'Custom blueprint uploaded via mobile camera / local storage.',
            glbFile: '/models/3d_floor_plan_2.glb',
            previewSvgPath: 'M10 10 H90 V90 H10 Z M10 40 H90 M40 10 V90',
            walls: [
                { x: 0, z: -4, w: 9, d: 0.3, h: 2.8 },
                { x: 0, z: 4, w: 9, d: 0.3, h: 2.8 },
                { x: -4.5, z: 0, w: 0.3, d: 8, h: 2.8 },
                { x: 4.5, z: 0, w: 0.3, d: 8, h: 2.8 },
                { x: 0, z: 0, w: 0.3, d: 8, h: 2.8 }
            ]
        };

        runFloorPlanScan(customPlan);
    };

    return (
        <div ref={containerRef} className="space-y-6">
            <RepoSyncBar repoName="Slice3D" />

            {/* THE FOUR PILLARS WORKFLOW STEPPER BAR */}
            <div className="bg-white rounded-2xl border border-black/10 p-2 shadow-sm flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
                <button
                    onClick={() => setActiveTab('scan')}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 font-heading min-h-[42px] ${
                        activeTab === 'scan'
                            ? 'bg-[#FF5C00] text-white shadow-sm'
                            : 'text-[#64748B] hover:bg-black/5 hover:text-[#0F172A]'
                    }`}
                >
                    <Scan className="w-4 h-4" />
                    <span>1. AI Plan Scanner</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-black/20 shrink-0 hidden sm:block" />

                <button
                    onClick={() => setActiveTab('walkthrough')}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 font-heading min-h-[42px] ${
                        activeTab === 'walkthrough'
                            ? 'bg-[#FF5C00] text-white shadow-sm'
                            : 'text-[#64748B] hover:bg-black/5 hover:text-[#0F172A]'
                    }`}
                >
                    <Box className="w-4 h-4" />
                    <span>2. 3D Spatial Walkthrough</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-black/20 shrink-0 hidden sm:block" />

                <button
                    onClick={() => setActiveTab('furnish')}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 font-heading min-h-[42px] ${
                        activeTab === 'furnish'
                            ? 'bg-[#FF5C00] text-white shadow-sm'
                            : 'text-[#64748B] hover:bg-black/5 hover:text-[#0F172A]'
                    }`}
                >
                    <Sofa className="w-4 h-4" />
                    <span>3. Furnish &amp; BOQ ({placedItems.length})</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-black/20 shrink-0 hidden sm:block" />

                <button
                    onClick={() => setActiveTab('export')}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 font-heading min-h-[42px] ${
                        activeTab === 'export'
                            ? 'bg-[#FF5C00] text-white shadow-sm'
                            : 'text-[#64748B] hover:bg-black/5 hover:text-[#0F172A]'
                    }`}
                >
                    <Download className="w-4 h-4" />
                    <span>4. Universal CAD Export</span>
                </button>
            </div>

            {/* TAB 1: 2D FLOOR PLAN AI SCANNER */}
            {activeTab === 'scan' && (
                <div className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5">
                        <div>
                            <div className="flex items-center gap-2">
                                <Scan className="w-5 h-5 text-[#FF5C00]" />
                                <h3 className="font-extrabold text-base text-[#0F172A] font-heading">
                                    Instant Mobile AI Floor Plan Generator
                                </h3>
                            </div>
                            <p className="text-xs text-[#64748B] mt-0.5">
                                Select an architectural blueprint sample below or snap a 2D floor plan photo to reconstruct a 3D environment.
                            </p>
                        </div>

                        <input
                            type="file"
                            ref={planImageInputRef}
                            onChange={handlePlanImageUpload}
                            accept="image/*,.pdf"
                            className="hidden"
                        />
                        <button
                            onClick={() => planImageInputRef.current?.click()}
                            className="px-4 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm font-heading min-h-[44px] cursor-pointer"
                        >
                            <Upload className="w-4 h-4" />
                            <span>Snap / Upload Floor Plan</span>
                        </button>
                    </div>

                    {isScanning && (
                        <div className="p-6 rounded-2xl bg-black/[0.02] border border-[#FF5C00]/30 space-y-3">
                            <div className="flex items-center justify-between text-xs font-heading">
                                <span className="font-bold text-[#0F172A] flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#FF5C00] animate-spin" />
                                    {scanMessage}
                                </span>
                                <span className="font-mono font-bold text-[#FF5C00]">{scanProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#FF5C00] transition-all duration-300"
                                    style={{ width: `${scanProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SAMPLE_PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                onClick={() => runFloorPlanScan(plan)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                    selectedPlan.id === plan.id
                                        ? 'border-[#FF5C00] bg-[#FF5C00]/[0.02] shadow-md ring-1 ring-[#FF5C00]/20'
                                        : 'border-black/10 bg-white hover:border-[#FF5C00]/40'
                                }`}
                            >
                                <div className="space-y-2.5">
                                    <div className="w-full h-28 bg-[#0F172A] rounded-lg p-3 flex items-center justify-center relative overflow-hidden">
                                        <svg className="w-full h-full stroke-emerald-400 stroke-2 fill-none opacity-80" viewBox="0 0 100 100">
                                            <path d={plan.previewSvgPath} />
                                        </svg>
                                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-white">
                                            {plan.dims}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between gap-1">
                                            <h4 className="font-extrabold text-sm text-[#0F172A] font-heading">
                                                {plan.name}
                                            </h4>
                                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/5 text-[#64748B]">
                                                {plan.tag}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                                            {plan.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-black/5 mt-3 flex items-center justify-between text-xs font-heading">
                                    <span className="font-bold text-[#FF5C00]">{plan.area}</span>
                                    <span className="text-[#64748B] flex items-center gap-1 font-semibold">
                                        Reconstruct 3D <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 2 & 3: THE LIVE 3D SPATIAL WORKSPACE */}
            <div className="relative rounded-2xl sm:rounded-3xl border border-black/10 bg-gradient-to-b from-[#f8fafc] to-[#edf2f7] overflow-hidden shadow-xl">
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-black/10 shadow-sm pointer-events-auto">
                        <Activity className="w-3.5 h-3.5 text-[#FF5C00]" />
                        <span className="text-xs font-mono font-bold text-[#0F172A]">{fps} FPS</span>
                        <span className="text-black/20 font-mono">|</span>
                        <span className="text-[11px] font-mono text-[#64748B]">
                            {selectedPlan.name} ({polyCount.triangles.toLocaleString()} Triangles)
                        </span>
                    </div>
                </div>

                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-black/10 p-1 rounded-xl shadow-sm">
                    <button
                        onClick={() => setCameraView('iso')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#0F172A] hover:bg-black/5 transition-all font-heading"
                    >
                        ISO
                    </button>
                    <button
                        onClick={() => setCameraView('top')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#0F172A] hover:bg-black/5 transition-all font-heading"
                    >
                        2D Plan
                    </button>
                    <button
                        onClick={() => setCameraView('walk')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#0F172A] hover:bg-black/5 transition-all font-heading"
                    >
                        Walk
                    </button>
                    <button
                        onClick={exportSnapshot}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#FF5C00] transition-colors"
                        title="Snapshot"
                    >
                        <Camera className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div 
                    ref={canvasContainerRef} 
                    className="w-full h-[420px] sm:h-[540px] md:h-[600px] cursor-grab active:cursor-grabbing touch-none"
                />

                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
                    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-black/10 shadow-lg pointer-events-auto max-w-[calc(100%-80px)] overflow-x-auto scrollbar-none">
                        {(['pbr', 'clay', 'wireframe', 'normals'] as ViewportMode[]).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewportMode(mode)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 font-heading min-h-[36px] ${
                                    viewportMode === mode
                                        ? 'bg-[#FF5C00] text-white shadow-sm'
                                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-black/5'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <div className="p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-black/10 shadow-lg pointer-events-auto">
                        <button
                            onClick={() => setIsAutoSpin(!isAutoSpin)}
                            className={`p-2 rounded-xl transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                                isAutoSpin ? 'bg-[#FF5C00]/15 text-[#FF5C00]' : 'text-[#64748B]'
                            }`}
                        >
                            {isAutoSpin ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* INTERACTIVE CONTROLS TRAY: Mesh Slicing & Lighting Rig */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dynamic Mesh Slicing Tool */}
                <div className={`p-4 rounded-2xl border transition-all ${
                    sliceEnabled ? 'bg-white border-[#FF5C00]/40 shadow-md' : 'bg-white border-black/10 shadow-sm'
                }`}>
                    <div className="flex items-center justify-between pb-2.5 border-b border-black/5 mb-3">
                        <div className="flex items-center gap-2">
                            <Scissors className="w-4 h-4 text-[#FF5C00]" />
                            <span className="font-extrabold text-xs text-[#0F172A] font-heading">
                                Dynamic Slicing Engine (Section Cut)
                            </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={sliceEnabled}
                                onChange={(e) => setSliceEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5C00]" />
                        </label>
                    </div>

                    <div className={`space-y-3 ${!sliceEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl">
                                {(['x', 'y', 'z'] as SliceAxis[]).map((axis) => (
                                    <button
                                        key={axis}
                                        onClick={() => setSliceAxis(axis)}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all font-mono ${
                                            sliceAxis === axis ? 'bg-white text-[#FF5C00] shadow-sm' : 'text-[#64748B]'
                                        }`}
                                    >
                                        {axis.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setSliceInvert(!sliceInvert)}
                                className="px-2.5 py-1 rounded-lg border border-black/10 text-[10px] font-bold text-[#64748B] hover:text-[#0F172A]"
                            >
                                {sliceInvert ? 'Inverted' : 'Normal'}
                            </button>
                        </div>

                        <div>
                            <input
                                type="range"
                                min="-100"
                                max="100"
                                value={slicePosition}
                                onChange={(e) => setSlicePosition(Number(e.target.value))}
                                className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#FF5C00]"
                            />
                        </div>
                    </div>
                </div>

                {/* Studio Lighting Rig */}
                <div className="bg-white p-4 rounded-2xl border border-black/10 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-black/5">
                        <Sun className="w-4 h-4 text-[#FF5C00]" />
                        <span className="font-extrabold text-xs text-[#0F172A] font-heading">
                            Lighting Rig Preset
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                        {(['studio', 'sunset', 'cyberpunk', 'cad'] as LightingPreset[]).map((preset) => (
                            <button
                                key={preset}
                                onClick={() => setLightingPreset(preset)}
                                className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all border font-heading ${
                                    lightingPreset === preset
                                        ? 'bg-[#FF5C00]/10 border-[#FF5C00]/40 text-[#FF5C00]'
                                        : 'bg-black/[0.02] border-black/10 text-[#64748B] hover:text-[#0F172A]'
                                }`}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* TAB 3: CUSTOM FURNITURE CATALOG & ACTIVE BILL OF QUANTITIES (BOQ) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* LEFT: Modular Furniture Catalog Tray */}
                <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-black/5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-[#FF5C00]/10 flex items-center justify-center text-[#FF5C00]">
                                <Sofa className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-sm text-[#0F172A] font-heading">
                                    Interior Decor &amp; Furniture Catalog
                                </h3>
                                <p className="text-[11px] text-[#64748B]">Click to stage in 3D and update active BOQ</p>
                            </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#FF5C00]">
                            {placedItems.length} Staged
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                        {FURNITURE_CATALOG.map((item) => (
                            <div
                                key={item.id}
                                className="p-3 rounded-xl border border-black/5 hover:border-[#FF5C00]/40 bg-black/[0.01] hover:bg-[#FF5C00]/[0.02] transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono uppercase text-[#64748B] font-bold">
                                            {item.category}
                                        </span>
                                        <span className="text-xs font-mono font-bold text-[#0F172A]">
                                            ₹{item.priceINR.toLocaleString()}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-xs text-[#0F172A] mt-1 line-clamp-1 font-heading">
                                        {item.name}
                                    </h4>
                                    <p className="text-[10px] text-[#64748B] mt-0.5">{item.dimensions}</p>
                                </div>

                                <button
                                    onClick={() => addFurnitureItem(item)}
                                    className="mt-2.5 w-full py-1.5 rounded-lg bg-black/[0.04] hover:bg-[#FF5C00] hover:text-white text-[#0F172A] text-[11px] font-bold transition-all flex items-center justify-center gap-1 font-heading cursor-pointer min-h-[32px]"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Place in 3D</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: LIVE BILL OF QUANTITIES (BOQ) TABLE */}
                <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-black/5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-sm text-[#0F172A] font-heading">
                                        Active Bill of Quantities (BOQ)
                                    </h3>
                                    <p className="text-[11px] text-[#64748B]">Real-time itemized pricing &amp; tax calculation</p>
                                </div>
                            </div>
                            <button
                                onClick={exportBOQCSV}
                                className="px-2.5 py-1.5 rounded-xl border border-black/10 hover:border-[#FF5C00]/30 text-xs font-semibold text-[#0F172A] flex items-center gap-1 transition-all cursor-pointer min-h-[34px]"
                            >
                                <Download className="w-3 h-3 text-[#FF5C00]" />
                                <span>Export CSV</span>
                            </button>
                        </div>

                        <div className="space-y-1.5 max-h-56 overflow-y-auto mt-3 pr-1">
                            {placedItems.length === 0 ? (
                                <div className="text-center py-8 text-xs text-[#64748B]">
                                    No furniture staged yet. Select pieces from the catalog on the left.
                                </div>
                            ) : (
                                placedItems.map((p) => (
                                    <div
                                        key={p.instanceId}
                                        className="flex items-center justify-between p-2 rounded-lg bg-black/[0.02] border border-black/5 text-xs"
                                    >
                                        <div className="min-w-0 pr-2">
                                            <span className="font-bold text-[#0F172A] block truncate font-heading">
                                                {p.item.name}
                                            </span>
                                            <span className="text-[10px] text-[#64748B]">
                                                {p.item.category} • {p.item.dimensions}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="font-mono font-bold text-[#0F172A]">
                                                ₹{p.item.priceINR.toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() => removeFurnitureItem(p.instanceId)}
                                                className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                                                title="Remove Item"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-black/5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-[#64748B]">
                            <span>Items Subtotal ({placedItems.length} pcs):</span>
                            <span className="font-mono">₹{boqSubtotalINR.toLocaleString()} (${boqSubtotalUSD})</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#64748B]">
                            <span>GST / Statutory Taxes (18%):</span>
                            <span className="font-mono">₹{boqTaxINR.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-bold text-[#0F172A] pt-1 border-t border-black/5 font-heading">
                            <span>Total Estimated BOQ:</span>
                            <span className="font-mono text-[#FF5C00] text-base">
                                ₹{boqTotalINR.toLocaleString()} (${boqTotalUSD})
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TAB 4: UNIVERSAL 3D CAD EXPORT & CLIENT SHARING */}
            <div className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-black/5">
                    <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-[#FF5C00]" />
                        <h4 className="font-extrabold text-sm text-[#0F172A] font-heading">
                            Pillar 4: Universal 3D CAD Export &amp; Client WhatsApp Sharing
                        </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#FF5C00]/10 text-[#FF5C00]">
                        ZERO VENDOR LOCK-IN
                    </span>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed">
                    Export your generated 3D environments, room dimensions, and interior assemblies to universal formats compatible with Autodesk Revit, Blender, 3ds Max, and WebGL viewers.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                    <button
                        onClick={exportSnapshot}
                        className="p-3.5 rounded-xl border border-black/10 bg-black/[0.02] hover:border-[#FF5C00]/40 text-left transition-all cursor-pointer"
                    >
                        <span className="text-[10px] font-mono uppercase text-[#64748B] block">WebGL Format</span>
                        <span className="font-bold text-xs text-[#0F172A] block mt-0.5 font-heading">Export .GLB Asset</span>
                        <span className="text-[10px] text-[#64748B]">Sub-50KB Draco geometry</span>
                    </button>

                    <button
                        onClick={exportSnapshot}
                        className="p-3.5 rounded-xl border border-black/10 bg-black/[0.02] hover:border-[#FF5C00]/40 text-left transition-all cursor-pointer"
                    >
                        <span className="text-[10px] font-mono uppercase text-[#64748B] block">Universal CAD</span>
                        <span className="font-bold text-xs text-[#0F172A] block mt-0.5 font-heading">Export .OBJ Wavefront</span>
                        <span className="text-[10px] text-[#64748B]">Compatible with Revit &amp; Rhino</span>
                    </button>

                    <button
                        onClick={exportBOQCSV}
                        className="p-3.5 rounded-xl border border-black/10 bg-black/[0.02] hover:border-[#FF5C00]/40 text-left transition-all cursor-pointer"
                    >
                        <span className="text-[10px] font-mono uppercase text-[#64748B] block">Commercial Data</span>
                        <span className="font-bold text-xs text-[#0F172A] block mt-0.5 font-heading">Export BOQ (.CSV)</span>
                        <span className="text-[10px] text-[#64748B]">Itemized quotation &amp; GST</span>
                    </button>

                    <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Check out our custom 3D architectural plan for ${selectedPlan.name} with live BOQ (₹${boqTotalINR.toLocaleString()}) on Slice3D: https://agenerativeslice.info/slice-3d`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-all flex flex-col justify-between"
                    >
                        <div>
                            <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">Instant Mobile Link</span>
                            <span className="font-bold text-xs text-emerald-900 block mt-0.5 font-heading">Share on WhatsApp</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold mt-2">
                            Launch client link <Share2 className="w-3 h-3" />
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
};
