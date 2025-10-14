import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AISuggestionsProps {
  currentHeight: number;
  currentWeight: number;
  goalHeight: number;
  goalWeight: number;
  bmi: number;
  caloriesConsumed: number;
  caloriesBurned: number;
  netCalories: number;
  diet: string;
  workouts: string;
}

export const AISuggestions = ({
  currentHeight,
  currentWeight,
  goalHeight,
  goalWeight,
  bmi,
  caloriesConsumed,
  caloriesBurned,
  netCalories,
  diet,
  workouts,
}: AISuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("fitness-suggestions", {
        body: {
          currentHeight,
          currentWeight,
          goalHeight,
          goalWeight,
          bmi,
          caloriesConsumed,
          caloriesBurned,
          netCalories,
          diet,
          workouts,
        },
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-subtle border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI-Powered Suggestions</h2>
      </div>

      {!suggestions ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Get personalized fitness and nutrition advice based on your stats and goals
          </p>
          <Button onClick={generateSuggestions} disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Get AI Suggestions"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap">{suggestions}</div>
          </div>
          <Button onClick={generateSuggestions} disabled={loading} variant="secondary">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              "Regenerate Suggestions"
            )}
          </Button>
        </div>
      )}
    </Card>
  );
};
