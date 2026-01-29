import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, DEFAULT_SETTINGS, UserProfile } from '../types';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  
  // Profile management
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  createProfile: (name: string) => void;
  loadProfile: (profileId: string) => void;
  deleteProfile: (profileId: string) => void;
  updateCurrentProfileName: (name: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILES: 'typingApp_profiles',
  CURRENT_PROFILE_ID: 'typingApp_currentProfileId',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load profiles and current profile from localStorage on mount
  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
      const storedCurrentProfileId = localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE_ID);

      if (storedProfiles) {
        const parsedProfiles: UserProfile[] = JSON.parse(storedProfiles);
        setProfiles(parsedProfiles);

        // Load the last used profile or create a default one
        if (storedCurrentProfileId) {
          const profile = parsedProfiles.find(p => p.id === storedCurrentProfileId);
          if (profile) {
            setCurrentProfile(profile);
            setSettings(profile.settings);
            return;
          }
        }

        // If no current profile, use the most recently used one
        if (parsedProfiles.length > 0) {
          const mostRecent = parsedProfiles.reduce((prev, current) =>
            current.lastUsed > prev.lastUsed ? current : prev
          );
          setCurrentProfile(mostRecent);
          setSettings(mostRecent.settings);
          localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE_ID, mostRecent.id);
          return;
        }
      }

      // Create default profile if none exist
      const defaultProfile: UserProfile = {
        id: Date.now().toString(),
        name: 'Default Profile',
        settings: DEFAULT_SETTINGS,
        lastUsed: Date.now(),
      };
      setProfiles([defaultProfile]);
      setCurrentProfile(defaultProfile);
      setSettings(defaultProfile.settings);
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([defaultProfile]));
      localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE_ID, defaultProfile.id);
    } catch (error) {
      console.error('Error loading profiles from localStorage:', error);
      // Fallback to default settings
      const defaultProfile: UserProfile = {
        id: Date.now().toString(),
        name: 'Default Profile',
        settings: DEFAULT_SETTINGS,
        lastUsed: Date.now(),
      };
      setProfiles([defaultProfile]);
      setCurrentProfile(defaultProfile);
      setSettings(defaultProfile.settings);
    }
  }, []);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      } catch (error) {
        console.error('Error saving profiles to localStorage:', error);
      }
    }
  }, [profiles]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    // Update current profile with new settings
    if (currentProfile) {
      const updatedProfile: UserProfile = {
        ...currentProfile,
        settings: updatedSettings,
        lastUsed: Date.now(),
      };
      setCurrentProfile(updatedProfile);

      // Update in profiles array
      setProfiles(prev =>
        prev.map(p => p.id === updatedProfile.id ? updatedProfile : p)
      );

      // Save current profile ID
      localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE_ID, updatedProfile.id);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    
    if (currentProfile) {
      const updatedProfile: UserProfile = {
        ...currentProfile,
        settings: DEFAULT_SETTINGS,
        lastUsed: Date.now(),
      };
      setCurrentProfile(updatedProfile);
      setProfiles(prev =>
        prev.map(p => p.id === updatedProfile.id ? updatedProfile : p)
      );
    }
  };

  const createProfile = (name: string) => {
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name,
      settings: DEFAULT_SETTINGS,
      lastUsed: Date.now(),
    };

    setProfiles(prev => [...prev, newProfile]);
    setCurrentProfile(newProfile);
    setSettings(newProfile.settings);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE_ID, newProfile.id);
  };

  const loadProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      const updatedProfile = { ...profile, lastUsed: Date.now() };
      setCurrentProfile(updatedProfile);
      setSettings(updatedProfile.settings);
      
      // Update lastUsed timestamp in profiles array
      setProfiles(prev =>
        prev.map(p => p.id === profileId ? updatedProfile : p)
      );
      
      localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE_ID, profileId);
    }
  };

  const deleteProfile = (profileId: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);

    // If deleting current profile, switch to another or create new default
    if (currentProfile?.id === profileId) {
      if (updatedProfiles.length > 0) {
        const nextProfile = updatedProfiles[0];
        setCurrentProfile(nextProfile);
        setSettings(nextProfile.settings);
        localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE_ID, nextProfile.id);
      } else {
        // Create a new default profile
        const defaultProfile: UserProfile = {
          id: Date.now().toString(),
          name: 'Default Profile',
          settings: DEFAULT_SETTINGS,
          lastUsed: Date.now(),
        };
        setProfiles([defaultProfile]);
        setCurrentProfile(defaultProfile);
        setSettings(defaultProfile.settings);
        localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE_ID, defaultProfile.id);
      }
    }
  };

  const updateCurrentProfileName = (name: string) => {
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, name };
      setCurrentProfile(updatedProfile);
      setProfiles(prev =>
        prev.map(p => p.id === updatedProfile.id ? updatedProfile : p)
      );
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        profiles,
        currentProfile,
        createProfile,
        loadProfile,
        deleteProfile,
        updateCurrentProfileName,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
