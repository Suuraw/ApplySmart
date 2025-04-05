"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useTheme } from "next-themes";

interface ATSScoreDashboardProps {
  score?: number;
  loading?: boolean;
  maxScore?: number;
}

const ATSScoreDashboard: React.FC<ATSScoreDashboardProps> = ({
  score,
  loading,
  maxScore = 100,
}) => {
  const [displayScore, setDisplayScore] = useState<number | null>(null);
  const controls = useAnimationControls();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { resolvedTheme } = useTheme(); // Use resolvedTheme instead of theme

  if (score || score === 0) {
    score = Math.abs(score - 100);
  }

  const startAngle = 180;
  const endAngle = 0;
  const angleRange = startAngle - endAngle;

  const scoreToAngle = (score: number) =>
    startAngle - (score / maxScore) * angleRange;

  useEffect(() => {
    if (loading) {
      let isIncreasing = true;
      let currentPosition = 0;

      controls.start({
        rotate: scoreToAngle(100),
        transition: { duration: 0 },
      });

      intervalRef.current = setInterval(() => {
        if (isIncreasing) {
          currentPosition += 5;
          if (currentPosition >= 100) isIncreasing = false;
        } else {
          currentPosition -= 5;
          if (currentPosition <= 0) isIncreasing = true;
        }

        controls.start({
          rotate: scoreToAngle(currentPosition),
          transition: { duration: 0.5, ease: "linear" },
        });
      }, 100);

      setDisplayScore(null);
    } else if (!loading && score !== undefined) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      controls.start({
        rotate: scoreToAngle(score),
        transition: { duration: 1, ease: "easeOut" },
      });

      const duration = 1500;
      const startTime = Date.now();
      const countUp = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setDisplayScore(Math.floor(progress * score!));

        if (progress < 1) {
          requestAnimationFrame(countUp);
        }
      };

      requestAnimationFrame(countUp);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading, score, controls, maxScore]);

  const needleColor = resolvedTheme === "dark" ? "#ffffff" : "#1f2937";

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
      <div className="flex flex-col items-center">
        <div className="relative w-72 aspect-square">
          <svg viewBox="0 0 200 107.8" className="w-full">
            <path
              d="M10,100 A90,90 0 0,1 190,100"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            <path
              d="M10,100 A90,90 0 0,1 70,15.5"
              fill="none"
              stroke="#ef4444"
              strokeWidth="10"
            />
            <path
              d="M70,15.5 A90,90 0 0,1 130,15.5"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="10"
            />
            <path
              d="M130,15.5 A90,90 0 0,1 190,100"
              fill="none"
              stroke="#22c55e"
              strokeWidth="10"
            />

            {[0, 20, 40, 60, 80, 100].map((tick) => {
              const angle = scoreToAngle(tick);
              const rad = (angle * Math.PI) / 180;
              const x1 = 100 + 75 * Math.cos(rad);
              const y1 = 99 + 90 * Math.sin(rad);
              const x2 = 100 + 85 * Math.cos(rad);
              const y2 = 99 + 90 * Math.sin(rad);

              return (
                <g key={tick}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={needleColor}
                    strokeWidth="2"
                  />
                  <text
                    x={100 + 65 * Math.cos(rad)}
                    y={100 + 65 * Math.sin(rad)}
                    fontSize="10"
                    fill={needleColor}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            <circle cx="100" cy="100" r="8" fill={needleColor} />

            <motion.line
              x1="50"
              y1="100"
              x2="100"
              y2="100"
              stroke={needleColor}
              strokeWidth="3"
              strokeLinecap="round"
              initial={{
                rotate: scoreToAngle(120),
                originX: "100px",
                originY: "100px",
              }}
              animate={controls}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
            <div className="text-4xl font-bold">
              {displayScore == null
                ? displayScore
                : loading || score === 100
                ? "..."
                : 100 - (score == undefined ? 0 : score)}
            </div>
            <div className="text-sm text-gray-500">ATS Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreDashboard;
