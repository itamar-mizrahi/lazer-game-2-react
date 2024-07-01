import React, { useRef } from 'react';
import * as THREE from 'three';

const Planet = ({ position, radius, color }) => {
  const meshRef = useRef();

  // Define the planet geometry and material
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color });

  // Create the planet mesh and set its position
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);

  // Set the reference to the mesh for use in rendering
  meshRef.current = mesh;

  return <primitive object={meshRef.current} />;
};

export default Planet;
