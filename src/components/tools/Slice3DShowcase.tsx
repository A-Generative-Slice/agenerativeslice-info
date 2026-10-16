import React, { useState, useEffect, useRef } from 'react';
import { 
    RotateCcw, Eye, Play, Pause, 
    Sparkles, Check, Activity 
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

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

export const Slice3DShowcase: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedColor, setSelectedColor] = useState<ColorOption>(colorOptions[0]);
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

        const vertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
            [0, -1.5, 0], [0, 1.5, 0],
            [-1.4, 0, 0], [1.4, 0, 0]
        ];

        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
            [8, 0], [8, 1], [8, 4], [8, 5],
            [9, 2], [9, 3], [9, 6], [9, 7],
            [10, 0], [10, 3], [10, 4], [10, 7],
            [11, 1], [11, 2], [11, 5], [11, 6]
        ];

        const faces = [
            { indices: [0, 1, 2, 3], normal: [0, 0, -1] },
            { indices: [4, 5, 6, 7], normal: [0, 0, 1] },
            { indices: [0, 1, 5, 4], normal: [0, -1, 0] },
            { indices: [2, 3, 7, 6], normal: [0, 1, 0] },
            { indices: [0, 3, 7, 4], normal: [-1, 0, 0] },
            { indices: [1, 2, 6, 5], normal: [1, 0, 0] },
            { indices: [9, 2, 6], normal: [0.5, 1, 0.5] },
            { indices: [9, 3, 7], normal: [-0.5, 1, 0.5] },
            { indices: [8, 0, 4], normal: [-0.5, -1, 0.5] },
            { indices: [8, 1, 5], normal: [0.5, -1, 0.5] }
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
                rotRef.current.y += dt * 35;
            }

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = '#0B0F17';
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            const gridSize = 32;
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

            const gradient = ctx.createRadialGradient(
                width / 2, height / 2 + 80, 20,
                width / 2, height / 2 + 80, 240
            );
            gradient.addColorStop(0, selectedColor.hex + '33');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            const radX = (rotRef.current.x * Math.PI) / 180;
            const radY = (rotRef.current.y * Math.PI) / 180;
            const cosX = Math.cos(radX);
            const sinX = Math.sin(radX);
            const cosY = Math.cos(radY);
            const sinY = Math.sin(radY);

            const scale = Math.min(width, height) * 0.22 * zoom;
            const cx = width / 2;
            const cy = height / 2;

            const projected = vertices.map(([vx, vy, vz]) => {
                const x1 = vx * cosY + vz * sinY;
                const y1 = vy;
                const z1 = -vx * sinY + vz * cosY;

                const x2 = x1;
                const y2 = y1 * cosX - z1 * sinX;
                const z2 = y1 * sinX + z1 * cosX;

                const fov = 4.0;
                const distance = 4.5;
                const pz = z2 + distance;
                const factor = (fov / pz) * scale;

                return {
                    x: cx + x2 * factor,
                    y: cy - y2 * factor,
                    z: z2
                };
            });

            if (!isWireframe) {
                const sortedFaces = faces.map(face => {
                    let avgZ = 0;
                    face.indices.forEach(idx => {
                        avgZ += projected[idx].z;
                    });
                    avgZ /= face.indices.length;
                    return { ...face, avgZ };
                }).sort((a, b) => b.avgZ - a.avgZ);

                sortedFaces.forEach(face => {
                    const pts = face.indices.map(i => projected[i]);
                    ctx.beginPath();
                    ctx.moveTo(pts[0].x, pts[0].y);
                    for (let i = 1; i < pts.length; i++) {
                        ctx.lineTo(pts[i].x, pts[i].y);
                    }
                    ctx.closePath();

                    const lightIntensity = Math.max(0.2, (face.avgZ + 1.8) / 3.2);
                    ctx.fillStyle = selectedColor.meshColor;
                    ctx.globalAlpha = Math.min(0.9, lightIntensity);
                    ctx.fill();

                    ctx.globalAlpha = 0.4;
                    ctx.strokeStyle = selectedColor.specular;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                });
                ctx.globalAlpha = 1.0;
            }

            if (isWireframe) {
                ctx.strokeStyle = selectedColor.hex;
                ctx.lineWidth = 1.8;
                edges.forEach(([i, j]) => {
                    ctx.beginPath();
                    ctx.moveTo(projected[i].x, projected[i].y);
                    ctx.lineTo(projected[j].x, projected[j].y);
                    ctx.stroke();
                });

                projected.forEach((p) => {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            const pTop = projected[9];
            const pBottom = projected[8];
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(pTop.x + 40, pTop.y);
            ctx.lineTo(pBottom.x + 40, pBottom.y);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '10px monospace';
            ctx.fillText('180mm', pTop.x + 48, (pTop.y + pBottom.y) / 2);

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [selectedColor, isWireframe, isAutoSpin, zoom]);

    const handleMouseDown = (e: React.MouseEvent) => {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;
        rotRef.current.y += dx * 0.6;
        rotRef.current.x -= dy * 0.6;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
    };

    const resetView = () => {
        rotRef.current = { x: 25, y: 35 };
        setZoom(1);
    };

    return (
        <div className="w-full rounded-3xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-white/10 bg-[#0B0F17]/90 backdrop-blur flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <img src={logoImg} alt="AGS Logo" className="w-8 h-8 rounded-full border border-[#FF5C00]/40 object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-heading">Slice3D Web Engine</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/30">
                                Interactive Sandbox
                            </span>
                        </div>
                        <p className="text-[11px] text-white/50">Drag mouse/touch to rotate 360° • Zero app download</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/70">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                            <Activity className="w-3.5 h-3.5 animate-pulse" /> {fps} FPS
                        </span>
                        <span className="text-white/30">|</span>
                        <span>1.2 MB Payload</span>
                        <span className="text-white/30">|</span>
                        <span>WebGL 2.0</span>
                    </div>

                    <button
                        onClick={() => setIsAutoSpin(!isAutoSpin)}
                        className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
                            isAutoSpin 
                                ? 'bg-[#FF5C00]/20 text-[#FF5C00] border-[#FF5C00]/30' 
                                : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                        }`}
                        title={isAutoSpin ? 'Pause auto-spin' : 'Resume auto-spin'}
                    >
                        {isAutoSpin ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={resetView}
                        className="p-2 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:text-white hover:bg-white/10 transition-colors"
                        title="Reset 3D camera"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div 
                className="relative w-full h-[420px] cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <canvas 
                    ref={canvasRef} 
                    className="w-full h-full block" 
                />

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <button
                        onClick={() => setIsWireframe(!isWireframe)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 backdrop-blur-md transition-all ${
                            isWireframe 
                                ? 'bg-[#FF5C00] text-white border-[#FF5C00]' 
                                : 'bg-[#0B0F17]/80 text-white/80 border-white/10 hover:bg-[#0B0F17]'
                        }`}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        {isWireframe ? 'Wireframe Mode' : 'Shaded CAD Mesh'}
                    </button>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-1.5">
                    <button 
                        onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.6))}
                        className="w-8 h-8 rounded-xl bg-[#0B0F17]/80 hover:bg-[#0B0F17] text-white text-xs border border-white/10 flex items-center justify-center font-bold"
                    >
                        +
                    </button>
                    <button 
                        onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.6))}
                        className="w-8 h-8 rounded-xl bg-[#0B0F17]/80 hover:bg-[#0B0F17] text-white text-xs border border-white/10 flex items-center justify-center font-bold"
                    >
                        -
                    </button>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-[11px] text-white/60 pointer-events-none flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#FF5C00]" />
                    Click & drag in any direction to explore 360° geometry
                </div>
            </div>

            <div className="px-6 py-4 bg-[#0B0F17] border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white/70 uppercase tracking-wider font-heading">
                        Finish & Material:
                    </span>
                    <span className="text-xs font-bold text-[#FF5C00]">{selectedColor.name}</span>
                </div>

                <div className="flex items-center gap-2.5">
                    {colorOptions.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => setSelectedColor(opt)}
                            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                                selectedColor.id === opt.id
                                    ? 'bg-white/10 border-[#FF5C00] text-white'
                                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'
                            }`}
                        >
                            <span 
                                className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-inner flex items-center justify-center"
                                style={{ backgroundColor: opt.hex }}
                            >
                                {selectedColor.id === opt.id && <Check className="w-2.5 h-2.5 text-white" />}
                            </span>
                            <span>{opt.name.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
