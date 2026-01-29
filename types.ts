export interface AppSettings {
  // Visual settings
  backgroundColor: string;
  textColor: string;
  highlightColor: string;
  keyBackgroundColor: string;
  keyTextColor: string;
  correctKeyColor: string; // color for the correct key
  fontSize: number;
  contrast: 'normal' | 'high' | 'maximum';
  
  // Keyboard settings
  visibleKeys: string[]; // array of specific keys to show
  keysClickable: boolean; // true = all keys work, false = only correct key works (errorless)
  showVisualIndicator: boolean; // blinking outline on correct key
  visualIndicatorColor: string; // color of the blinking outline
  visualIndicatorSpeed: number; // speed of blinking in milliseconds (lower = faster)
  blankKeyOpacity: number; // opacity of black overlay on blank keys (0-100)
  
  // Feedback settings
  enableCorrectKeyFeedback: boolean; // show sparkle and play sound on correct key press
  enableWrongKeyFeedback: boolean; // show visual cue and play sound on wrong key press
  
  // Audio settings
  enableVoicePrompts: boolean;
  
  // Typing prompt
  typingPrompt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  settings: AppSettings;
  lastUsed: number; // timestamp
}

const ALL_KEYS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ' '];

export const DEFAULT_SETTINGS: AppSettings = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  highlightColor: '#4ade80',
  keyBackgroundColor: '#e5e7eb',
  keyTextColor: '#000000',
  correctKeyColor: '#34d399', // color for the correct key
  fontSize: 48,
  contrast: 'normal',
  visibleKeys: [...ALL_KEYS], // all keys visible by default
  keysClickable: true,
  showVisualIndicator: true,
  visualIndicatorColor: '#ef4444',
  visualIndicatorSpeed: 800,
  blankKeyOpacity: 30,
  enableCorrectKeyFeedback: true,
  enableWrongKeyFeedback: true,
  enableVoicePrompts: true,
  typingPrompt: 'the quick brown fox jumps over the lazy dog',
};

export { ALL_KEYS };