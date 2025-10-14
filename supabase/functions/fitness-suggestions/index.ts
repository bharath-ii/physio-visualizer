import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FitnessData {
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: FitnessData = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert fitness and nutrition coach. Provide personalized, actionable advice based on the user's current stats, goals, diet, and workout routine. 

Give specific suggestions for:
1. Diet modifications (what to eat more/less of)
2. Workout improvements (types, duration, intensity)
3. Lifestyle changes
4. Timeline to reach goals

Be encouraging but realistic. Focus on sustainable, healthy changes.`;

    const userPrompt = `
Current Stats:
- Height: ${data.currentHeight} cm
- Weight: ${data.currentWeight} kg
- BMI: ${data.bmi.toFixed(1)}

Goal Stats:
- Target Height: ${data.goalHeight} cm
- Target Weight: ${data.goalWeight} kg

Daily Nutrition:
- Calories Consumed: ${data.caloriesConsumed} kcal
- Calories Burned: ${data.caloriesBurned} kcal
- Net Calories: ${data.netCalories > 0 ? '+' : ''}${data.netCalories} kcal

Current Diet:
${data.diet}

Current Workouts:
${data.workouts}

Please provide personalized suggestions to help reach the goal stats.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const suggestions = aiResponse.choices[0].message.content;

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in fitness-suggestions function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
