export interface MockupTemplate {
  id: string;
  name: string;
  category: 'apparel' | 'accessories' | 'home';
  imageUrl: string;
  // Placement coordinates (0-1 range)
  placement: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    perspective?: number; // Simple skew/warp factor
  };
}

export interface UserLogo {
  url: string;
  width: number;
  height: number;
}
