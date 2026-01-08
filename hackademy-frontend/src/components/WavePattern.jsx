/**
 * WavePattern - Abstract Guilloché-style wave lines
 * Creates a sophisticated, flowing wave pattern using SVG Bézier curves
 */
const WavePattern = ({ className = '' }) => {
    // Generate wave paths with varying amplitudes and phases
    const generateWavePaths = () => {
        const paths = [];
        const lineCount = 24;
        const width = 600;
        const height = 500;

        for (let i = 0; i < lineCount; i++) {
            // Each line has unique properties for organic variation
            const yOffset = 20 + (i * 18); // Vertical spacing
            const amplitude = 15 + Math.sin(i * 0.5) * 10; // Wave height varies
            const frequency = 0.008 + (i % 3) * 0.002; // Slight frequency variation
            const phase = i * 0.3; // Phase shift for convergence effect
            const warp = Math.sin(i * 0.2) * 30; // Creates the 3D warping effect

            // Build the path using quadratic Bézier curves
            let d = `M 0 ${yOffset + warp}`;

            const segments = 8;
            const segmentWidth = width / segments;

            for (let j = 0; j < segments; j++) {
                const x1 = j * segmentWidth;
                const x2 = (j + 0.5) * segmentWidth;
                const x3 = (j + 1) * segmentWidth;

                // Calculate y positions with converging/diverging effect
                const progress = j / segments;
                const convergeFactor = Math.sin(progress * Math.PI) * 0.6 + 0.4;
                const divergeFactor = 1 + Math.sin((i + j) * 0.4) * 0.3;

                const y1 = yOffset + Math.sin((x1 * frequency) + phase) * amplitude * convergeFactor + warp * divergeFactor;
                const y2 = yOffset + Math.sin((x2 * frequency) + phase) * amplitude * convergeFactor * 1.5 + warp * divergeFactor;
                const y3 = yOffset + Math.sin((x3 * frequency) + phase) * amplitude * convergeFactor + warp * divergeFactor;

                d += ` Q ${x2} ${y2}, ${x3} ${y3}`;
            }

            paths.push({
                d,
                opacity: 0.3 + (i % 5) * 0.1, // Varying opacity for depth
                strokeWidth: 0.8 + Math.sin(i * 0.7) * 0.3 // Varying stroke width
            });
        }

        return paths;
    };

    const wavePaths = generateWavePaths();

    return (
        <svg
            viewBox="0 0 600 500"
            className={`w-full h-full ${className}`}
            preserveAspectRatio="xMinYMin slice"
        >
            <defs>
                {/* Gradient for the wave lines */}
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0.3" />
                </linearGradient>

                {/* Glow filter for subtle luminosity */}
                <filter id="waveGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <g filter="url(#waveGlow)">
                {wavePaths.map((path, index) => (
                    <path
                        key={index}
                        d={path.d}
                        stroke="url(#waveGradient)"
                        strokeWidth={path.strokeWidth}
                        fill="none"
                        opacity={path.opacity}
                        strokeLinecap="round"
                    />
                ))}
            </g>
        </svg>
    );
};

export default WavePattern;
