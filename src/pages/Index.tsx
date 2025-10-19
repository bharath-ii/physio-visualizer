import { useState, useEffect } from "react";
import { GenderSelector } from "@/components/GenderSelector";
import { BodyModel3D } from "@/components/BodyModel3D";
import { DetailedUserInputForm, DetailedUserData } from "@/components/DetailedUserInputForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { AISuggestions } from "@/components/AISuggestions";
import { DailyProgressNavigator } from "@/components/DailyProgressNavigator";
import { calculateBMI, calculateMealCalories, estimateCaloriesBurned } from "@/utils/calculations";
import { Dumbbell, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const Index = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [userData, setUserData] = useState<DetailedUserData | null>(null);
  const [bmi, setBmi] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [netCalories, setNetCalories] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loadedProgress, setLoadedProgress] = useState<any>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGenderSelect = (selectedGender: "male" | "female") => {
    setGender(selectedGender);
  };

  const handleFormSubmit = async (data: DetailedUserData) => {
    setUserData(data);

    const calculatedBMI = calculateBMI(data.height, data.weight);
    setBmi(calculatedBMI);

    const totalConsumed = calculateMealCalories(data.breakfast) + calculateMealCalories(data.lunch) + calculateMealCalories(data.dinner);
    const burned = estimateCaloriesBurned(data.morningWorkout, data.eveningWorkout, data.nightWorkout);
    const net = totalConsumed - burned;

    setCaloriesConsumed(totalConsumed);
    setCaloriesBurned(burned);
    setNetCalories(net);

    // Save to database if user is authenticated
    if (user && gender) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      const { error } = await supabase
        .from('daily_progress')
        .upsert({
          user_id: user.id,
          date: dateString,
          gender,
          height: data.height,
          weight: data.weight,
          goal_height: data.goalHeight,
          goal_weight: data.goalWeight,
          breakfast: data.breakfast as any,
          lunch: data.lunch as any,
          dinner: data.dinner as any,
          morning_workout: data.morningWorkout,
          evening_workout: data.eveningWorkout,
          night_workout: data.nightWorkout,
          bmi: calculatedBMI,
          calories_consumed: totalConsumed,
          calories_burned: burned,
          net_calories: net,
        } as any);

      if (error) {
        toast({
          title: "Error saving progress",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Progress Saved!",
          description: `BMI: ${calculatedBMI.toFixed(1)} | Net Calories: ${net > 0 ? "+" : ""}${net}`,
        });
      }
    } else {
      toast({
        title: "Model Updated!",
        description: `BMI: ${calculatedBMI.toFixed(1)} | Net Calories: ${net > 0 ? "+" : ""}${net}`,
      });
    }
  };

  const handleProgressLoad = (progress: any) => {
    setLoadedProgress(progress);
    if (progress) {
      setGender(progress.gender);
      setUserData({
        height: progress.height,
        weight: progress.weight,
        goalHeight: progress.goal_height,
        goalWeight: progress.goal_weight,
        breakfast: progress.breakfast,
        lunch: progress.lunch,
        dinner: progress.dinner,
        morningWorkout: progress.morning_workout,
        eveningWorkout: progress.evening_workout,
        nightWorkout: progress.night_workout,
      });
      setBmi(progress.bmi);
      setCaloriesConsumed(progress.calories_consumed);
      setCaloriesBurned(progress.calories_burned);
      setNetCalories(progress.net_calories);
    } else {
      // Reset to empty state when no data for selected date
      setUserData(null);
      setBmi(0);
      setCaloriesConsumed(0);
      setCaloriesBurned(0);
      setNetCalories(0);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setGender(null);
    setUserData(null);
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  const formatDiet = (data: DetailedUserData): string => {
    const formatMeal = (mealName: string, foods: any[]) => {
      if (foods.length === 0) return `${mealName}: Not specified`;
      return `${mealName}: ${foods.map((f) => `${f.name} (${f.quantity})`).join(", ")}`;
    };
    return [formatMeal("Breakfast", data.breakfast), formatMeal("Lunch", data.lunch), formatMeal("Dinner", data.dinner)].join("\n");
  };

  const formatWorkouts = (data: DetailedUserData): string => {
    const workouts = [];
    if (data.morningWorkout) workouts.push(`Morning: ${data.morningWorkout}`);
    if (data.eveningWorkout) workouts.push(`Evening: ${data.eveningWorkout}`);
    if (data.nightWorkout) workouts.push(`Night: ${data.nightWorkout}`);
    return workouts.length > 0 ? workouts.join("\n") : "No workouts specified";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero text-white py-8 shadow-glow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="h-10 w-10" />
              <h1 className="text-3xl md:text-4xl font-bold">Body Transformation Tracker</h1>
            </div>
            {user && (
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
          <p className="text-center mt-3 text-white/90 text-lg">Visualize your fitness journey with AI-powered insights</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-12">
        {!gender ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <GenderSelector selected={gender} onSelect={handleGenderSelect} isAuthenticated={!!user} />
          </div>
        ) : (
          <>
            {user && (
              <DailyProgressNavigator
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                onProgressLoad={handleProgressLoad}
              />
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              <div><DetailedUserInputForm onSubmit={handleFormSubmit} initialData={userData || undefined} /></div>
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-bold mb-2">Your Body Visualization</h2>
                  <p className="text-muted-foreground">Interactive 3D model updated based on your stats</p>
                </div>
                <BodyModel3D gender={gender} bmi={bmi || 22} netCalories={netCalories} />
              </div>
            </div>

            {userData && (
              <>
                <ResultsDisplay bmi={bmi} caloriesConsumed={caloriesConsumed} caloriesBurned={caloriesBurned} netCalories={netCalories} />
                <AISuggestions currentHeight={userData.height} currentWeight={userData.weight} goalHeight={userData.goalHeight} goalWeight={userData.goalWeight} bmi={bmi} caloriesConsumed={caloriesConsumed} caloriesBurned={caloriesBurned} netCalories={netCalories} diet={formatDiet(userData)} workouts={formatWorkouts(userData)} />
              </>
            )}
          </>
        )}
      </main>

      <footer className="bg-card border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Track your progress, transform your body, achieve your goals.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
