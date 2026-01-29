import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Settings } from 'lucide-react';
import { Keyboard } from './Keyboard';
import { useSettings } from '../contexts/SettingsContext';

export function TypingInterface() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Track if typing has started

  const targetText = settings.typingPrompt.toLowerCase();
  const currentLetter = currentIndex < targetText.length ? targetText[currentIndex] : '';

  // Initial voice prompt - "Let's type [prompt]"
  useEffect(() => {
    if (!settings.enableVoicePrompts || hasStarted) return;

    const utterance = new SpeechSynthesisUtterance(
      `Let's type ${settings.typingPrompt}`
    );
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    
    const timeout = setTimeout(() => {
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      
      // Mark as started after initial prompt
      utterance.onend = () => {
        setHasStarted(true);
      };
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [settings.enableVoicePrompts, settings.typingPrompt]); // Only run when settings change, not hasStarted

  // Voice prompt for current letter - only after initial prompt
  useEffect(() => {
    if (!settings.enableVoicePrompts || !currentLetter || isComplete || !hasStarted) return;

    const utterance = new SpeechSynthesisUtterance(
      currentLetter === ' ' ? 'space' : currentLetter
    );
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    
    // Small delay to avoid overlapping speech
    const timeout = setTimeout(() => {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      speechSynthesis.speak(utterance);
    }, 300);

    return () => {
      clearTimeout(timeout);
      speechSynthesis.cancel();
    };
  }, [currentLetter, settings.enableVoicePrompts, isComplete, hasStarted]);

  // Audio feedback functions
  const playCorrectSound = () => {
    if (!settings.enableCorrectKeyFeedback) return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // High pleasant tone
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const playWrongSound = () => {
    if (!settings.enableWrongKeyFeedback) return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200; // Low error tone
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };

  const handleKeyPress = (key: string) => {
    const expectedKey = targetText[currentIndex];
    
    if (key.toLowerCase() === expectedKey) {
      const newTypedText = typedText + key;
      setTypedText(newTypedText);
      
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      
      // Check if typing is complete
      if (newIndex >= targetText.length) {
        setIsComplete(true);
        // Navigate to reward screen after a short delay
        setTimeout(() => {
          navigate('/reward');
        }, 500);
      }
      playCorrectSound();
    } else {
      playWrongSound();
    }
  };

  const getContrastStyles = () => {
    switch (settings.contrast) {
      case 'high':
        return {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          highlightColor: '#22c55e',
          textDisplayBg: '#f3f4f6',
        };
      case 'maximum':
        return {
          backgroundColor: '#000000',
          textColor: '#ffffff',
          highlightColor: '#00ff00',
          textDisplayBg: '#1a1a1a',
        };
      default:
        return {
          backgroundColor: settings.backgroundColor,
          textColor: settings.textColor,
          highlightColor: settings.highlightColor,
          textDisplayBg: settings.contrast === 'maximum' ? '#1a1a1a' : '#f3f4f6',
        };
    }
  };

  const contrastStyles = getContrastStyles();

  return (
    <div
      style={{ backgroundColor: contrastStyles.backgroundColor }}
      className="h-screen flex flex-col p-3 overflow-hidden"
    >
      {/* Header with Settings Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Large Text Display */}
      <div className="flex-none mb-3">
        <div
          className="text-center px-3 py-3 rounded-lg w-full"
          style={{
            backgroundColor: contrastStyles.textDisplayBg,
          }}
        >
          <div
            className="font-mono font-bold leading-tight break-words"
            style={{
              fontSize: `${settings.fontSize}px`,
              color: contrastStyles.textColor,
            }}
          >
            {targetText.split('').map((char, index) => {
              const isTyped = index < currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <span
                  key={index}
                  style={{
                    color: isTyped
                      ? '#9ca3af'
                      : isCurrent
                      ? contrastStyles.highlightColor
                      : contrastStyles.textColor,
                    backgroundColor: isCurrent ? `${contrastStyles.highlightColor}40` : 'transparent',
                    fontWeight: isCurrent ? 'bold' : 'normal',
                    padding: isCurrent ? '2px 4px' : '0',
                    borderRadius: isCurrent ? '4px' : '0',
                    textDecoration: isTyped ? 'line-through' : 'none',
                  }}
                  className="transition-all duration-200"
                >
                  {char === ' ' ? '␣' : char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="w-full mt-2">
          <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${(currentIndex / targetText.length) * 100}%`,
                backgroundColor: contrastStyles.highlightColor,
              }}
            />
          </div>
          <p
            className="text-center mt-1 text-lg font-semibold"
            style={{ color: contrastStyles.textColor }}
          >
            {currentIndex} / {targetText.length}
          </p>
        </div>
      </div>

      {/* Keyboard - takes remaining space */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <Keyboard targetLetter={currentLetter} onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
}