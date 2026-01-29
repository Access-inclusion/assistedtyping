import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, RotateCcw, User, Trash2, Plus, Check } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { ALL_KEYS } from '../types';

export function Settings() {
  const { settings, updateSettings, resetSettings, profiles, currentProfile, createProfile, loadProfile, deleteProfile, updateCurrentProfileName } = useSettings();
  const navigate = useNavigate();
  const [localSettings, setLocalSettings] = useState(settings);
  const [showNewProfileDialog, setShowNewProfileDialog] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingProfileName, setEditingProfileName] = useState(false);
  const [editedName, setEditedName] = useState('');

  const handleSave = () => {
    updateSettings(localSettings);
    navigate('/');
  };

  const handleReset = () => {
    resetSettings();
    navigate('/');
  };

  const updateLocalSetting = <K extends keyof typeof localSettings>(
    key: K,
    value: typeof localSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleKey = (key: string) => {
    const newVisibleKeys = localSettings.visibleKeys.includes(key)
      ? localSettings.visibleKeys.filter(k => k !== key)
      : [...localSettings.visibleKeys, key];
    updateLocalSetting('visibleKeys', newVisibleKeys);
  };

  const selectAllKeys = () => {
    updateLocalSetting('visibleKeys', [...ALL_KEYS]);
  };

  const deselectAllKeys = () => {
    updateLocalSetting('visibleKeys', []);
  };

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      createProfile(newProfileName);
      setNewProfileName('');
      setShowNewProfileDialog(false);
    }
  };

  const handleLoadProfile = (profileId: string) => {
    loadProfile(profileId);
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setLocalSettings(profile.settings);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length > 1) { // Don't allow deleting the last profile
      deleteProfile(profileId);
    }
  };

  const handleEditProfileName = () => {
    setEditingProfileName(true);
    setEditedName(currentProfile?.name || '');
  };

  const handleSaveProfileName = () => {
    if (editedName.trim()) {
      updateCurrentProfileName(editedName);
      setEditingProfileName(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
          >
            <RotateCcw size={18} />
            <span className="font-semibold">Reset</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 space-y-6">
          {/* Typing Prompt */}
          <div>
            <h2 className="text-xl font-bold mb-3">Typing Prompt</h2>
            <textarea
              value={localSettings.typingPrompt}
              onChange={(e) => updateLocalSetting('typingPrompt', e.target.value)}
              className="w-full p-2 border-2 border-gray-300 rounded-lg text-base"
              rows={2}
              placeholder="Enter the text students will type..."
            />
          </div>

          {/* Keyboard Visibility Settings */}
          <div>
            <h2 className="text-xl font-bold mb-3">Visible Keys</h2>
            <p className="text-sm text-gray-600 mb-3">
              Select which keys will be visible on the keyboard. Unselected keys will appear as blank outlines.
            </p>
            
            <div className="flex gap-2 mb-3">
              <button
                onClick={selectAllKeys}
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold"
              >
                Select All
              </button>
              <button
                onClick={deselectAllKeys}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold"
              >
                Deselect All
              </button>
              <span className="ml-auto text-sm font-semibold text-gray-600 self-center">
                {localSettings.visibleKeys.length} / {ALL_KEYS.length} keys visible
              </span>
            </div>

            {/* Keyboard Layout for Key Selection */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="space-y-2">
                {/* First Row */}
                <div className="flex justify-center gap-1.5">
                  {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(key => (
                    <button
                      key={key}
                      onClick={() => toggleKey(key)}
                      className={`w-10 h-10 rounded-lg font-bold text-lg transition-all ${
                        localSettings.visibleKeys.includes(key)
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>
                
                {/* Second Row */}
                <div className="flex justify-center gap-1.5">
                  {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(key => (
                    <button
                      key={key}
                      onClick={() => toggleKey(key)}
                      className={`w-10 h-10 rounded-lg font-bold text-lg transition-all ${
                        localSettings.visibleKeys.includes(key)
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>
                
                {/* Third Row */}
                <div className="flex justify-center gap-1.5">
                  {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(key => (
                    <button
                      key={key}
                      onClick={() => toggleKey(key)}
                      className={`w-10 h-10 rounded-lg font-bold text-lg transition-all ${
                        localSettings.visibleKeys.includes(key)
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>
                
                {/* Space Bar */}
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => toggleKey(' ')}
                    className={`w-60 h-10 rounded-lg font-bold text-lg transition-all ${
                      localSettings.visibleKeys.includes(' ')
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    SPACE
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Settings */}
          <div>
            <h2 className="text-xl font-bold mb-3">Visual Settings</h2>
            
            <div className="space-y-3">
              {/* Contrast */}
              <div>
                <label className="block font-semibold mb-1.5">Contrast Mode</label>
                <select
                  value={localSettings.contrast}
                  onChange={(e) => updateLocalSetting('contrast', e.target.value as 'normal' | 'high' | 'maximum')}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Contrast</option>
                  <option value="maximum">Maximum Contrast</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block font-semibold mb-1.5">
                  Font Size: {localSettings.fontSize}px
                </label>
                <input
                  type="range"
                  min="24"
                  max="96"
                  value={localSettings.fontSize}
                  onChange={(e) => updateLocalSetting('fontSize', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Background Color */}
              <div>
                <label className="block font-semibold mb-1.5">Background Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={localSettings.backgroundColor}
                    onChange={(e) => updateLocalSetting('backgroundColor', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localSettings.backgroundColor}
                    onChange={(e) => updateLocalSetting('backgroundColor', e.target.value)}
                    className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block font-semibold mb-1.5">Text Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={localSettings.textColor}
                    onChange={(e) => updateLocalSetting('textColor', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localSettings.textColor}
                    onChange={(e) => updateLocalSetting('textColor', e.target.value)}
                    className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Highlight Color */}
              <div>
                <label className="block font-semibold mb-1.5">Highlight Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={localSettings.highlightColor}
                    onChange={(e) => updateLocalSetting('highlightColor', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localSettings.highlightColor}
                    onChange={(e) => updateLocalSetting('highlightColor', e.target.value)}
                    className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Key Background Color */}
              <div>
                <label className="block font-semibold mb-1.5">Key Background Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={localSettings.keyBackgroundColor}
                    onChange={(e) => updateLocalSetting('keyBackgroundColor', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localSettings.keyBackgroundColor}
                    onChange={(e) => updateLocalSetting('keyBackgroundColor', e.target.value)}
                    className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Key Text Color */}
              <div>
                <label className="block font-semibold mb-1.5">Key Text Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={localSettings.keyTextColor}
                    onChange={(e) => updateLocalSetting('keyTextColor', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localSettings.keyTextColor}
                    onChange={(e) => updateLocalSetting('keyTextColor', e.target.value)}
                    className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Correct Key Color */}
              <div>
                <label className="block font-semibold mb-1.5">Correct Key Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={localSettings.correctKeyColor}
                    onChange={(e) => updateLocalSetting('correctKeyColor', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localSettings.correctKeyColor}
                    onChange={(e) => updateLocalSetting('correctKeyColor', e.target.value)}
                    className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Color for the current target key the student should press
                </p>
              </div>
            </div>
          </div>

          {/* Keyboard Settings */}
          <div>
            <h2 className="text-xl font-bold mb-3">Keyboard Settings</h2>
            
            <div className="space-y-3">
              {/* Errorless Practice Mode */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="keysClickable"
                  checked={!localSettings.keysClickable}
                  onChange={(e) => updateLocalSetting('keysClickable', !e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="keysClickable" className="font-semibold cursor-pointer">
                  Errorless Practice Mode (only correct key is clickable)
                </label>
              </div>

              {/* Visual Indicator Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showVisualIndicator"
                  checked={localSettings.showVisualIndicator}
                  onChange={(e) => updateLocalSetting('showVisualIndicator', e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="showVisualIndicator" className="font-semibold cursor-pointer">
                  Show Visual Indicator (blinking outline on correct key)
                </label>
              </div>

              {/* Visual Indicator Color */}
              {localSettings.showVisualIndicator && (
                <div className="ml-8">
                  <label className="block font-semibold mb-1.5">Visual Indicator Color</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={localSettings.visualIndicatorColor}
                      onChange={(e) => updateLocalSetting('visualIndicatorColor', e.target.value)}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSettings.visualIndicatorColor}
                      onChange={(e) => updateLocalSetting('visualIndicatorColor', e.target.value)}
                      className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Visual Indicator Speed */}
              {localSettings.showVisualIndicator && (
                <div className="ml-8">
                  <label className="block font-semibold mb-1.5">
                    Blink Speed: {localSettings.visualIndicatorSpeed}ms (slower = higher number)
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="100"
                    value={localSettings.visualIndicatorSpeed}
                    onChange={(e) => updateLocalSetting('visualIndicatorSpeed', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Faster (200ms)</span>
                    <span>Slower (2000ms)</span>
                  </div>
                </div>
              )}

              {/* Blank Key Opacity */}
              <div>
                <label className="block font-semibold mb-1.5">
                  Blank Key Cover Opacity: {localSettings.blankKeyOpacity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={localSettings.blankKeyOpacity}
                  onChange={(e) => updateLocalSetting('blankKeyOpacity', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Transparent (0%)</span>
                  <span>Fully Covered (100%)</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Controls the darkness of the black cover over non-visible keys. Higher values make blank keys less visible.
                </p>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div>
            <h2 className="text-xl font-bold mb-3">Audio Settings</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enableVoicePrompts"
                  checked={localSettings.enableVoicePrompts}
                  onChange={(e) => updateLocalSetting('enableVoicePrompts', e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="enableVoicePrompts" className="font-semibold cursor-pointer">
                  Enable Voice Prompts
                </label>
              </div>
            </div>
          </div>

          {/* Feedback Settings */}
          <div>
            <h2 className="text-xl font-bold mb-3">Feedback Settings</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enableCorrectKeyFeedback"
                  checked={localSettings.enableCorrectKeyFeedback}
                  onChange={(e) => updateLocalSetting('enableCorrectKeyFeedback', e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="enableCorrectKeyFeedback" className="font-semibold cursor-pointer">
                  Enable Correct Key Feedback (sound and sparkle animation)
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enableWrongKeyFeedback"
                  checked={localSettings.enableWrongKeyFeedback}
                  onChange={(e) => updateLocalSetting('enableWrongKeyFeedback', e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="enableWrongKeyFeedback" className="font-semibold cursor-pointer">
                  Enable Wrong Key Feedback (sound and shake animation)
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-lg transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Profiles Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">User Profiles</h2>
          <p className="text-sm text-gray-600 mb-4">
            Save different configurations for multiple users. All data is stored locally on this device.
          </p>
          
          <div className="space-y-4">
            {/* Current Profile */}
            {currentProfile && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-green-700" />
                  <div className="flex-1">
                    {editingProfileName ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveProfileName();
                          if (e.key === 'Escape') setEditingProfileName(false);
                        }}
                        className="w-full p-2 border-2 border-gray-300 rounded-lg text-sm"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <span className="font-bold text-lg">{currentProfile.name}</span>
                        <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">Current Profile</span>
                      </div>
                    )}
                  </div>
                  {editingProfileName ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfileName}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        title="Save"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingProfileName(false)}
                        className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        title="Cancel"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEditProfileName}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
                    >
                      Rename
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Other Profiles */}
            {profiles.filter(p => p.id !== currentProfile?.id).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-gray-700">Other Profiles</h3>
                <div className="space-y-2">
                  {profiles
                    .filter(p => p.id !== currentProfile?.id)
                    .sort((a, b) => b.lastUsed - a.lastUsed)
                    .map(profile => (
                      <div key={profile.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                        <User size={18} className="text-gray-600" />
                        <span className="font-semibold flex-1">{profile.name}</span>
                        <button
                          onClick={() => handleLoadProfile(profile.id)}
                          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold"
                        >
                          Switch To
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                          title="Delete Profile"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* New Profile Button */}
            <button
              onClick={() => setShowNewProfileDialog(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold rounded-lg transition-colors"
            >
              <Plus size={20} />
              Create New Profile
            </button>

            {/* New Profile Dialog */}
            {showNewProfileDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                  <h3 className="text-xl font-bold mb-4">Create New Profile</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter a name for the new profile. It will start with default settings.
                  </p>
                  <input
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateProfile();
                      if (e.key === 'Escape') {
                        setShowNewProfileDialog(false);
                        setNewProfileName('');
                      }
                    }}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-base mb-4"
                    placeholder="Enter profile name..."
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowNewProfileDialog(false);
                        setNewProfileName('');
                      }}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateProfile}
                      disabled={!newProfileName.trim()}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}