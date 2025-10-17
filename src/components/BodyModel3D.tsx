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

  const hairColor = "#2C1810";
  const clothingTopColor = "#4A90E2";
  const clothingBottomColor = "#2C3E50";

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 2.1, 0]} scale={[bodyScale.headScale, bodyScale.headScale * 1.2, bodyScale.headScale]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 2.35, -0.05]} scale={[bodyScale.headScale * 1.05, bodyScale.headScale * 0.7, bodyScale.headScale * 1.05]}>
        <sphereGeometry args={[0.36, 32, 32]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.12, 2.15, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0.12, 2.15, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 2.05, 0.32]} scale={[0.3, 0.5, 0.8]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.8, 0]} scale={[bodyScale.neckThickness, 1, bodyScale.neckThickness]}>
        <cylinderGeometry args={[0.13, 0.16, 0.35, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>
      
      {/* Upper Torso - Shirt */}
      <mesh position={[0, 1.3, 0]} scale={[bodyScale.shoulderWidth, 1, bodyScale.torsoDepth]}>
        <capsuleGeometry args={[0.35, 0.45, 16, 32]} />
        <meshStandardMaterial color={clothingTopColor} roughness={0.7} metalness={0} />
      </mesh>
      
      {/* Mid Torso - Shirt */}
      <mesh position={[0, 0.75, 0]} scale={[bodyScale.torsoWidth * 0.88, 1, bodyScale.torsoDepth * 0.88]}>
        <capsuleGeometry args={[0.32, 0.4, 16, 32]} />
        <meshStandardMaterial color={clothingTopColor} roughness={0.7} metalness={0} />
      </mesh>
      
      {/* Lower Torso - Shirt */}
      <mesh position={[0, 0.25, 0]} scale={[bodyScale.torsoWidth * 0.82, 1, bodyScale.torsoDepth * 0.82]}>
        <capsuleGeometry args={[0.3, 0.35, 16, 32]} />
        <meshStandardMaterial color={clothingTopColor} roughness={0.7} metalness={0} />
      </mesh>
      
      {/* Hips - Pants */}
      <mesh position={[0, -0.15, 0]} scale={[bodyScale.torsoWidth * 0.8, 1, bodyScale.torsoDepth * 0.8]}>
        <capsuleGeometry args={[0.32, 0.3, 16, 32]} />
        <meshStandardMaterial color={clothingBottomColor} roughness={0.7} metalness={0} />
      </mesh>

      {/* Left Shoulder */}
      <mesh position={[-0.5 * bodyScale.shoulderWidth, 1.28, 0]} scale={[bodyScale.limbWidth * 0.7, 0.7, bodyScale.limbWidth * 0.7]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={clothingTopColor} roughness={0.7} metalness={0} />
      </mesh>
      
      {/* Right Shoulder */}
      <mesh position={[0.5 * bodyScale.shoulderWidth, 1.28, 0]} scale={[bodyScale.limbWidth * 0.7, 0.7, bodyScale.limbWidth * 0.7]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={clothingTopColor} roughness={0.7} metalness={0} />
      </mesh>

      {/* Left Upper Arm - Skin */}
      <mesh position={[-0.56 * bodyScale.shoulderWidth, 0.7, 0]} rotation={[0, 0, 0.12]} scale={[bodyScale.limbWidth * 0.6, 1, bodyScale.limbWidth * 0.6]}>
        <capsuleGeometry args={[0.12, 0.6, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>
      
      {/* Right Upper Arm - Skin */}
      <mesh position={[0.56 * bodyScale.shoulderWidth, 0.7, 0]} rotation={[0, 0, -0.12]} scale={[bodyScale.limbWidth * 0.6, 1, bodyScale.limbWidth * 0.6]}>
        <capsuleGeometry args={[0.12, 0.6, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Left Elbow */}
      <mesh position={[-0.62 * bodyScale.shoulderWidth, 0.25, 0]} scale={[bodyScale.limbWidth * 0.55, 0.55, bodyScale.limbWidth * 0.55]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>
      
      {/* Right Elbow */}
      <mesh position={[0.62 * bodyScale.shoulderWidth, 0.25, 0]} scale={[bodyScale.limbWidth * 0.55, 0.55, bodyScale.limbWidth * 0.55]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Left Forearm */}
      <mesh position={[-0.66 * bodyScale.shoulderWidth, -0.3, 0]} rotation={[0, 0, 0.08]} scale={[bodyScale.limbWidth * 0.52, 1, bodyScale.limbWidth * 0.52]}>
        <capsuleGeometry args={[0.1, 0.58, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>
      
      {/* Right Forearm */}
      <mesh position={[0.66 * bodyScale.shoulderWidth, -0.3, 0]} rotation={[0, 0, -0.08]} scale={[bodyScale.limbWidth * 0.52, 1, bodyScale.limbWidth * 0.52]}>
        <capsuleGeometry args={[0.1, 0.58, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Left Hand */}
      <mesh position={[-0.7 * bodyScale.shoulderWidth, -0.7, 0]} scale={[bodyScale.limbWidth * 0.45, 0.6, bodyScale.limbWidth * 0.4]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Hand */}
      <mesh position={[0.7 * bodyScale.shoulderWidth, -0.7, 0]} scale={[bodyScale.limbWidth * 0.45, 0.6, bodyScale.limbWidth * 0.4]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Hip Joint */}
      <mesh position={[-0.25, -0.38, 0]} scale={[bodyScale.limbWidth * 0.62, 0.62, bodyScale.limbWidth * 0.62]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={clothingBottomColor} roughness={0.7} metalness={0} />
      </mesh>
      
      {/* Right Hip Joint */}
      <mesh position={[0.25, -0.38, 0]} scale={[bodyScale.limbWidth * 0.62, 0.62, bodyScale.limbWidth * 0.62]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={clothingBottomColor} roughness={0.7} metalness={0} />
      </mesh>

      {/* Left Thigh - Pants */}
      <mesh position={[-0.25, -1.05, 0]} scale={[bodyScale.limbWidth * 0.7, 1, bodyScale.limbWidth * 0.7]}>
        <capsuleGeometry args={[0.16, 0.8, 16, 32]} />
        <meshStandardMaterial color={clothingBottomColor} roughness={0.7} metalness={0} />
      </mesh>
      
      {/* Right Thigh - Pants */}
      <mesh position={[0.25, -1.05, 0]} scale={[bodyScale.limbWidth * 0.7, 1, bodyScale.limbWidth * 0.7]}>
        <capsuleGeometry args={[0.16, 0.8, 16, 32]} />
        <meshStandardMaterial color={clothingBottomColor} roughness={0.7} metalness={0} />
      </mesh>

      {/* Left Knee */}
      <mesh position={[-0.25, -1.6, 0]} scale={[bodyScale.limbWidth * 0.58, 0.58, bodyScale.limbWidth * 0.58]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={clothingBottomColor} roughness={0.7} metalness={0} />
      </mesh>
      
      {/* Right Knee */}
      <mesh position={[0.25, -1.6, 0]} scale={[bodyScale.limbWidth * 0.58, 0.58, bodyScale.limbWidth * 0.58]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={clothingBottomColor} roughness={0.7} metalness={0} />
      </mesh>

      {/* Left Calf - Pants */}
      <mesh position={[-0.25, -2.25, 0]} scale={[bodyScale.limbWidth * 0.55, 1, bodyScale.limbWidth * 0.55]}>
        <capsuleGeometry args={[0.13, 0.8, 16, 32]} />
        <meshStandardMaterial color={clothingBottomColor} roughness={0.7} metalness={0} />
      </mesh>
      
      {/* Right Calf - Pants */}
      <mesh position={[0.25, -2.25, 0]} scale={[bodyScale.limbWidth * 0.55, 1, bodyScale.limbWidth * 0.55]}>
        <capsuleGeometry args={[0.13, 0.8, 16, 32]} />
        <meshStandardMaterial color={clothingBottomColor} roughness={0.7} metalness={0} />
      </mesh>

      {/* Left Ankle */}
      <mesh position={[-0.25, -2.75, 0]} scale={[bodyScale.limbWidth * 0.48, 0.48, bodyScale.limbWidth * 0.48]}>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>
      
      {/* Right Ankle */}
      <mesh position={[0.25, -2.75, 0]} scale={[bodyScale.limbWidth * 0.48, 0.48, bodyScale.limbWidth * 0.48]}>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Left Foot */}
      <mesh position={[-0.25, -2.92, 0.14]} scale={[0.75, 0.5, 1.3]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.18, 0.15, 0.32]} />
        <meshStandardMaterial color="#2C3E50" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Right Foot */}
      <mesh position={[0.25, -2.92, 0.14]} scale={[0.75, 0.5, 1.3]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.18, 0.15, 0.32]} />
        <meshStandardMaterial color="#2C3E50" roughness={0.8} metalness={0.1} />
      </mesh>
    </group>
  );
};

export const BodyModel3D = ({ gender, bmi, netCalories }: BodyModel3DProps) => {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-elegant bg-card border border-border">
      <Canvas camera={{ position: [0, 0.2, 5.5], fov: 50 }}>
        <color attach="background" args={["hsl(var(--background))"]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} />
        <directionalLight position={[-4, 5, -4]} intensity={0.7} />
        <pointLight position={[0, 3, 4]} intensity={1} />
        <hemisphereLight args={["#ffffff", "#8B7355", 0.5]} />
        
        <BodyMesh gender={gender} bmi={bmi} netCalories={netCalories} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={3.5} 
          maxDistance={9}
          maxPolarAngle={Math.PI / 1.9}
          minPolarAngle={Math.PI / 5}
          enableDamping
          dampingFactor={0.05}
        />
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.05, 0]} receiveShadow>
          <circleGeometry args={[8, 64]} />
          <meshStandardMaterial 
            color="hsl(var(--muted))" 
            roughness={0.8} 
            metalness={0.1}
          />
        </mesh>
      </Canvas>
    </div>
  );
};
