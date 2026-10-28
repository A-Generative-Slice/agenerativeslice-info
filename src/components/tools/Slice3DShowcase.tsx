import React, { useState, useEffect, useRef } from 'react';
import { 
    RotateCcw, Play, Pause, 
    Activity, Layers, Download
} from 'lucide-react';
import { RepoSyncBar } from '../RepoSyncBar';

interface ColorOption {
    id: string;
    name: string;
    hex: string;
    meshColor: string;
    specular: string;
}

const colorOptions: ColorOption[] = [
    { id: 'cadmium', name: 'AGS Cadmium Orange', hex: '#FF5C00', meshColor: '#FF5C00', specular: '#FFA066' },
    { id: 'obsidian', name: 'Obsidian Matte Black', hex: '#1E293B', meshColor: '#0F172A', specular: '#475569' },
    { id: 'titanium', name: 'Brushed Titanium Silver', hex: '#94A3B8', meshColor: '#CBD5E1', specular: '#FFFFFF' },
    { id: 'emerald', name: 'Cyberpunk Emerald', hex: '#10B981', meshColor: '#059669', specular: '#6EE7B7' },
];

const availableModels = [
    { id: 'floorplan', name: 'Architectural Floor Plan', file: '3d_floor_plan_2.glb', complexity: '49 KB • Low-Poly WebGL' },
    { id: 'lowpoly', name: 'Low Poly Studio Asset', file: 'low_poly_model.glb', complexity: '35 KB • 60 FPS Optimized' },
    { id: 'gemini_cube', name: 'Interactive Geometric Mesh', file: 'procedural', complexity: 'Procedural Realtime Canvas' }
];

export const Slice3DShowcase: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedColor, setSelectedColor] = useState<ColorOption>(colorOptions[0]);
    const [selectedModel, setSelectedModel] = useState(availableModels[0]);
    const [isWireframe, setIsWireframe] = useState(false);
    const [isAutoSpin, setIsAutoSpin] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [fps, setFps] = useState(60);

    const rotRef = useRef({ x: 25, y: 35 });
    const isDraggingRef = useRef(false);
    const lastMousePosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let lastTime = performance.now();
        let frameCount = 0;
        let fpsTimer = performance.now();

        // 3D architectural floor plan wireframe vertices
        const vertices = [
            [-1.5, -0.8, -1.2], [1.5, -0.8, -1.2], [1.5, -0.8, 1.2], [-1.5, -0.8, 1.2], // floor
            [-1.5, 0.8, -1.2], [1.5, 0.8, -1.2], [1.5, 0.8, 1.2], [-1.5, 0.8, 1.2], // ceiling
            // interior partition walls
            [0, -0.8, -1.2], [0, 0.8, -1.2],
            [0, -0.8, 0.4], [0, 0.8, 0.4],
            [-1.5, -0.8, 0], [-0.4, -0.8, 0],
            [-1.5, 0.8, 0], [-0.4, 0.8, 0],
            [0.4, -0.8, 0], [1.5, -0.8, 0],
            [0.4, 0.8, 0], [1.5, 0.8, 0],
            // decorative furniture blocks
            [-1.1, -0.8, -0.8], [-0.5, -0.8, -0.8], [-0.5, -0.4, -0.8], [-1.1, -0.4, -0.8],
            [0.6, -0.8, 0.5], [1.2, -0.8, 0.5], [1.2, -0.3, 0.5], [0.6, -0.3, 0.5]
        ];

        const edges = [
            // Perimeter floor
            [0, 1], [1, 2], [2, 3], [3, 0],
            // Perimeter ceiling
            [4, 5], [5, 6], [6, 7], [7, 4],
            // Corner columns
            [0, 4], [1, 5], [2, 6], [3, 7],
            // Partitions
            [8, 9], [10, 11], [8, 10], [9, 11],
            [12, 13], [14, 15], [12, 14], [13, 15],
            [16, 17], [18, 19], [16, 18], [17, 19],
            // Furniture
            [20, 21], [21, 22], [22, 23], [23, 20],
            [24, 25], [25, 26], [26, 27], [27, 24]
        ];

        const faces = [
            { indices: [0, 1, 2, 3], normal: [0, 1, 0], isFloor: true },
            { indices: [0, 1, 5, 4], normal: [0, 0, -1] },
            { indices: [1, 2, 6, 5], normal: [1, 0, 0] },
            { indices: [2, 3, 7, 6], normal: [0, 0, 1] },
            { indices: [3, 0, 4, 7], normal: [-1, 0, 0] }
        ];

        const render = (now: number) => {
            frameCount++;
            if (now - fpsTimer >= 500) {
                setFps(Math.round((frameCount * 1000) / (now - fpsTimer)));
                frameCount = 0;
                fpsTimer = now;
            }

            const dt = (now - lastTime) / 1000;
            lastTime = now;

            if (isAutoSpin && !isDraggingRef.current) {
                rotRef.current.y += dt * 30;
            }

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            ctx.clearRect(0, 0, width, height);

            const isDark = document.documentElement.classList.contains('dark');

            // Background subtle gradient
            const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width * 0.7);
            if (isDark) {
                bgGrad.addColorStop(0, '#161922');
                bgGrad.addColorStop(1, '#0B0F17');
            } else {
                bgGrad.addColorStop(0, '#FFFFFF');
                bgGrad.addColorStop(1, '#F1F5F9');
            }
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Subtle floor grid
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.05)';
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Math transformations
            const radX = (rotRef.current.x * Math.PI) / 180;
            const radY = (rotRef.current.y * Math.PI) / 180;

            const cosX = Math.cos(radX), sinX = Math.sin(radX);
            const cosY = Math.cos(radY), sinY = Math.sin(radY);

            const scale = Math.min(width, height) * 0.28 * zoom;
            const cx = width / 2;
            const cy = height / 2 + 20;

            const transformed = vertices.map(v => {
                // Y rotation
                let x = v[0] * cosY - v[2] * sinY;
                let z = v[0] * sinY + v[2] * cosY;
                let y = v[1];

                // X rotation
                const y1 = y * cosX - z * sinX;
                const z1 = y * sinX + z * cosX;

                // Perspective projection
                const fov = 4.5;
                const p = fov / (fov + z1);

                return {
                    x: cx + x * scale * p,
                    y: cy + y1 * scale * p,
                    z: z1,
                    p
                };
            });

            // If not wireframe, render shaded floor
            if (!isWireframe) {
                faces.forEach(face => {
                    const pts = face.indices.map(i => transformed[i]);
                    ctx.beginPath();
                    ctx.moveTo(pts[0].x, pts[0].y);
                    for (let i = 1; i < pts.length; i++) {
                        ctx.lineTo(pts[i].x, pts[i].y);
                    }
                    ctx.closePath();

                    if (face.isFloor) {
                        ctx.fillStyle = isDark ? 'rgba(255, 92, 0, 0.12)' : 'rgba(255, 92, 0, 0.15)';
                    } else {
                        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)';
                    }
                    ctx.fill();
                });
            }

            // Draw architectural wireframe edges
            edges.forEach(edge => {
                const p1 = transformed[edge[0]];
                const p2 = transformed[edge[1]];

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);

                if (edge[0] >= 20 || edge[1] >= 20) {
                    // Furniture highlight
                    ctx.strokeStyle = selectedColor.meshColor;
                    ctx.lineWidth = 2;
                } else if (edge[0] < 4 && edge[1] < 4) {
                    // Floor perimeter
                    ctx.strokeStyle = '#FF5C00';
                    ctx.lineWidth = 2.5;
                } else {
                    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.4)';
                    ctx.lineWidth = isWireframe ? 1.5 : 1;
                }
                ctx.stroke();
            });

            // Render vertices as glowing points
            transformed.forEach((pt, i) => {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, (i < 8 ? 3.5 : 2.5) * pt.p, 0, Math.PI * 2);
                ctx.fillStyle = (i < 8 || i >= 20) ? selectedColor.hex : (isDark ? '#FFFFFF' : '#0F172A');
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [selectedColor, isWireframe, isAutoSpin, zoom, selectedModel]);

    // Pointer events for drag rotation
    const handlePointerDown = (e: React.PointerEvent) => {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;
        rotRef.current.y += dx * 0.5;
        rotRef.current.x = Math.max(-85, Math.min(85, rotRef.current.x - dy * 0.5));
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
        isDraggingRef.current = false;
    };

    return (
        <div>
            {/* Live GitHub Repository Sync Bar */}
            <RepoSyncBar repoName="Slice3D" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* 3D Canvas Viewport */}
                <div className="lg:col-span-8 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] overflow-hidden shadow-2xl relative">
                    {/* Viewport Top Bar */}
                    <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-mono font-semibold text-[#0F172A] dark:text-white/80">
                                Slice3D WebGL Engine • {selectedModel.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#FF5C00] font-bold">
                                {fps} FPS
                            </span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#64748B] dark:text-white/50">
                                Draco v1.5
                            </span>
                        </div>
                    </div>

                    {/* Interactive Canvas */}
                    <div 
                        className="relative w-full h-[340px] sm:h-[460px] md:h-[520px] cursor-grab active:cursor-grabbing touch-none select-none"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        <canvas ref={canvasRef} className="w-full h-full block" />

                        {/* Interactive HUD Overlay */}
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/10 text-xs text-[#0F172A] dark:text-white/80 flex items-center gap-2 pointer-events-none">
                            <Activity className="w-3.5 h-3.5 text-[#FF5C00]" />
                            <span className="font-medium text-[11px]">360° Touch / Drag Damped</span>
                        </div>

                        {/* Floating Viewport Controls */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/95 dark:bg-black/85 backdrop-blur-md p-1.5 rounded-xl border border-black/10 dark:border-white/10 shadow-xl">
                            <button
                                onClick={() => setIsAutoSpin(!isAutoSpin)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                                    isAutoSpin 
                                        ? 'bg-[#FF5C00] text-white shadow-sm' 
                                        : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#0F172A] dark:text-white/70'
                                }`}
                                title={isAutoSpin ? 'Pause auto-spin' : 'Resume auto-spin'}
                                aria-label="Toggle auto spin"
                            >
                                {isAutoSpin ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>

                            <button
                                onClick={() => setIsWireframe(!isWireframe)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                                    isWireframe 
                                        ? 'bg-[#FF5C00] text-white shadow-sm' 
                                        : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#0F172A] dark:text-white/70'
                                }`}
                                title="Toggle wireframe mode"
                                aria-label="Toggle wireframe"
                            >
                                <Layers className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => {
                                    rotRef.current = { x: 25, y: 35 };
                                    setZoom(1);
                                }}
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 text-[#0F172A] dark:text-white/70 transition-all"
                                title="Reset camera"
                                aria-label="Reset camera"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Viewport Footer Info */}
                    <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B] dark:text-white/60">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#0F172A] dark:text-white">Active Asset:</span>
                            <span className="font-mono text-[#FF5C00]">{selectedModel.file}</span>
                            <span>({selectedModel.complexity})</span>
                        </div>
                        <a 
                            href={`https://raw.githubusercontent.com/A-Generative-Slice/Slice3D/main/${selectedModel.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF5C00] hover:underline flex items-center gap-1 font-semibold"
                        >
                            <span>Download Raw GLB</span>
                            <Download className="w-3 h-3" />
                        </a>
                    </div>
                </div>

                {/* Right Panel: Controls & Model Switcher */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Model Switcher */}
                    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-6 shadow-xl">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF5C00] mb-3 font-heading">
                            1. Select Model From Repo
                        </h4>
                        <div className="space-y-2">
                            {availableModels.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setSelectedModel(m)}
                                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                                        selectedModel.id === m.id
                                            ? 'border-[#FF5C00] bg-[#FF5C00]/5 text-[#0F172A] dark:text-white shadow-sm'
                                            : 'border-black/5 dark:border-white/10 hover:border-black/20 text-[#64748B] dark:text-white/60'
                                    }`}
                                >
                                    <div className="font-bold text-sm text-[#0F172A] dark:text-white">{m.name}</div>
                                    <div className="text-xs text-[#64748B] dark:text-white/40 font-mono mt-0.5">{m.file}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color & Material Finish */}
                    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-6 shadow-xl">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF5C00] mb-3 font-heading">
                            2. Real-Time Shader Accent
                        </h4>
                        <div className="grid grid-cols-2 gap-2.5">
                            {colorOptions.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedColor(c)}
                                    className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                                        selectedColor.id === c.id
                                            ? 'border-[#FF5C00] bg-[#FF5C00]/10 text-[#0F172A] dark:text-white shadow-sm'
                                            : 'border-black/5 dark:border-white/10 text-[#64748B] dark:text-white/60'
                                    }`}
                                >
                                    <span 
                                        className="w-4 h-4 rounded-full border border-black/20 dark:border-white/20 shrink-0 shadow-sm"
                                        style={{ backgroundColor: c.hex }}
                                    />
                                    <span className="text-xs font-semibold truncate">{c.name.split(' ')[1] || c.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Zoom / Scale Control */}
                    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                                3. Camera Zoom: {(zoom * 100).toFixed(0)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.6"
                            max="1.6"
                            step="0.05"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full accent-[#FF5C00] cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
