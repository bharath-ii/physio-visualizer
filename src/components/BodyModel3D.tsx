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

  // Calculate body proportions based on BMI, net calories, and gender
  const bodyScale = useMemo(() => {
    const baseBMI = 22;
    const bmiDiff = bmi - baseBMI;
    
    // Gender-specific base proportions - more dramatic for male
    const genderMultiplier = gender === "male" ? 1.08 : 0.92;
    const shoulderMultiplier = gender === "male" ? 1.35 : 0.95;
    const hipMultiplier = gender === "male" ? 0.88 : 1.08;
    const chestDepthMultiplier = gender === "male" ? 1.15 : 1.05;
    
    // Body width increases with higher BMI - more refined scaling
    const torsoWidth = (1 + (bmiDiff * 0.10)) * genderMultiplier;
    const limbWidth = (1 + (bmiDiff * 0.06)) * genderMultiplier;
    const shoulderWidth = (1 + (bmiDiff * 0.08)) * shoulderMultiplier;
    const hipWidth = (1 + (bmiDiff * 0.08)) * hipMultiplier;
    
    // Calorie effect on muscle definition and body composition
    const calorieEffect = Math.min(Math.max(netCalories / 1500, -0.2), 0.2);
    const muscleDefinition = netCalories > 0 ? calorieEffect * 0.5 : calorieEffect * 0.3;
    
    return {
      torsoWidth: Math.max(0.7, Math.min(2.2, torsoWidth + calorieEffect * 0.3)),
      limbWidth: Math.max(0.7, Math.min(1.8, limbWidth + muscleDefinition)),
      shoulderWidth: Math.max(0.8, Math.min(2.4, shoulderWidth + muscleDefinition * 0.7)),
      hipWidth: Math.max(0.8, Math.min(2.0, hipWidth)),
      torsoDepth: Math.max(0.7, Math.min(2.2, (1 + bmiDiff * 0.08 + calorieEffect * 0.2) * chestDepthMultiplier)),
      neckThickness: Math.max(0.8, Math.min(1.5, (1 + bmiDiff * 0.05) * (gender === "male" ? 1.12 : 1))),
      headScale: Math.max(0.95, Math.min(1.15, 1 + bmiDiff * 0.02)),
      chestScale: gender === "male" ? 1.2 : 1.05,
    };
  }, [bmi, netCalories, gender]);

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
  const hairLength = gender === "female" ? 1.3 : 0.7;

  return (
    <group ref={groupRef}>
      {/* Head - Realistic proportions */}
      <mesh position={[0, 2.15, 0]} scale={[bodyScale.headScale * 0.85, bodyScale.headScale * 1.05, bodyScale.headScale * 0.88]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.35} metalness={0.05} />
      </mesh>
      
      {/* Jawline */}
      <mesh position={[0, 1.92, 0.08]} scale={[bodyScale.headScale * 0.75, bodyScale.headScale * 0.35, bodyScale.headScale * 0.7]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.35} metalness={0.05} />
      </mesh>
      
      {/* Hair - Gender specific styling */}
      {gender === "male" ? (
        <>
          {/* Male hair - textured short style */}
          <mesh position={[0, 2.42, -0.08]} scale={[bodyScale.headScale * 1.02, bodyScale.headScale * 0.68, bodyScale.headScale * 1.08]}>
            <sphereGeometry args={[0.42, 32, 32]} />
            <meshStandardMaterial color={hairColor} roughness={0.85} metalness={0.02} />
          </mesh>
          {/* Hair volume front */}
          <mesh position={[0, 2.48, 0.15]} scale={[0.35, 0.25, 0.38]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.85} metalness={0.02} />
          </mesh>
        </>
      ) : (
        <>
          {/* Female hair - fuller and longer with layers */}
          <mesh position={[0, 2.38, 0]} scale={[bodyScale.headScale * 1.15, bodyScale.headScale * 0.88, bodyScale.headScale * 1.15]}>
            <sphereGeometry args={[0.44, 32, 32]} />
            <meshStandardMaterial color={hairColor} roughness={0.75} metalness={0.15} />
          </mesh>
          {/* Hair flow down - longer */}
          <mesh position={[0, 1.7, -0.28]} scale={[0.9, 1.35, 0.65]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color={hairColor} roughness={0.75} metalness={0.15} />
          </mesh>
          {/* Hair sides volume */}
          <mesh position={[-0.32, 2.1, -0.12]} scale={[0.55, 0.85, 0.52]}>
            <sphereGeometry args={[0.26, 16, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.75} metalness={0.15} />
          </mesh>
          <mesh position={[0.32, 2.1, -0.12]} scale={[0.55, 0.85, 0.52]}>
            <sphereGeometry args={[0.26, 16, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.75} metalness={0.15} />
          </mesh>
        </>
      )}
      
      {/* Eyes - Better positioned */}
      <mesh position={[-0.14, 2.2, 0.32]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[0.14, 2.2, 0.32]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
      </mesh>
      
      {/* Eye whites */}
      <mesh position={[-0.14, 2.2, 0.3]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.14, 2.2, 0.3]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Nose - More defined */}
      <mesh position={[0, 2.08, 0.36]} scale={[0.35, 0.55, 0.9]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.35} metalness={0.05} />
      </mesh>
      
      {/* Mouth area */}
      <mesh position={[0, 1.95, 0.32]} scale={[0.4, 0.2, 0.5]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#D4A088" roughness={0.4} metalness={0.05} />
      </mesh>
      
      {/* Neck - Gender proportioned */}
      <mesh position={[0, 1.78, 0]} scale={[bodyScale.neckThickness * 0.95, 1, bodyScale.neckThickness * 0.95]}>
        <cylinderGeometry args={[0.14, 0.17, 0.4, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.05} />
      </mesh>
      
      {/* Upper Torso - Dramatic gender differences */}
      {gender === "male" ? (
        <>
          {/* Male - Very broad shoulders and chest - V-taper shape */}
          <mesh position={[0, 1.38, 0]} scale={[bodyScale.shoulderWidth * 1.4, 1.1, bodyScale.torsoDepth * 1.05]}>
            <capsuleGeometry args={[0.46, 0.52, 16, 32]} />
            <meshStandardMaterial color={clothingTopColor} roughness={0.55} metalness={0.08} />
          </mesh>
          
          {/* Large pectoral muscles - masculine definition */}
          <mesh position={[-0.24, 1.42, 0.22]} scale={[1.05, 1, 1.25]}>
            <sphereGeometry args={[0.26, 32, 32]} />
            <meshStandardMaterial color={clothingTopColor} roughness={0.42} metalness={0.1} />
          </mesh>
          <mesh position={[0.24, 1.42, 0.22]} scale={[1.05, 1, 1.25]}>
            <sphereGeometry args={[0.26, 32, 32]} />
            <meshStandardMaterial color={clothingTopColor} roughness={0.42} metalness={0.1} />
          </mesh>
          
          {/* Chest separation - sternum definition */}
          <mesh position={[0, 1.4, 0.32]} scale={[0.15, 1, 1.1]}>
            <boxGeometry args={[0.025, 0.32, 0.18]} />
            <meshStandardMaterial color={clothingTopColor} roughness={0.48} metalness={0.06} />
          </mesh>
          
          {/* Upper chest mass */}
          <mesh position={[0, 1.52, 0.12]} scale={[bodyScale.shoulderWidth * 1.2, 0.65, bodyScale.torsoDepth * 0.85]}>
            <capsuleGeometry args={[0.32, 0.22, 16, 32]} />
            <meshStandardMaterial color={clothingTopColor} roughness={0.55} metalness={0.08} />
          </mesh>
        </>
      ) : (
        <>
          {/* Female - Narrower shoulders, defined chest */}
          <mesh position={[0, 1.32, 0]} scale={[bodyScale.shoulderWidth * 0.92, 1, bodyScale.torsoDepth * bodyScale.chestScale * 1.08]}>
            <capsuleGeometry args={[0.36, 0.46, 16, 32]} />
            <meshStandardMaterial color={clothingTopColor} roughness={0.6} metalness={0.05} />
          </mesh>
          
          {/* Bust definition - more refined */}
          <mesh position={[-0.15, 1.36, 0.24]} scale={[0.98, 0.88, 1.08]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color={clothingTopColor} roughness={0.48} metalness={0.06} />
          </mesh>
          <mesh position={[0.15, 1.36, 0.24]} scale={[0.98, 0.88, 1.08]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color={clothingTopColor} roughness={0.48} metalness={0.06} />
          </mesh>
        </>
      )}
      
      {/* Mid Torso - Gender tapered */}
      <mesh position={[0, 0.8, 0]} scale={[
        bodyScale.torsoWidth * (gender === "male" ? 0.92 : 0.85), 
        1, 
        bodyScale.torsoDepth * 0.88
      ]}>
        <capsuleGeometry args={[0.34, 0.38, 16, 32]} />
        <meshStandardMaterial color={clothingTopColor} roughness={0.6} metalness={0.05} />
      </mesh>
      
      {/* Lower Torso - Shirt */}
      <mesh position={[0, 0.25, 0]} scale={[bodyScale.torsoWidth * 0.82, 1, bodyScale.torsoDepth * 0.82]}>
        <capsuleGeometry args={[0.3, 0.35, 16, 32]} />
        <meshStandardMaterial color={clothingTopColor} roughness={0.7} metalness={0} />
      </mesh>
      
      {/* Hips - Pants with gender-specific width */}
      <mesh position={[0, -0.15, 0]} scale={[bodyScale.hipWidth * 0.82, 1, bodyScale.torsoDepth * 0.8]}>
        <capsuleGeometry args={[0.32, 0.3, 16, 32]} />
        <meshStandardMaterial color={clothingBottomColor} roughness={0.7} metalness={0} />
      </mesh>

      {/* Left Shoulder - Large deltoids for male */}
      <mesh position={[
        -0.56 * bodyScale.shoulderWidth * (gender === "male" ? 1.28 : 1), 
        1.35, 
        0
      ]} scale={[
        bodyScale.limbWidth * (gender === "male" ? 1.05 : 0.65), 
        gender === "male" ? 0.9 : 0.75, 
        bodyScale.limbWidth * (gender === "male" ? 1.05 : 0.65)
      ]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color={clothingTopColor} roughness={0.55} metalness={0.08} />
      </mesh>
      
      {/* Right Shoulder - Large deltoids for male */}
      <mesh position={[
        0.56 * bodyScale.shoulderWidth * (gender === "male" ? 1.28 : 1), 
        1.35, 
        0
      ]} scale={[
        bodyScale.limbWidth * (gender === "male" ? 1.05 : 0.65), 
        gender === "male" ? 0.9 : 0.75, 
        bodyScale.limbWidth * (gender === "male" ? 1.05 : 0.65)
      ]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color={clothingTopColor} roughness={0.55} metalness={0.08} />
      </mesh>

      {/* Left Upper Arm - Bicep */}
      <mesh position={[
        -0.58 * bodyScale.shoulderWidth * (gender === "male" ? 1.25 : 1), 
        0.7, 
        0
      ]} rotation={[0, 0, 0.12]} scale={[
        bodyScale.limbWidth * (gender === "male" ? 0.75 : 0.6), 
        1, 
        bodyScale.limbWidth * (gender === "male" ? 0.75 : 0.6)
      ]}>
        <capsuleGeometry args={[0.14, 0.62, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.45} metalness={0.08} />
      </mesh>
      
      {/* Right Upper Arm - Bicep */}
      <mesh position={[
        0.58 * bodyScale.shoulderWidth * (gender === "male" ? 1.25 : 1), 
        0.7, 
        0
      ]} rotation={[0, 0, -0.12]} scale={[
        bodyScale.limbWidth * (gender === "male" ? 0.75 : 0.6), 
        1, 
        bodyScale.limbWidth * (gender === "male" ? 0.75 : 0.6)
      ]}>
        <capsuleGeometry args={[0.14, 0.62, 16, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.45} metalness={0.08} />
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

      {/* Left Hand - Palm */}
      <mesh position={[-0.7 * bodyScale.shoulderWidth, -0.7, 0]} scale={[bodyScale.limbWidth * 0.5, 0.65, bodyScale.limbWidth * 0.45]}>
        <boxGeometry args={[0.14, 0.18, 0.08]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.05} />
      </mesh>
      
      {/* Left Hand - Fingers */}
      <mesh position={[-0.7 * bodyScale.shoulderWidth, -0.82, 0.02]} scale={[0.85, 1, 0.7]}>
        <boxGeometry args={[0.12, 0.08, 0.04]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.05} />
      </mesh>
      
      {/* Right Hand - Palm */}
      <mesh position={[0.7 * bodyScale.shoulderWidth, -0.7, 0]} scale={[bodyScale.limbWidth * 0.5, 0.65, bodyScale.limbWidth * 0.45]}>
        <boxGeometry args={[0.14, 0.18, 0.08]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.05} />
      </mesh>
      
      {/* Right Hand - Fingers */}
      <mesh position={[0.7 * bodyScale.shoulderWidth, -0.82, 0.02]} scale={[0.85, 1, 0.7]}>
        <boxGeometry args={[0.12, 0.08, 0.04]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.05} />
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
        
        <gridHelper args={[10, 10, "#000000", "#000000"]} position={[0, -3.04, 0]} />
      </Canvas>
    </div>
  );
};
