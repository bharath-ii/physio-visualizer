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

  // Body color based on BMI category with more natural skin tones
  const bodyColor = useMemo(() => {
    if (bmi < 18.5) return "#FFB088"; // Underweight - light peachy
    if (bmi < 25) return "#E8B59B"; // Normal - healthy tan
    if (bmi < 30) return "#D9A88E"; // Overweight - deeper tan
    return "#C99A85"; // Obese - darker tan
  }, [bmi]);

  const skinColor = "#F5D5C0";
  const shoeColor = "#1a1a1a";
  const hairColor = "#4A3728";
  const clothingColor = "#3B82F6";

  return (
    <group ref={groupRef}>
      {/* Head - anatomically correct proportions */}
      <mesh position={[0, 2.2, 0]} scale={[bodyScale.headScale, bodyScale.headScale * 1.2, bodyScale.headScale * 0.95]}>
        <sphereGeometry args={[0.33, 64, 64]} />
        <meshStandardMaterial color={skinColor} roughness={0.3} metalness={0.05} />
      </mesh>
      
      {/* Hair - more realistic volume */}
      <mesh position={[0, 2.48, -0.08]} scale={[bodyScale.headScale * 1.05, bodyScale.headScale * 0.75, bodyScale.headScale * 1.05]}>
        <sphereGeometry args={[0.35, 64, 64]} />
        <meshStandardMaterial color={hairColor} roughness={0.95} metalness={0} />
      </mesh>
      
      {/* Eyes - more detailed */}
      <mesh position={[-0.11, 2.24, 0.29]}>
        <sphereGeometry args={[0.045, 32, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.9} emissive="#1a1a1a" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.11, 2.24, 0.29]}>
        <sphereGeometry args={[0.045, 32, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.9} emissive="#1a1a1a" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Eye highlights */}
      <mesh position={[-0.1, 2.26, 0.32]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.12, 2.26, 0.32]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Nose - more defined */}
      <mesh position={[0, 2.14, 0.3]} scale={[0.35, 0.55, 1.3]} rotation={[0.15, 0, 0]}>
        <sphereGeometry args={[0.055, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.05} />
      </mesh>
      
      {/* Mouth suggestion */}
      <mesh position={[0, 2.05, 0.28]} scale={[0.8, 0.3, 0.5]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#D4A894" roughness={0.6} metalness={0} />
      </mesh>
      
      {/* Neck - smoother transition */}
      <mesh position={[0, 1.88, 0]} scale={[bodyScale.neckThickness, 1, bodyScale.neckThickness * 0.95]}>
        <cylinderGeometry args={[0.14, 0.17, 0.3, 64]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.05} />
      </mesh>
      
      {/* Adam's apple (subtle) */}
      <mesh position={[0, 1.82, 0.12]} scale={[0.4, 0.6, 0.8]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.05} />
      </mesh>
      
      {/* Upper Chest - anatomically correct with clothing */}
      <mesh position={[0, 1.4, 0]} scale={[bodyScale.shoulderWidth * 0.88, 1.05, bodyScale.torsoDepth * 0.68]}>
        <capsuleGeometry args={[0.38, 0.45, 32, 64]} />
        <meshStandardMaterial color={clothingColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Chest definition (subtle pectoral muscles) */}
      <mesh position={[-0.15 * bodyScale.shoulderWidth, 1.38, 0.22]} scale={[0.5, 0.8, 0.6]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={clothingColor} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0.15 * bodyScale.shoulderWidth, 1.38, 0.22]} scale={[0.5, 0.8, 0.6]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={clothingColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Mid Torso - smooth transition with clothing */}
      <mesh position={[0, 0.85, 0]} scale={[bodyScale.torsoWidth * 0.82, 1.05, bodyScale.torsoDepth * 0.62]}>
        <capsuleGeometry args={[0.36, 0.38, 32, 64]} />
        <meshStandardMaterial color={clothingColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Abdomen - natural curve with clothing */}
      <mesh position={[0, 0.38, 0]} scale={[bodyScale.torsoWidth * 0.76, 1.05, bodyScale.torsoDepth * 0.58]}>
        <capsuleGeometry args={[0.33, 0.32, 32, 64]} />
        <meshStandardMaterial color={clothingColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Pelvis/Hips - organic shape with pants */}
      <mesh position={[0, -0.08, 0]} scale={[bodyScale.torsoWidth * 0.78, 1.02, bodyScale.torsoDepth * 0.62]}>
        <capsuleGeometry args={[0.36, 0.28, 32, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.05} />
      </mesh>
      
      {/* Belt */}
      <mesh position={[0, -0.02, 0]} scale={[bodyScale.torsoWidth * 0.82, 0.3, bodyScale.torsoDepth * 0.64]}>
        <cylinderGeometry args={[0.36, 0.36, 0.08, 64]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Left Shoulder - deltoid muscle definition */}
      <mesh position={[-0.52 * bodyScale.shoulderWidth, 1.32, 0]} scale={[bodyScale.limbWidth * 0.65, 0.68, bodyScale.limbWidth * 0.65]}>
        <sphereGeometry args={[0.24, 64, 64]} />
        <meshStandardMaterial color={clothingColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Shoulder - deltoid muscle definition */}
      <mesh position={[0.52 * bodyScale.shoulderWidth, 1.32, 0]} scale={[bodyScale.limbWidth * 0.65, 0.68, bodyScale.limbWidth * 0.65]}>
        <sphereGeometry args={[0.24, 64, 64]} />
        <meshStandardMaterial color={clothingColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Upper Arm - bicep and tricep definition */}
      <mesh position={[-0.62 * bodyScale.shoulderWidth, 0.78, 0]} rotation={[0, 0, 0.12]} scale={[bodyScale.limbWidth * 0.58, 1.05, bodyScale.limbWidth * 0.58]}>
        <capsuleGeometry args={[0.135, 0.68, 32, 64]} />
        <meshStandardMaterial color={skinColor} roughness={0.32} metalness={0.08} />
      </mesh>
      
      {/* Right Upper Arm - bicep and tricep definition */}
      <mesh position={[0.62 * bodyScale.shoulderWidth, 0.78, 0]} rotation={[0, 0, -0.12]} scale={[bodyScale.limbWidth * 0.58, 1.05, bodyScale.limbWidth * 0.58]}>
        <capsuleGeometry args={[0.135, 0.68, 32, 64]} />
        <meshStandardMaterial color={skinColor} roughness={0.32} metalness={0.08} />
      </mesh>

      {/* Left Elbow - anatomical joint */}
      <mesh position={[-0.68 * bodyScale.shoulderWidth, 0.30, 0]} scale={[bodyScale.limbWidth * 0.48, 0.48, bodyScale.limbWidth * 0.48]}>
        <sphereGeometry args={[0.132, 64, 64]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.08} />
      </mesh>
      
      {/* Right Elbow - anatomical joint */}
      <mesh position={[0.68 * bodyScale.shoulderWidth, 0.30, 0]} scale={[bodyScale.limbWidth * 0.48, 0.48, bodyScale.limbWidth * 0.48]}>
        <sphereGeometry args={[0.132, 64, 64]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.08} />
      </mesh>

      {/* Left Forearm - naturally tapered with muscle detail */}
      <mesh position={[-0.73 * bodyScale.shoulderWidth, -0.23, 0]} rotation={[0, 0, 0.08]} scale={[bodyScale.limbWidth * 0.50, 1.02, bodyScale.limbWidth * 0.50]}>
        <capsuleGeometry args={[0.108, 0.63, 32, 64]} />
        <meshStandardMaterial color={skinColor} roughness={0.38} metalness={0.08} />
      </mesh>
      
      {/* Right Forearm - naturally tapered with muscle detail */}
      <mesh position={[0.73 * bodyScale.shoulderWidth, -0.23, 0]} rotation={[0, 0, -0.08]} scale={[bodyScale.limbWidth * 0.50, 1.02, bodyScale.limbWidth * 0.50]}>
        <capsuleGeometry args={[0.108, 0.63, 32, 64]} />
        <meshStandardMaterial color={skinColor} roughness={0.38} metalness={0.08} />
      </mesh>

      {/* Left Wrist */}
      <mesh position={[-0.77 * bodyScale.shoulderWidth, -0.62, 0]} scale={[bodyScale.limbWidth * 0.42, 0.42, bodyScale.limbWidth * 0.42]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.08} />
      </mesh>
      
      {/* Right Wrist */}
      <mesh position={[0.77 * bodyScale.shoulderWidth, -0.62, 0]} scale={[bodyScale.limbWidth * 0.42, 0.42, bodyScale.limbWidth * 0.42]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} metalness={0.08} />
      </mesh>
      
      {/* Left Hand - palm */}
      <mesh position={[-0.78 * bodyScale.shoulderWidth, -0.82, 0.02]} scale={[bodyScale.limbWidth * 0.42, 0.55, bodyScale.limbWidth * 0.38]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.13, 0.16, 0.06]} />
        <meshStandardMaterial color={skinColor} roughness={0.45} metalness={0.05} />
      </mesh>
      
      {/* Right Hand - palm */}
      <mesh position={[0.78 * bodyScale.shoulderWidth, -0.82, 0.02]} scale={[bodyScale.limbWidth * 0.42, 0.55, bodyScale.limbWidth * 0.38]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.13, 0.16, 0.06]} />
        <meshStandardMaterial color={skinColor} roughness={0.45} metalness={0.05} />
      </mesh>
      
      {/* Left Fingers */}
      <mesh position={[-0.78 * bodyScale.shoulderWidth, -0.95, 0.02]} scale={[bodyScale.limbWidth * 0.35, 0.4, bodyScale.limbWidth * 0.28]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.04]} />
        <meshStandardMaterial color={skinColor} roughness={0.45} metalness={0.05} />
      </mesh>
      
      {/* Right Fingers */}
      <mesh position={[0.78 * bodyScale.shoulderWidth, -0.95, 0.02]} scale={[bodyScale.limbWidth * 0.35, 0.4, bodyScale.limbWidth * 0.28]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.04]} />
        <meshStandardMaterial color={skinColor} roughness={0.45} metalness={0.05} />
      </mesh>

      {/* Left Hip Joint - gluteal muscle connection */}
      <mesh position={[-0.26, -0.33, 0]} scale={[bodyScale.limbWidth * 0.58, 0.58, bodyScale.limbWidth * 0.58]}>
        <sphereGeometry args={[0.19, 64, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.05} />
      </mesh>
      
      {/* Right Hip Joint - gluteal muscle connection */}
      <mesh position={[0.26, -0.33, 0]} scale={[bodyScale.limbWidth * 0.58, 0.58, bodyScale.limbWidth * 0.58]}>
        <sphereGeometry args={[0.19, 64, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Left Thigh - quadriceps and hamstring definition */}
      <mesh position={[-0.26, -0.98, 0]} scale={[bodyScale.limbWidth * 0.68, 1.05, bodyScale.limbWidth * 0.68]}>
        <capsuleGeometry args={[0.16, 0.78, 32, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.05} />
      </mesh>
      
      {/* Right Thigh - quadriceps and hamstring definition */}
      <mesh position={[0.26, -0.98, 0]} scale={[bodyScale.limbWidth * 0.68, 1.05, bodyScale.limbWidth * 0.68]}>
        <capsuleGeometry args={[0.16, 0.78, 32, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Left Knee - patella detail */}
      <mesh position={[-0.26, -1.52, 0]} scale={[bodyScale.limbWidth * 0.54, 0.54, bodyScale.limbWidth * 0.54]}>
        <sphereGeometry args={[0.155, 64, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.05} />
      </mesh>
      
      {/* Right Knee - patella detail */}
      <mesh position={[0.26, -1.52, 0]} scale={[bodyScale.limbWidth * 0.54, 0.54, bodyScale.limbWidth * 0.54]}>
        <sphereGeometry args={[0.155, 64, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.05} />
      </mesh>
      
      {/* Left Kneecap */}
      <mesh position={[-0.26, -1.52, 0.12]} scale={[0.6, 0.65, 0.5]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Right Kneecap */}
      <mesh position={[0.26, -1.52, 0.12]} scale={[0.6, 0.65, 0.5]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Calf - gastrocnemius muscle definition */}
      <mesh position={[-0.26, -2.16, 0]} scale={[bodyScale.limbWidth * 0.52, 1.05, bodyScale.limbWidth * 0.52]}>
        <capsuleGeometry args={[0.125, 0.76, 32, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.05} />
      </mesh>
      
      {/* Right Calf - gastrocnemius muscle definition */}
      <mesh position={[0.26, -2.16, 0]} scale={[bodyScale.limbWidth * 0.52, 1.05, bodyScale.limbWidth * 0.52]}>
        <capsuleGeometry args={[0.125, 0.76, 32, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.05} />
      </mesh>
      
      {/* Left Calf muscle bulge */}
      <mesh position={[-0.26, -2.05, -0.08]} scale={[0.55, 0.75, 0.65]}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.05} />
      </mesh>
      
      {/* Right Calf muscle bulge */}
      <mesh position={[0.26, -2.05, -0.08]} scale={[0.55, 0.75, 0.65]}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Left Ankle - anatomical joint with sock */}
      <mesh position={[-0.26, -2.68, 0]} scale={[bodyScale.limbWidth * 0.44, 0.44, bodyScale.limbWidth * 0.44]}>
        <sphereGeometry args={[0.122, 64, 64]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.8} metalness={0} />
      </mesh>
      
      {/* Right Ankle - anatomical joint with sock */}
      <mesh position={[0.26, -2.68, 0]} scale={[bodyScale.limbWidth * 0.44, 0.44, bodyScale.limbWidth * 0.44]}>
        <sphereGeometry args={[0.122, 64, 64]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.8} metalness={0} />
      </mesh>

      {/* Left Foot - sneaker design */}
      <mesh position={[-0.26, -2.92, 0.16]} scale={[0.62, 0.38, 0.9]} rotation={[0.08, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.105, 0.36, 16, 32]} />
        <meshStandardMaterial color={shoeColor} roughness={0.65} metalness={0.15} />
      </mesh>
      
      {/* Right Foot - sneaker design */}
      <mesh position={[0.26, -2.92, 0.16]} scale={[0.62, 0.38, 0.9]} rotation={[0.08, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.105, 0.36, 16, 32]} />
        <meshStandardMaterial color={shoeColor} roughness={0.65} metalness={0.15} />
      </mesh>
      
      {/* Left Shoe sole */}
      <mesh position={[-0.26, -3.02, 0.16]} scale={[0.65, 0.25, 0.95]} rotation={[0.05, 0, Math.PI / 2]}>
        <boxGeometry args={[0.12, 0.4, 0.25]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.05} />
      </mesh>
      
      {/* Right Shoe sole */}
      <mesh position={[0.26, -3.02, 0.16]} scale={[0.65, 0.25, 0.95]} rotation={[0.05, 0, Math.PI / 2]}>
        <boxGeometry args={[0.12, 0.4, 0.25]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.05} />
      </mesh>
      
      {/* Left Shoe laces detail */}
      <mesh position={[-0.26, -2.88, 0.22]} scale={[0.4, 0.15, 0.6]}>
        <boxGeometry args={[0.08, 0.25, 0.02]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Right Shoe laces detail */}
      <mesh position={[0.26, -2.88, 0.22]} scale={[0.4, 0.15, 0.6]}>
        <boxGeometry args={[0.08, 0.25, 0.02]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
};

export const BodyModel3D = ({ gender, bmi, netCalories }: BodyModel3DProps) => {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-elegant bg-card border border-border">
      <Canvas camera={{ position: [0, 0.3, 5.5], fov: 50 }} shadows dpr={[1, 2]}>
        <color attach="background" args={["hsl(var(--background))"]} />
        
        {/* Enhanced lighting setup for realism */}
        <ambientLight intensity={0.4} />
        
        {/* Key light - main light source */}
        <directionalLight 
          position={[6, 10, 5]} 
          intensity={2.2} 
          castShadow 
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
        />
        
        {/* Fill light - softens shadows */}
        <directionalLight position={[-5, 4, -4]} intensity={0.9} color="#e3f2fd" />
        
        {/* Rim light - creates depth */}
        <directionalLight position={[0, 3, -5]} intensity={0.7} color="#fff9e6" />
        
        {/* Top spotlight for hair highlights */}
        <spotLight 
          position={[0, 8, 1]} 
          angle={0.4} 
          penumbra={0.9} 
          intensity={1.0} 
          castShadow
          color="#ffffff"
        />
        
        {/* Front fill light */}
        <pointLight position={[0, 2, 4]} intensity={0.8} color="#ffefd5" />
        
        {/* Hemisphere light for natural ambient */}
        <hemisphereLight args={["#87CEEB", "#8B7355", 0.6]} />
        
        <BodyMesh gender={gender} bmi={bmi} netCalories={netCalories} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={3.5} 
          maxDistance={9}
          maxPolarAngle={Math.PI / 1.75}
          minPolarAngle={Math.PI / 4}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
        
        {/* Studio-style ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.8} />
        </mesh>
      </Canvas>
    </div>
  );
};
