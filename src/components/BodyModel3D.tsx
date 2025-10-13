import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface BodyModel3DProps {
  gender: "male" | "female";
  bmi: number;
  netCalories: number;
}

const BodyMesh = ({ gender, bmi, netCalories }: BodyModel3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Calculate body proportions based on BMI and net calories
  const bodyScale = useMemo(() => {
    const baseBMI = 22; // Average BMI
    const bmiDiff = bmi - baseBMI;
    
    // Scale factors based on BMI deviation
    const widthScale = 1 + (bmiDiff * 0.04);
    const heightScale = 1;
    const depthScale = 1 + (bmiDiff * 0.03);
    
    // Adjust based on net calories (subtle effect for recent changes)
    const calorieEffect = Math.min(Math.max(netCalories / 3500, -0.1), 0.1);
    
    return {
      x: Math.max(0.6, Math.min(1.8, widthScale + calorieEffect)),
      y: heightScale,
      z: Math.max(0.6, Math.min(1.8, depthScale + calorieEffect)),
    };
  }, [bmi, netCalories]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Body color based on BMI category
  const bodyColor = useMemo(() => {
    if (bmi < 18.5) return "#FFA726"; // Underweight - orange
    if (bmi < 25) return "#66BB6A"; // Normal - green
    if (bmi < 30) return "#FFA726"; // Overweight - orange
    return "#EF5350"; // Obese - red
  }, [bmi]);

  return (
    <group>
      {/* Main torso */}
      <mesh ref={meshRef} position={[0, 0, 0]} scale={[bodyScale.x, bodyScale.y, bodyScale.z]}>
        <capsuleGeometry args={[0.5, 1.5, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.5, 0]} scale={[1, 1, 1]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#FFD8B1" roughness={0.8} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.6 * bodyScale.x, 0.3, 0]} rotation={[0, 0, Math.PI / 6]} scale={[0.6, 0.6, 0.6]}>
        <capsuleGeometry args={[0.15, 1.2, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0.6 * bodyScale.x, 0.3, 0]} rotation={[0, 0, -Math.PI / 6]} scale={[0.6, 0.6, 0.6]}>
        <capsuleGeometry args={[0.15, 1.2, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.25, -1.5, 0]} scale={[0.7, 0.7, 0.7]}>
        <capsuleGeometry args={[0.18, 1.3, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0.25, -1.5, 0]} scale={[0.7, 0.7, 0.7]}>
        <capsuleGeometry args={[0.18, 1.3, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
};

export const BodyModel3D = ({ gender, bmi, netCalories }: BodyModel3DProps) => {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-elegant bg-card">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
        <BodyMesh gender={gender} bmi={bmi} netCalories={netCalories} />
        <OrbitControls enableZoom={true} enablePan={false} minDistance={3} maxDistance={8} />
        <gridHelper args={[10, 10, "#ddd", "#ddd"]} position={[0, -3, 0]} />
      </Canvas>
    </div>
  );
};
