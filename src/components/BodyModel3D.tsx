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
  const groupRef = useRef<THREE.Group>(null);

  // Calculate body proportions based on BMI and net calories
  const bodyScale = useMemo(() => {
    const baseBMI = 22;
    const bmiDiff = bmi - baseBMI;
    
    // Body width increases with higher BMI - more refined scaling
    const torsoWidth = 1 + (bmiDiff * 0.10);
    const limbWidth = 1 + (bmiDiff * 0.06);
    const shoulderWidth = 1 + (bmiDiff * 0.08);
    
    // Calorie effect on muscle definition and body composition
    const calorieEffect = Math.min(Math.max(netCalories / 1500, -0.2), 0.2);
    const muscleDefinition = netCalories > 0 ? calorieEffect * 0.5 : calorieEffect * 0.3;
    
    return {
      torsoWidth: Math.max(0.7, Math.min(2.2, torsoWidth + calorieEffect * 0.3)),
      limbWidth: Math.max(0.7, Math.min(1.8, limbWidth + muscleDefinition)),
      shoulderWidth: Math.max(0.8, Math.min(2.0, shoulderWidth + muscleDefinition * 0.7)),
      torsoDepth: Math.max(0.7, Math.min(2.2, 1 + bmiDiff * 0.08 + calorieEffect * 0.2)),
      neckThickness: Math.max(0.8, Math.min(1.5, 1 + bmiDiff * 0.05)),
      headScale: Math.max(0.95, Math.min(1.15, 1 + bmiDiff * 0.02)),
    };
  }, [bmi, netCalories]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  // Body color based on BMI category
  const bodyColor = useMemo(() => {
    if (bmi < 18.5) return "#FFD4A3";
    if (bmi < 25) return "#F5CBA7";
    if (bmi < 30) return "#E8B298";
    return "#D4A088";
  }, [bmi]);

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 2.2, 0]} scale={[bodyScale.headScale, bodyScale.headScale * 1.15, bodyScale.headScale]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 2.25, 0.25]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.1, 2.25, 0.25]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.9, 0]} scale={[bodyScale.neckThickness, 1, bodyScale.neckThickness]}>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Upper Torso */}
      <mesh position={[0, 1.4, 0]} scale={[bodyScale.shoulderWidth, 1, bodyScale.torsoDepth]}>
        <capsuleGeometry args={[0.32, 0.4, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Mid Torso */}
      <mesh position={[0, 0.85, 0]} scale={[bodyScale.torsoWidth * 0.9, 1, bodyScale.torsoDepth * 0.9]}>
        <capsuleGeometry args={[0.3, 0.35, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Lower Torso */}
      <mesh position={[0, 0.35, 0]} scale={[bodyScale.torsoWidth * 0.85, 1, bodyScale.torsoDepth * 0.85]}>
        <capsuleGeometry args={[0.28, 0.3, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Hips */}
      <mesh position={[0, -0.1, 0]} scale={[bodyScale.torsoWidth * 0.88, 1, bodyScale.torsoDepth * 0.88]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Shoulder */}
      <mesh position={[-0.45 * bodyScale.shoulderWidth, 1.35, 0]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Shoulder */}
      <mesh position={[0.45 * bodyScale.shoulderWidth, 1.35, 0]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Upper Arm */}
      <mesh position={[-0.52 * bodyScale.shoulderWidth, 0.85, 0]} rotation={[0, 0, 0.1]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <capsuleGeometry args={[0.11, 0.55, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Upper Arm */}
      <mesh position={[0.52 * bodyScale.shoulderWidth, 0.85, 0]} rotation={[0, 0, -0.1]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <capsuleGeometry args={[0.11, 0.55, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Elbow */}
      <mesh position={[-0.58 * bodyScale.shoulderWidth, 0.38, 0]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Elbow */}
      <mesh position={[0.58 * bodyScale.shoulderWidth, 0.38, 0]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Forearm */}
      <mesh position={[-0.62 * bodyScale.shoulderWidth, -0.15, 0]} rotation={[0, 0, 0.05]} scale={[bodyScale.limbWidth * 0.9, 1, bodyScale.limbWidth * 0.9]}>
        <capsuleGeometry args={[0.095, 0.5, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Forearm */}
      <mesh position={[0.62 * bodyScale.shoulderWidth, -0.15, 0]} rotation={[0, 0, -0.05]} scale={[bodyScale.limbWidth * 0.9, 1, bodyScale.limbWidth * 0.9]}>
        <capsuleGeometry args={[0.095, 0.5, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Hand */}
      <mesh position={[-0.65 * bodyScale.shoulderWidth, -0.55, 0]} scale={[bodyScale.limbWidth * 0.8, 1, bodyScale.limbWidth * 0.7]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Hand */}
      <mesh position={[0.65 * bodyScale.shoulderWidth, -0.55, 0]} scale={[bodyScale.limbWidth * 0.8, 1, bodyScale.limbWidth * 0.7]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Hip */}
      <mesh position={[-0.22, -0.3, 0]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Hip */}
      <mesh position={[0.22, -0.3, 0]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Thigh */}
      <mesh position={[-0.22, -0.9, 0]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <capsuleGeometry args={[0.14, 0.7, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Thigh */}
      <mesh position={[0.22, -0.9, 0]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <capsuleGeometry args={[0.14, 0.7, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Knee */}
      <mesh position={[-0.22, -1.4, 0]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Knee */}
      <mesh position={[0.22, -1.4, 0]} scale={[bodyScale.limbWidth, 1, bodyScale.limbWidth]}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Calf */}
      <mesh position={[-0.22, -2.05, 0]} scale={[bodyScale.limbWidth * 0.85, 1, bodyScale.limbWidth * 0.85]}>
        <capsuleGeometry args={[0.11, 0.75, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Calf */}
      <mesh position={[0.22, -2.05, 0]} scale={[bodyScale.limbWidth * 0.85, 1, bodyScale.limbWidth * 0.85]}>
        <capsuleGeometry args={[0.11, 0.75, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Ankle */}
      <mesh position={[-0.22, -2.6, 0]} scale={[bodyScale.limbWidth * 0.75, 1, bodyScale.limbWidth * 0.75]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Ankle */}
      <mesh position={[0.22, -2.6, 0]} scale={[bodyScale.limbWidth * 0.75, 1, bodyScale.limbWidth * 0.75]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Foot */}
      <mesh position={[-0.22, -2.8, 0.12]} scale={[0.7, 0.7, 1.2]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.28]} />
        <meshStandardMaterial color="#333333" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Right Foot */}
      <mesh position={[0.22, -2.8, 0.12]} scale={[0.7, 0.7, 1.2]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.28]} />
        <meshStandardMaterial color="#333333" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
};

export const BodyModel3D = ({ gender, bmi, netCalories }: BodyModel3DProps) => {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-elegant bg-card border border-border">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={["hsl(var(--background))"]} />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <directionalLight position={[-3, 5, -3]} intensity={0.5} />
        <pointLight position={[0, 3, 3]} intensity={0.8} />
        
        <BodyMesh gender={gender} bmi={bmi} netCalories={netCalories} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={3} 
          maxDistance={8}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 6}
        />
        
        <gridHelper args={[10, 10, "hsl(var(--border))", "hsl(var(--border))"]} position={[0, -3, 0]} />
      </Canvas>
    </div>
  );
};
