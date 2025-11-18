import { GradientProps } from '@/components/generals/types/gradient-background';
import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

const GradientBackground = ({
  width = '100%',
  height = '100%',
  colors = ['#fde047', '#ffffff'], 
  gradientType = 'linear', 
  linearDirection = { x1: '0%', y1: '0%', x2: '100%', y2: '0%' }, 
  radialCenter = { cx: '50%', cy: '50%', r: '50%' }, 
}: GradientProps) => {
  return (
    <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
      <Defs>
        {gradientType === 'linear' ? (
          <LinearGradient id="grad" {...linearDirection}>
            {colors.map((color, index) => (
              <Stop
                key={index}
                offset={`${(index / (colors.length - 1)) * 100}%`}
                stopColor={color}
                stopOpacity="1"
              />
            ))}
          </LinearGradient>
        ) : (
          <RadialGradient id="grad" {...radialCenter}>
            {colors.map((color, index) => (
              <Stop
                key={index}
                offset={`${(index / (colors.length - 1)) * 100}%`}
                stopColor={color}
                stopOpacity="1"
              />
            ))}
          </RadialGradient>
        )}
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
    </Svg>
  );
};

export default GradientBackground;