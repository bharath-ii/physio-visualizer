import { useState } from "react";
import { GenderSelector } from "@/components/GenderSelector";
import { BodyModel3D } from "@/components/BodyModel3D";
import { UserInputForm } from "@/components/UserInputForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { calculateBMI, estimateCaloriesFromDiet, estimateCaloriesBurned } from "@/utils/calculations";
import { Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  height: number;
  weight: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  morningWorkout: string;
  eveningWorkout: string;
  nightWorkout: string;
}

const Index = () => {
  const { toast } = useToast();
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bmi, setBmi] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [netCalories, setNetCalories] = useState(0);

  const handleGenderSelect = (selectedGender: "male" | "female") => {
    setGender(selectedGender);
  };

  const handleFormSubmit = (data: UserData) => {
    console.log("Form submitted with data:", data);
    setUserData(data);

    // Calculate BMI
    const calculatedBMI = calculateBMI(data.height, data.weight);
    console.log("Calculated BMI:", calculatedBMI);
    setBmi(calculatedBMI);

    // Calculate calories
    const consumed = estimateCaloriesFromDiet(data.breakfast, data.lunch, data.dinner);
    const burned = estimateCaloriesBurned(data.morningWorkout, data.eveningWorkout, data.nightWorkout);
    const net = consumed - burned;

    console.log("Calories - Consumed:", consumed, "Burned:", burned, "Net:", net);

    setCaloriesConsumed(consumed);
    setCaloriesBurned(burned);
    setNetCalories(net);

    // Show success notification
    toast({
      title: "Model Updated!",
      description: `BMI: ${calculatedBMI.toFixed(1)} | Net Calories: ${net > 0 ? '+' : ''}${net}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-white py-8 shadow-glow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <Dumbbell className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Body Transformation Tracker</h1>
          </div>
          <p className="text-center mt-3 text-white/90 text-lg">
            Visualize your fitness journey with AI-powered insights
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-12">
        {!gender ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <GenderSelector selected={gender} onSelect={handleGenderSelect} />
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Input Form */}
              <div>
                <UserInputForm onSubmit={handleFormSubmit} initialData={userData || undefined} />
              </div>

              {/* Right: 3D Model */}
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-bold mb-2">Your Body Visualization</h2>
                  <p className="text-muted-foreground">
                    Interactive 3D model updated based on your stats
                  </p>
                </div>
                <BodyModel3D 
                  gender={gender} 
                  bmi={bmi || 22} 
                  netCalories={netCalories}
                />
              </div>
            </div>

            {/* Results Display */}
            {userData && (
              <ResultsDisplay
                bmi={bmi}
                caloriesConsumed={caloriesConsumed}
                caloriesBurned={caloriesBurned}
                netCalories={netCalories}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Track your progress, transform your body, achieve your goals.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
