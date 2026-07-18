import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Link from '@docusaurus/Link';
import { nodes, edges, categories } from './data';
import styles from './styles.module.css';

/**
 * Interactive knowledge graph for the Python tutorial.
 * SVG-based, zero external dependencies.
 */
export default function KnowledgeGraph() {
  const svgRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // Node dimensions
  const NODE_W = 130;
  const NODE_H = 40;
  const NODE_R = 10;

  // Connected nodes for hover highlight
  const connectedMap = useMemo(() => {
    const map = {};
    nodes.forEach((n) => { map[n.id] = new Set(); });
    edges.forEach((e) => {
      map[e.from]?.add(e.to);
      map[e.to]?.add(e.from);
    });
    return map;
  }, []);

  const isHighlighted = useCallback((nodeId) => {
    if (!hoveredNode) return true;
    return nodeId === hoveredNode || connectedMap[hoveredNode]?.has(nodeId);
  }, [hoveredNode, connectedMap]);

  const isEdgeHighlighted = useCallback((edge) => {
    if (!hoveredNode) return true;
    return edge.from === hoveredNode || edge.to === hoveredNode;
  }, [hoveredNode]);

  const isNodeVisible = useCallback((node) => {
    if (!activeCategory) return true;
    return node.category === activeCategory;
  }, [activeCategory]);

  const isEdgeVisible = useCallback((edge) => {
    const fromNode = nodes.find((n) => n.id === edge.from);
    const toNode = nodes.find((n) => n.id === edge.to);
    if (!fromNode || !toNode) return false;
    if (activeCategory) {
      return fromNode.category === activeCategory || toNode.category === activeCategory;
    }
    return true;
  }, [activeCategory]);

  // Pan handlers
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('a') || e.target.closest('foreignObject')) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX, y: e.clientY,
      tx: transform.x, ty: transform.y,
    };
  }, [transform]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setTransform((prev) => ({
      ...prev,
      x: dragStart.current.tx + dx,
      y: dragStart.current.ty + dy,
    }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom handler
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.3, Math.min(2, prev.scale + delta)),
    }));
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Calculate edge path
  const getEdgePath = useCallback((fromNode, toNode) => {
    const fx = fromNode.x + NODE_W / 2;
    const fy = fromNode.y + NODE_H / 2;
    const tx = toNode.x + NODE_W / 2;
    const ty = toNode.y + NODE_H / 2;

    const dx = tx - fx;
    const dy = ty - fy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return '';

    const ux = dx / dist;
    const uy = dy / dist;

    // Start from edge of source node
    const sx = fx + ux * (NODE_W / 2 + 4);
    const sy = fy + uy * (NODE_H / 2 + 4);

    // End at edge of target node
    const ex = tx - ux * (NODE_W / 2 + 8);
    const ey = ty - uy * (NODE_H / 2 + 8);

    // Curved path
    const midX = (sx + ex) / 2;
    const midY = (sy + ey) / 2;
    const perpX = -(ey - sy) * 0.1;
    const perpY = (ex - sx) * 0.1;

    return `M ${sx} ${sy} Q ${midX + perpX} ${midY + perpY} ${ex} ${ey}`;
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Legend */}
      <div className={styles.legend}>
        <button
          className={`${styles.legendItem} ${!activeCategory ? styles.legendActive : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          全部
        </button>
        {Object.entries(categories).map(([key, cat]) => (
          <button
            key={key}
            className={`${styles.legendItem} ${activeCategory === key ? styles.legendActive : ''}`}
            style={{ '--cat-color': cat.color }}
            onClick={() => setActiveCategory(activeCategory === key ? null : key)}
          >
            <span className={styles.legendDot} style={{ background: cat.color }} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* SVG Graph */}
      <div className={styles.svgContainer}>
        <svg
          ref={svgRef}
          className={styles.svg}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <defs>
            {/* Arrow marker */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="var(--ifm-color-emphasis-400)"
              />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="var(--ifm-color-primary)"
              />
            </marker>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
            {/* Edges */}
            {edges.map((edge, i) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              const visible = isEdgeVisible(edge);
              const highlighted = isEdgeHighlighted(edge);
              const path = getEdgePath(fromNode, toNode);

              return (
                <path
                  key={i}
                  d={path}
                  className={`${styles.edge} ${!visible ? styles.edgeHidden : ''} ${highlighted && visible ? styles.edgeHighlighted : ''}`}
                  stroke={highlighted && visible ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-300)'}
                  strokeWidth={highlighted && visible ? 2 : 1.5}
                  fill="none"
                  markerEnd={highlighted && visible ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                  style={{
                    transition: 'stroke 0.2s ease, stroke-width 0.2s ease, opacity 0.3s ease',
                    opacity: visible ? (hoveredNode ? (highlighted ? 1 : 0.2) : 0.6) : 0,
                  }}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const cat = categories[node.category];
              const visible = isNodeVisible(node);
              const highlighted = isHighlighted(node);
              const isHovered = hoveredNode === node.id;

              return (
                <g
                  key={node.id}
                  className={`${styles.nodeGroup} ${!visible ? styles.nodeHidden : ''}`}
                  style={{ opacity: visible ? (hoveredNode ? (highlighted ? 1 : 0.3) : 1) : 0.15 }}
                >
                  <Link to={node.path} style={{ textDecoration: 'none' }}>
                    {/* Shadow */}
                    <rect
                      x={node.x + 2}
                      y={node.y + 2}
                      width={NODE_W}
                      height={NODE_H}
                      rx={NODE_R}
                      fill="rgba(0,0,0,0.08)"
                      style={{ transition: 'all 0.2s ease' }}
                    />
                    {/* Background */}
                    <rect
                      x={node.x}
                      y={node.y}
                      width={NODE_W}
                      height={NODE_H}
                      rx={NODE_R}
                      fill={isHovered ? cat.color : 'var(--ifm-card-background-color)'}
                      stroke={cat.color}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      style={{
                        transition: 'all 0.2s ease',
                        filter: isHovered ? 'url(#glow)' : 'none',
                      }}
                    />
                    {/* Left accent bar */}
                    <rect
                      x={node.x}
                      y={node.y}
                      width={4}
                      height={NODE_H}
                      rx={2}
                      fill={cat.color}
                      style={{ transition: 'all 0.2s ease' }}
                    />
                    {/* Label */}
                    <foreignObject
                      x={node.x + 10}
                      y={node.y}
                      width={NODE_W - 16}
                      height={NODE_H}
                    >
                      <div
                        className={styles.nodeLabel}
                        style={{ color: isHovered ? 'white' : 'var(--ifm-color-text-primary)' }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        {node.label}
                      </div>
                    </foreignObject>
                  </Link>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Zoom controls */}
        <div className={styles.zoomControls}>
          <button
            className={styles.zoomBtn}
            onClick={() => setTransform((p) => ({ ...p, scale: Math.min(2, p.scale + 0.2) }))}
          >
            +
          </button>
          <button
            className={styles.zoomBtn}
            onClick={() => setTransform((p) => ({ ...p, scale: Math.max(0.3, p.scale - 0.2) }))}
          >
            −
          </button>
          <button
            className={styles.zoomBtn}
            onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
          >
            ⟳
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className={styles.instructions}>
        <span>🖱 拖拽平移</span>
        <span>🔍 滚轮缩放</span>
        <span>👆 点击节点跳转</span>
      </div>
    </div>
  );
}
