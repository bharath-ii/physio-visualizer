import { User, UserRound } from "lucide-react";
import { Button } from "./ui/button";

interface GenderSelectorProps {
  selected: "male" | "female" | null;
  onSelect: (gender: "male" | "female") => void;
}

export const GenderSelector = ({ selected, onSelect }: GenderSelectorProps) => {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
        Select Your Gender
      </h2>
      <div className="flex gap-6">
        <Button
          onClick={() => onSelect("male")}
          variant={selected === "male" ? "default" : "outline"}
          size="lg"
          className="flex-col h-32 w-32 gap-3 transition-all hover:scale-105"
        >
          <User className="h-12 w-12" />
          <span className="text-lg font-semibold">Male</span>
        </Button>
        <Button
          onClick={() => onSelect("female")}
          variant={selected === "female" ? "default" : "outline"}
          size="lg"
          className="flex-col h-32 w-32 gap-3 transition-all hover:scale-105"
        >
          <UserRound className="h-12 w-12" />
          <span className="text-lg font-semibold">Female</span>
        </Button>
      </div>
    </div>
  );
};
