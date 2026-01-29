import React, { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface KeyboardProps {
  targetLetter: string;
  onKeyPress: (key: string) => void;
  onWrongKeyPress?: () => void; // callback for wrong key press
  onCorrectKeyPress?: () => void; // callback for correct key press
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export function Keyboard({ targetLetter, onKeyPress, onWrongKeyPress, onCorrectKeyPress }: KeyboardProps) {
  const { settings } = useSettings();
  const [showIndicator, setShowIndicator] = useState(true);
  const [wrongKeyPressed, setWrongKeyPressed] = useState<string | null>(null);
  const [correctKeyAnimation, setCorrectKeyAnimation] = useState(false);

  // Blinking animation for visual indicator
  useEffect(() => {
    if (!settings.showVisualIndicator) return;
    
    const interval = setInterval(() => {
      setShowIndicator(prev => !prev);
    }, settings.visualIndicatorSpeed);
    
    return () => clearInterval(interval);
  }, [settings.showVisualIndicator, settings.visualIndicatorSpeed]);

  // Use the visibleKeys array from settings
  const visibleKeys = new Set(settings.visibleKeys.map(k => k.toLowerCase()));

  const handleKeyClick = (key: string) => {
    const isCorrectKey = key.toLowerCase() === targetLetter.toLowerCase();
    
    // In errorless mode, only correct key is clickable
    if (!settings.keysClickable && !isCorrectKey) {
      return;
    }
    
    if (isCorrectKey) {
      // Trigger correct key feedback animation
      if (settings.enableCorrectKeyFeedback) {
        setCorrectKeyAnimation(true);
        setTimeout(() => setCorrectKeyAnimation(false), 600);
        onCorrectKeyPress?.();
      }
      onKeyPress(key);
    } else {
      // Trigger wrong key feedback
      if (settings.enableWrongKeyFeedback) {
        setWrongKeyPressed(key);
        setTimeout(() => setWrongKeyPressed(null), 500);
        onWrongKeyPress?.();
      }
    }
  };

  const getKeyStyle = (key: string) => {
    const isCorrectKey = key.toLowerCase() === targetLetter.toLowerCase();
    const isVisible = visibleKeys.has(key);
    
    let backgroundColor = settings.keyBackgroundColor;
    let textColor = settings.keyTextColor;
    let border = '2px solid #9ca3af';
    
    // Correct key uses special color
    if (isCorrectKey && isVisible) {
      backgroundColor = settings.correctKeyColor;
    }
    
    if (settings.contrast === 'high') {
      backgroundColor = isVisible ? (isCorrectKey ? settings.correctKeyColor : '#ffffff') : settings.keyBackgroundColor;
      textColor = '#000000';
      border = '3px solid #000000';
    } else if (settings.contrast === 'maximum') {
      backgroundColor = isVisible ? (isCorrectKey ? settings.correctKeyColor : '#ffffff') : settings.keyBackgroundColor;
      textColor = '#000000';
      border = '4px solid #000000';
    }
    
    const cursor = (!settings.keysClickable && !isCorrectKey) ? 'not-allowed' : 'pointer';
    
    return {
      backgroundColor,
      color: textColor,
      border,
      cursor,
    };
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2">
      <div className="space-y-1.5">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const isCorrectKey = key.toLowerCase() === targetLetter.toLowerCase();
              const isVisible = visibleKeys.has(key);
              const isWrongKey = wrongKeyPressed === key;
              
              return (
                <div key={key} className="relative">
                  <button
                    onClick={() => handleKeyClick(key)}
                    style={getKeyStyle(key) as React.CSSProperties}
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg text-xl sm:text-2xl font-bold transition-all duration-200 shadow-lg ${
                      isWrongKey ? 'animate-shake' : 'active:scale-95'
                    }`}
                  >
                    {key.toUpperCase()}
                  </button>
                  
                  {/* Black overlay for non-visible keys */}
                  {!isVisible && (
                    <div
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{
                        backgroundColor: `rgba(0, 0, 0, ${settings.blankKeyOpacity / 100})`,
                      }}
                    />
                  )}
                  
                  {/* Blinking outline indicator - separate from the key */}
                  {isCorrectKey && settings.showVisualIndicator && showIndicator && (
                    <div
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{
                        border: `5px solid ${settings.visualIndicatorColor}`,
                        boxShadow: `0 0 15px ${settings.visualIndicatorColor}`,
                      }}
                    />
                  )}
                  
                  {/* Wrong key feedback - red flash */}
                  {isWrongKey && settings.enableWrongKeyFeedback && (
                    <div
                      className="absolute inset-0 rounded-lg pointer-events-none animate-flash"
                      style={{
                        border: '4px solid #ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      }}
                    />
                  )}
                  
                  {/* Correct key sparkle effect */}
                  {isCorrectKey && correctKeyAnimation && settings.enableCorrectKeyFeedback && (
                    <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
                      <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle" />
                      <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-sparkle" style={{ animationDelay: '0.1s' }} />
                      <div className="absolute bottom-2 right-3 w-2 h-2 bg-yellow-400 rounded-full animate-sparkle" style={{ animationDelay: '0.2s' }} />
                      <div className="absolute bottom-1 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-sparkle" style={{ animationDelay: '0.15s' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Space bar */}
        <div className="flex justify-center mt-2">
          <div className="relative">
            <button
              onClick={() => handleKeyClick(' ')}
              style={{
                backgroundColor: targetLetter === ' ' && visibleKeys.has(' ') ? settings.correctKeyColor : settings.keyBackgroundColor,
                color: settings.keyTextColor,
                border: '2px solid #9ca3af',
                cursor: (!settings.keysClickable && targetLetter !== ' ') ? 'not-allowed' : 'pointer',
              } as React.CSSProperties}
              className={`w-64 sm:w-80 md:w-96 h-12 sm:h-14 md:h-16 rounded-lg text-xl font-bold transition-all duration-200 shadow-lg ${
                wrongKeyPressed === ' ' ? 'animate-shake' : 'active:scale-95'
              }`}
            >
              SPACE
            </button>
            
            {/* Black overlay for non-visible space bar */}
            {!visibleKeys.has(' ') && (
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${settings.blankKeyOpacity / 100})`,
                }}
              />
            )}
            
            {/* Blinking outline indicator for space bar */}
            {targetLetter === ' ' && settings.showVisualIndicator && showIndicator && (
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  border: `5px solid ${settings.visualIndicatorColor}`,
                  boxShadow: `0 0 15px ${settings.visualIndicatorColor}`,
                }}
              />
            )}
            
            {/* Wrong key feedback for space bar */}
            {wrongKeyPressed === ' ' && settings.enableWrongKeyFeedback && (
              <div
                className="absolute inset-0 rounded-lg pointer-events-none animate-flash"
                style={{
                  border: '4px solid #ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                }}
              />
            )}
            
            {/* Correct key sparkle effect for space bar */}
            {targetLetter === ' ' && correctKeyAnimation && settings.enableCorrectKeyFeedback && (
              <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
                <div className="absolute top-2 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle" />
                <div className="absolute top-3 right-10 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-sparkle" style={{ animationDelay: '0.1s' }} />
                <div className="absolute bottom-3 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-sparkle" style={{ animationDelay: '0.2s' }} />
                <div className="absolute bottom-2 right-20 w-1 h-1 bg-yellow-300 rounded-full animate-sparkle" style={{ animationDelay: '0.15s' }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}