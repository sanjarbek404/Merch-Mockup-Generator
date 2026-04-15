import { MockupTemplate } from './types';

export const MOCKUP_TEMPLATES: MockupTemplate[] = [
  {
    id: 'white-tee',
    name: 'Classic White Tee',
    category: 'apparel',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    placement: {
      x: 0.5,
      y: 0.42,
      width: 0.25,
      height: 0.25,
    }
  },
  {
    id: 'black-tee',
    name: 'Classic Black Tee',
    category: 'apparel',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
    placement: {
      x: 0.5,
      y: 0.45,
      width: 0.22,
      height: 0.22,
    }
  },
  {
    id: 'grey-hoodie',
    name: 'Premium Hoodie',
    category: 'apparel',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80',
    placement: {
      x: 0.5,
      y: 0.48,
      width: 0.2,
      height: 0.2,
    }
  },
  {
    id: 'tote-bag',
    name: 'Canvas Tote Bag',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1591348113527-51b102ddffae?auto=format&fit=crop&w=1200&q=80',
    placement: {
      x: 0.5,
      y: 0.55,
      width: 0.35,
      height: 0.35,
      rotation: -2
    }
  },
  {
    id: 'white-mug',
    name: 'Ceramic Mug',
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80',
    placement: {
      x: 0.45,
      y: 0.5,
      width: 0.25,
      height: 0.25,
    }
  },
  {
    id: 'snapback-cap',
    name: 'Snapback Cap',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80',
    placement: {
      x: 0.5,
      y: 0.45,
      width: 0.15,
      height: 0.15,
    }
  }
];
