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
    
    // Body width increases with higher BMI
    const torsoWidth = 1 + (bmiDiff * 0.12);
    const limbWidth = 1 + (bmiDiff * 0.08);
    
    // Calorie effect on muscle definition
    const calorieEffect = Math.min(Math.max(netCalories / 1500, -0.25), 0.25);
    
    return {
      torsoWidth: Math.max(0.6, Math.min(2.5, torsoWidth + calorieEffect)),
      limbWidth: Math.max(0.6, Math.min(2, limbWidth + calorieEffect * 0.5)),
      torsoDepth: Math.max(0.6, Math.min(2.5, 1 + bmiDiff * 0.1 + calorieEffect)),
    };
  }, [bmi, netCalories]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  // Body color based on BMI category
  const bodyColor = useMemo(() => {
    if (bmi < 18.5) return "#FFA726"; // Underweight - orange
    if (bmi < 25) return "#66BB6A"; // Normal - green
    if (bmi < 30) return "#FFA726"; // Overweight - orange
    return "#EF5350"; // Obese - red
  }, [bmi]);

  const skinColor = "#FFDAB3";
  const shoeColor = "#2C2C2C";

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.35, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Upper Chest */}
      <mesh position={[0, 1.35, 0]} scale={[bodyScale.torsoWidth * 0.85, 1, bodyScale.torsoDepth * 0.65]}>
        <boxGeometry args={[0.7, 0.6, 0.45]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Mid Torso */}
      <mesh position={[0, 0.8, 0]} scale={[bodyScale.torsoWidth * 0.8, 1, bodyScale.torsoDepth * 0.6]}>
        <boxGeometry args={[0.68, 0.5, 0.43]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Abdomen */}
      <mesh position={[0, 0.35, 0]} scale={[bodyScale.torsoWidth * 0.75, 1, bodyScale.torsoDepth * 0.58]}>
        <boxGeometry args={[0.65, 0.45, 0.4]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Pelvis/Hips */}
      <mesh position={[0, -0.1, 0]} scale={[bodyScale.torsoWidth * 0.78, 1, bodyScale.torsoDepth * 0.6]}>
        <boxGeometry args={[0.7, 0.4, 0.42]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Left Shoulder */}
      <mesh position={[-0.48 * bodyScale.torsoWidth, 1.3, 0]} scale={[bodyScale.limbWidth * 0.6, 0.6, bodyScale.limbWidth * 0.6]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Right Shoulder */}
      <mesh position={[0.48 * bodyScale.torsoWidth, 1.3, 0]} scale={[bodyScale.limbWidth * 0.6, 0.6, bodyScale.limbWidth * 0.6]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Left Upper Arm */}
      <mesh position={[-0.58 * bodyScale.torsoWidth, 0.75, 0]} rotation={[0, 0, 0.15]} scale={[bodyScale.limbWidth * 0.55, 1, bodyScale.limbWidth * 0.55]}>
        <cylinderGeometry args={[0.14, 0.13, 0.85, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Right Upper Arm */}
      <mesh position={[0.58 * bodyScale.torsoWidth, 0.75, 0]} rotation={[0, 0, -0.15]} scale={[bodyScale.limbWidth * 0.55, 1, bodyScale.limbWidth * 0.55]}>
        <cylinderGeometry args={[0.14, 0.13, 0.85, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Left Elbow */}
      <mesh position={[-0.66 * bodyScale.torsoWidth, 0.28, 0]} scale={[bodyScale.limbWidth * 0.45, 0.45, bodyScale.limbWidth * 0.45]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Right Elbow */}
      <mesh position={[0.66 * bodyScale.torsoWidth, 0.28, 0]} scale={[bodyScale.limbWidth * 0.45, 0.45, bodyScale.limbWidth * 0.45]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Left Forearm */}
      <mesh position={[-0.7 * bodyScale.torsoWidth, -0.25, 0]} rotation={[0, 0, 0.1]} scale={[bodyScale.limbWidth * 0.48, 1, bodyScale.limbWidth * 0.48]}>
        <cylinderGeometry args={[0.11, 0.12, 0.8, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Right Forearm */}
      <mesh position={[0.7 * bodyScale.torsoWidth, -0.25, 0]} rotation={[0, 0, -0.1]} scale={[bodyScale.limbWidth * 0.48, 1, bodyScale.limbWidth * 0.48]}>
        <cylinderGeometry args={[0.11, 0.12, 0.8, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Left Hand */}
      <mesh position={[-0.75 * bodyScale.torsoWidth, -0.7, 0]} scale={[bodyScale.limbWidth * 0.4, 0.5, bodyScale.limbWidth * 0.35]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>
      
      {/* Right Hand */}
      <mesh position={[0.75 * bodyScale.torsoWidth, -0.7, 0]} scale={[bodyScale.limbWidth * 0.4, 0.5, bodyScale.limbWidth * 0.35]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>

      {/* Left Hip Joint */}
      <mesh position={[-0.25, -0.35, 0]} scale={[bodyScale.limbWidth * 0.55, 0.55, bodyScale.limbWidth * 0.55]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Right Hip Joint */}
      <mesh position={[0.25, -0.35, 0]} scale={[bodyScale.limbWidth * 0.55, 0.55, bodyScale.limbWidth * 0.55]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Left Thigh */}
      <mesh position={[-0.25, -1, 0]} scale={[bodyScale.limbWidth * 0.65, 1, bodyScale.limbWidth * 0.65]}>
        <cylinderGeometry args={[0.16, 0.15, 0.95, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Right Thigh */}
      <mesh position={[0.25, -1, 0]} scale={[bodyScale.limbWidth * 0.65, 1, bodyScale.limbWidth * 0.65]}>
        <cylinderGeometry args={[0.16, 0.15, 0.95, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Left Knee */}
      <mesh position={[-0.25, -1.55, 0]} scale={[bodyScale.limbWidth * 0.52, 0.52, bodyScale.limbWidth * 0.52]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Right Knee */}
      <mesh position={[0.25, -1.55, 0]} scale={[bodyScale.limbWidth * 0.52, 0.52, bodyScale.limbWidth * 0.52]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Left Calf */}
      <mesh position={[-0.25, -2.2, 0]} scale={[bodyScale.limbWidth * 0.5, 1, bodyScale.limbWidth * 0.5]}>
        <cylinderGeometry args={[0.12, 0.14, 0.95, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Right Calf */}
      <mesh position={[0.25, -2.2, 0]} scale={[bodyScale.limbWidth * 0.5, 1, bodyScale.limbWidth * 0.5]}>
        <cylinderGeometry args={[0.12, 0.14, 0.95, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Left Ankle */}
      <mesh position={[-0.25, -2.75, 0]} scale={[bodyScale.limbWidth * 0.42, 0.42, bodyScale.limbWidth * 0.42]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Right Ankle */}
      <mesh position={[0.25, -2.75, 0]} scale={[bodyScale.limbWidth * 0.42, 0.42, bodyScale.limbWidth * 0.42]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Left Foot */}
      <mesh position={[-0.25, -3, 0.15]} scale={[0.6, 0.35, 0.85]}>
        <boxGeometry args={[0.25, 0.2, 0.45]} />
        <meshStandardMaterial color={shoeColor} roughness={0.8} />
      </mesh>
      
      {/* Right Foot */}
      <mesh position={[0.25, -3, 0.15]} scale={[0.6, 0.35, 0.85]}>
        <boxGeometry args={[0.25, 0.2, 0.45]} />
        <meshStandardMaterial color={shoeColor} roughness={0.8} />
      </mesh>
    </group>
  );
};

export const BodyModel3D = ({ gender, bmi, netCalories }: BodyModel3DProps) => {
  return (
    <div className="w-full h-[550px] rounded-xl overflow-hidden shadow-elegant bg-card border border-border">
      <Canvas camera={{ position: [0, 0.5, 6], fov: 55 }}>
        <color attach="background" args={["hsl(var(--background))"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 3]} intensity={1.5} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.6} />
        <pointLight position={[0, 3, 0]} intensity={0.8} color="#ffffff" />
        <BodyMesh gender={gender} bmi={bmi} netCalories={netCalories} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={4} 
          maxDistance={10}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
        <gridHelper args={[8, 8]} position={[0, -3.2, 0]} />
      </Canvas>
    </div>
  );
};
