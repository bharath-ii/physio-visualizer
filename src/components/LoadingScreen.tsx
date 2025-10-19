const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.9)] to-[hsl(var(--primary)/0.7)]">
      <style>{`
        @keyframes logoBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes squat {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(20px);
          }
        }

        @keyframes leftLeg {
          0%, 100% {
            transform: rotate(0deg);
            height: 30px;
          }
          50% {
            transform: rotate(-15deg);
            height: 20px;
          }
        }

        @keyframes rightLeg {
          0%, 100% {
            transform: rotate(0deg);
            height: 30px;
          }
          50% {
            transform: rotate(15deg);
            height: 20px;
          }
        }

        .logo-bounce {
          animation: logoBounce 2s ease-in-out infinite;
        }

        .fade-in {
          animation: fadeIn 1s ease-out;
        }

        .fade-in-delayed {
          animation: fadeIn 1s ease-out 0.3s both;
        }

        .squat-animation {
          animation: squat 1.8s ease-in-out infinite;
        }

        .left-leg-animation {
          animation: leftLeg 1.8s ease-in-out infinite;
        }

        .right-leg-animation {
          animation: rightLeg 1.8s ease-in-out infinite;
        }
      `}</style>

      <div className="text-center">
        {/* Logo */}
        <div className="w-[100px] h-[100px] mx-auto mb-10 bg-white rounded-[25px] flex items-center justify-center logo-bounce shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="relative w-[60px] h-[10px] bg-[hsl(var(--primary))] rounded-[5px]">
            <div className="absolute w-[18px] h-[30px] bg-[hsl(var(--primary))] rounded-[4px] top-1/2 -translate-y-1/2 -left-[10px]" />
            <div className="absolute w-[18px] h-[30px] bg-[hsl(var(--primary))] rounded-[4px] top-1/2 -translate-y-1/2 -right-[10px]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-black text-white mb-5 tracking-tight fade-in">
          FITZONE
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-white/80 mb-[60px] fade-in-delayed">
          Get Ready To Transform
        </p>

        {/* Animated Figure */}
        <div className="w-[120px] h-[120px] mx-auto relative">
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 squat-animation">
            {/* Head */}
            <div className="w-6 h-6 bg-white rounded-full mx-auto mb-[3px]" />
            
            {/* Body with Barbell */}
            <div className="relative w-[10px] h-[35px] bg-white mx-auto rounded-[5px]">
              <div className="absolute w-[90px] h-[6px] bg-white top-[5px] left-1/2 -translate-x-1/2 rounded-[3px]">
                <div className="absolute w-[14px] h-[22px] bg-white rounded-[3px] top-1/2 -translate-y-1/2 -left-[7px]" />
                <div className="absolute w-[14px] h-[22px] bg-white rounded-[3px] top-1/2 -translate-y-1/2 -right-[7px]" />
              </div>
            </div>

            {/* Legs */}
            <div className="flex justify-between w-[35px] mx-auto">
              <div className="w-[10px] h-[30px] bg-white rounded-[5px] origin-top left-leg-animation" />
              <div className="w-[10px] h-[30px] bg-white rounded-[5px] origin-top right-leg-animation" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
