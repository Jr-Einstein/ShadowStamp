
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import QRCode from 'qrcode';

interface ARVisualizerProps {
  arContent?: string;
  isActive: boolean;
  contentType?: 'text' | 'url' | 'qr';
}

const ARVisualizer: React.FC<ARVisualizerProps> = ({ arContent, isActive, contentType = 'text' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add a simple 3D object to represent AR content
    const geometry = new THREE.TorusKnotGeometry(1, 0.4, 64, 8);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x6e59a5,
      specular: 0x6e59a5,
      shininess: 20,
      wireframe: false
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    // Add text or QR code representation of AR content if provided
    if (arContent) {
      // For QR content type or if content looks like a URL
      if (contentType === 'qr' || contentType === 'url' || 
          arContent.startsWith('http') || arContent.includes('www.')) {
        // Generate QR code as texture
        const createQRTexture = async () => {
          try {
            const canvas = document.createElement('canvas');
            await QRCode.toCanvas(canvas, arContent, {
              width: 256,
              margin: 1,
              color: {
                dark: '#ffffff',
                light: '#000000'
              }
            });
            
            const qrTexture = new THREE.CanvasTexture(canvas);
            const qrMaterial = new THREE.MeshBasicMaterial({ map: qrTexture });
            const qrGeometry = new THREE.PlaneGeometry(2, 2);
            const qrMesh = new THREE.Mesh(qrGeometry, qrMaterial);
            qrMesh.position.y = -2;
            scene.add(qrMesh);
          } catch (error) {
            console.error('Failed to generate QR code:', error);
          }
        };
        createQRTexture();
      } else {
        // Create text texture for non-QR content
        const textCanvas = document.createElement('canvas');
        const context = textCanvas.getContext('2d');
        if (context) {
          textCanvas.width = 256;
          textCanvas.height = 128;
          context.fillStyle = '#000000';
          context.fillRect(0, 0, textCanvas.width, textCanvas.height);
          context.font = '16px Arial';
          context.fillStyle = '#ffffff';
          context.textAlign = 'center';
          
          // Display full content or truncate if too long
          const displayContent = arContent.length > 30 
            ? arContent.substring(0, 30) + '...' 
            : arContent;
          
          context.fillText(displayContent, textCanvas.width / 2, textCanvas.height / 2);
          
          const textTexture = new THREE.CanvasTexture(textCanvas);
          const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture });
          const textGeometry = new THREE.PlaneGeometry(2, 1);
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.position.y = -2;
          scene.add(textMesh);
        }
      }
    }
    
    // Animation loop
    const animate = () => {
      if (!isActive) return;
      
      const animationId = requestAnimationFrame(animate);
      
      // Rotate objects
      if (torusKnot) {
        torusKnot.rotation.x += 0.01;
        torusKnot.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
      
      // Cleanup function to cancel animation when component unmounts or isActive changes
      return () => {
        cancelAnimationFrame(animationId);
      };
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [isActive, arContent, contentType]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-64 border border-white/10 rounded-lg overflow-hidden"
      style={{ display: isActive ? 'block' : 'none' }}
    />
  );
};

export default ARVisualizer;
