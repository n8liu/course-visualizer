"use client";

import {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-3d";

import berkeleyCoursesData from "../data/berkeley-courses-data.json";
import { RefObject, useCallback, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import tinyColor, { type ColorInput } from "tinycolor2";
import SearchBar from "@/components/search-bar";
import DepartmentFilter from "@/components/department-filter";
import { Node } from "@/lib/types";
import { X } from "lucide-react";

const ForceGraph = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

const val = 1;
const nodeRelSize = 4;
const nodeResolution = 8;

const CAMERA_DISTANCE2NODES_FACTOR = 170;

const colorStr2Hex = (str: ColorInput | number) =>
  typeof str !== "number" ? parseInt(tinyColor(str).toHex(), 16) : str;

export default function Home() {
  const [focusedCourse, setFocusedCourse] = useState<Node | null>(null);
  const [search, setSearch] = useState("");
  const [isEngineRunning, setIsEngineRunning] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    "COMPSCI", "MATH", "STAT", "PHYSICS", "EECS", "DATA"
  ]); // Start with popular STEM departments to reduce initial load
  const [showDepartmentFilter, setShowDepartmentFilter] = useState(false);

  const fgRef: RefObject<
    ForceGraphMethods<NodeObject, LinkObject> | undefined
  > = useRef(undefined);

  // Filter courses and links based on selected departments
  const filteredData = useMemo(() => {
    if (selectedDepartments.length === 0) {
      return berkeleyCoursesData;
    }

    const filteredNodes = berkeleyCoursesData.nodes.filter((node) =>
      selectedDepartments.includes(node.department || "")
    );
    
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    
    const filteredLinks = berkeleyCoursesData.links.filter(
      (link) =>
        nodeIds.has(link.source as string) && nodeIds.has(link.target as string)
    );

    return {
      nodes: filteredNodes,
      links: filteredLinks,
    };
  }, [selectedDepartments]);

  const focusNode = useCallback(
    (node: {
      [others: string]: unknown;
      id?: string | number | undefined;
      x?: number | undefined;
      y?: number | undefined;
      z?: number | undefined;
      vx?: number | undefined;
      vy?: number | undefined;
      vz?: number | undefined;
      fx?: number | undefined;
      fy?: number | undefined;
      fz?: number | undefined;
    }) => {
      if (node.x === undefined || node.y === undefined || node.z === undefined)
        return;

      setSearch(`${node.id} - ${node.name}`);
      setFocusedCourse({ id: node.id as string, name: node.name as string });

      // Aim at node from outside it
      const distance = 100;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current!.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        { x: node.x, y: node.y, z: node.z }, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
    },
    [fgRef]
  );

  const handleSelectedCourse = (course: Node | null) => {
    if (course === null) {
      if (focusedCourse !== null) {
        setFocusedCourse(null);
        fgRef.current!.cameraPosition(
          {
            x: 0,
            y: 0,
            z:
              Math.cbrt(filteredData.nodes.length) *
              CAMERA_DISTANCE2NODES_FACTOR,
          },
          { x: 0, y: 0, z: 0 },
          3000
        );
      }
      return;
    }

    const node = filteredData.nodes.find(
      (node) => node.id === course.id
    ) as NodeObject<
      NodeObject<{
        id: string;
        name: string;
      }>
    >;

    focusNode(node);
  };

  const getThreeObject = useCallback(
    (node: {
      [others: string]: unknown;
      id?: string | number | undefined;
      x?: number | undefined;
      y?: number | undefined;
      z?: number | undefined;
      vx?: number | undefined;
      vy?: number | undefined;
      vz?: number | undefined;
      fx?: number | undefined;
      fy?: number | undefined;
      fz?: number | undefined;
    }) => {
      const radius = Math.cbrt(val) * nodeRelSize;
      // Reduce segments for better performance
      const numSegments = 6; // Reduced from 8

      const geometry = new THREE.SphereGeometry(
        radius,
        numSegments,
        numSegments
      );
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(
          colorStr2Hex((node.color as number | string) || "#ffffaa")
        ),
        transparent: true,
        opacity:
          focusedCourse === null || node.id === focusedCourse.id ? 0.75 : 0.3,
      });

      const mesh = new THREE.Mesh(geometry, material);
      return mesh;
    },
    [focusedCourse]
  );

  return (
    <main className="relative">
      <SearchBar
        courses={filteredData.nodes}
        links={filteredData.links}
        onCourseSelect={handleSelectedCourse}
        selectedCourse={focusedCourse}
        search={search}
        onSearchChange={setSearch}
        isLoading={isEngineRunning}
        onFilterClick={() => setShowDepartmentFilter(!showDepartmentFilter)}
        filterCount={selectedDepartments.length}
      />

      {/* Department Filter Sidebar */}
      {showDepartmentFilter && (
        <div className="fixed top-20 right-4 z-40 w-80 bg-background border rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filter by Department</h3>
            <button
              onClick={() => setShowDepartmentFilter(false)}
              className="p-1 hover:bg-accent rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <DepartmentFilter
            courses={berkeleyCoursesData.nodes}
            selectedDepartments={selectedDepartments}
            onDepartmentsChange={setSelectedDepartments}
          />
        </div>
      )}

      {/* Course Stats */}
      <div className="fixed bottom-4 left-4 z-40 bg-background/90 backdrop-blur-sm border rounded-lg shadow-lg px-4 py-2">
        <div className="text-sm">
          <span className="font-medium">{filteredData.nodes.length}</span> courses
          {selectedDepartments.length > 0 && (
            <span className="text-muted-foreground ml-2">
              ({selectedDepartments.length} departments)
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {filteredData.links.length} connections
        </div>
        {filteredData.nodes.length > 1000 && (
          <div className="text-xs text-amber-600 mt-1">
            ⚡ Large dataset - may be slow
          </div>
        )}
      </div>

      <ForceGraph
        graphData={filteredData}
        nodeAutoColorBy={(node) => (node.id as string).match(/[a-zA-Z]+/)![0]}
        nodeLabel={(node) => `${node.id} - ${node.name}`}
        // Performance optimizations
        cooldownTicks={100}
        cooldownTime={5000}
        warmupTicks={50}
        // Link optimizations
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        linkWidth={(link) => {
          if (!focusedCourse) return 1.5;
          const source = typeof link.source === 'object' ? link.source.id : link.source;
          const target = typeof link.target === 'object' ? link.target.id : link.target;
          return source === focusedCourse.id || target === focusedCourse.id ? 3 : 0.5;
        }}
        linkColor={(link) => {
          if (!focusedCourse) return "rgba(100, 150, 255, 0.5)";
          const source = typeof link.source === 'object' ? link.source.id : link.source;
          const target = typeof link.target === 'object' ? link.target.id : link.target;
          // Highlight links connected to focused course
          if (source === focusedCourse.id || target === focusedCourse.id) {
            return "rgba(34, 197, 94, 0.8)"; // Green for connected
          }
          return "rgba(100, 150, 255, 0.15)"; // More dimmed for others
        }}
        linkOpacity={(link) => {
          if (!focusedCourse) return 0.5;
          const source = typeof link.source === 'object' ? link.source.id : link.source;
          const target = typeof link.target === 'object' ? link.target.id : link.target;
          return source === focusedCourse.id || target === focusedCourse.id ? 0.8 : 0.15;
        }}
        linkDirectionalParticles={(link) => {
          // Only show particles on focused course links
          if (!focusedCourse) return 0;
          const source = typeof link.source === 'object' ? link.source.id : link.source;
          const target = typeof link.target === 'object' ? link.target.id : link.target;
          return source === focusedCourse.id || target === focusedCourse.id ? 3 : 0;
        }}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.008}
        linkLabel={(link) => {
          const source = typeof link.source === 'object' ? link.source.id : link.source;
          const target = typeof link.target === 'object' ? link.target.id : link.target;
          return `Prerequisite: ${source} → ${target}`;
        }}
        // Additional performance settings
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        enableNavigationControls={true}
        enablePointerInteraction={true}
        ref={fgRef}
        onNodeClick={focusNode}
        enableNodeDrag={false}
        nodeThreeObject={getThreeObject}
        onEngineStop={() => setIsEngineRunning(false)}
      />
    </main>
  );
} 