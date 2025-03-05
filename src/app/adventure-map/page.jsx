'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import PageLayout from '../components/ui/PageLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// ✅ Dynamically import Leaflet (Prevents SSR errors)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const API_KEY = 'b2b2bf8b9e38469faa854c0a8127b210';
const TILE_LAYER_URL = `https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${API_KEY}`;

export default function AdventureMap() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <LoadingSpinner />; // ✅ Uses loading animation instead of text
  }

  return (
    <PageLayout>
      <div className='w-full flex flex-col items-center bg-background text-foreground min-h-screen'>
        {/* Page Title */}
        <h1 className='text-4xl md:text-5xl font-bold mb-10 text-primary-blue'>
          Explore New River Gorge
        </h1>
        <p className='text-lg text-center max-w-2xl text-foreground-light mb-6'>
          Zoom in and explore the trails, rivers, and climbing areas of New
          River Gorge National Park.
        </p>

        {/* Interactive Map */}
        <div className='w-full max-w-5xl h-[80vh] md:h-[85vh] lg:h-[90vh] shadow-lg border border-primary-blue rounded-lg mb-20'>
          <MapContainer
            center={[38.07, -81.08]}
            zoom={12}
            scrollWheelZoom={true}
            className='w-full h-full'
          >
            <TileLayer url={TILE_LAYER_URL} />
          </MapContainer>
        </div>
      </div>
    </PageLayout>
  );
}
