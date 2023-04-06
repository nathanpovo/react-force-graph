import * as React from 'react';
import { Object3D, Material } from 'three';
import { ConfigOptions, ForceGraphVRInstance as ForceGraphKapsuleInstance } from '3d-force-graph-vr';

export interface GraphData<NodeType extends NodeObject, LinkType extends LinkObject<NodeType>> {
  nodes: NodeType[];
  links: LinkType[];
}

export type NodeObject = {
  id?: string | number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number;
  fy?: number;
  fz?: number;
};

export type LinkObject<NodeType extends NodeObject> = {
  source?: string | number | NodeType;
  target?: string | number | NodeType;
};

type Accessor<In, Out> = Out | string | ((obj: In) => Out);

type DagMode = 'td' | 'bu' | 'lr' | 'rl' | 'zout' | 'zin' | 'radialout' | 'radialin';

type ForceEngine = 'd3' | 'ngraph';

interface ForceFn<NodeType extends NodeObject> {
  (alpha: number): void;
  initialize?: (nodes: NodeType[], ...args: any[]) => void;
  [key: string]: any;
}

type Coords = { x: number; y: number; z: number; }

type LinkPositionUpdateFn = <NodeType extends NodeObject, LinkType extends LinkObject<NodeType>>(obj: Object3D, coords: { start: Coords, end: Coords }, link: LinkType) => void | null | boolean;

export interface ForceGraphProps<
  NodeType extends NodeObject,
  LinkType extends LinkObject<NodeType>
> extends ConfigOptions {
  // Data input
  graphData?: GraphData<NodeType, LinkType>;
  nodeId?: string;
  linkSource?: string;
  linkTarget?: string;

  // Container layout
  width?: number;
  height?: number;
  yOffset?: number;
  glScale?: number;

  // Node styling
  nodeLabel?: Accessor<NodeType, string>;
  nodeDesc?: Accessor<NodeType, string>;
  nodeRelSize?: number;
  nodeVal?: Accessor<NodeType, number>;
  nodeVisibility?: Accessor<NodeType, boolean>;
  nodeColor?: Accessor<NodeType, string>;
  nodeAutoColorBy?: Accessor<NodeType, string | null>;
  nodeOpacity?: number;
  nodeResolution?: number;
  nodeThreeObject?: Accessor<NodeType, Object3D>;
  nodeThreeObjectExtend?: Accessor<NodeType, boolean>;

  // Link styling
  linkLabel?: Accessor<LinkType, string>;
  linkDesc?: Accessor<LinkType, string>;
  linkVisibility?: Accessor<LinkType, boolean>;
  linkColor?: Accessor<LinkType, string>;
  linkAutoColorBy?: Accessor<LinkType, string | null>;
  linkWidth?: Accessor<LinkType, number>;
  linkOpacity?: number;
  linkResolution?: number;
  linkCurvature?: Accessor<LinkType, number>;
  linkCurveRotation?: Accessor<LinkType, number>;
  linkMaterial?: Accessor<LinkType, Material | boolean | null>;
  linkThreeObject?: Accessor<LinkType, Object3D>;
  linkThreeObjectExtend?: Accessor<LinkType, boolean>;
  linkPositionUpdate?: LinkPositionUpdateFn | null;
  linkDirectionalArrowLength?: Accessor<LinkType, number>;
  linkDirectionalArrowColor?: Accessor<LinkType, string>;
  linkDirectionalArrowRelPos?: Accessor<LinkType, number>;
  linkDirectionalArrowResolution?: number;
  linkDirectionalParticles?: Accessor<LinkType, number>;
  linkDirectionalParticleSpeed?: Accessor<LinkType, number>;
  linkDirectionalParticleWidth?: Accessor<LinkType, number>;
  linkDirectionalParticleColor?: Accessor<LinkType, string>;
  linkDirectionalParticleResolution?: number;

  // Force engine (d3-force) configuration
  forceEngine?: ForceEngine;
  numDimensions?: 1 | 2 | 3;
  dagMode?: DagMode;
  dagLevelDistance?: number | null;
  dagNodeFilter?: (node: NodeType) => boolean;
  onDagError?: ((loopNodeIds: (string | number)[]) => void) | undefined;
  d3AlphaMin?: number;
  d3AlphaDecay?: number;
  d3VelocityDecay?: number;
  ngraphPhysics?: object;
  warmupTicks?: number;
  cooldownTicks?: number;
  cooldownTime?: number;
  onEngineTick?: () => void;
  onEngineStop?: () => void;

  // Interaction
  onNodeHover?: (node: NodeType | null, previousNode: NodeType | null) => void;
  onNodeClick?: (link: LinkType) => void;
  onLinkHover?: (link: LinkType | null, previousLink: LinkType | null) => void;
  onLinkClick?: (link: LinkType) => void;
}

export interface ForceGraphMethods<
  NodeType extends NodeObject,
  LinkType extends LinkObject<NodeType>
> {
  // Link styling
  emitParticle(link: LinkType): ForceGraphKapsuleInstance;

  // Force engine (d3-force) configuration
  d3Force(forceName: 'link' | 'charge' | 'center' | string): ForceFn<NodeType> | undefined;
  d3Force(forceName: 'link' | 'charge' | 'center' | string, forceFn: ForceFn<NodeType>): ForceGraphKapsuleInstance;
  d3ReheatSimulation(): ForceGraphKapsuleInstance;

  // Render control
  refresh(): ForceGraphKapsuleInstance;

  // Utility
  getGraphBbox(nodeFilter?: (node: NodeType) => boolean): { x: [number, number], y: [number, number], z: [number, number] };
}

type FCwithRef = <NodeType extends NodeObject, LinkType extends LinkObject<NodeType>>(props: ForceGraphProps<NodeType, LinkType> & { ref?: React.MutableRefObject<ForceGraphMethods<NodeType, LinkType> | undefined>; }) => React.ReactElement;

declare const ForceGraph: FCwithRef;

export default ForceGraph;
