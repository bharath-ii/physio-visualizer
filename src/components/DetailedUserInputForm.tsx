import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodInput, FoodItem } from "./FoodInput";

export interface DetailedUserData {
  height: number;
  weight: number;
  goalHeight: number;
  goalWeight: number;
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  morningWorkout: string;
  eveningWorkout: string;
  nightWorkout: string;
}

interface DetailedUserInputFormProps {
  onSubmit: (data: DetailedUserData) => void;
  initialData?: DetailedUserData;
}

export const DetailedUserInputForm = ({ onSubmit, initialData }: DetailedUserInputFormProps) => {
  const [formData, setFormData] = useState<DetailedUserData>(
    initialData || {
      height: 0,
      weight: 0,
      goalHeight: 0,
      goalWeight: 0,
      breakfast: [],
      lunch: [],
      dinner: [],
      morningWorkout: "",
      eveningWorkout: "",
      nightWorkout: "",
    }
  );

  const handleChange = (field: keyof DetailedUserData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Details</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="height">Current Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ""}
                onChange={(e) => handleChange("height", parseFloat(e.target.value))}
                required
                placeholder="e.g., 170"
              />
            </div>
            <div>
              <Label htmlFor="weight">Current Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ""}
                onChange={(e) => handleChange("weight", parseFloat(e.target.value))}
                required
                placeholder="e.g., 70"
              />
            </div>
            <div>
              <Label htmlFor="goalHeight">Goal Height (cm)</Label>
              <Input
                id="goalHeight"
                type="number"
                value={formData.goalHeight || ""}
                onChange={(e) => handleChange("goalHeight", parseFloat(e.target.value))}
                required
                placeholder="e.g., 175"
              />
            </div>
            <div>
              <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
              <Input
                id="goalWeight"
                type="number"
                value={formData.goalWeight || ""}
                onChange={(e) => handleChange("goalWeight", parseFloat(e.target.value))}
                required
                placeholder="e.g., 65"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="diet" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="diet">Daily Diet</TabsTrigger>
            <TabsTrigger value="workout">Workouts</TabsTrigger>
          </TabsList>

          <TabsContent value="diet" className="space-y-4 mt-4">
            <FoodInput
              label="Breakfast"
              foods={formData.breakfast}
              onFoodsChange={(foods) => handleChange("breakfast", foods)}
            />
            <FoodInput
              label="Lunch"
              foods={formData.lunch}
              onFoodsChange={(foods) => handleChange("lunch", foods)}
            />
            <FoodInput
              label="Dinner"
              foods={formData.dinner}
              onFoodsChange={(foods) => handleChange("dinner", foods)}
            />
          </TabsContent>

          <TabsContent value="workout" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="morningWorkout">Morning Workout</Label>
              <Input
                id="morningWorkout"
                value={formData.morningWorkout}
                onChange={(e) => handleChange("morningWorkout", e.target.value)}
                placeholder="e.g., Running 30 min"
              />
            </div>
            <div>
              <Label htmlFor="eveningWorkout">Evening Workout</Label>
              <Input
                id="eveningWorkout"
                value={formData.eveningWorkout}
                onChange={(e) => handleChange("eveningWorkout", e.target.value)}
                placeholder="e.g., Gym 1 hour"
              />
            </div>
            <div>
              <Label htmlFor="nightWorkout">Night Workout</Label>
              <Input
                id="nightWorkout"
                value={formData.nightWorkout}
                onChange={(e) => handleChange("nightWorkout", e.target.value)}
                placeholder="e.g., Yoga 20 min"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" className="w-full" size="lg">
          Update Model & Get Suggestions
        </Button>
      </form>
    </Card>
  );
};
