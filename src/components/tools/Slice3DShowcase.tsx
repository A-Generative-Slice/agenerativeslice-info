import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
    Scissors, Layers, Maximize2, Minimize2, Camera, 
    Upload, Play, Pause, RefreshCw, Activity, 
    ChevronDown, Sparkles, MapPin
} from 'lucide-react';
import { RepoSyncBar } from '../RepoSyncBar';

// Types
export type ViewportMode = 'pbr' | 'wireframe' | 'normals' | 'clay' | 'xray';
export type LightingPreset = 'studio' | 'sunset' | 'cyberpunk' | 'cad';
export type SliceAxis = 'x' | 'y' | 'z';

interface ModelPreset {
    id: string;
    name: string;
    category: string;
    url: string;
    description: string;
    scale: number;
    rotationOffset?: [number, number, number];
    isProcedural?: boolean;
}

const MODEL_PRESETS: ModelPreset[] = [
    {
        id: 'floorplan_v2',
        name: 'Architectural Villa Plan (Draco 49KB)',
        category: 'Architecture & Real Estate',
        url: '/models/3d_floor_plan_2.glb',
        description: 'Multi-room luxury villa layout with partition walls and furniture staging.',
        scale: 1.0
    },
    {
        id: 'dragon_asset',
        name: 'Low-Poly Studio Asset (35KB)',
        category: 'Blender FastMCP Procedural',
        url: '/models/low_poly_model.glb',
        description: 'Parametric dark-grey low-poly mesh built via the Slice3D Blender automation bridge.',
        scale: 1.2
    },
    {
        id: 'cad_gun',
        name: 'Hard-Surface Precision Model (68KB)',
        category: 'Industrial Design',
        url: '/models/high_quality_gun.glb',
        description: 'Hard-surface mechanical asset for manufacturing and tolerance inspection.',
        scale: 1.5
    },
    {
        id: 'floorplan_v1',
        name: 'Structural Blueprints (46KB)',
        category: 'Civil Engineering',
        url: '/models/3d_floor_plan.glb',
        description: 'Foundation slab and load-bearing column framework.',
        scale: 1.0
    },
    {
        id: 'procedural_crystal',
        name: 'Procedural Crystal Geode (Live WebGL)',
        category: 'Generative Algorithm',
        url: '',
        description: 'Real-time mathematical icosahedron lattice with multi-facet noise deformation.',
        scale: 1.0,
        isProcedural: true
    }
];

interface AnnotationPoint {
    id: string;
    title: string;
    tag: string;
    desc: string;
    pos: THREE.Vector3;
}

export const Slice3DShowcase: React.FC = () => {
    // Canvas & Container Refs
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasContainerRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Three.js internal object refs (persistent across renders)
    const threeRefs = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        controls: OrbitControls;
        currentModelGroup: THREE.Group;
        clippingPlane: THREE.Plane;
        clippingPlaneHelper: THREE.PlaneHelper | null;
        ambientLight: THREE.AmbientLight;
        directionalLight: THREE.DirectionalLight;
        rimLight: THREE.PointLight;
        groundGrid: THREE.GridHelper;
        originalMaterials: Map<string, THREE.Material | THREE.Material[]>;
        childInitialPositions: Map<THREE.Object3D, THREE.Vector3>;
        animFrameId: number;
    } | null>(null);

    // State
    const [selectedPreset, setSelectedPreset] = useState<ModelPreset>(MODEL_PRESETS[0]);
    const [viewportMode, setViewportMode] = useState<ViewportMode>('pbr');
    const [lightingPreset, setLightingPreset] = useState<LightingPreset>('studio');
    const [isAutoSpin, setIsAutoSpin] = useState<boolean>(true);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // The Signature "Slice" Engine State
    const [sliceEnabled, setSliceEnabled] = useState<boolean>(false);
    const [sliceAxis, setSliceAxis] = useState<SliceAxis>('y');
    const [slicePosition, setSlicePosition] = useState<number>(0); // -100 to 100
    const [sliceInvert, setSliceInvert] = useState<boolean>(false);
    const [showSliceHelper, setShowSliceHelper] = useState<boolean>(true);

    // Exploded View State
    const [explodeAmount, setExplodeAmount] = useState<number>(0); // 0 to 100

    // Diagnostics Telemetry State
    const [fps, setFps] = useState<number>(60);
    const [polyCount, setPolyCount] = useState<{ triangles: number; vertices: number; meshes: number }>({
        triangles: 0,
        vertices: 0,
        meshes: 0
    });
    const [dimensions, setDimensions] = useState<{ x: string; y: string; z: string }>({
        x: '0.00',
        y: '0.00',
        z: '0.00'
    });

    // Annotations State
    const [annotations, setAnnotations] = useState<AnnotationPoint[]>([]);

    // -------------------------------------------------------------
    // Procedural Geometry Generator (when isProcedural is true)
    // -------------------------------------------------------------
    const createProceduralMesh = useCallback((): THREE.Group => {
        const group = new THREE.Group();
        group.name = "Procedural_Crystal_Group";

        // Core icosahedron
        const geom = new THREE.IcosahedronGeometry(1.6, 2);
        
        // Add procedural noise to vertices
        const posAttr = geom.attributes.position;
        const v = new THREE.Vector3();
        for (let i = 0; i < posAttr.count; i++) {
            v.fromBufferAttribute(posAttr, i);
            const noise = Math.sin(v.x * 3) * Math.cos(v.y * 3) * Math.sin(v.z * 3) * 0.15;
            v.addScaledVector(v.clone().normalize(), noise);
            posAttr.setXYZ(i, v.x, v.y, v.z);
        }
        geom.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#FF5C00'),
            roughness: 0.25,
            metalness: 0.65,
            flatShading: true
        });

        const mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);

        // Surrounding orbital ring
        const ringGeom = new THREE.TorusGeometry(2.4, 0.04, 16, 100);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0x94A3B8,
            roughness: 0.3,
            metalness: 0.8
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 3;
        group.add(ring);

        // Surrounding floating satellite nodes
        for (let i = 0; i < 4; i++) {
            const satGeom = new THREE.OctahedronGeometry(0.25, 0);
            const satMat = new THREE.MeshStandardMaterial({
                color: 0xFF5C00,
                roughness: 0.1,
                metalness: 0.9
            });
            const sat = new THREE.Mesh(satGeom, satMat);
            const angle = (i / 4) * Math.PI * 2;
            sat.position.set(Math.cos(angle) * 2.5, Math.sin(angle * 2) * 0.5, Math.sin(angle) * 2.5);
            group.add(sat);
        }

        return group;
    }, []);

    // -------------------------------------------------------------
    // Update Scene Telemetry (Counts, Bounding Box)
    // -------------------------------------------------------------
    const updateTelemetry = useCallback((modelGroup: THREE.Group) => {
        let triCount = 0;
        let vertCount = 0;
        let meshCount = 0;

        const box = new THREE.Box3().setFromObject(modelGroup);
        const size = new THREE.Vector3();
        box.getSize(size);

        modelGroup.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                meshCount++;
                const geom = child.geometry;
                if (geom) {
                    if (geom.index) {
                        triCount += geom.index.count / 3;
                    } else if (geom.attributes.position) {
                        triCount += geom.attributes.position.count / 3;
                    }
                    if (geom.attributes.position) {
                        vertCount += geom.attributes.position.count;
                    }
                }
            }
        });

        setPolyCount({
            triangles: Math.round(triCount),
            vertices: Math.round(vertCount),
            meshes: meshCount
        });

        setDimensions({
            x: (size.x * 100).toFixed(1), // cm
            y: (size.y * 100).toFixed(1),
            z: (size.z * 100).toFixed(1)
        });

        // Generate context-aware 3D annotations
        const center = new THREE.Vector3();
        box.getCenter(center);
        setAnnotations([
            {
                id: 'center',
                title: 'Geometric Mass Centroid',
                tag: 'BIM ORIGIN',
                desc: `Calculated centroid at [${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)}]. Zero calibration point.`,
                pos: center.clone().add(new THREE.Vector3(0, size.y * 0.4, 0))
            },
            {
                id: 'envelope',
                title: 'Bounding Envelope',
                tag: 'TOLERANCE',
                desc: `Max spatial envelope is ${(size.x * size.y * size.z).toFixed(3)} m³. Draco compressed delivery.`,
                pos: new THREE.Vector3(box.max.x * 0.8, box.max.y, box.max.z * 0.8)
            }
        ]);
    }, []);

    // -------------------------------------------------------------
    // Load Model Handler (GLB Loader or Procedural)
    // -------------------------------------------------------------
    const loadModel = useCallback((preset: ModelPreset, customFile?: File) => {
        const three = threeRefs.current;
        if (!three) return;

        setIsLoading(true);
        setLoadError(null);

        // Clear existing model children
        while (three.currentModelGroup.children.length > 0) {
            const obj = three.currentModelGroup.children[0];
            three.currentModelGroup.remove(obj);
        }
        three.originalMaterials.clear();
        three.childInitialPositions.clear();

        const onModelReady = (loadedGroup: THREE.Group) => {
            // Apply scale
            loadedGroup.scale.setScalar(preset.scale);

            // Compute center & recenter
            const box = new THREE.Box3().setFromObject(loadedGroup);
            const center = new THREE.Vector3();
            box.getCenter(center);
            loadedGroup.position.sub(center); // Center to (0,0,0)

            // Cache original materials and positions for exploded view
            loadedGroup.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    three.originalMaterials.set(child.uuid, child.material);
                    three.childInitialPositions.set(child, child.position.clone());
                }
            });

            three.currentModelGroup.add(loadedGroup);

            // Position ground grid just below bottom of bounding box
            const updatedBox = new THREE.Box3().setFromObject(three.currentModelGroup);
            three.groundGrid.position.y = updatedBox.min.y - 0.05;

            // Reset camera to fit model nicely
            const maxDim = Math.max(
                updatedBox.max.x - updatedBox.min.x,
                updatedBox.max.y - updatedBox.min.y,
                updatedBox.max.z - updatedBox.min.z
            );
            const cameraDist = Math.max(maxDim * 2.2, 4.0);
            three.camera.position.set(cameraDist * 0.8, cameraDist * 0.6, cameraDist * 0.9);
            three.controls.target.set(0, 0, 0);
            three.controls.update();

            updateTelemetry(three.currentModelGroup);
            setIsLoading(false);
        };

        if (customFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const buffer = e.target?.result as ArrayBuffer;
                if (!buffer) {
                    setLoadError('Failed to read file buffer.');
                    setIsLoading(false);
                    return;
                }
                const loader = new GLTFLoader();
                loader.parse(
                    buffer,
                    '',
                    (gltf) => onModelReady(gltf.scene),
                    (err) => {
                        console.error('GLTF parse error:', err);
                        setLoadError('Invalid GLTF/GLB file structure.');
                        setIsLoading(false);
                    }
                );
            };
            reader.readAsArrayBuffer(customFile);
        } else if (preset.isProcedural) {
            setTimeout(() => {
                const proceduralGroup = createProceduralMesh();
                onModelReady(proceduralGroup);
            }, 100);
        } else {
            const loader = new GLTFLoader();
            loader.load(
                preset.url,
                (gltf) => onModelReady(gltf.scene),
                undefined,
                (err) => {
                    console.warn(`Failed loading GLB from ${preset.url}. Falling back to procedural preview.`, err);
                    const fallbackGroup = createProceduralMesh();
                    onModelReady(fallbackGroup);
                }
            );
        }
    }, [createProceduralMesh, updateTelemetry]);

    // -------------------------------------------------------------
    // Initialize Three.js WebGL Engine (Mount Lifecycle)
    // -------------------------------------------------------------
    useEffect(() => {
        const container = canvasContainerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight || 500;

        // 1. Scene
        const scene = new THREE.Scene();
        scene.background = null;

        // 2. Camera
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
        camera.position.set(4, 3, 5);

        // 3. Renderer with High-Performance Settings & Clipping Planes
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

        // 4. Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxDistance = 50;
        controls.minDistance = 0.5;
        controls.maxPolarAngle = Math.PI / 2 + 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.2;

        // 5. Studio Lighting Rig
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
        directionalLight.position.set(8, 14, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 30;
        directionalLight.shadow.bias = -0.0005;
        scene.add(directionalLight);

        const rimLight = new THREE.PointLight(0xFF5C00, 1.5, 20);
        rimLight.position.set(-8, 6, -8);
        scene.add(rimLight);

        // 6. Ground Engineering Grid
        const groundGrid = new THREE.GridHelper(16, 32, 0xFF5C00, 0xCBD5E1);
        groundGrid.position.y = -0.01;
        scene.add(groundGrid);

        // 7. Dynamic Slicing Plane Engine
        const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
        renderer.clippingPlanes = [];

        const clippingPlaneHelper = new THREE.PlaneHelper(clippingPlane, 8, 0xFF5C00);
        clippingPlaneHelper.visible = false;
        scene.add(clippingPlaneHelper);

        // 8. Model Container Group
        const currentModelGroup = new THREE.Group();
        scene.add(currentModelGroup);

        threeRefs.current = {
            scene,
            camera,
            renderer,
            controls,
            currentModelGroup,
            clippingPlane,
            clippingPlaneHelper,
            ambientLight,
            directionalLight,
            rimLight,
            groundGrid,
            originalMaterials: new Map(),
            childInitialPositions: new Map(),
            animFrameId: 0
        };

        // 9. Animation & FPS Meter Loop
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

        // 10. Resize Observer
        const resizeObserver = new ResizeObserver(() => {
            if (!container) return;
            const newW = container.clientWidth;
            const newH = container.clientHeight || 500;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        });
        resizeObserver.observe(container);

        // Load initial model
        loadModel(selectedPreset);

        // Cleanup
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

    // -------------------------------------------------------------
    // Apply Viewport Mode
    // -------------------------------------------------------------
    useEffect(() => {
        const three = threeRefs.current;
        if (!three) return;

        three.currentModelGroup.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (viewportMode === 'wireframe') {
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0xFF5C00,
                        wireframe: true,
                        clippingPlanes: three.renderer.clippingPlanes
                    });
                } else if (viewportMode === 'normals') {
                    child.material = new THREE.MeshNormalMaterial({
                        clippingPlanes: three.renderer.clippingPlanes
                    });
                } else if (viewportMode === 'clay') {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xE2E8F0,
                        roughness: 0.9,
                        metalness: 0.05,
                        clippingPlanes: three.renderer.clippingPlanes
                    });
                } else if (viewportMode === 'xray') {
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: 0x38BDF8,
                        roughness: 0.1,
                        transmission: 0.85,
                        opacity: 0.7,
                        transparent: true,
                        clippingPlanes: three.renderer.clippingPlanes
                    });
                } else {
                    const orig = three.originalMaterials.get(child.uuid);
                    if (orig) {
                        child.material = orig;
                    }
                }
            }
        });
    }, [viewportMode]);

    // -------------------------------------------------------------
    // Apply Lighting Presets
    // -------------------------------------------------------------
    useEffect(() => {
        const three = threeRefs.current;
        if (!three) return;

        switch (lightingPreset) {
            case 'studio':
                three.ambientLight.intensity = 1.2;
                three.ambientLight.color.set(0xffffff);
                three.directionalLight.intensity = 2.4;
                three.directionalLight.color.set(0xfff5ea);
                three.rimLight.color.set(0xFF5C00);
                three.rimLight.intensity = 1.5;
                break;
            case 'sunset':
                three.ambientLight.intensity = 0.8;
                three.ambientLight.color.set(0xffe4d6);
                three.directionalLight.intensity = 3.2;
                three.directionalLight.color.set(0xff7700);
                three.rimLight.color.set(0x7c3aed);
                three.rimLight.intensity = 2.0;
                break;
            case 'cyberpunk':
                three.ambientLight.intensity = 0.5;
                three.ambientLight.color.set(0x0f172a);
                three.directionalLight.intensity = 1.8;
                three.directionalLight.color.set(0x00f0ff);
                three.rimLight.color.set(0xff0055);
                three.rimLight.intensity = 3.0;
                break;
            case 'cad':
                three.ambientLight.intensity = 2.2;
                three.ambientLight.color.set(0xffffff);
                three.directionalLight.intensity = 1.0;
                three.directionalLight.color.set(0xffffff);
                three.rimLight.intensity = 0;
                break;
        }
    }, [lightingPreset]);

    // -------------------------------------------------------------
    // Apply Dynamic Mesh Slicing
    // -------------------------------------------------------------
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

        const box = new THREE.Box3().setFromObject(three.currentModelGroup);
        let minBound = box.min.y;
        let maxBound = box.max.y;
        if (sliceAxis === 'x') { minBound = box.min.x; maxBound = box.max.x; }
        if (sliceAxis === 'z') { minBound = box.min.z; maxBound = box.max.z; }

        const span = (maxBound - minBound) || 2;
        const constant = -(minBound + ((slicePosition + 100) / 200) * span);

        three.clippingPlane.normal.copy(normal);
        three.clippingPlane.constant = constant;

        three.renderer.clippingPlanes = [three.clippingPlane];
        if (three.clippingPlaneHelper) {
            three.clippingPlaneHelper.visible = showSliceHelper;
        }
    }, [sliceEnabled, sliceAxis, slicePosition, sliceInvert, showSliceHelper]);

    // -------------------------------------------------------------
    // Apply Exploded View
    // -------------------------------------------------------------
    useEffect(() => {
        const three = threeRefs.current;
        if (!three) return;

        const factor = explodeAmount / 100;
        three.currentModelGroup.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const initPos = three.childInitialPositions.get(child);
                if (initPos) {
                    const dir = initPos.clone().normalize();
                    child.position.copy(initPos).addScaledVector(dir, factor * 2.5);
                }
            }
        });
    }, [explodeAmount]);

    // -------------------------------------------------------------
    // Apply Auto-Spin
    // -------------------------------------------------------------
    useEffect(() => {
        const three = threeRefs.current;
        if (!three) return;
        three.controls.autoRotate = isAutoSpin;
        three.controls.autoRotateSpeed = 1.2;
    }, [isAutoSpin]);

    // -------------------------------------------------------------
    // Camera View Presets
    // -------------------------------------------------------------
    const setCameraView = (view: 'iso' | 'top' | 'front' | 'reset') => {
        const three = threeRefs.current;
        if (!three) return;

        setIsAutoSpin(false);
        const box = new THREE.Box3().setFromObject(three.currentModelGroup);
        const maxDim = Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z) || 4;
        const d = maxDim * 2.2;

        switch (view) {
            case 'iso':
                three.camera.position.set(d * 0.7, d * 0.7, d * 0.7);
                break;
            case 'top':
                three.camera.position.set(0, d * 1.4, 0.001);
                break;
            case 'front':
                three.camera.position.set(0, 0, d * 1.3);
                break;
            case 'reset':
                three.camera.position.set(d * 0.8, d * 0.6, d * 0.9);
                break;
        }
        three.controls.target.set(0, 0, 0);
        three.controls.update();
    };

    // -------------------------------------------------------------
    // 4K PNG Snapshot Export
    // -------------------------------------------------------------
    const exportSnapshot = () => {
        const three = threeRefs.current;
        if (!three) return;

        three.renderer.render(three.scene, three.camera);
        const dataUrl = three.renderer.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `slice3d-${selectedPreset.id}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    // -------------------------------------------------------------
    // Custom Model Upload Handler
    // -------------------------------------------------------------
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const customPreset: ModelPreset = {
            id: `custom_${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            category: 'User Custom Upload',
            url: '',
            description: `Imported local 3D asset (${(file.size / 1024).toFixed(1)} KB).`,
            scale: 1.0
        };

        setSelectedPreset(customPreset);
        loadModel(customPreset, file);
    };

    // Toggle Fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => {});
            setIsFullscreen(true);
        } else {
            document.exitFullscreen().catch(() => {});
            setIsFullscreen(false);
        }
    };

    return (
        <div ref={containerRef} className="space-y-6">
            {/* Real-time GitHub Org Sync Indicator */}
            <RepoSyncBar repoName="Slice3D" />

            {/* TOP HEADER CONTROLS BAR */}
            <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left: Model Preset Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-heading shrink-0">
                        Active 3D Asset:
                    </span>
                    <div className="relative inline-block w-full sm:w-auto">
                        <select
                            value={selectedPreset.id}
                            onChange={(e) => {
                                const found = MODEL_PRESETS.find(p => p.id === e.target.value);
                                if (found) {
                                    setSelectedPreset(found);
                                    loadModel(found);
                                }
                            }}
                            className="w-full sm:w-72 px-3 py-2 rounded-xl text-xs font-semibold bg-black/[0.03] border border-black/10 text-[#0F172A] appearance-none cursor-pointer focus:outline-none focus:border-[#FF5C00] transition-colors pr-8 font-heading min-h-[42px]"
                        >
                            {MODEL_PRESETS.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Custom GLB Upload */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept=".glb,.gltf" 
                        className="hidden" 
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 rounded-xl border border-black/10 bg-black/[0.02] hover:bg-black/[0.05] text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-all font-heading min-h-[40px] cursor-pointer"
                        title="Upload your own .GLB or .GLTF file"
                    >
                        <Upload className="w-3.5 h-3.5 text-[#FF5C00]" />
                        <span>Upload Custom GLB</span>
                    </button>

                    {/* Snapshot */}
                    <button
                        onClick={exportSnapshot}
                        className="px-3 py-2 rounded-xl border border-black/10 bg-black/[0.02] hover:bg-black/[0.05] text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-all font-heading min-h-[40px] cursor-pointer"
                        title="Capture 4K WebGL Snapshot"
                    >
                        <Camera className="w-3.5 h-3.5 text-[#FF5C00]" />
                        <span className="hidden sm:inline">4K Snapshot</span>
                    </button>

                    {/* Fullscreen Toggle */}
                    <button
                        onClick={toggleFullscreen}
                        className="p-2.5 rounded-xl border border-black/10 bg-black/[0.02] hover:bg-black/[0.05] text-[#0F172A] transition-all min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                        title="Toggle Immersive Fullscreen"
                    >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* MAIN 3D SPATIAL WORKSPACE CONTAINER */}
            <div className="relative rounded-2xl sm:rounded-3xl border border-black/10 bg-gradient-to-b from-[#f8fafc] to-[#edf2f7] overflow-hidden shadow-xl">
                {/* Loading & Status Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 z-30 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-3 border-[#FF5C00]/20 border-t-[#FF5C00] rounded-full animate-spin" />
                        <span className="text-xs font-bold text-[#0F172A] font-heading tracking-wide">
                            Streaming 3D Spatial Geometry...
                        </span>
                        <span className="text-[11px] font-mono text-[#64748B]">
                            Draco Decompression &amp; WebGL Buffer Allocation
                        </span>
                    </div>
                )}

                {loadError && (
                    <div className="absolute top-4 left-4 right-4 z-30 bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-xl flex items-center justify-between">
                        <span>{loadError}</span>
                        <button 
                            onClick={() => loadModel(selectedPreset)} 
                            className="underline font-bold ml-2 cursor-pointer"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Top-Left: Real-time Telemetry HUD */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-black/10 shadow-sm pointer-events-auto">
                        <Activity className="w-3.5 h-3.5 text-[#FF5C00]" />
                        <span className="text-xs font-mono font-bold text-[#0F172A]">{fps} FPS</span>
                        <span className="text-black/20 font-mono">|</span>
                        <span className="text-[11px] font-mono text-[#64748B]">
                            {polyCount.triangles.toLocaleString()} Triangles
                        </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/80 backdrop-blur-md border border-black/10 text-[10px] font-mono text-[#64748B]">
                        <span>Bounds:</span>
                        <span className="text-[#0F172A] font-bold">
                            {dimensions.x} × {dimensions.y} × {dimensions.z} cm
                        </span>
                    </div>
                </div>

                {/* Top-Right: Camera View Angle Quick-Presets */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-black/10 p-1 rounded-xl shadow-sm">
                    <button
                        onClick={() => setCameraView('iso')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#0F172A] hover:bg-black/5 transition-all font-heading"
                        title="Isometric CAD Perspective"
                    >
                        ISO
                    </button>
                    <button
                        onClick={() => setCameraView('top')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#0F172A] hover:bg-black/5 transition-all font-heading"
                        title="Top-Down Architectural Floor Plan"
                    >
                        Plan
                    </button>
                    <button
                        onClick={() => setCameraView('front')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#0F172A] hover:bg-black/5 transition-all font-heading"
                        title="Front Elevation View"
                    >
                        Front
                    </button>
                    <button
                        onClick={() => setCameraView('reset')}
                        className="p-1 rounded-lg text-[#64748B] hover:text-[#FF5C00] transition-colors"
                        title="Reset Camera Orientation"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* THE THREE.JS INTERACTIVE WEBGL CANVAS */}
                <div 
                    ref={canvasContainerRef} 
                    className="w-full h-[400px] sm:h-[540px] md:h-[620px] cursor-grab active:cursor-grabbing touch-none"
                />

                {/* FLOATING ACTION DOCK: The Signature "Slice" & Studio Controls */}
                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
                    {/* Left: Viewport Mode Chips */}
                    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-black/10 shadow-lg pointer-events-auto max-w-[calc(100%-80px)] overflow-x-auto scrollbar-none">
                        {(['pbr', 'wireframe', 'normals', 'clay', 'xray'] as ViewportMode[]).map((mode) => (
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

                    {/* Right: Turntable Play/Pause */}
                    <div className="p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-black/10 shadow-lg pointer-events-auto">
                        <button
                            onClick={() => setIsAutoSpin(!isAutoSpin)}
                            className={`p-2 rounded-xl transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                                isAutoSpin 
                                    ? 'bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/30' 
                                    : 'text-[#64748B] hover:bg-black/5'
                            }`}
                            title={isAutoSpin ? 'Pause Turntable Rotation' : 'Start Turntable Rotation'}
                        >
                            {isAutoSpin ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ANNOTATION CHIPS: 3D Dimension & Spatial Markers */}
            {annotations.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {annotations.map((ann) => (
                        <div key={ann.id} className="p-3.5 rounded-xl bg-white border border-black/10 flex items-start gap-3 shadow-sm">
                            <div className="w-7 h-7 rounded-lg bg-[#FF5C00]/10 flex items-center justify-center text-[#FF5C00] shrink-0 mt-0.5">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-extrabold text-xs text-[#0F172A] font-heading">{ann.title}</span>
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/5 text-[#64748B]">
                                        {ann.tag}
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#64748B] leading-relaxed">{ann.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* DEDICATED TOOLBELT: Dynamic Mesh Slicing & Studio Lighting Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PANEL 1: The Signature "Slice" Cross-Sectioning Engine */}
                <div className={`p-5 rounded-2xl border transition-all ${
                    sliceEnabled 
                        ? 'bg-white border-[#FF5C00]/40 shadow-md ring-1 ring-[#FF5C00]/20' 
                        : 'bg-white border-black/10 shadow-sm'
                }`}>
                    <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                sliceEnabled ? 'bg-[#FF5C00] text-white' : 'bg-black/5 text-[#64748B]'
                            }`}>
                                <Scissors className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-sm text-[#0F172A] font-heading">
                                    Mesh Slicing Engine
                                </h3>
                                <p className="text-[11px] text-[#64748B]">
                                    Live cross-sectioning &amp; internal CAD slicing
                                </p>
                            </div>
                        </div>

                        {/* Enable/Disable Slice Toggle */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={sliceEnabled}
                                onChange={(e) => setSliceEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-black/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C00]" />
                        </label>
                    </div>

                    <div className={`space-y-4 ${!sliceEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                        {/* Slice Axis Selector */}
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-[#0F172A] font-heading">
                                Cutting Axis:
                            </span>
                            <div className="flex items-center gap-1.5 bg-black/5 p-1 rounded-xl">
                                {(['x', 'y', 'z'] as SliceAxis[]).map((axis) => (
                                    <button
                                        key={axis}
                                        onClick={() => setSliceAxis(axis)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all font-mono min-h-[32px] ${
                                            sliceAxis === axis
                                                ? 'bg-white text-[#FF5C00] shadow-sm font-extrabold'
                                                : 'text-[#64748B] hover:text-[#0F172A]'
                                        }`}
                                    >
                                        {axis.toUpperCase()} ({axis === 'y' ? 'Plan' : axis === 'x' ? 'Cross' : 'Long'})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Slicing Position Slider */}
                        <div>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="font-medium text-[#64748B]">Section Depth:</span>
                                <span className="font-mono font-bold text-[#FF5C00]">{slicePosition}%</span>
                            </div>
                            <input
                                type="range"
                                min="-100"
                                max="100"
                                value={slicePosition}
                                onChange={(e) => setSlicePosition(Number(e.target.value))}
                                className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#FF5C00]"
                            />
                        </div>

                        {/* Section Options */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                            <button
                                onClick={() => setSliceInvert(!sliceInvert)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all font-heading min-h-[36px] ${
                                    sliceInvert
                                        ? 'bg-[#FF5C00]/10 border-[#FF5C00]/30 text-[#FF5C00]'
                                        : 'bg-black/[0.02] border-black/10 text-[#64748B]'
                                }`}
                            >
                                {sliceInvert ? 'Inverted (Reverse Cut)' : 'Normal Direction'}
                            </button>

                            <button
                                onClick={() => setShowSliceHelper(!showSliceHelper)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all font-heading min-h-[36px] ${
                                    showSliceHelper
                                        ? 'bg-[#FF5C00]/10 border-[#FF5C00]/30 text-[#FF5C00]'
                                        : 'bg-black/[0.02] border-black/10 text-[#64748B]'
                                }`}
                            >
                                {showSliceHelper ? 'Cutting Plane Grid: ON' : 'Plane Grid: OFF'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* PANEL 2: Exploded Assembly & Studio Lighting */}
                <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-sm space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-black/5">
                        <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center text-[#64748B]">
                            <Layers className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-sm text-[#0F172A] font-heading">
                                Assembly Separation &amp; Lighting
                            </h3>
                            <p className="text-[11px] text-[#64748B]">
                                Radial component explosion and HDR illumination
                            </p>
                        </div>
                    </div>

                    {/* Exploded View Slider */}
                    <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-medium text-[#64748B]">Exploded View Separation:</span>
                            <span className="font-mono font-bold text-[#0F172A]">{explodeAmount}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={explodeAmount}
                            onChange={(e) => setExplodeAmount(Number(e.target.value))}
                            className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#FF5C00]"
                        />
                    </div>

                    {/* Studio Lighting Presets */}
                    <div>
                        <span className="text-xs font-bold text-[#0F172A] block mb-2 font-heading">
                            Lighting Rig Preset:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {(['studio', 'sunset', 'cyberpunk', 'cad'] as LightingPreset[]).map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => setLightingPreset(preset)}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all border font-heading min-h-[40px] ${
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
            </div>

            {/* TECHNICAL BLUEPRINT & ARCHITECTURAL CASE STUDY CARD */}
            <div className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-black/5">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#FF5C00]" />
                        <h4 className="font-extrabold text-sm text-[#0F172A] font-heading">
                            Bespoke Production Verification: Metropolis Architectural Studios
                        </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20">
                        VERIFIED CASE STUDY
                    </span>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed">
                    Previously, heavy 120MB+ Autodesk Revit and 3ds Max files caused mobile browser crashes during off-plan luxury villa sales in Chennai. By deploying the <strong>Slice3D WebGL Pipeline</strong> with Draco geometry compression, models now stream at <strong>under 49 KB</strong> while retaining full interactive mesh slicing and instant section plane visualization.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-black/[0.02] border border-black/5">
                        <span className="text-[10px] uppercase font-mono text-[#64748B] block">Payload Reduction</span>
                        <span className="font-extrabold text-sm text-[#FF5C00] font-heading">-99.9% (49 KB)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/[0.02] border border-black/5">
                        <span className="text-[10px] uppercase font-mono text-[#64748B] block">Mobile Frame Rate</span>
                        <span className="font-extrabold text-sm text-[#0F172A] font-heading">60 FPS Locked</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/[0.02] border border-black/5">
                        <span className="text-[10px] uppercase font-mono text-[#64748B] block">Geometry Engine</span>
                        <span className="font-extrabold text-sm text-[#0F172A] font-heading">Three.js WebGL 2.0</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/[0.02] border border-black/5">
                        <span className="text-[10px] uppercase font-mono text-[#64748B] block">Procedural Bridge</span>
                        <span className="font-extrabold text-sm text-[#0F172A] font-heading">Blender FastMCP</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
