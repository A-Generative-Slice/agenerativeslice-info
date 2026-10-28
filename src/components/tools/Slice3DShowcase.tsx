import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
    Menu, X, Send, Paperclip, Sparkles, 
    Trash2, Box, Camera, CheckCircle2, 
    ArrowRight, RotateCcw, 
    Calculator, Bot, Layers, 
    Plus, Upload, ShieldCheck
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

// Types
export interface StoredAsset {
    id: string;
    name: string;
    category: string;
    priceINR: number;
    dimensions: string;
    fileName: string;
    fileSizeKB: number;
    color: string;
    isCustom?: boolean;
}

export interface PlacedFurniture {
    id: string;
    assetId: string;
    name: string;
    category: string;
    priceINR: number;
    position: [number, number, number];
    rotationY: number;
    dimensions: [number, number, number];
    color: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
    floorPlanUrl?: string;
    floorPlanName?: string;
    actionApplied?: string;
}

export interface SpacePreset {
    id: string;
    title: string;
    subtitle: string;
    prompt: string;
    areaSqFt: number;
    dimensions: string;
}

// Preset Catalog of Chennai Modern Interior Products
const DEFAULT_VAULT_ASSETS: StoredAsset[] = [
    { id: 'ast-1', name: 'Curved Bouclé Sectional Sofa', category: 'Seating', priceINR: 48500, dimensions: '2600 x 950 x 780 mm', fileName: 'boucle_sectional.glb', fileSizeKB: 2420, color: '#e2e8f0' },
    { id: 'ast-2', name: 'Walnut & Travertine Coffee Table', category: 'Tables', priceINR: 18200, dimensions: '1200 x 600 x 420 mm', fileName: 'walnut_coffee_tab.glb', fileSizeKB: 1180, color: '#78350f' },
    { id: 'ast-3', name: 'Minimalist Oak Workstation Desk', category: 'Office', priceINR: 22000, dimensions: '1500 x 750 x 750 mm', fileName: 'oak_desk_ergonomic.glb', fileSizeKB: 1450, color: '#d97706' },
    { id: 'ast-4', name: 'Herman Miller Style Mesh Chair', category: 'Office', priceINR: 19500, dimensions: '650 x 650 x 1050 mm', fileName: 'ergonomic_task_chair.glb', fileSizeKB: 980, color: '#334155' },
    { id: 'ast-5', name: 'Floating Wall Media Console', category: 'Storage', priceINR: 26000, dimensions: '2100 x 400 x 450 mm', fileName: 'floating_media_unit.glb', fileSizeKB: 1320, color: '#1e293b' },
    { id: 'ast-6', name: 'Monolithic Dining Table (6-Seater)', category: 'Dining', priceINR: 36000, dimensions: '1800 x 900 x 760 mm', fileName: 'monolithic_dining.glb', fileSizeKB: 1840, color: '#475569' }
];

const RECENT_SPACES: SpacePreset[] = [
    { id: 'spc-1', title: 'Contemporary 2BHK Living', subtitle: 'Open layout • Chennai Apartment', prompt: 'Reconstruct modern 2BHK living room with sectional sofa, walnut coffee table, and media unit', areaSqFt: 620, dimensions: '7.5m x 6.0m' },
    { id: 'spc-2', title: 'Executive Studio & Office', subtitle: 'Workstations • Meeting zone', prompt: 'Add 2 oak workstations with ergonomic chairs, conference hub, and lounge seating', areaSqFt: 480, dimensions: '6.0m x 5.2m' },
    { id: 'spc-3', title: 'Scandinavian Minimal Studio', subtitle: 'Neutral tones • Open kitchen', prompt: 'Scandinavian open-plan studio with dining nook and modular storage', areaSqFt: 540, dimensions: '6.8m x 5.5m' },
    { id: 'spc-4', title: 'Luxury Villa Master Suite', subtitle: 'Spacious • Ambient lighting', prompt: 'Luxury master bedroom suite with king bed, dressing area, and accent armchairs', areaSqFt: 720, dimensions: '8.0m x 6.5m' }
];

export function Slice3DShowcase() {
    // Left Drawer (Gemini style)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Modals
    const [activeModal, setActiveModal] = useState<'vault' | 'boq' | 'specs' | 'history' | null>(null);

    // Camera view mode (3D isometric vs 2D top-down)
    const [cameraMode, setCameraMode] = useState<'3d' | 'top'>('3d');

    // Chat / AI Co-Pilot State
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: 'init-msg',
            sender: 'ai',
            text: 'Welcome to Slice3D. I am your Spatial AI Co-Pilot. Attach a 2D floor plan image or describe your dream space, and I will construct the 3D room in real-time.',
            timestamp: 'Just now'
        }
    ]);
    const [inputPrompt, setInputPrompt] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [attachedFloorPlan, setAttachedFloorPlan] = useState<{ url: string; name: string } | null>(null);

    // Active Room Specifications
    const [roomSpecs, setRoomSpecs] = useState({
        name: 'Contemporary 2BHK Living',
        width: 7.5,
        depth: 6.0,
        height: 2.8,
        areaSqFt: 620
    });

    // 3D Asset Vault (localStorage persistence)
    const [assetVault, setAssetVault] = useState<StoredAsset[]>(() => {
        try {
            const saved = localStorage.getItem('slice3d_asset_vault');
            return saved ? JSON.parse(saved) : DEFAULT_VAULT_ASSETS;
        } catch {
            return DEFAULT_VAULT_ASSETS;
        }
    });

    // Active Furniture in 3D scene
    const [furnitureList, setFurnitureList] = useState<PlacedFurniture[]>([
        { id: 'f-1', assetId: 'ast-1', name: 'Curved Bouclé Sectional Sofa', category: 'Seating', priceINR: 48500, position: [-1.2, 0.4, 0.5], rotationY: 0, dimensions: [2.6, 0.78, 0.95], color: '#e2e8f0' },
        { id: 'f-2', assetId: 'ast-2', name: 'Walnut & Travertine Coffee Table', category: 'Tables', priceINR: 18200, position: [-1.2, 0.22, -0.6], rotationY: 0, dimensions: [1.2, 0.42, 0.6], color: '#78350f' },
        { id: 'f-3', assetId: 'ast-5', name: 'Floating Wall Media Console', category: 'Storage', priceINR: 26000, position: [-1.2, 0.25, -2.7], rotationY: 0, dimensions: [2.1, 0.45, 0.4], color: '#1e293b' },
        { id: 'f-4', assetId: 'ast-6', name: 'Monolithic Dining Table (6-Seater)', category: 'Dining', priceINR: 36000, position: [2.0, 0.38, 0.8], rotationY: 1.57, dimensions: [1.8, 0.76, 0.9], color: '#475569' }
    ]);

    // New 3D Asset Form State
    const [newAssetName, setNewAssetName] = useState('');
    const [newAssetCategory, setNewAssetCategory] = useState('Seating');
    const [newAssetPrice, setNewAssetPrice] = useState('24000');
    const [newAssetDims, setNewAssetDims] = useState('1200 x 800 x 750 mm');
    const [newAssetFile, setNewAssetFile] = useState<File | null>(null);

    // Three.js References
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const roomGroupRef = useRef<THREE.Group | null>(null);
    const furnitureGroupRef = useRef<THREE.Group | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modelUploadInputRef = useRef<HTMLInputElement>(null);

    // Sync vault to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('slice3d_asset_vault', JSON.stringify(assetVault));
        } catch {
            // storage quota fallback
        }
    }, [assetVault]);

    // Financial Calculation for BOQ
    const boqSubtotal = furnitureList.reduce((sum, item) => sum + item.priceINR, 0);
    const gstRate = 0.18; // 18% GST (CGST 9% + SGST 9%)
    const gstAmount = Math.round(boqSubtotal * gstRate);
    const boqGrandTotal = boqSubtotal + gstAmount;

    // -------------------------------------------------------------------------
    // Three.js Scene Setup & Render Loop
    // -------------------------------------------------------------------------
    useEffect(() => {
        const container = canvasContainerRef.current;
        if (!container) return;

        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        // 1. Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);
        sceneRef.current = scene;

        // 2. Camera
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
        camera.position.set(11, 9, 13);
        camera.lookAt(0, 0.5, 0);
        cameraRef.current = camera;

        // 3. Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;

        // Clean any old canvas
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 4. OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 - 0.02; // Do not go underneath floor
        controls.minDistance = 4;
        controls.maxDistance = 30;
        controls.target.set(0, 0.5, 0);
        controlsRef.current = controls;

        // 5. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
        sunLight.position.set(14, 18, 12);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.bias = -0.0001;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 40;
        sunLight.shadow.camera.left = -10;
        sunLight.shadow.camera.right = 10;
        sunLight.shadow.camera.top = 10;
        sunLight.shadow.camera.bottom = -10;
        scene.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.45);
        fillLight.position.set(-12, 10, -10);
        scene.add(fillLight);

        // 6. Architectural Groups
        const roomGroup = new THREE.Group();
        scene.add(roomGroup);
        roomGroupRef.current = roomGroup;

        const furnitureGroup = new THREE.Group();
        scene.add(furnitureGroup);
        furnitureGroupRef.current = furnitureGroup;

        // 7. Ground Plane / Floor Grid
        const grid = new THREE.GridHelper(30, 30, 0xe2e8f0, 0xf1f5f9);
        grid.position.y = -0.01;
        scene.add(grid);

        // Resize Listener
        const handleResize = () => {
            if (!container || !rendererRef.current || !cameraRef.current) return;
            const w = container.clientWidth || window.innerWidth;
            const h = container.clientHeight || window.innerHeight;
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // Animation Loop
        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    // -------------------------------------------------------------------------
    // Reconstruct Room Geometry (Walls, Doors, Floor)
    // -------------------------------------------------------------------------
    const rebuildRoom = useCallback((width: number, depth: number, height: number) => {
        const roomGroup = roomGroupRef.current;
        if (!roomGroup) return;

        // Clear previous room geometry
        while (roomGroup.children.length > 0) {
            const child = roomGroup.children[0] as THREE.Mesh;
            roomGroup.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
            } else if (child.material) {
                child.material.dispose();
            }
        }

        // 1. Warm Architectural Floor
        const floorGeo = new THREE.BoxGeometry(width, 0.1, depth);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0xfdfaf7,
            roughness: 0.35,
            metalness: 0.05
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.y = -0.05;
        floor.receiveShadow = true;
        roomGroup.add(floor);

        // Floor Border Trim
        const borderGeo = new THREE.BoxGeometry(width + 0.1, 0.04, depth + 0.1);
        const borderMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
        const border = new THREE.Mesh(borderGeo, borderMat);
        border.position.y = -0.07;
        roomGroup.add(border);

        // 2. Extruded Walls
        const wallThickness = 0.22;
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.85,
            metalness: 0.02
        });
        const accentWallMat = new THREE.MeshStandardMaterial({
            color: 0xf1f5f9,
            roughness: 0.75
        });

        // Back Wall (North)
        const northWallGeo = new THREE.BoxGeometry(width, height, wallThickness);
        const northWall = new THREE.Mesh(northWallGeo, accentWallMat);
        northWall.position.set(0, height / 2, -depth / 2 - wallThickness / 2);
        northWall.castShadow = true;
        northWall.receiveShadow = true;
        roomGroup.add(northWall);

        // Left Wall (West - With window opening simulation)
        const leftWallGeo = new THREE.BoxGeometry(wallThickness, height, depth);
        const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
        leftWall.position.set(-width / 2 - wallThickness / 2, height / 2, 0);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        roomGroup.add(leftWall);

        // Glass Window Panel on Left Wall
        const glassGeo = new THREE.BoxGeometry(0.04, height * 0.5, depth * 0.4);
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0x93c5fd,
            transparent: true,
            opacity: 0.3,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.8
        });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.set(-width / 2 - 0.05, height * 0.55, 0);
        roomGroup.add(glass);

        // Decorative Skirting Board
        const skirtingGeo = new THREE.BoxGeometry(width, 0.1, 0.04);
        const skirtingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
        const skirtingNorth = new THREE.Mesh(skirtingGeo, skirtingMat);
        skirtingNorth.position.set(0, 0.05, -depth / 2 + 0.02);
        roomGroup.add(skirtingNorth);
    }, []);

    // -------------------------------------------------------------------------
    // Reconstruct Furniture Meshes in 3D Scene
    // -------------------------------------------------------------------------
    const rebuildFurnitureMeshes = useCallback((list: PlacedFurniture[]) => {
        const group = furnitureGroupRef.current;
        if (!group) return;

        // Clear existing furniture meshes
        while (group.children.length > 0) {
            const child = group.children[0] as THREE.Mesh;
            group.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
            } else if (child.material) {
                child.material.dispose();
            }
        }

        list.forEach(item => {
            const itemGroup = new THREE.Group();
            itemGroup.position.set(...item.position);
            itemGroup.rotation.y = item.rotationY;

            const [w, h, d] = item.dimensions;
            const mainColor = new THREE.Color(item.color);

            if (item.category === 'Seating') {
                // Procedural Modern Sectional / Sofa
                const seatGeo = new THREE.BoxGeometry(w, h * 0.45, d);
                const seatMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.85 });
                const seat = new THREE.Mesh(seatGeo, seatMat);
                seat.position.y = 0;
                seat.castShadow = true;
                seat.receiveShadow = true;
                itemGroup.add(seat);

                // Backrest
                const backGeo = new THREE.BoxGeometry(w, h * 0.6, d * 0.25);
                const back = new THREE.Mesh(backGeo, seatMat);
                back.position.set(0, h * 0.35, -d * 0.37);
                back.castShadow = true;
                itemGroup.add(back);

                // Soft Throw Cushions
                const cushionGeo = new THREE.BoxGeometry(0.5, 0.35, 0.15);
                const cushionMat = new THREE.MeshStandardMaterial({ color: 0xff5c00, roughness: 0.9 });
                const cushion1 = new THREE.Mesh(cushionGeo, cushionMat);
                cushion1.position.set(-w * 0.3, h * 0.3, -d * 0.25);
                cushion1.rotation.y = 0.2;
                itemGroup.add(cushion1);

                // Sleek Legs
                const legGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.15);
                const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
                const legOffsets = [
                    [w * 0.45, -h * 0.25, d * 0.4],
                    [-w * 0.45, -h * 0.25, d * 0.4],
                    [w * 0.45, -h * 0.25, -d * 0.4],
                    [-w * 0.45, -h * 0.25, -d * 0.4]
                ];
                legOffsets.forEach(pos => {
                    const leg = new THREE.Mesh(legGeo, legMat);
                    leg.position.set(pos[0], pos[1], pos[2]);
                    leg.castShadow = true;
                    itemGroup.add(leg);
                });
            } else if (item.category === 'Tables') {
                // Table Top
                const topGeo = new THREE.BoxGeometry(w, 0.05, d);
                const topMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.25, metalness: 0.1 });
                const top = new THREE.Mesh(topGeo, topMat);
                top.position.y = h * 0.4;
                top.castShadow = true;
                top.receiveShadow = true;
                itemGroup.add(top);

                // Minimalist Plinth / Metal Legs
                const baseGeo = new THREE.BoxGeometry(w * 0.8, h * 0.38, d * 0.6);
                const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
                const base = new THREE.Mesh(baseGeo, baseMat);
                base.position.y = 0;
                base.castShadow = true;
                itemGroup.add(base);
            } else if (item.category === 'Office') {
                // Desk Tabletop
                const deskTopGeo = new THREE.BoxGeometry(w, 0.06, d);
                const deskMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.4 });
                const deskTop = new THREE.Mesh(deskTopGeo, deskMat);
                deskTop.position.y = h * 0.4;
                deskTop.castShadow = true;
                itemGroup.add(deskTop);

                // Minimal Steel Frame
                const frameGeo = new THREE.BoxGeometry(w * 0.95, h * 0.8, d * 0.9);
                const wireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
                const frame = new THREE.Mesh(frameGeo, wireMat);
                frame.position.y = 0;
                frame.castShadow = true;
                itemGroup.add(frame);

                // Laptop on Desk
                const laptopGeo = new THREE.BoxGeometry(0.35, 0.02, 0.25);
                const laptopMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
                const laptop = new THREE.Mesh(laptopGeo, laptopMat);
                laptop.position.set(0, h * 0.45, 0);
                itemGroup.add(laptop);
            } else {
                // Generic High-Precision Architectural Volume
                const boxGeo = new THREE.BoxGeometry(w, h, d);
                const boxMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.5, metalness: 0.1 });
                const box = new THREE.Mesh(boxGeo, boxMat);
                box.castShadow = true;
                box.receiveShadow = true;
                itemGroup.add(box);
            }

            group.add(itemGroup);
        });
    }, []);

    // Trigger Initial Room & Furniture Build
    useEffect(() => {
        rebuildRoom(roomSpecs.width, roomSpecs.depth, roomSpecs.height);
        rebuildFurnitureMeshes(furnitureList);
    }, [roomSpecs, furnitureList, rebuildRoom, rebuildFurnitureMeshes]);

    // -------------------------------------------------------------------------
    // Camera View Mode (3D Perspective vs 2D Top-Down)
    // -------------------------------------------------------------------------
    const toggleCameraView = () => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (!camera || !controls) return;

        if (cameraMode === '3d') {
            // Switch to 2D Top-Down View
            camera.position.set(0, 18, 0.01);
            controls.target.set(0, 0, 0);
            controls.enableRotate = false; // lock rotation in top-down
            setCameraMode('top');
        } else {
            // Switch to 3D Isometric View
            camera.position.set(11, 9, 13);
            controls.target.set(0, 0.5, 0);
            controls.enableRotate = true;
            setCameraMode('3d');
        }
        controls.update();
    };

    // Reset Camera
    const resetCamera = () => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (!camera || !controls) return;
        camera.position.set(11, 9, 13);
        controls.target.set(0, 0.5, 0);
        controls.enableRotate = true;
        controls.update();
        setCameraMode('3d');
    };

    // Take High-DPI Snapshot
    const handleSnapshot = () => {
        const renderer = rendererRef.current;
        if (!renderer) return;
        const dataUrl = renderer.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Slice3D_Render_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    // -------------------------------------------------------------------------
    // Spatial AI Co-Pilot Execution
    // -------------------------------------------------------------------------
    const handleSendPrompt = (promptText?: string) => {
        const query = (promptText || inputPrompt).trim();
        if (!query && !attachedFloorPlan) return;

        const userMsg: ChatMessage = {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text: query || 'Analyze attached 2D floor plan drawing and extrude 3D space',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            floorPlanUrl: attachedFloorPlan?.url,
            floorPlanName: attachedFloorPlan?.name
        };

        setChatMessages(prev => [...prev, userMsg]);
        setInputPrompt('');
        setIsAiThinking(true);

        const currentAttached = attachedFloorPlan;
        setAttachedFloorPlan(null); // clear attachment after send

        // Simulate Spatial AI Parser & Room Extrusion
        setTimeout(() => {
            setIsAiThinking(false);
            const lower = query.toLowerCase();

            if (lower.includes('workstation') || lower.includes('office')) {
                // Reconfigure to Executive Office Layout
                setRoomSpecs({ name: 'Executive Studio & Office', width: 6.8, depth: 5.5, height: 2.8, areaSqFt: 480 });
                setFurnitureList([
                    { id: 'f-off-1', assetId: 'ast-3', name: 'Minimalist Oak Workstation Desk', category: 'Office', priceINR: 22000, position: [-1.2, 0.4, 0], rotationY: 0, dimensions: [1.6, 0.75, 0.8], color: '#d97706' },
                    { id: 'f-off-2', assetId: 'ast-3', name: 'Minimalist Oak Workstation Desk', category: 'Office', priceINR: 22000, position: [1.2, 0.4, 0], rotationY: 0, dimensions: [1.6, 0.75, 0.8], color: '#d97706' },
                    { id: 'f-off-3', assetId: 'ast-4', name: 'Herman Miller Style Mesh Chair', category: 'Office', priceINR: 19500, position: [-1.2, 0.4, 0.9], rotationY: 3.14, dimensions: [0.65, 1.0, 0.65], color: '#334155' },
                    { id: 'f-off-4', assetId: 'ast-4', name: 'Herman Miller Style Mesh Chair', category: 'Office', priceINR: 19500, position: [1.2, 0.4, 0.9], rotationY: 3.14, dimensions: [0.65, 1.0, 0.65], color: '#334155' },
                    { id: 'f-off-5', assetId: 'ast-5', name: 'Floating Wall Storage Unit', category: 'Storage', priceINR: 26000, position: [0, 0.25, -2.4], rotationY: 0, dimensions: [2.8, 0.45, 0.4], color: '#1e293b' }
                ]);

                setChatMessages(prev => [...prev, {
                    id: `ai-${Date.now()}`,
                    sender: 'ai',
                    text: '✨ Configured Executive Office suite with dual ergonomic oak workstations, task seating, and storage. Updated Live BOQ: ₹1,09,000 + GST.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    actionApplied: 'Executive Office Setup'
                }]);
            } else if (lower.includes('clear') || lower.includes('empty')) {
                // Clear all furniture
                setFurnitureList([]);
                setChatMessages(prev => [...prev, {
                    id: `ai-${Date.now()}`,
                    sender: 'ai',
                    text: '🧹 Cleared all furniture items. Architectural room shell ready for new asset placement.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    actionApplied: 'Room Emptied'
                }]);
            } else if (currentAttached || lower.includes('plan') || lower.includes('2bhk')) {
                // Reconstruct from Floor Plan
                setRoomSpecs({ name: 'Extruded 2BHK Space', width: 7.8, depth: 6.2, height: 2.8, areaSqFt: 640 });
                setFurnitureList([
                    { id: 'f-fp-1', assetId: 'ast-1', name: 'Curved Bouclé Sectional Sofa', category: 'Seating', priceINR: 48500, position: [-1.5, 0.4, 0.8], rotationY: 0, dimensions: [2.6, 0.78, 0.95], color: '#e2e8f0' },
                    { id: 'f-fp-2', assetId: 'ast-2', name: 'Walnut & Travertine Coffee Table', category: 'Tables', priceINR: 18200, position: [-1.5, 0.22, -0.4], rotationY: 0, dimensions: [1.2, 0.42, 0.6], color: '#78350f' },
                    { id: 'f-fp-3', assetId: 'ast-6', name: 'Monolithic Dining Table (6-Seater)', category: 'Dining', priceINR: 36000, position: [2.2, 0.38, 0.5], rotationY: 1.57, dimensions: [1.8, 0.76, 0.9], color: '#475569' },
                    { id: 'f-fp-4', assetId: 'ast-5', name: 'Floating Wall Media Console', category: 'Storage', priceINR: 26000, position: [-1.5, 0.25, -2.8], rotationY: 0, dimensions: [2.1, 0.45, 0.4], color: '#1e293b' }
                ]);

                setChatMessages(prev => [...prev, {
                    id: `ai-${Date.now()}`,
                    sender: 'ai',
                    text: currentAttached 
                        ? `📐 Successfully parsed floor plan "${currentAttached.name}". Extruded 640 sq.ft perimeter walls, zoned living & dining spaces, and staged 4 architectural assets.`
                        : '✨ Extruded contemporary 2BHK living layout with sectional lounge, travertine table, and dining suite. Total estimated BOQ: ₹1,28,700.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    actionApplied: 'Floor Plan Extruded'
                }]);
            } else {
                // General styling prompt
                setChatMessages(prev => [...prev, {
                    id: `ai-${Date.now()}`,
                    sender: 'ai',
                    text: `Applied "${query}". Optimized spatial clearances, lighting ambience, and staged matching architectural elements in real-time.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        }, 800);
    };

    // Stage Asset from Vault into 3D Scene
    const stageAssetFromVault = (asset: StoredAsset) => {
        const offset = (furnitureList.length % 5) * 0.6 - 1.2;
        const newItem: PlacedFurniture = {
            id: `f-${Date.now()}`,
            assetId: asset.id,
            name: asset.name,
            category: asset.category,
            priceINR: asset.priceINR,
            position: [offset, 0.4, 0],
            rotationY: 0,
            dimensions: [1.2, 0.6, 0.8],
            color: asset.color
        };

        setFurnitureList(prev => [...prev, newItem]);
        setActiveModal(null);
        setIsDrawerOpen(false);

        // Feedback in chat
        setChatMessages(prev => [...prev, {
            id: `stg-${Date.now()}`,
            sender: 'ai',
            text: `📦 Staged "${asset.name}" into the active 3D coordinates. Added ₹${asset.priceINR.toLocaleString('en-IN')} to Live BOQ.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

    // Handle Upload of New 3D Asset
    const handleSaveNewAsset = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAssetName) return;

        const newAsset: StoredAsset = {
            id: `custom-${Date.now()}`,
            name: newAssetName,
            category: newAssetCategory,
            priceINR: parseInt(newAssetPrice, 10) || 15000,
            dimensions: newAssetDims || '1000 x 800 x 750 mm',
            fileName: newAssetFile ? newAssetFile.name : `${newAssetName.toLowerCase().replace(/\s+/g, '_')}.glb`,
            fileSizeKB: newAssetFile ? Math.round(newAssetFile.size / 1024) : 1850,
            color: '#ff5c00',
            isCustom: true
        };

        setAssetVault(prev => [newAsset, ...prev]);
        setNewAssetName('');
        setNewAssetPrice('24000');
        setNewAssetFile(null);
        alert(`Saved "${newAsset.name}" to your 3D Asset Vault!`);
    };

    // Load a Space Preset
    const loadPresetSpace = (preset: SpacePreset) => {
        setIsDrawerOpen(false);
        handleSendPrompt(preset.prompt);
    };

    // Get the latest message for floating card
    const latestAiMessage = [...chatMessages].reverse().find(m => m.sender === 'ai') || chatMessages[0];

    return (
        <div className="relative w-screen h-[100dvh] overflow-hidden bg-slate-900 font-sans select-none">
            {/* ================================================================= */}
            {/* 1. PRIMARY LIVE 3D VIEWPORT (Full Screen WebGL) */}
            {/* ================================================================= */}
            <div 
                ref={canvasContainerRef} 
                className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none z-0"
            />

            {/* ================================================================= */}
            {/* 2. FLOATING TOP HEADER BAR */}
            {/* ================================================================= */}
            <header className="absolute top-0 inset-x-0 z-20 px-3 py-3 sm:px-5 sm:py-4 flex items-center justify-between pointer-events-none">
                {/* Left: Gemini Menu Button + Logo */}
                <div className="flex items-center gap-2.5 pointer-events-auto">
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-center text-slate-800 hover:bg-white hover:scale-105 active:scale-95 transition"
                        title="Open Menu"
                        aria-label="Open Navigation Menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/80 px-3 py-1.5 rounded-full shadow-md">
                        <img 
                            src={logoImg} 
                            alt="A Generative Slice" 
                            className="w-6 h-6 rounded-full object-cover border border-orange-200" 
                        />
                        <div className="flex items-center gap-1.5">
                            <span className="font-extrabold tracking-tight text-slate-900 text-sm sm:text-base">
                                SLICE<span className="text-[#FF5C00]">3D</span>
                            </span>
                            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-[#FF5C00]">
                                AI STUDIO
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Quick Viewport Actions & Live BOQ Pill */}
                <div className="flex items-center gap-2 pointer-events-auto">
                    {/* Camera Mode 2D/3D */}
                    <button
                        onClick={toggleCameraView}
                        className="h-9 px-3 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white transition flex items-center gap-1.5"
                        title={cameraMode === '3d' ? 'Switch to 2D Floor Plan View' : 'Switch to 3D View'}
                    >
                        <Layers className="w-3.5 h-3.5 text-[#FF5C00]" />
                        <span className="hidden xs:inline">{cameraMode === '3d' ? '2D Plan' : '3D Orbit'}</span>
                    </button>

                    {/* Snapshot Button */}
                    <button
                        onClick={handleSnapshot}
                        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-slate-700 hover:text-[#FF5C00] hover:bg-white transition flex items-center justify-center"
                        title="Take High-DPI Snapshot"
                    >
                        <Camera className="w-4 h-4" />
                    </button>

                    {/* Live BOQ Pill */}
                    <button
                        onClick={() => setActiveModal('boq')}
                        className="h-9 px-3.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-md shadow-md text-xs font-bold transition flex items-center gap-1.5 group"
                    >
                        <Calculator className="w-3.5 h-3.5 text-[#FF5C00]" />
                        <span>₹{boqGrandTotal.toLocaleString('en-IN')}</span>
                    </button>
                </div>
            </header>

            {/* ================================================================= */}
            {/* 3. GEMINI-STYLE LEFT SLIDE-OUT DRAWER MENU */}
            {/* ================================================================= */}
            {isDrawerOpen && (
                <div 
                    onClick={() => setIsDrawerOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity"
                />
            )}

            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-[82vw] max-w-[340px] bg-white border-r border-slate-200 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
                    isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Drawer Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <img src={logoImg} alt="Logo" className="w-7 h-7 rounded-full object-cover" />
                        <div>
                            <div className="font-extrabold text-slate-900 text-base leading-none">
                                SLICE<span className="text-[#FF5C00]">3D</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">A Generative Slice</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsDrawerOpen(false)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* "+ New Space" Gemini Action */}
                    <button
                        onClick={() => {
                            setIsDrawerOpen(false);
                            handleSendPrompt('Clear all furniture and reset to clean 2BHK room perimeter');
                        }}
                        className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50/50 hover:border-orange-200 text-slate-800 hover:text-[#FF5C00] font-semibold text-xs transition flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4 text-[#FF5C00]" />
                        <span>Start New 3D Space</span>
                    </button>

                    {/* Section: Recent Spaces / History */}
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
                            Recent Architectural Spaces
                        </div>
                        <div className="space-y-1">
                            {RECENT_SPACES.map(space => (
                                <button
                                    key={space.id}
                                    onClick={() => loadPresetSpace(space)}
                                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 transition group flex items-center justify-between"
                                >
                                    <div className="truncate pr-2">
                                        <div className="text-xs font-semibold text-slate-800 group-hover:text-[#FF5C00] truncate">
                                            {space.title}
                                        </div>
                                        <div className="text-[10px] text-slate-400">
                                            {space.subtitle} • {space.areaSqFt} sq ft
                                        </div>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FF5C00] group-hover:translate-x-0.5 transition" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Section: Management Tools */}
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
                            Management & BOQ
                        </div>
                        <div className="space-y-1">
                            <button
                                onClick={() => { setIsDrawerOpen(false); setActiveModal('vault'); }}
                                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center justify-between text-xs font-semibold text-slate-700"
                            >
                                <div className="flex items-center gap-2.5">
                                    <Box className="w-4 h-4 text-[#FF5C00]" />
                                    <span>3D Asset Vault</span>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                                    {assetVault.length}
                                </span>
                            </button>

                            <button
                                onClick={() => { setIsDrawerOpen(false); setActiveModal('boq'); }}
                                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center justify-between text-xs font-semibold text-slate-700"
                            >
                                <div className="flex items-center gap-2.5">
                                    <Calculator className="w-4 h-4 text-emerald-600" />
                                    <span>Bill of Quantities (BOQ)</span>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                                    ₹{boqGrandTotal.toLocaleString('en-IN')}
                                </span>
                            </button>

                            <button
                                onClick={() => { setIsDrawerOpen(false); setActiveModal('specs'); }}
                                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center justify-between text-xs font-semibold text-slate-700"
                            >
                                <div className="flex items-center gap-2.5">
                                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                                    <span>Room Dimensions & Specs</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {roomSpecs.width}m × {roomSpecs.depth}m
                                </span>
                            </button>

                            <button
                                onClick={() => { setIsDrawerOpen(false); resetCamera(); }}
                                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-2.5 text-xs font-semibold text-slate-700"
                            >
                                <RotateCcw className="w-4 h-4 text-slate-400" />
                                <span>Reset Camera View</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
                    A Generative Slice • Nungambakkam, Chennai<br />
                    <span className="text-[10px] text-slate-300">Slice3D Spatial AI CAD v2.4</span>
                </div>
            </aside>

            {/* ================================================================= */}
            {/* 4. DOCKED BOTTOM CHAT SCREEN (Gemini Style) */}
            {/* ================================================================= */}
            <div className="absolute bottom-0 inset-x-0 z-30 p-3 pb-6 sm:p-5 flex flex-col items-center pointer-events-none">
                <div className="w-full max-w-2xl space-y-2 pointer-events-auto">
                    
                    {/* Floating AI Assistant Response Card */}
                    {latestAiMessage && (
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-3 sm:p-3.5 transition-all duration-300">
                            <div className="flex items-start justify-between gap-2.5">
                                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-[#FF5C00] shrink-0 mt-0.5">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="text-xs text-slate-700 leading-relaxed">
                                        <p className="line-clamp-2 sm:line-clamp-3">
                                            {latestAiMessage.text}
                                        </p>
                                        {latestAiMessage.actionApplied && (
                                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>{latestAiMessage.actionApplied}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setActiveModal('history')}
                                    className="text-[10px] font-semibold text-slate-400 hover:text-slate-800 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition shrink-0"
                                >
                                    History ({chatMessages.length})
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Quick Suggestion Chips (Swipeable Horizontal Bar) */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                        <button
                            onClick={() => handleSendPrompt('Reconstruct 2BHK modern living room with open-plan kitchen')}
                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-[11px] font-semibold text-slate-700 hover:border-orange-300 hover:text-[#FF5C00] transition active:scale-95"
                        >
                            ✨ 2BHK Living Room
                        </button>
                        <button
                            onClick={() => handleSendPrompt('Add 2 ergonomic workstations with Herman Miller task chairs')}
                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-[11px] font-semibold text-slate-700 hover:border-orange-300 hover:text-[#FF5C00] transition active:scale-95"
                        >
                            💼 Add Workstations
                        </button>
                        <button
                            onClick={() => handleSendPrompt('Scandinavian open studio apartment layout')}
                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-[11px] font-semibold text-slate-700 hover:border-orange-300 hover:text-[#FF5C00] transition active:scale-95"
                        >
                            🌿 Scandinavian Studio
                        </button>
                        <button
                            onClick={() => handleSendPrompt('Clear all furniture and make room empty')}
                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-[11px] font-semibold text-slate-500 hover:text-red-500 transition active:scale-95"
                        >
                            🧹 Clear Room
                        </button>
                    </div>

                    {/* Gemini Prompt Bar */}
                    <div className="bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-slate-200 p-1.5 sm:p-2 flex items-center gap-1.5">
                        {/* Floor Plan Attachment Button */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const url = URL.createObjectURL(file);
                                    setAttachedFloorPlan({ url, name: file.name });
                                }
                            }}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-2 rounded-full transition ${
                                attachedFloorPlan 
                                    ? 'bg-orange-100 text-[#FF5C00]' 
                                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                            title="Attach 2D Floor Plan Image"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>

                        {/* Attachment Thumbnail Chip inside Input Bar */}
                        {attachedFloorPlan && (
                            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 pl-1 pr-2 py-0.5 rounded-full max-w-[130px] shrink-0">
                                <img 
                                    src={attachedFloorPlan.url} 
                                    alt="Floor plan" 
                                    className="w-5 h-5 rounded-full object-cover" 
                                />
                                <span className="text-[10px] font-bold text-[#FF5C00] truncate">
                                    {attachedFloorPlan.name}
                                </span>
                                <button
                                    onClick={() => setAttachedFloorPlan(null)}
                                    className="text-orange-400 hover:text-orange-700 ml-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {/* Input Field */}
                        <input
                            type="text"
                            value={inputPrompt}
                            onChange={e => setInputPrompt(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendPrompt()}
                            placeholder={attachedFloorPlan ? 'Describe how to build this plan...' : 'Ask Slice3D to design or place furniture...'}
                            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 px-2 py-1"
                        />

                        {/* Send Button */}
                        <button
                            onClick={() => handleSendPrompt()}
                            disabled={isAiThinking || (!inputPrompt.trim() && !attachedFloorPlan)}
                            className="w-9 h-9 rounded-full bg-[#FF5C00] hover:bg-[#e05200] disabled:opacity-40 disabled:hover:bg-[#FF5C00] text-white flex items-center justify-center transition active:scale-95 shadow-md shrink-0"
                            title="Send Prompt"
                        >
                            {isAiThinking ? (
                                <Sparkles className="w-4 h-4 animate-spin text-white" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* ================================================================= */}
            {/* 5. MODALS (Asset Vault, Live BOQ, Chat History, Specs) */}
            {/* ================================================================= */}
            {activeModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                {activeModal === 'vault' && <Box className="w-5 h-5 text-[#FF5C00]" />}
                                {activeModal === 'boq' && <Calculator className="w-5 h-5 text-emerald-600" />}
                                {activeModal === 'history' && <Bot className="w-5 h-5 text-blue-600" />}
                                {activeModal === 'specs' && <ShieldCheck className="w-5 h-5 text-indigo-600" />}
                                <h3 className="font-extrabold text-slate-900 text-base">
                                    {activeModal === 'vault' && '3D Asset Vault'}
                                    {activeModal === 'boq' && 'Bill of Quantities (BOQ)'}
                                    {activeModal === 'history' && 'Conversation History'}
                                    {activeModal === 'specs' && 'Room Blueprint Specs'}
                                </h3>
                            </div>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 overflow-y-auto flex-1">
                            
                            {/* --- 3D ASSET VAULT MODAL --- */}
                            {activeModal === 'vault' && (
                                <div className="space-y-6">
                                    {/* Upload Form */}
                                    <form onSubmit={handleSaveNewAsset} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                                Add New 3D Model File (.glb, .gltf)
                                            </span>
                                            <span className="text-[10px] text-slate-400">Saved to Local Vault</span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Product Name</label>
                                                <input 
                                                    type="text" 
                                                    value={newAssetName} 
                                                    onChange={e => setNewAssetName(e.target.value)} 
                                                    placeholder="e.g. Marble Top Dining Table" 
                                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#FF5C00]"
                                                    required 
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Category</label>
                                                <select 
                                                    value={newAssetCategory} 
                                                    onChange={e => setNewAssetCategory(e.target.value)} 
                                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#FF5C00]"
                                                >
                                                    <option>Seating</option>
                                                    <option>Tables</option>
                                                    <option>Office</option>
                                                    <option>Storage</option>
                                                    <option>Dining</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Price (₹ INR)</label>
                                                <input 
                                                    type="number" 
                                                    value={newAssetPrice} 
                                                    onChange={e => setNewAssetPrice(e.target.value)} 
                                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#FF5C00]" 
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Dimensions (W x D x H)</label>
                                                <input 
                                                    type="text" 
                                                    value={newAssetDims} 
                                                    onChange={e => setNewAssetDims(e.target.value)} 
                                                    placeholder="1500 x 800 x 750 mm" 
                                                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#FF5C00]" 
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <input 
                                                type="file" 
                                                ref={modelUploadInputRef} 
                                                accept=".glb,.gltf,.obj" 
                                                className="hidden" 
                                                onChange={e => e.target.files?.[0] && setNewAssetFile(e.target.files[0])} 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => modelUploadInputRef.current?.click()}
                                                className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-1.5"
                                            >
                                                <Upload className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{newAssetFile ? newAssetFile.name : 'Choose .glb / .gltf'}</span>
                                            </button>

                                            <button 
                                                type="submit" 
                                                className="text-xs font-bold text-white bg-[#FF5C00] hover:bg-[#e05200] px-4 py-1.5 rounded-xl transition"
                                            >
                                                Save to Vault
                                            </button>
                                        </div>
                                    </form>

                                    {/* Asset Catalog Grid */}
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
                                            Stored Assets ({assetVault.length})
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {assetVault.map(asset => (
                                                <div 
                                                    key={asset.id} 
                                                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-orange-200 hover:shadow-sm transition flex flex-col justify-between"
                                                >
                                                    <div>
                                                        <div className="flex items-start justify-between gap-1 mb-1">
                                                            <div className="font-bold text-slate-800 text-xs">
                                                                {asset.name}
                                                            </div>
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                                                                {asset.category}
                                                            </span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 mb-2">
                                                            ₹{asset.priceINR.toLocaleString('en-IN')} • {asset.dimensions}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => stageAssetFromVault(asset)}
                                                        className="w-full py-1.5 rounded-xl bg-orange-50 hover:bg-[#FF5C00] text-[#FF5C00] hover:text-white font-bold text-[11px] transition flex items-center justify-center gap-1"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        <span>Stage in 3D Scene</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- LIVE BILL OF QUANTITIES (BOQ) MODAL --- */}
                            {activeModal === 'boq' && (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                                                    <th className="pb-2">Item</th>
                                                    <th className="pb-2">Category</th>
                                                    <th className="pb-2 text-right">Price</th>
                                                    <th className="pb-2 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {furnitureList.map(item => (
                                                    <tr key={item.id} className="text-slate-700">
                                                        <td className="py-2.5 font-semibold text-slate-800">{item.name}</td>
                                                        <td className="py-2.5 text-slate-500">{item.category}</td>
                                                        <td className="py-2.5 text-right font-bold text-slate-900">
                                                            ₹{item.priceINR.toLocaleString('en-IN')}
                                                        </td>
                                                        <td className="py-2.5 text-center">
                                                            <button
                                                                onClick={() => setFurnitureList(prev => prev.filter(f => f.id !== item.id))}
                                                                className="text-slate-300 hover:text-red-500 transition p-1"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Cost Summary Box */}
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                                        <div className="flex justify-between text-slate-600">
                                            <span>Subtotal ({furnitureList.length} items)</span>
                                            <span className="font-semibold">₹{boqSubtotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-600">
                                            <span>Statutory GST (18%)</span>
                                            <span className="font-semibold">₹{gstAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
                                            <span>Grand Total (INR)</span>
                                            <span className="text-[#FF5C00]">₹{boqGrandTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    {/* WhatsApp Quotation Action */}
                                    <a
                                        href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi Slice3D! I would like to order the staged BOQ quotation for ${roomSpecs.name}. Total: ₹${boqGrandTotal.toLocaleString('en-IN')}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center block transition shadow-md"
                                    >
                                        Request Official Quotation on WhatsApp
                                    </a>
                                </div>
                            )}

                            {/* --- CHAT HISTORY MODAL --- */}
                            {activeModal === 'history' && (
                                <div className="space-y-3">
                                    {chatMessages.map(msg => (
                                        <div 
                                            key={msg.id} 
                                            className={`p-3 rounded-2xl text-xs ${
                                                msg.sender === 'user' 
                                                    ? 'bg-slate-100 ml-8 text-slate-800' 
                                                    : 'bg-orange-50/70 border border-orange-100 mr-8 text-slate-800'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                                                <span>{msg.sender === 'user' ? 'You' : 'Spatial AI Co-Pilot'}</span>
                                                <span>{msg.timestamp}</span>
                                            </div>
                                            {msg.floorPlanUrl && (
                                                <div className="mb-2">
                                                    <img 
                                                        src={msg.floorPlanUrl} 
                                                        alt="Attached plan" 
                                                        className="w-24 h-24 rounded-lg object-cover border border-slate-200 shadow-sm" 
                                                    />
                                                </div>
                                            )}
                                            <p className="leading-relaxed">{msg.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* --- ROOM SPECS MODAL --- */}
                            {activeModal === 'specs' && (
                                <div className="space-y-4 text-xs">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Room Width</div>
                                            <div className="text-base font-extrabold text-slate-800">{roomSpecs.width} Meters</div>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Room Depth</div>
                                            <div className="text-base font-extrabold text-slate-800">{roomSpecs.depth} Meters</div>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Ceiling Height</div>
                                            <div className="text-base font-extrabold text-slate-800">{roomSpecs.height} Meters</div>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Floor Area</div>
                                            <div className="text-base font-extrabold text-[#FF5C00]">{roomSpecs.areaSqFt} Sq.Ft</div>
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-slate-500 leading-relaxed">
                                        Wall thickness is standard 220mm brick masonry equivalent. Flooring incorporates high-durability architectural terrazzo with anti-reflective matte clear coat.
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Slice3DShowcase;
