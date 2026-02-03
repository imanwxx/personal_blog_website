'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Robot3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ffff, 0.5, 10);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    // Tesla Optimus-inspired robot
    const robotGroup = new THREE.Group();

    // Materials
    const whiteMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 100,
      emissive: 0x404040,
      emissiveIntensity: 0.1
    });

    const blackMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a1a1a,
      shininess: 80
    });

    const jointMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x333333,
      shininess: 90
    });

    const ledMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 1
    });

    // Torso (main body)
    const torsoGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.4);
    const torso = new THREE.Mesh(torsoGeometry, whiteMaterial);
    torso.position.y = 1.3;
    robotGroup.add(torso);

    // Chest LED strip
    const chestLedGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.42);
    const chestLed = new THREE.Mesh(chestLedGeometry, ledMaterial);
    chestLed.position.set(0, 1.65, 0);
    robotGroup.add(chestLed);

    // Upper body frame
    const upperFrameGeometry = new THREE.BoxGeometry(0.65, 0.3, 0.45);
    const upperFrame = new THREE.Mesh(upperFrameGeometry, blackMaterial);
    upperFrame.position.set(0, 1.7, 0);
    robotGroup.add(upperFrame);

    // Head - Optimus style: sleek dome design
    const headGroup = new THREE.Group();

    // Main head dome
    const headGeometry = new THREE.SphereGeometry(0.2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const head = new THREE.Mesh(headGeometry, whiteMaterial);
    head.scale.set(1, 0.9, 1);
    headGroup.add(head);

    // Head bottom (jaw area)
    const jawGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.2, 32);
    const jaw = new THREE.Mesh(jawGeometry, whiteMaterial);
    jaw.position.y = -0.15;
    headGroup.add(jaw);

    // LED face sensor (Optimus signature feature)
    const faceLedGeometry = new THREE.BoxGeometry(0.35, 0.08, 0.22);
    const faceLed = new THREE.Mesh(faceLedGeometry, ledMaterial);
    faceLed.position.set(0, 0.05, 0.17);
    headGroup.add(faceLed);

    // Head sensors (camera positions)
    const sensorGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 16);
    const leftSensor = new THREE.Mesh(sensorGeometry, blackMaterial);
    leftSensor.position.set(-0.12, 0.15, 0.12);
    leftSensor.rotation.x = Math.PI / 6;
    headGroup.add(leftSensor);

    const rightSensor = new THREE.Mesh(sensorGeometry, blackMaterial);
    rightSensor.position.set(0.12, 0.15, 0.12);
    rightSensor.rotation.x = Math.PI / 6;
    headGroup.add(rightSensor);

    headGroup.position.set(0, 2.2, 0);
    robotGroup.add(headGroup);

    // Arms - Optimus style with more joints
    const shoulderGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    
    // Left arm
    const leftShoulder = new THREE.Mesh(shoulderGeometry, jointMaterial);
    leftShoulder.position.set(-0.4, 1.8, 0);
    robotGroup.add(leftShoulder);

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.5, 16), whiteMaterial);
    leftUpperArm.position.set(-0.55, 1.5, 0);
    leftUpperArm.rotation.z = Math.PI / 8;
    robotGroup.add(leftUpperArm);

    const leftElbow = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), jointMaterial);
    leftElbow.position.set(-0.65, 1.2, 0);
    robotGroup.add(leftElbow);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.5, 16), whiteMaterial);
    leftForearm.position.set(-0.7, 0.95, 0);
    leftForearm.rotation.z = Math.PI / 12;
    robotGroup.add(leftForearm);

    // Left hand (simplified)
    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 0.08), blackMaterial);
    leftHand.position.set(-0.72, 0.65, 0);
    robotGroup.add(leftHand);

    // Right arm
    const rightShoulder = new THREE.Mesh(shoulderGeometry, jointMaterial);
    rightShoulder.position.set(0.4, 1.8, 0);
    robotGroup.add(rightShoulder);

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.5, 16), whiteMaterial);
    rightUpperArm.position.set(0.55, 1.5, 0);
    rightUpperArm.rotation.z = -Math.PI / 8;
    robotGroup.add(rightUpperArm);

    const rightElbow = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), jointMaterial);
    rightElbow.position.set(0.65, 1.2, 0);
    robotGroup.add(rightElbow);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.5, 16), whiteMaterial);
    rightForearm.position.set(0.7, 0.95, 0);
    rightForearm.rotation.z = -Math.PI / 12;
    robotGroup.add(rightForearm);

    // Right hand
    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 0.08), blackMaterial);
    rightHand.position.set(0.72, 0.65, 0);
    robotGroup.add(rightHand);

    // Pelvis area
    const pelvisGeometry = new THREE.BoxGeometry(0.55, 0.25, 0.35);
    const pelvis = new THREE.Mesh(pelvisGeometry, whiteMaterial);
    pelvis.position.set(0, 0.9, 0);
    robotGroup.add(pelvis);

    // Legs with articulated joints
    const hipGeometry = new THREE.SphereGeometry(0.11, 16, 16);
    
    // Left leg
    const leftHip = new THREE.Mesh(hipGeometry, jointMaterial);
    leftHip.position.set(-0.15, 0.75, 0);
    robotGroup.add(leftHip);

    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.6, 16), whiteMaterial);
    leftThigh.position.set(-0.2, 0.45, 0);
    robotGroup.add(leftThigh);

    const leftKnee = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 16), jointMaterial);
    leftKnee.position.set(-0.2, 0.1, 0);
    robotGroup.add(leftKnee);

    const leftShin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.6, 16), whiteMaterial);
    leftShin.position.set(-0.2, -0.2, 0);
    robotGroup.add(leftShin);

    // Left foot
    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.25), blackMaterial);
    leftFoot.position.set(-0.2, -0.55, 0.05);
    robotGroup.add(leftFoot);

    // Right leg
    const rightHip = new THREE.Mesh(hipGeometry, jointMaterial);
    rightHip.position.set(0.15, 0.75, 0);
    robotGroup.add(rightHip);

    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.6, 16), whiteMaterial);
    rightThigh.position.set(0.2, 0.45, 0);
    robotGroup.add(rightThigh);

    const rightKnee = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 16), jointMaterial);
    rightKnee.position.set(0.2, 0.1, 0);
    robotGroup.add(rightKnee);

    const rightShin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.6, 16), whiteMaterial);
    rightShin.position.set(0.2, -0.2, 0);
    robotGroup.add(rightShin);

    // Right foot
    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.25), blackMaterial);
    rightFoot.position.set(0.2, -0.55, 0.05);
    robotGroup.add(rightFoot);

    scene.add(robotGroup);

    // Ground platform
    const groundGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.1, 32);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a1a2e,
      shininess: 50
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -0.6;
    scene.add(ground);

    // Add floating tech particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.7,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.set(3, 2.5, 4);
    camera.lookAt(0, 1.2, 0);

    // Store arm and leg references for animation
    let leftThighRef = leftThigh;
    let rightThighRef = rightThigh;
    let leftShinRef = leftShin;
    let rightShinRef = rightShin;
    let leftForearmRef = leftForearm;
    let rightForearmRef = rightForearm;
    let headGroupRef = headGroup;
    let chestLedRef = chestLed;
    let faceLedRef = faceLed;
    let particlesRef = particles;

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.05;

      // Walking animation - more natural human-like motion
      const walkSpeed = 0.12;
      const strideAmplitude = 0.35;

      // Left leg
      leftThighRef.rotation.x = Math.sin(time * walkSpeed) * strideAmplitude;
      leftShinRef.rotation.x = Math.max(0, -Math.sin(time * walkSpeed) * 0.3) + 0.1;
      
      // Right leg (opposite phase)
      rightThighRef.rotation.x = Math.sin(time * walkSpeed + Math.PI) * strideAmplitude;
      rightShinRef.rotation.x = Math.max(0, -Math.sin(time * walkSpeed + Math.PI) * 0.3) + 0.1;

      // Arms swing naturally
      leftForearmRef.rotation.z = Math.PI / 8 + Math.sin(time * walkSpeed + Math.PI) * 0.4;
      rightForearmRef.rotation.z = -Math.PI / 8 + Math.sin(time * walkSpeed) * 0.4;

      // Body bobbing during walk
      robotGroup.position.y = Math.abs(Math.sin(time * walkSpeed * 2)) * 0.08;

      // Head slight sway
      headGroupRef.rotation.y = Math.sin(time * 0.3) * 0.08;
      headGroupRef.rotation.x = Math.sin(time * 0.4) * 0.05;

      // LED pulse effects
      const ledPulse = 0.5 + Math.sin(time * 3) * 0.5;
      chestLedRef.material.emissiveIntensity = ledPulse;
      faceLedRef.material.emissiveIntensity = ledPulse;

      // Rotate particles slowly
      particlesRef.rotation.y += 0.001;
      particlesRef.rotation.x += 0.0005;

      // Robot subtle rotation
      robotGroup.rotation.y = Math.sin(time * 0.15) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="h-[400px] w-full rounded-2xl"
      style={{ minHeight: '400px' }}
    />
  );
}
