'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Node {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mesh: THREE.Mesh;
  label: string;
  category: string;
}

interface Connection {
  line: THREE.Line;
  node1: Node;
  node2: Node;
}

interface AINetwork3DProps {
  skills?: string[];
}

export default function AINetwork3D({ skills }: AINetwork3DProps) {
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x6366f1, 1, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1, 20);
    pointLight2.position.set(-5, 5, -5);
    scene.add(pointLight2);

    // Define tech stack categories
    const categories = {
      'programming': { color: 0x3b82f6, position: { x: 0, y: 3, z: 2 } },
      'cad': { color: 0x10b981, position: { x: -3, y: 0, z: 2 } },
      'rl': { color: 0xf59e0b, position: { x: 3, y: 0, z: 2 } },
      'simulation': { color: 0xef4444, position: { x: 0, y: -3, z: 0 } }
    };

    // Default nodes if no skills provided
    const defaultSkills = [
      'Python', 'VSCode', 'Bamboo Studio', 'SolidWorks', 'OnShape',
      'Reinforcement Learning', 'MuJoCo', 'Isaac Gym', 'Isaac Lab'
    ];

    // Use provided skills or default
    const nodeDefinitions = (skills && skills.length > 0 ? skills : defaultSkills).map((skill) => {
      // Determine category based on skill name
      let category = 'programming';
      if (['Bamboo Studio', 'SolidWorks', 'OnShape'].includes(skill)) {
        category = 'cad';
      } else if (['Reinforcement Learning', 'MuJoCo'].includes(skill)) {
        category = 'rl';
      } else if (['Isaac Gym', 'Isaac Lab'].includes(skill)) {
        category = 'simulation';
      }

      return { label: skill, category };
    });

    // Create neural network nodes
    const nodes: Node[] = [];
    const sphereGeometry = new THREE.SphereGeometry(0.25, 24, 24);

    nodeDefinitions.forEach((def, index) => {
      const category = categories[def.category as keyof typeof categories];
      const basePos = category.position;
      
      // Add some randomness around the category center
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 3
      );

      const material = new THREE.MeshPhongMaterial({
        color: category.color,
        emissive: category.color,
        emissiveIntensity: 0.4,
        shininess: 100,
        transparent: true,
        opacity: 0.9
      });

      const node = new THREE.Mesh(sphereGeometry, material);
      const position = new THREE.Vector3(
        basePos.x + offset.x,
        basePos.y + offset.y,
        basePos.z + offset.z
      );
      
      node.position.copy(position);
      scene.add(node);

      nodes.push({
        position,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015
        ),
        mesh: node,
        label: def.label,
        category: def.category
      });
    });

    // Create connections between related nodes
    const connections: Connection[] = [];
    const connectionRules = [
      // Python connects to everything
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
      // VSCode connects to programming tools
      [1, 0],
      // CAD tools connect to each other
      [2, 3], [2, 4], [3, 4],
      // RL connects to Python and simulation
      [5, 0], [5, 6], [5, 7], [5, 8],
      // MuJoCo connects to RL
      [6, 5], [6, 0],
      // Isaac tools connect to each other and RL
      [7, 5], [7, 8], [8, 5]
    ];

    const maxDistance = 4;

    connectionRules.forEach(([idx1, idx2]) => {
      const node1 = nodes[idx1];
      const node2 = nodes[idx2];
      const distance = node1.position.distanceTo(node2.position);
      
      if (distance < maxDistance) {
        const points = [node1.position, node2.position];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Gradient color based on categories
        const cat1 = categories[node1.category as keyof typeof categories];
        const cat2 = categories[node2.category as keyof typeof categories];
        const color = new THREE.Color(cat1.color).lerp(new THREE.Color(cat2.color), 0.5);
        
        const material = new THREE.LineBasicMaterial({
          color: color.getHex(),
          transparent: true,
          opacity: 0.3 - (distance / maxDistance) * 0.15
        });

        const line = new THREE.Line(geometry, material);
        scene.add(line);

        connections.push({
          line,
          node1,
          node2
        });
      }
    });

    // Add central hub (representing the developer)
    const hubGeometry = new THREE.IcosahedronGeometry(1.0, 1);
    const hubMaterial = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      emissive: 0x083344,
      emissiveIntensity: 0.6,
      shininess: 100,
      wireframe: true
    });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.position.set(0, 0, 0);
    scene.add(hub);

    // Inner core
    const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 1.0,
      shininess: 100
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    hub.add(core);

    // Connect hub to major categories
    Object.values(categories).forEach((cat: any, index) => {
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(cat.position.x, cat.position.y, cat.position.z)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: cat.color,
        transparent: true,
        opacity: 0.2
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      connections.push({
        line,
        node1: nodes[0],
        node2: nodes[Math.min(index + 1, nodes.length - 1)]
      });
    });

    // Orbiting particles around hub
    const orbitParticles: THREE.Mesh[] = [];
    const particleGeometry = new THREE.SphereGeometry(0.06, 12, 12);
    
    Object.values(categories).forEach((cat, i) => {
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: cat.color,
        transparent: true,
        opacity: 0.9
      });

      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.userData = {
        radius: 1.5 + i * 0.3,
        angle: (i / 4) * Math.PI * 2,
        y: (Math.random() - 0.5) * 2,
        speed: 0.015 + Math.random() * 0.01
      };
      hub.add(particle);
      orbitParticles.push(particle);
    });

    // Camera position
    camera.position.z = 12;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Move nodes slowly
      nodes.forEach(node => {
        node.position.add(node.velocity);

        // Bounce off boundaries
        const bound = 5;
        if (Math.abs(node.position.x) > bound) node.velocity.x *= -1;
        if (Math.abs(node.position.y) > bound) node.velocity.y *= -1;
        if (Math.abs(node.position.z) > bound) node.velocity.z *= -1;

        node.mesh.position.copy(node.position);
        
        // Pulse effect
        const material = node.mesh.material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = 0.3 + Math.sin(time * 2.5 + node.position.x) * 0.15;
      });

      // Update connections
      connections.forEach(conn => {
        const positions = conn.line.geometry.attributes.position.array as Float32Array;
        positions[0] = conn.node1.position.x;
        positions[1] = conn.node1.position.y;
        positions[2] = conn.node1.position.z;
        positions[3] = conn.node2.position.x;
        positions[4] = conn.node2.position.y;
        positions[5] = conn.node2.position.z;
        conn.line.geometry.attributes.position.needsUpdate = true;

        // Pulse opacity based on distance
        const distance = conn.node1.position.distanceTo(conn.node2.position);
        const material = conn.line.material as THREE.LineBasicMaterial;
        material.opacity = Math.max(0, 0.4 - (distance / maxDistance) * 0.3);
      });

      // Rotate hub
      hub.rotation.x += 0.004;
      hub.rotation.y += 0.006;

      // Pulse core
      const coreScale = 1 + Math.sin(time * 3) * 0.15;
      core.scale.set(coreScale, coreScale, coreScale);
      (core.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.7 + Math.sin(time * 2.5) * 0.3;

      // Orbit particles
      orbitParticles.forEach(particle => {
        const data = particle.userData as any;
        data.angle += data.speed;
        particle.position.x = Math.cos(data.angle) * data.radius;
        particle.position.z = Math.sin(data.angle) * data.radius;
        particle.position.y = Math.sin(time * 2 + data.angle) * 0.5;
      });

      // Camera movement
      camera.position.x = Math.sin(time * 0.25) * 3;
      camera.position.y = 2 + Math.sin(time * 0.2) * 1;
      camera.lookAt(0, 0, 0);

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
