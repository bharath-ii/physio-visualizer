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

  // Calculate body proportions based on BMI and net calories with more visible changes
  const bodyScale = useMemo(() => {
    console.log("BodyModel3D - BMI:", bmi, "NetCalories:", netCalories);
    const baseBMI = 22; // Average BMI
    const bmiDiff = bmi - baseBMI;
    
    // More pronounced scale factors based on BMI deviation
    const widthScale = 1 + (bmiDiff * 0.08); // Doubled effect
    const heightScale = 1;
    const depthScale = 1 + (bmiDiff * 0.06); // Doubled effect
    
    // More visible calorie effect
    const calorieEffect = Math.min(Math.max(netCalories / 2000, -0.2), 0.2);
    
    const scales = {
      x: Math.max(0.5, Math.min(2.2, widthScale + calorieEffect)),
      y: heightScale,
      z: Math.max(0.5, Math.min(2.2, depthScale + calorieEffect)),
    };
    
    console.log("Body scales:", scales);
    return scales;
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
      {/* Upper torso - chest area */}
      <mesh ref={meshRef} position={[0, 0.5, 0]} scale={[bodyScale.x * 0.9, bodyScale.y * 0.8, bodyScale.z * 0.7]}>
        <capsuleGeometry args={[0.5, 1.2, 32, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.3} />
      </mesh>
      
      {/* Lower torso - abdomen */}
      <mesh position={[0, -0.4, 0]} scale={[bodyScale.x, bodyScale.y * 0.7, bodyScale.z * 0.8]}>
        <capsuleGeometry args={[0.48, 1, 32, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.3} />
      </mesh>
      
      {/* Hips/pelvis */}
      <mesh position={[0, -1.1, 0]} scale={[bodyScale.x * 0.95, bodyScale.y * 0.5, bodyScale.z * 0.75]}>
        <capsuleGeometry args={[0.55, 0.6, 32, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.3} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.3, 0]} scale={[0.4, 0.4, 0.4]}>
        <cylinderGeometry args={[0.3, 0.35, 0.5, 16]} />
        <meshStandardMaterial color="#FFDAB3" roughness={0.7} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.8, 0]} scale={[1, 1.1, 1]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#FFDAB3" roughness={0.7} />
      </mesh>
      
      {/* Shoulders */}
      <mesh position={[-0.65 * bodyScale.x, 0.9, 0]} scale={[bodyScale.x * 0.35, 0.35, bodyScale.z * 0.35]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.65 * bodyScale.x, 0.9, 0]} scale={[bodyScale.x * 0.35, 0.35, bodyScale.z * 0.35]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.3} />
      </mesh>
      
      {/* Upper arms */}
      <mesh position={[-0.75 * bodyScale.x, 0.3, 0]} rotation={[0, 0, Math.PI / 8]} scale={[bodyScale.x * 0.35, 1, bodyScale.z * 0.35]}>
        <capsuleGeometry args={[0.2, 0.8, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.75 * bodyScale.x, 0.3, 0]} rotation={[0, 0, -Math.PI / 8]} scale={[bodyScale.x * 0.35, 1, bodyScale.z * 0.35]}>
        <capsuleGeometry args={[0.2, 0.8, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.3} />
      </mesh>
      
      {/* Lower arms */}
      <mesh position={[-0.9 * bodyScale.x, -0.5, 0]} rotation={[0, 0, Math.PI / 10]} scale={[bodyScale.x * 0.28, 0.9, bodyScale.z * 0.28]}>
        <capsuleGeometry args={[0.18, 0.8, 16, 16]} />
        <meshStandardMaterial color="#FFDAB3" roughness={0.6} />
      </mesh>
      <mesh position={[0.9 * bodyScale.x, -0.5, 0]} rotation={[0, 0, -Math.PI / 10]} scale={[bodyScale.x * 0.28, 0.9, bodyScale.z * 0.28]}>
        <capsuleGeometry args={[0.18, 0.8, 16, 16]} />
        <meshStandardMaterial color="#FFDAB3" roughness={0.6} />
      </mesh>
      
      {/* Upper legs (thighs) */}
      <mesh position={[-0.35, -1.8, 0]} scale={[bodyScale.x * 0.45, 1, bodyScale.z * 0.45]}>
        <capsuleGeometry args={[0.25, 1, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.35, -1.8, 0]} scale={[bodyScale.x * 0.45, 1, bodyScale.z * 0.45]}>
        <capsuleGeometry args={[0.25, 1, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.3} />
      </mesh>
      
      {/* Lower legs (calves) */}
      <mesh position={[-0.35, -3, 0]} scale={[bodyScale.x * 0.32, 0.85, bodyScale.z * 0.32]}>
        <capsuleGeometry args={[0.2, 0.9, 16, 16]} />
        <meshStandardMaterial color="#FFDAB3" roughness={0.6} />
      </mesh>
      <mesh position={[0.35, -3, 0]} scale={[bodyScale.x * 0.32, 0.85, bodyScale.z * 0.32]}>
        <capsuleGeometry args={[0.2, 0.9, 16, 16]} />
        <meshStandardMaterial color="#FFDAB3" roughness={0.6} />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.35, -3.7, 0.15]} rotation={[0, 0, Math.PI / 2]} scale={[0.4, 0.3, 0.6]}>
        <capsuleGeometry args={[0.25, 0.6, 8, 8]} />
        <meshStandardMaterial color="#C19A6B" roughness={0.8} />
      </mesh>
      <mesh position={[0.35, -3.7, 0.15]} rotation={[0, 0, Math.PI / 2]} scale={[0.4, 0.3, 0.6]}>
        <capsuleGeometry args={[0.25, 0.6, 8, 8]} />
        <meshStandardMaterial color="#C19A6B" roughness={0.8} />
      </mesh>
    </group>
  );
};

export const BodyModel3D = ({ gender, bmi, netCalories }: BodyModel3DProps) => {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-elegant bg-card">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
        <BodyMesh gender={gender} bmi={bmi} netCalories={netCalories} />
        <OrbitControls enableZoom={true} enablePan={false} minDistance={5} maxDistance={12} />
        <gridHelper args={[10, 10, "#888", "#ccc"]} position={[0, -4, 0]} />
      </Canvas>
    </div>
  );
};
