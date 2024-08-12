import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';

// Define the types for the component props
interface ObjModelProps {
  path: string;
}

const ObjModel: React.FC<ObjModelProps> = ({ path }) => {
  const obj = useLoader(OBJLoader, path);
  return <primitive object={obj} />;
};

interface ObjViewerProps {
  path: string;
}

const ObjViewer: React.FC<ObjViewerProps> = ({ path }) => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <ObjModel path={path} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default ObjViewer;
