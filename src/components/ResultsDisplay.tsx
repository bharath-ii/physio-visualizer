import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Activity, TrendingDown, TrendingUp, Target } from "lucide-react";
import { Progress } from "./ui/progress";

interface ResultsDisplayProps {
  bmi: number;
  caloriesConsumed: number;
  caloriesBurned: number;
  netCalories: number;
}

export const ResultsDisplay = ({
  bmi,
  caloriesConsumed,
  caloriesBurned,
  netCalories,
}: ResultsDisplayProps) => {
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "bg-accent" };
    if (bmi < 25) return { label: "Normal", color: "bg-secondary" };
    if (bmi < 30) return { label: "Overweight", color: "bg-accent" };
    return { label: "Obese", color: "bg-destructive" };
  };

  const bmiCategory = getBMICategory(bmi);
  const bmiProgress = Math.min((bmi / 40) * 100, 100);

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-scale-in">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            BMI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-primary">{bmi.toFixed(1)}</span>
            <Badge className={bmiCategory.color}>{bmiCategory.label}</Badge>
          </div>
          <Progress value={bmiProgress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Your BMI is {bmi.toFixed(1)}, which falls in the {bmiCategory.label.toLowerCase()} category.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Calorie Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Consumed
              </p>
              <p className="text-2xl font-bold text-accent">{caloriesConsumed}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-4 w-4" />
                Burned
              </p>
              <p className="text-2xl font-bold text-secondary">{caloriesBurned}</p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">Net Calories</p>
            <p className={`text-3xl font-bold ${netCalories > 0 ? 'text-accent' : 'text-secondary'}`}>
              {netCalories > 0 ? '+' : ''}{netCalories}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {netCalories > 500 ? "Calorie surplus - may gain weight" : 
               netCalories < -500 ? "Calorie deficit - may lose weight" : 
               "Balanced calorie intake"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
