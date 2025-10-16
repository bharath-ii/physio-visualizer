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
  const hairColor = "#3D2817";

  return (
    <group ref={groupRef}>
      {/* Head - more realistic shape */}
      <mesh position={[0, 2.2, 0]} scale={[1, 1.15, 0.95]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 2.45, -0.05]} scale={[1.02, 0.7, 1.02]}>
        <sphereGeometry args={[0.36, 32, 32]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.12, 2.25, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0.12, 2.25, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 2.15, 0.32]} scale={[0.4, 0.6, 1.2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} />
      </mesh>
      
      {/* Neck - more realistic */}
      <mesh position={[0, 1.85, 0]} scale={[1, 1, 0.95]}>
        <cylinderGeometry args={[0.15, 0.18, 0.35, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Upper Chest - more rounded */}
      <mesh position={[0, 1.35, 0]} scale={[bodyScale.torsoWidth * 0.85, 1, bodyScale.torsoDepth * 0.65]}>
        <capsuleGeometry args={[0.35, 0.5, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>
      
      {/* Mid Torso - smooth transition */}
      <mesh position={[0, 0.8, 0]} scale={[bodyScale.torsoWidth * 0.8, 1, bodyScale.torsoDepth * 0.6]}>
        <capsuleGeometry args={[0.34, 0.4, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>
      
      {/* Abdomen - natural curve */}
      <mesh position={[0, 0.35, 0]} scale={[bodyScale.torsoWidth * 0.75, 1, bodyScale.torsoDepth * 0.58]}>
        <capsuleGeometry args={[0.32, 0.35, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>
      
      {/* Pelvis/Hips - organic shape */}
      <mesh position={[0, -0.1, 0]} scale={[bodyScale.torsoWidth * 0.78, 1, bodyScale.torsoDepth * 0.6]}>
        <capsuleGeometry args={[0.35, 0.3, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>

      {/* Left Shoulder - smooth joint */}
      <mesh position={[-0.48 * bodyScale.torsoWidth, 1.3, 0]} scale={[bodyScale.limbWidth * 0.6, 0.6, bodyScale.limbWidth * 0.6]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>
      
      {/* Right Shoulder - smooth joint */}
      <mesh position={[0.48 * bodyScale.torsoWidth, 1.3, 0]} scale={[bodyScale.limbWidth * 0.6, 0.6, bodyScale.limbWidth * 0.6]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>

      {/* Left Upper Arm - muscular definition */}
      <mesh position={[-0.58 * bodyScale.torsoWidth, 0.75, 0]} rotation={[0, 0, 0.15]} scale={[bodyScale.limbWidth * 0.55, 1, bodyScale.limbWidth * 0.55]}>
        <capsuleGeometry args={[0.13, 0.7, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>
      
      {/* Right Upper Arm - muscular definition */}
      <mesh position={[0.58 * bodyScale.torsoWidth, 0.75, 0]} rotation={[0, 0, -0.15]} scale={[bodyScale.limbWidth * 0.55, 1, bodyScale.limbWidth * 0.55]}>
        <capsuleGeometry args={[0.13, 0.7, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>

      {/* Left Elbow - natural joint */}
      <mesh position={[-0.66 * bodyScale.torsoWidth, 0.28, 0]} scale={[bodyScale.limbWidth * 0.45, 0.45, bodyScale.limbWidth * 0.45]}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Right Elbow - natural joint */}
      <mesh position={[0.66 * bodyScale.torsoWidth, 0.28, 0]} scale={[bodyScale.limbWidth * 0.45, 0.45, bodyScale.limbWidth * 0.45]}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Left Forearm - tapered naturally */}
      <mesh position={[-0.7 * bodyScale.torsoWidth, -0.25, 0]} rotation={[0, 0, 0.1]} scale={[bodyScale.limbWidth * 0.48, 1, bodyScale.limbWidth * 0.48]}>
        <capsuleGeometry args={[0.105, 0.65, 16, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Right Forearm - tapered naturally */}
      <mesh position={[0.7 * bodyScale.torsoWidth, -0.25, 0]} rotation={[0, 0, -0.1]} scale={[bodyScale.limbWidth * 0.48, 1, bodyScale.limbWidth * 0.48]}>
        <capsuleGeometry args={[0.105, 0.65, 16, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Left Hand - more detailed */}
      <mesh position={[-0.75 * bodyScale.torsoWidth, -0.7, 0]} scale={[bodyScale.limbWidth * 0.4, 0.5, bodyScale.limbWidth * 0.35]}>
        <boxGeometry args={[0.12, 0.16, 0.08]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      
      {/* Right Hand - more detailed */}
      <mesh position={[0.75 * bodyScale.torsoWidth, -0.7, 0]} scale={[bodyScale.limbWidth * 0.4, 0.5, bodyScale.limbWidth * 0.35]}>
        <boxGeometry args={[0.12, 0.16, 0.08]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* Left Hip Joint - smooth connection */}
      <mesh position={[-0.25, -0.35, 0]} scale={[bodyScale.limbWidth * 0.55, 0.55, bodyScale.limbWidth * 0.55]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>
      
      {/* Right Hip Joint - smooth connection */}
      <mesh position={[0.25, -0.35, 0]} scale={[bodyScale.limbWidth * 0.55, 0.55, bodyScale.limbWidth * 0.55]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>

      {/* Left Thigh - realistic muscle shape */}
      <mesh position={[-0.25, -1, 0]} scale={[bodyScale.limbWidth * 0.65, 1, bodyScale.limbWidth * 0.65]}>
        <capsuleGeometry args={[0.15, 0.8, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>
      
      {/* Right Thigh - realistic muscle shape */}
      <mesh position={[0.25, -1, 0]} scale={[bodyScale.limbWidth * 0.65, 1, bodyScale.limbWidth * 0.65]}>
        <capsuleGeometry args={[0.15, 0.8, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.15} />
      </mesh>

      {/* Left Knee - natural joint */}
      <mesh position={[-0.25, -1.55, 0]} scale={[bodyScale.limbWidth * 0.52, 0.52, bodyScale.limbWidth * 0.52]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Right Knee - natural joint */}
      <mesh position={[0.25, -1.55, 0]} scale={[bodyScale.limbWidth * 0.52, 0.52, bodyScale.limbWidth * 0.52]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Left Calf - natural taper */}
      <mesh position={[-0.25, -2.2, 0]} scale={[bodyScale.limbWidth * 0.5, 1, bodyScale.limbWidth * 0.5]}>
        <capsuleGeometry args={[0.12, 0.8, 16, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Right Calf - natural taper */}
      <mesh position={[0.25, -2.2, 0]} scale={[bodyScale.limbWidth * 0.5, 1, bodyScale.limbWidth * 0.5]}>
        <capsuleGeometry args={[0.12, 0.8, 16, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Left Ankle - subtle joint */}
      <mesh position={[-0.25, -2.75, 0]} scale={[bodyScale.limbWidth * 0.42, 0.42, bodyScale.limbWidth * 0.42]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Right Ankle - subtle joint */}
      <mesh position={[0.25, -2.75, 0]} scale={[bodyScale.limbWidth * 0.42, 0.42, bodyScale.limbWidth * 0.42]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Left Foot - more realistic shoe shape */}
      <mesh position={[-0.25, -3, 0.15]} scale={[0.6, 0.35, 0.85]} rotation={[0.1, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.1, 0.35, 8, 16]} />
        <meshStandardMaterial color={shoeColor} roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Right Foot - more realistic shoe shape */}
      <mesh position={[0.25, -3, 0.15]} scale={[0.6, 0.35, 0.85]} rotation={[0.1, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.1, 0.35, 8, 16]} />
        <meshStandardMaterial color={shoeColor} roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
};

export const BodyModel3D = ({ gender, bmi, netCalories }: BodyModel3DProps) => {
  return (
    <div className="w-full h-[550px] rounded-xl overflow-hidden shadow-elegant bg-card border border-border">
      <Canvas camera={{ position: [0, 0.5, 6], fov: 55 }} shadows>
        <color attach="background" args={["hsl(var(--background))"]} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.8} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-4, 3, -3]} intensity={0.8} />
        <pointLight position={[0, 4, 2]} intensity={1.2} color="#fff5e6" />
        <spotLight 
          position={[0, 6, 0]} 
          angle={0.5} 
          penumbra={0.8} 
          intensity={0.6} 
          castShadow
        />
        <BodyMesh gender={gender} bmi={bmi} netCalories={netCalories} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={4} 
          maxDistance={10}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
        <gridHelper args={[10, 10, "#888888", "#444444"]} position={[0, -3.2, 0]} />
      </Canvas>
    </div>
  );
};
