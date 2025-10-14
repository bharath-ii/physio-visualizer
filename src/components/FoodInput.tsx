import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { foodCalories } from "@/utils/foodDatabase";

export interface FoodItem {
  name: string;
  quantity: number;
}

interface FoodInputProps {
  label: string;
  foods: FoodItem[];
  onFoodsChange: (foods: FoodItem[]) => void;
}

export const FoodInput = ({ label, foods, onFoodsChange }: FoodInputProps) => {
  const [currentFood, setCurrentFood] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");

  const addFood = () => {
    if (currentFood && currentQuantity) {
      onFoodsChange([...foods, { name: currentFood, quantity: parseFloat(currentQuantity) }]);
      setCurrentFood("");
      setCurrentQuantity("");
    }
  };

  const removeFood = (index: number) => {
    onFoodsChange(foods.filter((_, i) => i !== index));
  };

  const getUnit = (foodName: string) => {
    const food = foodCalories[foodName.toLowerCase()];
    return food?.unit === "g" ? "grams" : "pieces";
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{label}</Label>
      
      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
        <Select value={currentFood} onValueChange={setCurrentFood}>
          <SelectTrigger>
            <SelectValue placeholder="Select food" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {Object.keys(foodCalories).map((food) => (
              <SelectItem key={food} value={food}>
                {food.charAt(0).toUpperCase() + food.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input
          type="number"
          placeholder={currentFood ? getUnit(currentFood) : "Qty"}
          value={currentQuantity}
          onChange={(e) => setCurrentQuantity(e.target.value)}
          className="w-24"
        />
        
        <Button type="button" onClick={addFood} size="icon" variant="secondary">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {foods.length > 0 && (
        <div className="space-y-2 mt-3">
          {foods.map((food, index) => (
            <div key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded-lg">
              <span className="text-sm">
                {food.name.charAt(0).toUpperCase() + food.name.slice(1)} - {food.quantity} {getUnit(food.name)}
              </span>
              <Button
                type="button"
                onClick={() => removeFood(index)}
                size="icon"
                variant="ghost"
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
