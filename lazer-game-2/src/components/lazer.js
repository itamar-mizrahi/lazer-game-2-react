import React, { useRef } from 'react';
import * as THREE from 'three';

const Lazer = ({ start, end, color }) => {
  const lineRef = useRef();

  // Define the laser material
  const material = new THREE.LineBasicMaterial({ color });

  // Create the laser line and set its start and end points
  const points = [new THREE.Vector3(start[0], start[1], start[2]), new THREE.Vector3(end[0], end[1], end[2])];
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);

  // Set the reference to the line for use in rendering
  lineRef.current = line;

  return <primitive object={lineRef.current} />;
};

export default Lazer;
