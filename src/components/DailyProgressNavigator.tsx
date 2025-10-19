import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface DailyProgress {
  id: string;
  date: string;
  gender: string;
  height: number;
  weight: number;
  goal_height: number;
  goal_weight: number;
  bmi: number;
  calories_consumed: number;
  calories_burned: number;
  net_calories: number;
  breakfast: any;
  lunch: any;
  dinner: any;
  morning_workout: string | null;
  evening_workout: string | null;
  night_workout: string | null;
}

interface DailyProgressNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onProgressLoad: (progress: DailyProgress | null) => void;
}

export const DailyProgressNavigator = ({ 
  currentDate, 
  onDateChange, 
  onProgressLoad 
}: DailyProgressNavigatorProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    loadAvailableDates();
  }, []);

  useEffect(() => {
    loadProgressForDate(currentDate);
  }, [currentDate]);

  const loadAvailableDates = async () => {
    const { data, error } = await supabase
      .from('daily_progress')
      .select('date')
      .order('date', { ascending: false });

    if (!error && data) {
      setAvailableDates(data.map(d => d.date));
    }
  };

  const loadProgressForDate = async (date: Date) => {
    setLoading(true);
    const dateString = format(date, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('date', dateString)
      .maybeSingle();

    if (error) {
      toast({
        title: "Error loading progress",
        description: error.message,
        variant: "destructive",
      });
      onProgressLoad(null);
    } else {
      onProgressLoad(data);
    }

    setLoading(false);
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    const today = new Date();
    if (newDate <= today) {
      onDateChange(newDate);
    }
  };

  const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const hasDataForDate = availableDates.includes(format(currentDate, 'yyyy-MM-dd'));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Daily Progress Navigator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousDay}
            disabled={loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <p className="text-lg font-semibold">
              {format(currentDate, 'MMMM dd, yyyy')}
            </p>
            <p className="text-sm text-muted-foreground">
              {isToday ? 'Today' : hasDataForDate ? 'Has data' : 'No data'}
            </p>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextDay}
            disabled={loading || isToday}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {availableDates.length > 0 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Total days tracked: {availableDates.length}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
