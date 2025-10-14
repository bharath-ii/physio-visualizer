import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

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

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{label}</Label>
      
      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
        <Input
          type="text"
          placeholder="Food item (e.g., rice, dosa, chicken)"
          value={currentFood}
          onChange={(e) => setCurrentFood(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
        />
        
        <Input
          type="number"
          placeholder="Grams"
          value={currentQuantity}
          onChange={(e) => setCurrentQuantity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
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
                {food.name} - {food.quantity}g
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
