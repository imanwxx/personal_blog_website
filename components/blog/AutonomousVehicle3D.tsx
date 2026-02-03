'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AutonomousVehicle3D() {
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

    const pointLight = new THREE.PointLight(0x00ff00, 0.8, 15);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    // Tesla Model Y-inspired vehicle
    const carGroup = new THREE.Group();

    // Materials
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xcccccc,
      shininess: 120,
      specular: 0x888888
    });

    const glassMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x111111,
      transparent: true,
      opacity: 0.7,
      shininess: 150
    });

    const blackMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x0a0a0a,
      shininess: 80
    });

    const wheelMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x222222,
      shininess: 90
    });

    const rimMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xc0c0c0,
      shininess: 150
    });

    const ledMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00
    });

    // Main body - SUV style with rounded edges
    const bodyGeometry = new THREE.BoxGeometry(2.1, 0.85, 4.7);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.55;
    carGroup.add(body);

    // Hood (front upper section)
    const hoodGeometry = new THREE.BoxGeometry(1.9, 0.15, 1.3);
    const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
    hood.position.set(0, 1.05, 1.6);
    carGroup.add(hood);

    // Windshield
    const windshieldGeometry = new THREE.BoxGeometry(1.75, 0.7, 0.08);
    const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
    windshield.position.set(0, 1.05, 1.1);
    windshield.rotation.x = Math.PI / 6;
    carGroup.add(windshield);

    // Roof (glass roof panel - Model Y signature)
    const roofGeometry = new THREE.BoxGeometry(1.7, 0.08, 2.0);
    const roof = new THREE.Mesh(roofGeometry, glassMaterial);
    roof.position.set(0, 1.45, 0);
    carGroup.add(roof);

    // Rear window
    const rearWindowGeometry = new THREE.BoxGeometry(1.75, 0.6, 0.08);
    const rearWindow = new THREE.Mesh(rearWindowGeometry, glassMaterial);
    rearWindow.position.set(0, 1.05, -1.0);
    rearWindow.rotation.x = -Math.PI / 7;
    carGroup.add(rearWindow);

    // Front bumper
    const frontBumperGeometry = new THREE.BoxGeometry(2.15, 0.25, 0.35);
    const frontBumper = new THREE.Mesh(frontBumperGeometry, blackMaterial);
    frontBumper.position.set(0, 0.2, 2.35);
    carGroup.add(frontBumper);

    // Rear bumper
    const rearBumperGeometry = new THREE.BoxGeometry(2.15, 0.25, 0.35);
    const rearBumper = new THREE.Mesh(rearBumperGeometry, blackMaterial);
    rearBumper.position.set(0, 0.2, -2.35);
    carGroup.add(rearBumper);

    // Tesla front fascia (no grille - Tesla signature)
    const fasciaGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.1);
    const fascia = new THREE.Mesh(fasciaGeometry, bodyMaterial);
    fascia.position.set(0, 0.65, 2.36);
    carGroup.add(fascia);

    // Front headlights (Model Y style)
    const headlightGeometry = new THREE.BoxGeometry(0.8, 0.15, 0.08);
    const headlightMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.8
    });
    
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.65, 0.85, 2.36);
    carGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.65, 0.85, 2.36);
    carGroup.add(rightHeadlight);

    // Rear taillights (horizontal strip - Tesla signature)
    const taillightGeometry = new THREE.BoxGeometry(1.8, 0.1, 0.08);
    const taillightMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.8
    });
    const taillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
    taillight.position.set(0, 0.85, -2.36);
    carGroup.add(taillight);

    // Side mirrors
    const mirrorGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.08);
    
    const leftMirror = new THREE.Mesh(mirrorGeometry, blackMaterial);
    leftMirror.position.set(-1.15, 0.9, 1.2);
    carGroup.add(leftMirror);

    const rightMirror = new THREE.Mesh(mirrorGeometry, blackMaterial);
    rightMirror.position.set(1.15, 0.9, 1.2);
    carGroup.add(rightMirror);

    // Wheels (Tesla Model Y 19" wheels style)
    const wheelPositions = [
      [-1.05, -0.2, 1.4],
      [1.05, -0.2, 1.4],
      [-1.05, -0.2, -1.4],
      [1.05, -0.2, -1.4],
    ];

    const wheels: THREE.Mesh[] = [];

    wheelPositions.forEach(pos => {
      // Tire
      const tireGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 32);
      const tire = new THREE.Mesh(tireGeometry, wheelMaterial);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(pos[0], pos[1], pos[2]);
      carGroup.add(tire);

      // Rim
      const rimGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.32, 24);
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(pos[0], pos[1], pos[2]);
      carGroup.add(rim);

      // Rim spokes (5-spoke design)
      for (let i = 0; i < 5; i++) {
        const spokeGeometry = new THREE.BoxGeometry(0.06, 0.24, 0.04);
        const spoke = new THREE.Mesh(spokeGeometry, rimMaterial);
        const angle = (i / 5) * Math.PI * 2;
        spoke.position.set(
          pos[0] + Math.cos(angle) * 0.15,
          pos[1],
          pos[2] + Math.sin(angle) * 0.15
        );
        spoke.rotation.x = angle;
        carGroup.add(spoke);
        wheels.push(spoke);
      }

      wheels.push(tire);
      wheels.push(rim);
    });

    // Autopilot/LiDAR sensor (Tesla style - camera-based)
    const sensorMountGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.15, 16);
    const sensorMount = new THREE.Mesh(sensorMountGeometry, blackMaterial);
    sensorMount.position.set(0, 1.5, 0);
    carGroup.add(sensorMount);

    const sensorGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16);
    const sensorMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 1
    });
    const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    sensor.position.set(0, 1.58, 0);
    carGroup.add(sensor);

    // FSD visualization - sensing cone
    const coneGeometry = new THREE.ConeGeometry(1.2, 3.0, 32, 1, true);
    const coneMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const sensingCone = new THREE.Mesh(coneGeometry, coneMaterial);
    sensingCone.position.set(0, 1.0, 3.0);
    sensingCone.rotation.x = -Math.PI / 2;
    carGroup.add(sensingCone);

    scene.add(carGroup);

    // Road
    const roadGeometry = new THREE.PlaneGeometry(20, 100);
    const roadMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a1a2e,
      side: THREE.DoubleSide
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -0.55;
    road.position.z = -40;
    scene.add(road);

    // Road markings
    const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    for (let i = 0; i < 25; i++) {
      const markingGeometry = new THREE.BoxGeometry(0.25, 0.01, 2.5);
      const marking = new THREE.Mesh(markingGeometry, markingMaterial);
      marking.position.set(0, -0.545, -35 + i * 3);
      scene.add(marking);
    }

    // Side lane markings
    const laneMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let z = -35; z < 40; z += 5) {
      const leftLane = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.01, 2.5), laneMaterial);
      leftLane.position.set(-2.5, -0.545, z);
      scene.add(leftLane);

      const rightLane = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.01, 2.5), laneMaterial);
      rightLane.position.set(2.5, -0.545, z);
      scene.add(rightLane);
    }

    // Lane guidance visualization
    const arrowMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00,
      transparent: true,
      opacity: 0.6
    });

    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(0, 0.3);
    arrowShape.lineTo(-0.15, -0.15);
    arrowShape.lineTo(-0.05, -0.15);
    arrowShape.lineTo(-0.05, -0.3);
    arrowShape.lineTo(0.05, -0.3);
    arrowShape.lineTo(0.05, -0.15);
    arrowShape.lineTo(0.15, -0.15);
    arrowShape.closePath();

    const arrowGeometry = new THREE.ShapeGeometry(arrowShape);
    const arrows: THREE.Mesh[] = [];

    for (let i = 0; i < 4; i++) {
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.position.set(0, 0.1, -12 - i * 10);
      arrow.rotation.x = -Math.PI / 2;
      scene.add(arrow);
      arrows.push(arrow);
    }

    camera.position.set(4, 3, 6);
    camera.lookAt(0, 0.5, 0);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.02;

      // Move car forward
      carGroup.position.z = (time * 2.5) % 30 - 15;

      // Rotate wheels
      wheels.forEach(wheel => {
        if (wheel.geometry.type === 'CylinderGeometry') {
          wheel.rotation.x += 0.12;
        }
      });

      // Animate sensor
      (sensor.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.7 + Math.sin(time * 4) * 0.3;

      // Animate sensing cone
      (sensingCone.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(time * 3) * 0.05;
      sensingCone.rotation.y = Math.sin(time * 2) * 0.1;

      // Animate navigation arrows
      arrows.forEach((arrow, i) => {
        arrow.position.y = 0.1 + Math.sin(time * 2 + i) * 0.15;
        (arrow.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(time * 3 + i) * 0.2;
      });

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
