
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const InteractiveBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Position (x, y, z)
      posArray[i] = (Math.random() - 0.5) * 50;     // x
      posArray[i + 1] = (Math.random() - 0.5) * 50; // y
      posArray[i + 2] = (Math.random() - 0.5) * 50; // z
      
      // Scale
      scaleArray[i / 3] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));

    // Create lines (connections between particles)
    const linesGeometry = new THREE.BufferGeometry();
    const linesPositions = new Float32Array(particlesCount * 6); // 2 points per line, 3 values per point
    const linesIndices: number[] = [];
    
    // Will be populated during animation
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3));

    // Materials
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x6e59a5,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x6e59a5,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });

    // Create meshes
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // Add blockchain-like structures
    const createCube = () => {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshPhongMaterial({
        color: 0x6e59a5,
        opacity: 0.7,
        transparent: true,
        wireframe: true
      });
      const cube = new THREE.Mesh(geometry, material);
      
      // Random position
      cube.position.x = (Math.random() - 0.5) * 40;
      cube.position.y = (Math.random() - 0.5) * 40;
      cube.position.z = (Math.random() - 0.5) * 40;
      
      return cube;
    };

    const cubes: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const cube = createCube();
      cubes.push(cube);
      scene.add(cube);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Window resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Update particle positions
      particlesMesh.rotation.x = elapsedTime * 0.05;
      particlesMesh.rotation.y = mousePosition.current.x * 0.5;
      
      // Update blockchain cubes
      cubes.forEach((cube, i) => {
        cube.rotation.x = elapsedTime * 0.2 + i * 0.1;
        cube.rotation.y = elapsedTime * 0.1 + i * 0.1;
      });

      // Dynamic connections between nearby particles
      const positions = particlesGeometry.attributes.position.array;
      let lineIndex = 0;
      
      for (let i = 0; i < particlesCount; i++) {
        const iX = positions[i * 3];
        const iY = positions[i * 3 + 1];
        const iZ = positions[i * 3 + 2];

        // Connect with nearby particles
        for (let j = i + 1; j < particlesCount; j++) {
          const jX = positions[j * 3];
          const jY = positions[j * 3 + 1];
          const jZ = positions[j * 3 + 2];

          const distance = Math.sqrt(
            Math.pow(iX - jX, 2) +
            Math.pow(iY - jY, 2) +
            Math.pow(iZ - jZ, 2)
          );

          if (distance < 5) {
            // Update line positions
            if (lineIndex < linesPositions.length - 6) {
              linesPositions[lineIndex++] = iX;
              linesPositions[lineIndex++] = iY;
              linesPositions[lineIndex++] = iZ;
              
              linesPositions[lineIndex++] = jX;
              linesPositions[lineIndex++] = jY;
              linesPositions[lineIndex++] = jZ;
            }
          }
        }
      }
      
      // Clear unused line positions
      for (let i = lineIndex; i < linesPositions.length; i++) {
        linesPositions[i] = 0;
      }
      
      linesMesh.geometry.attributes.position.needsUpdate = true;
      
      // Camera movement based on mouse
      camera.position.x += (mousePosition.current.x * 2 - camera.position.x) * 0.05;
      camera.position.y += (-mousePosition.current.y * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }

      scene.clear();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10" 
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default InteractiveBackground;
