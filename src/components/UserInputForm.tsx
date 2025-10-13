import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calculator } from "lucide-react";

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

interface UserInputFormProps {
  onSubmit: (data: UserData) => void;
  initialData?: Partial<UserData>;
}

export const UserInputForm = ({ onSubmit, initialData }: UserInputFormProps) => {
  const [formData, setFormData] = useState<UserData>({
    height: initialData?.height || 170,
    weight: initialData?.weight || 70,
    breakfast: initialData?.breakfast || "",
    lunch: initialData?.lunch || "",
    dinner: initialData?.dinner || "",
    morningWorkout: initialData?.morningWorkout || "",
    eveningWorkout: initialData?.eveningWorkout || "",
    nightWorkout: initialData?.nightWorkout || "",
  });

  const handleChange = (field: keyof UserData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Physical Details
          </CardTitle>
          <CardDescription>Enter your current measurements</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              min="100"
              max="250"
              value={formData.height}
              onChange={(e) => handleChange("height", Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              min="30"
              max="200"
              step="0.1"
              value={formData.weight}
              onChange={(e) => handleChange("weight", Number(e.target.value))}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Daily Diet & Workouts</CardTitle>
          <CardDescription>Track your meals and exercise routine</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="diet">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="diet">Diet</TabsTrigger>
              <TabsTrigger value="workout">Workout</TabsTrigger>
            </TabsList>
            
            <TabsContent value="diet" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="breakfast">Breakfast (e.g., 2 eggs, 2 toast, milk)</Label>
                <Input
                  id="breakfast"
                  value={formData.breakfast}
                  onChange={(e) => handleChange("breakfast", e.target.value)}
                  placeholder="Describe your breakfast"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lunch">Lunch (e.g., rice, dal, vegetables)</Label>
                <Input
                  id="lunch"
                  value={formData.lunch}
                  onChange={(e) => handleChange("lunch", e.target.value)}
                  placeholder="Describe your lunch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dinner">Dinner (e.g., roti, curry, salad)</Label>
                <Input
                  id="dinner"
                  value={formData.dinner}
                  onChange={(e) => handleChange("dinner", e.target.value)}
                  placeholder="Describe your dinner"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="workout" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="morningWorkout">Morning Workout (e.g., 30min running)</Label>
                <Input
                  id="morningWorkout"
                  value={formData.morningWorkout}
                  onChange={(e) => handleChange("morningWorkout", e.target.value)}
                  placeholder="Describe morning exercise"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eveningWorkout">Evening Workout (e.g., gym, 45min)</Label>
                <Input
                  id="eveningWorkout"
                  value={formData.eveningWorkout}
                  onChange={(e) => handleChange("eveningWorkout", e.target.value)}
                  placeholder="Describe evening exercise"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nightWorkout">Night Workout (e.g., yoga, 20min)</Label>
                <Input
                  id="nightWorkout"
                  value={formData.nightWorkout}
                  onChange={(e) => handleChange("nightWorkout", e.target.value)}
                  placeholder="Describe night exercise"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full shadow-elegant">
        Calculate & Update Model
      </Button>
    </form>
  );
};
