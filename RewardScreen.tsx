import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PartyPopper, RotateCcw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const REWARD_IMAGES = [
  'https://images.unsplash.com/photo-1577558445004-b0bdc90e0439?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNlbGVicmF0aW9uJTIwY29uZmV0dGl8ZW58MXx8fHwxNzY5NjM5MTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1765934879305-e2ee18822f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2FydG9vbiUyMGFuaW1hbHN8ZW58MXx8fHwxNzY5NjkwMDM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1693651199295-2dee5af42919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGJhbGxvb25zJTIwcGFydHl8ZW58MXx8fHwxNzY5Njg3MTYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
];

export function RewardScreen() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [randomImage] = useState(() => 
    REWARD_IMAGES[Math.floor(Math.random() * REWARD_IMAGES.length)]
  );

  // Play celebration sound
  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance('Great job! You completed the activity!');
    utterance.rate = 0.9;
    utterance.pitch = 1.3;
    speechSynthesis.speak(utterance);

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const handleTryAgain = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Animated Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                {['🎉', '🎊', '⭐', '✨', '🌟'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}

        {/* Success Message */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-8">
          <div className="flex justify-center">
            <PartyPopper size={80} className="text-yellow-500 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Awesome Job!
          </h1>

          <p className="text-2xl md:text-3xl font-semibold text-gray-700">
            You completed the typing activity! 🎯
          </p>

          {/* Reward Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl max-w-2xl mx-auto">
            <ImageWithFallback
              src={randomImage}
              alt="Celebration reward"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={handleTryAgain}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-2xl font-bold rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <RotateCcw size={28} />
              Try Again
            </button>
          </div>

          {/* Stars decoration */}
          <div className="flex justify-center gap-4 text-5xl">
            <span className="animate-pulse">⭐</span>
            <span className="animate-pulse delay-100">⭐</span>
            <span className="animate-pulse delay-200">⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
}
