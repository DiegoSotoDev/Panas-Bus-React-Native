import React from 'react';

const cleanProps = (props: any) => {
  if (!props) return {};
  const {
    propList,
    matrix,
    origin,
    originX,
    originY,
    rotation,
    scale,
    scaleX,
    scaleY,
    skew,
    skewX,
    skewY,
    ...rest
  } = props;
  return rest;
};

export const Svg = React.forwardRef<SVGSVGElement, any>((props, ref) => (
  <svg ref={ref} {...cleanProps(props)}>
    {props.children}
  </svg>
));

export const Path = React.forwardRef<SVGPathElement, any>((props, ref) => (
  <path ref={ref} {...cleanProps(props)} />
));

export const Rect = React.forwardRef<SVGRectElement, any>((props, ref) => (
  <rect ref={ref} {...cleanProps(props)} />
));

export const Circle = React.forwardRef<SVGCircleElement, any>((props, ref) => (
  <circle ref={ref} {...cleanProps(props)} />
));

export const Ellipse = React.forwardRef<SVGEllipseElement, any>((props, ref) => (
  <ellipse ref={ref} {...cleanProps(props)} />
));

export const Line = React.forwardRef<SVGLineElement, any>((props, ref) => (
  <line ref={ref} {...cleanProps(props)} />
));

export const G = React.forwardRef<SVGGElement, any>((props, ref) => (
  <g ref={ref} {...cleanProps(props)}>
    {props.children}
  </g>
));

export const Text = React.forwardRef<SVGTextElement, any>((props, ref) => (
  <text ref={ref} {...cleanProps(props)}>
    {props.children}
  </text>
));

export const TSpan = React.forwardRef<SVGTSpanElement, any>((props, ref) => (
  <tspan ref={ref} {...cleanProps(props)}>
    {props.children}
  </tspan>
));

export const Defs = React.forwardRef<SVGDefsElement, any>((props, ref) => (
  <defs ref={ref} {...cleanProps(props)}>
    {props.children}
  </defs>
));

export const Use = React.forwardRef<SVGUseElement, any>((props, ref) => (
  <use ref={ref} {...cleanProps(props)} />
));

export const Polyline = React.forwardRef<SVGPolylineElement, any>((props, ref) => (
  <polyline ref={ref} {...cleanProps(props)} />
));

export const Polygon = React.forwardRef<SVGPolygonElement, any>((props, ref) => (
  <polygon ref={ref} {...cleanProps(props)} />
));

export const ClipPath = React.forwardRef<SVGClipPathElement, any>((props, ref) => (
  <clipPath ref={ref} {...cleanProps(props)}>
    {props.children}
  </clipPath>
));

export const LinearGradient = React.forwardRef<SVGLinearGradientElement, any>((props, ref) => (
  <linearGradient ref={ref} {...cleanProps(props)}>
    {props.children}
  </linearGradient>
));

export const RadialGradient = React.forwardRef<SVGRadialGradientElement, any>((props, ref) => (
  <radialGradient ref={ref} {...cleanProps(props)}>
    {props.children}
  </radialGradient>
));

export const Stop = React.forwardRef<SVGStopElement, any>((props, ref) => (
  <stop ref={ref} {...cleanProps(props)} />
));

export const Image = React.forwardRef<SVGImageElement, any>((props, ref) => (
  <image ref={ref} {...cleanProps(props)} />
));

export const SvgXml = (props: any) => {
  if (!props?.xml) return null;
  return <div dangerouslySetInnerHTML={{ __html: props.xml }} />;
};

export default Svg;
