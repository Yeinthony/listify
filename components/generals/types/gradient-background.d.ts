export interface GradientProps {
  width?: string | number;
  height?: string | number;

  // Colores del gradiente
  colors?: string[];

  // Tipo de gradiente
  gradientType?: 'linear' | 'radial';

  // Configuración para gradiente lineal
  linearDirection?: {
    x1?: string;
    y1?: string;
    x2?: string;
    y2?: string;
  };

  // Configuración para gradiente radial
  radialCenter?: {
    cx?: string;
    cy?: string;
    r?: string;
  };
}