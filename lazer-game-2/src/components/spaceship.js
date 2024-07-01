import React, { useRef } from 'react';
import * as THREE from 'three';

const Spaceship = ({ position, rotation }) => {
  const meshRef = useRef();

  // Define the spaceship geometry and material
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  // Create the spaceship mesh and set its position and rotation
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]);

  // Set the reference to the mesh for use in rendering
  meshRef.current = mesh;

  return <primitive object={meshRef.current} />;
};

export default Spaceship;
