import React from 'react';
import styles from './styles.module.css';

/**
 * SVG block diagram for feedback control system.
 * Dynamically shows plant equation based on parameters.
 */
export default function BlockDiagram({ plantType, params, theme }) {
  const isDark = theme === 'dark';
  const stroke = isDark ? '#6a6880' : '#9a98a8';
  const textFill = isDark ? '#b8b6c4' : '#5a5a6e';
  const boxFill = isDark ? '#1a1a28' : '#ffffff';
  const boxStroke = isDark ? '#3a3a5a' : '#d0cec8';
  const accentFill = isDark ? '#6b8aff' : '#4a6cf7';
  const arrowFill = isDark ? '#6a6880' : '#9a98a8';

  const plantEq = plantType === 'second-order'
    ? `G(s) = ωn²/(s²+2ζωn·s+ωn²)`
    : `G(s) = K/(Ts+1)`;

  const plantParams = plantType === 'second-order'
    ? `ωn=${params.wn?.toFixed(1)}  ζ=${params.zeta?.toFixed(2)}`
    : `K=${params.K?.toFixed(1)}  T=${params.T?.toFixed(1)}s`;

  return (
    <div className={styles.blockDiagram}>
      <svg viewBox="0 0 660 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
            <polygon points="0 0, 9 3.5, 0 7" fill={arrowFill} />
          </marker>
        </defs>

        {/* 设定值 r(t) */}
        <text x="10" y="40" fill={textFill} fontSize="15" fontFamily="Inter, system-ui, sans-serif">r(t)</text>
        <line x1="48" y1="36" x2="80" y2="36" stroke={stroke} strokeWidth="1.8" markerEnd="url(#arrow)" />

        {/* 比较点 ⊕ */}
        <circle cx="92" cy="36" r="13" fill="none" stroke={boxStroke} strokeWidth="1.8" />
        <text x="86" y="41" fill={accentFill} fontSize="16" fontWeight="bold">+</text>

        {/* 比较点到PID */}
        <line x1="105" y1="36" x2="136" y2="36" stroke={stroke} strokeWidth="1.8" markerEnd="url(#arrow)" />

        {/* PID 控制器 */}
        <rect x="140" y="12" width="110" height="48" rx="8" fill={boxFill} stroke={boxStroke} strokeWidth="1.8" />
        <text x="195" y="42" fill={accentFill} fontSize="17" fontWeight="600" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif">PID</text>

        {/* PID 到被控对象 */}
        <line x1="250" y1="36" x2="286" y2="36" stroke={stroke} strokeWidth="1.8" markerEnd="url(#arrow)" />
        <text x="268" y="26" fill={textFill} fontSize="13" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif">u(t)</text>

        {/* 被控对象 */}
        <rect x="290" y="4" width="240" height="64" rx="8" fill={boxFill} stroke={boxStroke} strokeWidth="1.8" />
        <text x="410" y="30" fill={textFill} fontSize="13" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{plantEq}</text>
        <text x="410" y="52" fill={accentFill} fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="500">{plantParams}</text>

        {/* 被控对象到输出 */}
        <line x1="530" y1="36" x2="570" y2="36" stroke={stroke} strokeWidth="1.8" markerEnd="url(#arrow)" />

        {/* 输出 y(t) */}
        <text x="580" y="40" fill={textFill} fontSize="15" fontFamily="Inter, system-ui, sans-serif">y(t)</text>

        {/* 反馈线 — 从输出线上、箭头之前分支 */}
        <line x1="546" y1="36" x2="546" y2="105" stroke={stroke} strokeWidth="1.8" />
        <line x1="546" y1="105" x2="92" y2="105" stroke={stroke} strokeWidth="1.8" />
        <line x1="92" y1="105" x2="92" y2="49" stroke={stroke} strokeWidth="1.8" markerEnd="url(#arrow)" />
        <text x="76" y="76" fill={accentFill} fontSize="14" fontWeight="bold">−</text>
        <text x="319" y="120" fill={textFill} fontSize="13" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif">反馈</text>
      </svg>
    </div>
  );
}
