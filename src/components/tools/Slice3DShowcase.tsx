import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
    Send, Paperclip, Image as ImageIcon, Bot, User, Sparkles, 
    Trash2, Box, Scissors, Camera, 
    Share2, CheckCircle2, FolderPlus,
    X
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';
import { RepoSyncBar } from '../RepoSyncBar';

export type ViewportMode = 'pbr' | 'clay' | 'wireframe';
export type ActiveView = 'studio' | 'vault' | 'boq';

// Custom / Stored 3D Asset Definition
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

// Initial Default Asset Vault Items
const DEFAULT_ASSETS: StoredAsset[] = [
    {
        id: 'asset_bed_teak',
        name: 'Executive Teak King Bed',
        category: 'Bedroom',
        priceINR: 48000,
        dimensions: '2.0m × 1.8m',
        fileName: 'teak_king_bed.glb',
        fileSizeKB: 38,
        color: '#854D0E'
    },
    {
        id: 'asset_sofa_fluted',
        name: 'Fluted Velvet 3-Seater Sofa',
        category: 'Living',
        priceINR: 36000,
        dimensions: '2.2m × 0.9m',
        fileName: 'fluted_sofa.glb',
        fileSizeKB: 42,
        color: '#FF5C00'
    },
    {
        id: 'asset_dining_oak',
        name: 'Minimalist White Oak Dining Table',
        category: 'Dining',
        priceINR: 28500,
        dimensions: '1.8m × 0.9m',
        fileName: 'white_oak_table.glb',
        fileSizeKB: 29,
        color: '#D97706'
    },
    {
        id: 'asset_workstation',
        name: 'Dual-Screen Ergonomic Desk',
        category: 'Office',
        priceINR: 22000,
        dimensions: '1.5m × 0.75m',
        fileName: 'executive_desk.glb',
        fileSizeKB: 34,
        color: '#1E293B'
    },
    {
        id: 'asset_luminaire',
        name: 'Recessed 3000K Architectural Lights',
        category: 'Lighting',
        priceINR: 14500,
        dimensions: '90mm diameter',
        fileName: 'luminaire_pack.glb',
        fileSizeKB: 18,
        color: '#F59E0B'
    }
];

// Placed 3D Object in the scene
interface PlacedObject {
    instanceId: string;
    asset: StoredAsset;
    position: [number, number, number];
}

// Chat Message Interface
interface ChatMessage {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
    attachedImage?: string;
    actionBadge?: string;
}

export const Slice3DShowcase: React.FC = () => {
    // Top-level View: Studio (Canvas + Chat), Vault (Product Adding), BOQ
    const [currentView, setCurrentView] = useState<ActiveView>('studio');

    // Canvas container ref
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasContainerRef = useRef<HTMLDivElement | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const floorPlanFileInputRef = useRef<HTMLInputElement | null>(null);
    const customAssetFileInputRef = useRef<HTMLInputElement | null>(null);

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
        animFrameId: number;
    } | null>(null);

    // Viewport Mode & Slicing State
    const [viewportMode, setViewportMode] = useState<ViewportMode>('pbr');
    const [sliceEnabled, setSliceEnabled] = useState<boolean>(false);
    const [sliceHeight, setSliceHeight] = useState<number>(1.8); // 0 to 3.5m
    const [fps, setFps] = useState<number>(60);
    const [polyCount, setPolyCount] = useState<number>(1840);

    // Asset Vault (Stored Products) - LocalStorage backed
    const [assetVault, setAssetVault] = useState<StoredAsset[]>(() => {
        try {
            const saved = localStorage.getItem('slice3d_asset_vault');
            return saved ? JSON.parse(saved) : DEFAULT_ASSETS;
        } catch {
            return DEFAULT_ASSETS;
        }
    });

    // New Asset Modal / Upload State
    const [newAssetName, setNewAssetName] = useState('');
    const [newAssetCategory, setNewAssetCategory] = useState('Living');
    const [newAssetPrice, setNewAssetPrice] = useState('32000');
    const [newAssetFile, setNewAssetFile] = useState<File | null>(null);
    const [isAddingAsset, setIsAddingAsset] = useState(false);

    // Placed 3D Objects in Current Floor
    const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([
        {
            instanceId: 'inst_1',
            asset: DEFAULT_ASSETS[0],
            position: [-2.4, 0.4, -1.8]
        },
        {
            instanceId: 'inst_2',
            asset: DEFAULT_ASSETS[1],
            position: [2.2, 0.35, 1.2]
        },
        {
            instanceId: 'inst_3',
            asset: DEFAULT_ASSETS[4],
            position: [0, 2.7, 0]
        }
    ]);

    // Active Room Floor Plan Dimensions (Extruded procedurally)
    const [roomDims, setRoomDims] = useState<{ name: string; w: number; d: number; h: number }>({
        name: 'Modern 2BHK Spatial Plan',
        w: 12,
        d: 10,
        h: 2.8
    });

    // Chat Environment State
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: 'msg_1',
            sender: 'assistant',
            text: 'Welcome to Slice3D! I can construct 3D environments from 2D floor plan images, stage custom assets from your vault, and calculate live Bill of Quantities. How would you like to build your space?',
            timestamp: 'Just now'
        }
    ]);
    const [promptInput, setPromptInput] = useState('');
    const [attachedFloorImage, setAttachedFloorImage] = useState<string | null>(null);
    const [isAiProcessing, setIsAiProcessing] = useState(false);

    // Save Asset Vault to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('slice3d_asset_vault', JSON.stringify(assetVault));
        } catch {}
    }, [assetVault]);

    // Auto-scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // -------------------------------------------------------------
    // Procedural Furniture Mesh Generator
    // -------------------------------------------------------------
    const createFurnitureMesh = (asset: StoredAsset): THREE.Group => {
        const group = new THREE.Group();
        group.name = `Placed_${asset.id}`;

        const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(asset.color),
            roughness: 0.35,
            metalness: 0.15
        });

        if (asset.category.toLowerCase().includes('bed')) {
            const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 1.8), mat);
            base.castShadow = true;
            group.add(base);

            const head = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.1, 1.8), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }));
            head.position.set(-1.0, 0.35, 0);
            head.castShadow = true;
            group.add(head);
        } else if (asset.category.toLowerCase().includes('sofa') || asset.category.toLowerCase().includes('living')) {
            const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 0.9), mat);
            seat.castShadow = true;
            group.add(seat);

            const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 0.25), mat);
            back.position.set(0, 0.35, -0.35);
            group.add(back);
        } else if (asset.category.toLowerCase().includes('dining') || asset.category.toLowerCase().includes('table')) {
            const top = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.9), mat);
            top.position.y = 0.35;
            group.add(top);

            const legMat = new THREE.MeshStandardMaterial({ color: 0x0F172A });
            [[-0.8, -0.35], [0.8, -0.35], [-0.8, 0.35], [0.8, 0.35]].forEach(([lx, lz]) => {
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7), legMat);
                leg.position.set(lx, 0, lz);
                group.add(leg);
            });
        } else if (asset.category.toLowerCase().includes('light')) {
            const pendant = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.35, 16), new THREE.MeshStandardMaterial({
                color: 0xF59E0B,
                emissive: 0xFF5C00,
                emissiveIntensity: 0.8
            }));
            pendant.rotation.x = Math.PI;
            group.add(pendant);
        } else {
            const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.75, 0.75), mat);
            box.castShadow = true;
            group.add(box);
        }

        return group;
    };

    // -------------------------------------------------------------
    // Rebuild Room & Placed Objects
    // -------------------------------------------------------------
    const buildRoom = useCallback(() => {
        const three = threeRefs.current;
        if (!three) return;

        // Clear room group
        while (three.roomGroup.children.length > 0) {
            three.roomGroup.remove(three.roomGroup.children[0]);
        }

        // 1. Floor Slab
        const floorGeom = new THREE.BoxGeometry(roomDims.w, 0.15, roomDims.d);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0xF8FAFC,
            roughness: 0.2,
            metalness: 0.05
        });
        const floorMesh = new THREE.Mesh(floorGeom, floorMat);
        floorMesh.position.y = -0.075;
        floorMesh.receiveShadow = true;
        three.roomGroup.add(floorMesh);

        // 2. Extruded Outer Walls
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0xE2E8F0,
            roughness: 0.85,
            metalness: 0.05
        });

        const halfW = roomDims.w / 2;
        const halfD = roomDims.d / 2;
        const wallH = roomDims.h;
        const wallT = 0.28;

        const wallConfigs = [
            // North wall
            { pos: [0, wallH / 2, -halfD], size: [roomDims.w, wallH, wallT] },
            // South wall
            { pos: [0, wallH / 2, halfD], size: [roomDims.w, wallH, wallT] },
            // West wall
            { pos: [-halfW, wallH / 2, 0], size: [wallT, wallH, roomDims.d] },
            // East wall
            { pos: [halfW, wallH / 2, 0], size: [wallT, wallH, roomDims.d] },
            // Interior partition
            { pos: [0, wallH / 2, 0], size: [wallT, wallH, roomDims.d * 0.6] }
        ];

        wallConfigs.forEach(w => {
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(w.size[0], w.size[1], w.size[2]),
                wallMat
            );
            mesh.position.set(w.pos[0], w.pos[1], w.pos[2]);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            three.roomGroup.add(mesh);
        });

        // 3. Render Placed Objects from Vault
        while (three.furnitureGroup.children.length > 0) {
            three.furnitureGroup.remove(three.furnitureGroup.children[0]);
        }

        placedObjects.forEach(p => {
            const mesh = createFurnitureMesh(p.asset);
            mesh.position.set(p.position[0], p.position[1], p.position[2]);
            three.furnitureGroup.add(mesh);
        });

        setPolyCount(wallConfigs.length * 12 + placedObjects.length * 52 + 24);
    }, [roomDims, placedObjects]);

    // -------------------------------------------------------------
    // Initialize Three.js WebGL Engine
    // -------------------------------------------------------------
    useEffect(() => {
        const container = canvasContainerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight || 500;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(9, 8, 11);

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
        controls.maxDistance = 45;
        controls.minDistance = 1.2;
        controls.maxPolarAngle = Math.PI / 2 + 0.02;

        // Clean Studio Lights
        const ambient = new THREE.AmbientLight(0xffffff, 1.4);
        scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(0xfff7ed, 2.6);
        dirLight.position.set(12, 18, 14);
        dirLight.castShadow = true;
        scene.add(dirLight);

        const rimLight = new THREE.PointLight(0xFF5C00, 1.5, 30);
        rimLight.position.set(-12, 8, -12);
        scene.add(rimLight);

        // Ground Cadmium Grid
        const grid = new THREE.GridHelper(22, 44, 0xFF5C00, 0xCBD5E1);
        grid.position.y = -0.16;
        scene.add(grid);

        // Dynamic Slicing Plane
        const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), sliceHeight);
        const clippingPlaneHelper = new THREE.PlaneHelper(clippingPlane, 16, 0xFF5C00);
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
            animFrameId: 0
        };

        let frameCount = 0;
        let lastTime = performance.now();

        const animate = (now: number) => {
            threeRefs.current!.animFrameId = requestAnimationFrame(animate);
            frameCount++;
            if (now - lastTime >= 500) {
                setFps(Math.round((frameCount * 1000) / (now - lastTime)));
                frameCount = 0;
                lastTime = now;
            }
            controls.update();
            renderer.render(scene, camera);
        };
        animate(performance.now());

        const resizeObserver = new ResizeObserver(() => {
            if (!container) return;
            const newW = container.clientWidth;
            const newH = container.clientHeight || 500;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        });
        resizeObserver.observe(container);

        buildRoom();

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

    // Rebuild room when roomDims or placedObjects change
    useEffect(() => {
        buildRoom();
    }, [buildRoom]);

    // Apply Slicing Plane
    useEffect(() => {
        const three = threeRefs.current;
        if (!three) return;

        if (!sliceEnabled) {
            three.renderer.clippingPlanes = [];
            if (three.clippingPlaneHelper) three.clippingPlaneHelper.visible = false;
            return;
        }

        three.clippingPlane.constant = -sliceHeight;
        three.renderer.clippingPlanes = [three.clippingPlane];
        if (three.clippingPlaneHelper) three.clippingPlaneHelper.visible = true;
    }, [sliceEnabled, sliceHeight]);

    // Apply Viewport Mode
    useEffect(() => {
        const three = threeRefs.current;
        if (!three) return;

        three.roomGroup.traverse(child => {
            if (child instanceof THREE.Mesh) {
                if (viewportMode === 'wireframe') {
                    child.material = new THREE.MeshBasicMaterial({ color: 0xFF5C00, wireframe: true, clippingPlanes: three.renderer.clippingPlanes });
                } else if (viewportMode === 'clay') {
                    child.material = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.9, clippingPlanes: three.renderer.clippingPlanes });
                }
            }
        });
    }, [viewportMode]);

    // -------------------------------------------------------------
    // Chat & Spatial Prompt Handler
    // -------------------------------------------------------------
    const handleSendPrompt = (customPrompt?: string) => {
        const text = (customPrompt || promptInput).trim();
        if (!text && !attachedFloorImage) return;

        const userMsg: ChatMessage = {
            id: `usr_${Date.now()}`,
            sender: 'user',
            text: text || 'Uploaded floor plan image for 3D reconstruction.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachedImage: attachedFloorImage || undefined
        };

        setChatMessages(prev => [...prev, userMsg]);
        setPromptInput('');
        setAttachedFloorImage(null);
        setIsAiProcessing(true);

        // AI Response Logic (Spatial Parser)
        setTimeout(() => {
            const lower = text.toLowerCase();
            let replyText = '';
            let badge = '';

            if (userMsg.attachedImage || lower.includes('floor plan') || lower.includes('reconstruct') || lower.includes('villa') || lower.includes('blueprint')) {
                // Resize / Extrude Floor
                setRoomDims({ name: 'AI Reconstructed Spatial Environment', w: 14, d: 11, h: 3.0 });
                replyText = 'Detected perimeter walls, interior partition grid, and doorway openings from your 2D plan. Reconstructed the 3D spatial shell with realistic drywall textures and 3.0m ceiling elevation.';
                badge = 'Extruded 3D Space (14m × 11m)';
            } else if (lower.includes('sofa') || lower.includes('living') || lower.includes('couch')) {
                const sofa = assetVault.find(a => a.category.toLowerCase().includes('living')) || assetVault[1];
                const newPlaced: PlacedObject = {
                    instanceId: `inst_${Date.now()}`,
                    asset: sofa,
                    position: [1.8, 0.35, 1.0]
                };
                setPlacedObjects(prev => [...prev, newPlaced]);
                replyText = `Retrieved "${sofa.name}" from your 3D Asset Vault and positioned it in the living room zone. Active BOQ updated.`;
                badge = `Staged: ${sofa.name} (₹${sofa.priceINR.toLocaleString()})`;
            } else if (lower.includes('bed') || lower.includes('bedroom')) {
                const bed = assetVault.find(a => a.category.toLowerCase().includes('bed')) || assetVault[0];
                const newPlaced: PlacedObject = {
                    instanceId: `inst_${Date.now()}`,
                    asset: bed,
                    position: [-3.0, 0.4, -2.0]
                };
                setPlacedObjects(prev => [...prev, newPlaced]);
                replyText = `Retrieved "${bed.name}" from your vault and staged it into the master bedroom suite.`;
                badge = `Staged: ${bed.name}`;
            } else if (lower.includes('slice') || lower.includes('roof') || lower.includes('section')) {
                setSliceEnabled(true);
                setSliceHeight(1.5);
                replyText = 'Activated horizontal dynamic section slicing at 1.5m depth to reveal internal room layouts and staged furniture.';
                badge = 'Slicing Active: 1.5m Depth';
            } else if (lower.includes('boq') || lower.includes('cost') || lower.includes('quote') || lower.includes('price')) {
                const total = placedObjects.reduce((acc, p) => acc + p.asset.priceINR, 0);
                replyText = `Current Bill of Quantities tabulates ${placedObjects.length} staged pieces totaling ₹${total.toLocaleString()} INR (exclusive of 18% GST). Switch to the BOQ tab to export CSV or send quote over WhatsApp.`;
                badge = `Total BOQ: ₹${Math.round(total * 1.18).toLocaleString()} (Inc GST)`;
            } else {
                replyText = `Synthesized your request: "${text}". Adjusted scene lighting, camera perspectives, and verified spatial bounds for mobile rendering.`;
                badge = 'Scene Refined';
            }

            const aiMsg: ChatMessage = {
                id: `ai_${Date.now()}`,
                sender: 'assistant',
                text: replyText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                actionBadge: badge
            };

            setChatMessages(prev => [...prev, aiMsg]);
            setIsAiProcessing(false);
        }, 900);
    };

    // Handle Image Attachment for Floor Plan
    const handleAttachFloorImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setAttachedFloorImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Handle Custom 3D Asset Addition to Vault
    const handleAddAssetToVault = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAssetName || !newAssetFile) return;

        const newAsset: StoredAsset = {
            id: `custom_${Date.now()}`,
            name: newAssetName,
            category: newAssetCategory,
            priceINR: Number(newAssetPrice) || 25000,
            dimensions: '1.8m × 0.9m',
            fileName: newAssetFile.name,
            fileSizeKB: Math.round(newAssetFile.size / 1024),
            color: '#FF5C00',
            isCustom: true
        };

        setAssetVault(prev => [newAsset, ...prev]);
        setNewAssetName('');
        setNewAssetPrice('32000');
        setNewAssetFile(null);
        setIsAddingAsset(false);

        // Notify in Chat
        setChatMessages(prev => [
            ...prev,
            {
                id: `msg_vault_${Date.now()}`,
                sender: 'assistant',
                text: `Successfully saved new 3D model "${newAsset.name}" to your Asset Vault. You can now prompt me to stage this object into your 3D rooms!`,
                timestamp: 'Just now',
                actionBadge: `Vault Asset Saved (${newAsset.fileSizeKB} KB)`
            }
        ]);
    };

    // Stage Asset directly from Vault
    const stageAssetFromVault = (asset: StoredAsset) => {
        const randomX = (Math.random() - 0.5) * 6;
        const randomZ = (Math.random() - 0.5) * 6;
        setPlacedObjects(prev => [
            ...prev,
            {
                instanceId: `inst_${Date.now()}`,
                asset,
                position: [randomX, 0.35, randomZ]
            }
        ]);
        setCurrentView('studio');
    };

    // Remove Placed Asset
    const removePlacedObject = (instanceId: string) => {
        setPlacedObjects(prev => prev.filter(p => p.instanceId !== instanceId));
    };

    // Compute BOQ Totals
    const boqSubtotal = placedObjects.reduce((acc, p) => acc + p.asset.priceINR, 0);
    const boqTax = Math.round(boqSubtotal * 0.18);
    const boqTotal = boqSubtotal + boqTax;

    // Export Snapshot
    const exportSnapshot = () => {
        const three = threeRefs.current;
        if (!three) return;
        three.renderer.render(three.scene, three.camera);
        const dataUrl = three.renderer.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `slice3d-snapshot-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <div ref={containerRef} className="space-y-4">
            <RepoSyncBar repoName="Slice3D" />

            {/* MINIMAL BRANDED HEADER */}
            <div className="bg-white rounded-2xl border border-black/10 p-3 sm:p-4 shadow-sm flex items-center justify-between gap-3">
                {/* Brand Identity: A Generative Slice Logo + SLICE 3D */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-black/10 shrink-0 shadow-sm">
                        <img src={logoImg} alt="A Generative Slice" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm tracking-wider uppercase font-heading text-[#0F172A]">
                                SLICE 3D
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FF5C00]/10 text-[#FF5C00]">
                                STUDIO
                            </span>
                        </div>
                        <span className="text-[10px] text-[#64748B] hidden sm:block">
                            By A Generative Slice • AI Spatial Floor Engine
                        </span>
                    </div>
                </div>

                {/* Minimal Top Navigation Tabs */}
                <div className="flex items-center gap-1.5 bg-black/[0.03] p-1 rounded-xl">
                    <button
                        onClick={() => setCurrentView('studio')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition-all ${
                            currentView === 'studio'
                                ? 'bg-white text-[#FF5C00] shadow-sm font-extrabold'
                                : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                    >
                        3D Studio &amp; Chat
                    </button>

                    <button
                        onClick={() => setCurrentView('vault')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition-all ${
                            currentView === 'vault'
                                ? 'bg-white text-[#FF5C00] shadow-sm font-extrabold'
                                : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                    >
                        3D Asset Vault ({assetVault.length})
                    </button>

                    <button
                        onClick={() => setCurrentView('boq')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition-all ${
                            currentView === 'boq'
                                ? 'bg-white text-[#FF5C00] shadow-sm font-extrabold'
                                : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                    >
                        Live BOQ (₹{boqTotal.toLocaleString()})
                    </button>
                </div>
            </div>

            {/* VIEW 1: STUDIO (3D CANVAS + AI CHAT CO-PILOT) */}
            {currentView === 'studio' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* LEFT / MOBILE BOTTOM: AI CHAT CO-PILOT (4 COLS) */}
                    <div className="lg:col-span-5 bg-white rounded-2xl border border-black/10 shadow-sm flex flex-col h-[520px] sm:h-[580px] overflow-hidden">
                        {/* Chat Header */}
                        <div className="p-3.5 border-b border-black/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-[#FF5C00]/10 flex items-center justify-center text-[#FF5C00]">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-xs text-[#0F172A] font-heading">
                                        Spatial AI Co-Pilot
                                    </h4>
                                    <p className="text-[10px] text-[#64748B]">Attach 2D plan &amp; prompt modifications</p>
                                </div>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        {/* Chat Stream */}
                        <div className="flex-grow p-3 space-y-3 overflow-y-auto text-xs">
                            {chatMessages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white ${
                                        msg.sender === 'user' ? 'bg-[#0F172A]' : 'bg-[#FF5C00]'
                                    }`}>
                                        {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                    </div>

                                    <div className={`max-w-[85%] rounded-2xl p-3 space-y-1.5 ${
                                        msg.sender === 'user' 
                                            ? 'bg-[#0F172A] text-white' 
                                            : 'bg-black/[0.03] text-[#0F172A] border border-black/5'
                                    }`}>
                                        {msg.attachedImage && (
                                            <div className="w-36 h-24 rounded-lg overflow-hidden border border-white/20 mb-1">
                                                <img src={msg.attachedImage} alt="Attached 2D Plan" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <p className="leading-relaxed">{msg.text}</p>
                                        {msg.actionBadge && (
                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF5C00]/15 text-[#FF5C00]">
                                                <Sparkles className="w-3 h-3" />
                                                <span>{msg.actionBadge}</span>
                                            </div>
                                        )}
                                        <span className={`block text-[9px] ${msg.sender === 'user' ? 'text-white/50' : 'text-[#64748B]'}`}>
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {isAiProcessing && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FF5C00]/5 text-[#FF5C00] text-xs">
                                    <Sparkles className="w-4 h-4 animate-spin" />
                                    <span>AI is synthesizing 3D geometry &amp; asset layout...</span>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Quick Prompt Chips */}
                        <div className="px-3 py-2 border-t border-black/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                            <button
                                onClick={() => handleSendPrompt('Convert this floor plan to a luxury 2BHK 3D villa')}
                                className="px-2.5 py-1 rounded-lg bg-black/[0.03] hover:bg-[#FF5C00]/10 hover:text-[#FF5C00] text-[10px] font-bold shrink-0 transition-colors"
                            >
                                ✨ Reconstruct 2BHK Plan
                            </button>
                            <button
                                onClick={() => handleSendPrompt('Add a living room sofa and stage with white oak furniture')}
                                className="px-2.5 py-1 rounded-lg bg-black/[0.03] hover:bg-[#FF5C00]/10 hover:text-[#FF5C00] text-[10px] font-bold shrink-0 transition-colors"
                            >
                                🛋️ Stage Living Room
                            </button>
                            <button
                                onClick={() => handleSendPrompt('Slice roof at 1.5m to inspect interior layout')}
                                className="px-2.5 py-1 rounded-lg bg-black/[0.03] hover:bg-[#FF5C00]/10 hover:text-[#FF5C00] text-[10px] font-bold shrink-0 transition-colors"
                            >
                                🔪 Slice at 1.5m
                            </button>
                            <button
                                onClick={() => handleSendPrompt('Calculate current active BOQ estimate')}
                                className="px-2.5 py-1 rounded-lg bg-black/[0.03] hover:bg-[#FF5C00]/10 hover:text-[#FF5C00] text-[10px] font-bold shrink-0 transition-colors"
                            >
                                📊 Calculate BOQ
                            </button>
                        </div>

                        {/* Input & Image Attachment Tray */}
                        <div className="p-3 border-t border-black/5 space-y-2 bg-[#FAFAFA]">
                            {attachedFloorImage && (
                                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#FF5C00]/30 text-xs">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-[#FF5C00]" />
                                        <span className="font-bold text-[11px] text-[#0F172A]">2D Floor Plan Attached</span>
                                    </div>
                                    <button onClick={() => setAttachedFloorImage(null)} className="text-[#64748B] hover:text-red-500">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={floorPlanFileInputRef}
                                    onChange={handleAttachFloorImage}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => floorPlanFileInputRef.current?.click()}
                                    className="p-2.5 rounded-xl border border-black/10 bg-white hover:bg-black/5 text-[#64748B] hover:text-[#FF5C00] transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center cursor-pointer"
                                    title="Attach 2D Floor Plan Photo"
                                >
                                    <Paperclip className="w-4 h-4" />
                                </button>

                                <input
                                    type="text"
                                    value={promptInput}
                                    onChange={e => setPromptInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendPrompt()}
                                    placeholder="Prompt AI to extrude plan, add furniture, slice..."
                                    className="flex-grow px-3.5 py-2 rounded-xl bg-white border border-black/10 text-xs text-[#0F172A] focus:outline-none focus:border-[#FF5C00] min-h-[42px]"
                                />

                                <button
                                    onClick={() => handleSendPrompt()}
                                    className="p-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white transition-all min-h-[42px] min-w-[42px] flex items-center justify-center shadow-sm cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: THE 3D SPATIAL CANVAS (7 COLS) */}
                    <div className="lg:col-span-7 relative rounded-2xl border border-black/10 bg-gradient-to-b from-[#f8fafc] to-[#edf2f7] overflow-hidden shadow-lg h-[520px] sm:h-[580px]">
                        {/* Minimal Telemetry Overlay */}
                        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-black/10 text-xs font-mono shadow-sm pointer-events-none">
                            <span className="font-bold text-[#FF5C00]">{fps} FPS</span>
                            <span className="text-black/20">|</span>
                            <span className="text-[#64748B]">{polyCount.toLocaleString()} Triangles</span>
                        </div>

                        {/* Top-Right Tools: Camera & Snapshot */}
                        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-black/10 p-1 rounded-xl shadow-sm">
                            <button
                                onClick={exportSnapshot}
                                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#FF5C00] transition-colors"
                                title="Export Snapshot"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* The Three.js Canvas */}
                        <div 
                            ref={canvasContainerRef} 
                            className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                        />

                        {/* Minimal Bottom Floating Controls: Viewport Mode & Slicing */}
                        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
                            <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-black/10 shadow-md pointer-events-auto">
                                {(['pbr', 'clay', 'wireframe'] as ViewportMode[]).map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewportMode(mode)}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all font-heading ${
                                            viewportMode === mode
                                                ? 'bg-[#FF5C00] text-white shadow-sm'
                                                : 'text-[#64748B] hover:text-[#0F172A]'
                                        }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>

                            {/* Minimal Slice Tool Toggle */}
                            <div className="flex items-center gap-2 p-1.5 px-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-black/10 shadow-md pointer-events-auto">
                                <button
                                    onClick={() => setSliceEnabled(!sliceEnabled)}
                                    className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                                        sliceEnabled ? 'text-[#FF5C00]' : 'text-[#64748B]'
                                    }`}
                                >
                                    <Scissors className="w-3.5 h-3.5" />
                                    <span className="text-[11px] font-heading">{sliceEnabled ? 'Slice: ON' : 'Slice'}</span>
                                </button>
                                {sliceEnabled && (
                                    <input
                                        type="range"
                                        min="0"
                                        max="3.5"
                                        step="0.1"
                                        value={sliceHeight}
                                        onChange={e => setSliceHeight(Number(e.target.value))}
                                        className="w-20 h-1 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#FF5C00]"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW 2: 3D ASSET VAULT (PRODUCT ADDING & MANAGEMENT) */}
            {currentView === 'vault' && (
                <div className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5">
                        <div>
                            <div className="flex items-center gap-2">
                                <Box className="w-5 h-5 text-[#FF5C00]" />
                                <h3 className="font-extrabold text-base text-[#0F172A] font-heading">
                                    3D Asset Vault &amp; Product Management
                                </h3>
                            </div>
                            <p className="text-xs text-[#64748B] mt-0.5">
                                Add your custom 3D files (.GLB, .GLTF, .OBJ) with itemized prices to stage into floor generation or prompt via AI.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsAddingAsset(true)}
                            className="px-4 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm font-heading cursor-pointer min-h-[42px]"
                        >
                            <FolderPlus className="w-4 h-4" />
                            <span>Add New 3D Asset</span>
                        </button>
                    </div>

                    {/* Add New Asset Form Modal / Box */}
                    {isAddingAsset && (
                        <form onSubmit={handleAddAssetToVault} className="p-5 rounded-2xl bg-[#FF5C00]/[0.02] border border-[#FF5C00]/30 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-extrabold text-sm text-[#0F172A] font-heading">Upload Custom 3D Object</h4>
                                <button type="button" onClick={() => setIsAddingAsset(false)} className="text-[#64748B] hover:text-black">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                                        Product / Asset Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newAssetName}
                                        onChange={e => setNewAssetName(e.target.value)}
                                        placeholder="e.g. Italian Marble Dining Table"
                                        className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#FF5C00]"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={newAssetCategory}
                                        onChange={e => setNewAssetCategory(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#FF5C00]"
                                    >
                                        <option value="Living">Living Room</option>
                                        <option value="Bedroom">Bedroom</option>
                                        <option value="Dining">Dining</option>
                                        <option value="Office">Office</option>
                                        <option value="Lighting">Lighting</option>
                                        <option value="Kitchen">Kitchen</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                                        Unit Price (INR ₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={newAssetPrice}
                                        onChange={e => setNewAssetPrice(e.target.value)}
                                        placeholder="32000"
                                        className="w-full px-3 py-2 rounded-xl border border-black/10 bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#FF5C00]"
                                    />
                                </div>
                            </div>

                            {/* 3D Model File Picker */}
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                                    3D Model Geometry (.GLB / .GLTF)
                                </label>
                                <input
                                    type="file"
                                    required
                                    ref={customAssetFileInputRef}
                                    onChange={e => setNewAssetFile(e.target.files?.[0] || null)}
                                    accept=".glb,.gltf,.obj"
                                    className="text-xs text-[#64748B] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#FF5C00]/10 file:text-[#FF5C00] hover:file:bg-[#FF5C00]/20"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingAsset(false)}
                                    className="px-4 py-2 rounded-xl border border-black/10 text-xs font-semibold text-[#64748B]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all shadow-sm font-heading cursor-pointer"
                                >
                                    Save Asset to Vault
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Stored Assets Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                        {assetVault.map(asset => (
                            <div
                                key={asset.id}
                                className="p-4 rounded-xl border border-black/10 bg-black/[0.01] hover:bg-[#FF5C00]/[0.02] hover:border-[#FF5C00]/30 transition-all flex flex-col justify-between space-y-3"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono uppercase font-bold text-[#64748B]">
                                            {asset.category}
                                        </span>
                                        <span className="text-xs font-mono font-bold text-[#0F172A]">
                                            ₹{asset.priceINR.toLocaleString()}
                                        </span>
                                    </div>
                                    <h4 className="font-extrabold text-xs text-[#0F172A] mt-1 font-heading">
                                        {asset.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-[#64748B] font-mono">
                                        <span>{asset.dimensions}</span>
                                        <span>•</span>
                                        <span>{asset.fileName} ({asset.fileSizeKB} KB)</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Ready
                                    </span>
                                    <button
                                        onClick={() => stageAssetFromVault(asset)}
                                        className="px-3 py-1.5 rounded-lg bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-[11px] font-bold transition-all font-heading cursor-pointer"
                                    >
                                        Stage in 3D
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VIEW 3: LIVE BILL OF QUANTITIES (BOQ) & UNIVERSAL EXPORT */}
            {currentView === 'boq' && (
                <div className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5">
                        <div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-extrabold text-base text-[#0F172A] font-heading">
                                    Live Bill of Quantities (BOQ) &amp; Client Quotation
                                </h3>
                            </div>
                            <p className="text-xs text-[#64748B] mt-0.5">
                                Real-time itemized procurement pricing tied directly to the 3D staged spatial layout.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(`Check out our custom 3D architectural plan with live BOQ (₹${boqTotal.toLocaleString()}) on Slice3D: https://agenerativeslice.info/slice-3d`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 font-heading"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Share Quote via WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* Staged Items Table */}
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                        {placedObjects.length === 0 ? (
                            <div className="text-center py-10 text-xs text-[#64748B]">
                                No assets staged in the 3D room yet. Stage items from the Studio Chat or Asset Vault.
                            </div>
                        ) : (
                            placedObjects.map(p => (
                                <div
                                    key={p.instanceId}
                                    className="flex items-center justify-between p-3 rounded-xl bg-black/[0.01] border border-black/5 text-xs"
                                >
                                    <div>
                                        <span className="font-bold text-[#0F172A] block font-heading">{p.asset.name}</span>
                                        <span className="text-[10px] text-[#64748B]">
                                            {p.asset.category} • {p.asset.dimensions} • {p.asset.fileName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-bold text-[#0F172A]">
                                            ₹{p.asset.priceINR.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => removePlacedObject(p.instanceId)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Financial Summary */}
                    <div className="pt-4 border-t border-black/5 space-y-2 max-w-sm ml-auto">
                        <div className="flex items-center justify-between text-xs text-[#64748B]">
                            <span>Items Subtotal ({placedObjects.length} items):</span>
                            <span className="font-mono">₹{boqSubtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#64748B]">
                            <span>GST (18% Statutory):</span>
                            <span className="font-mono">₹{boqTax.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-bold text-[#0F172A] pt-2 border-t border-black/5 font-heading">
                            <span>Grand Total Estimate:</span>
                            <span className="font-mono text-[#FF5C00] text-base">₹{boqTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
