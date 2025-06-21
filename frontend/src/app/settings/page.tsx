'use client';

import React, { useState } from 'react';
import { 
  User, 
  Palette, 
  Monitor, 
  Building2, 
  Bell, 
  Shield, 
  Database, 
  Settings as SettingsIcon,
  Moon,
  Sun,
  Smartphone,
  Grid3X3,
  List,
  Download,  Upload,
  Globe,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  ChevronRight,
  Users as UsersIcon
} from 'lucide-react';
import { useTheme, defaultThemes } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { useOrganizational } from '@/context/OrganizationalContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThemeCard } from '@/components/settings/ThemeCard';
import CustomThemeEditor from '@/components/settings/CustomThemeEditor';
import { OrganizationType } from '@/types';

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'ui-ux', label: 'UI/UX', icon: Monitor },
  { id: 'account', label: 'Account', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'system', label: 'System', icon: SettingsIcon },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance');
  const { currentTheme, setCurrentTheme, customThemes, addCustomTheme, updateCustomTheme, deleteCustomTheme } = useTheme();
  const { preferences, updatePreferences } = useSettings();
  const { logout, updateProfile, user } = useAuth();
  const { 
    currentUser, 
    currentOrganization, 
    organizationHierarchy, 
    getParentOrganizations, 
    getChildOrganizations,
    getOrganizationsByType
  } = useOrganizational();
  const [showApiKey, setShowApiKey] = useState(false);
  const [showCustomThemeEditor, setShowCustomThemeEditor] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  // Form states for profile data
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferences: {
      theme: user?.preferences?.theme || 'light',
      notifications: user?.preferences?.notifications || true,
      language: user?.preferences?.language || 'en',
      timezone: user?.preferences?.timezone || 'UTC'
    }
  });
  // Form states for organization settings
  const [organizationData, setOrganizationData] = useState({
    name: currentOrganization?.name || '',
    timezone: currentOrganization?.settings?.operational?.timezone || 'America/Chicago',
    dateFormat: currentOrganization?.settings?.operational?.dateFormat || 'MM/DD/YYYY',
    currency: currentOrganization?.settings?.operational?.currency || 'USD'
  });
  // Form states for notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: user?.preferences?.notifications || false,
    push: user?.preferences?.notifications || false,
    sms: user?.preferences?.notifications || false
  });

  // Get all themes (default + custom)
  const allThemes = [...defaultThemes, ...customThemes];
  
  // Group themes by category
  const themeCategories = {
    business: allThemes.filter(theme => theme.category === 'business'),
    modern: allThemes.filter(theme => theme.category === 'modern'),
    creative: allThemes.filter(theme => theme.category === 'creative'),
    custom: customThemes,
  };  const handleMobileMenuLayoutChange = (layout: 'list' | 'grid') => {
    updatePreferences({ mobileMenuLayout: layout });
  };
  const handleThemeSelect = async (theme: any) => {
    setCurrentTheme(theme);
    // Also save theme preference to user profile
    try {
      await updateProfile({
        preferences: {
          ...profileData.preferences,
          theme: theme.name.toLowerCase()
        }
      });
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const handleCreateCustomTheme = () => {
    setEditingThemeId(null);
    setShowCustomThemeEditor(true);
  };

  const handleEditCustomTheme = (themeId: string) => {
    setEditingThemeId(themeId);
    setShowCustomThemeEditor(true);
  };

  const handleDeleteCustomTheme = (themeId: string) => {
    if (confirm('Are you sure you want to delete this custom theme?')) {
      deleteCustomTheme(themeId);
    }
  };

  const handleDuplicateTheme = (theme: any) => {
    const newTheme = addCustomTheme({
      name: `${theme.name} (Copy)`,
      colors: { ...theme.colors },
      isDark: theme.isDark,
      category: 'custom',
    });
    setCurrentTheme(newTheme);
  };

  const handleExportTheme = (theme: any) => {
    const themeData = JSON.stringify(theme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string);
          const importedTheme = addCustomTheme({
            name: `${themeData.name} (Imported)`,
            colors: themeData.colors,
            isDark: themeData.isDark,
            category: 'custom',
          });
          setCurrentTheme(importedTheme);
        } catch (error) {
          alert('Invalid theme file format');
        }
      };
      reader.readAsText(file);
    }
    // Reset the input
    event.target.value = '';
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    // For now, we'll work with the current theme system
    // This would need to be updated based on the actual theme context implementation
    console.log('Theme change requested:', newTheme);
  };

  // Save handlers
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        preferences: profileData.preferences
      });
      setSaveMessage('Profile saved successfully!');
    } catch (error) {
      setSaveMessage('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };  const handleSavePreferences = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      // Settings preferences are automatically saved to localStorage via SettingsContext
      // Also save to user profile on backend
      await updateProfile({
        preferences: {
          ...profileData.preferences,
          theme: currentTheme.name.toLowerCase(),
          notifications: notificationPreferences.email || notificationPreferences.push || notificationPreferences.sms,
          language: preferences.language,
          timezone: preferences.timezone
        }
      });
      setSaveMessage('Preferences saved successfully!');
    } catch (error) {
      setSaveMessage('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };
  const handleSaveOrganizationSettings = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      // Here you would save organization settings to the backend
      // For now, we'll just show a success message
      setSaveMessage('Organization settings saved successfully!');
    } catch (error) {
      setSaveMessage('Failed to save organization settings. Please try again.');
    } finally {
      setIsSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };
  const handleExportUserPreferences = () => {
    const userPrefs = {
      theme: currentTheme.name,
      notifications: notificationPreferences,
      profile: {
        language: profileData.preferences.language,
        timezone: profileData.preferences.timezone
      },
      settings: {
        mobileMenuLayout: preferences.mobileMenuLayout,
        animationsEnabled: preferences.animationsEnabled,
        showTooltips: preferences.showTooltips
      }
    };
    
    const prefsData = JSON.stringify(userPrefs, null, 2);
    const blob = new Blob([prefsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-preferences-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportUserPreferences = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const prefsData = JSON.parse(e.target?.result as string);
          
          // Apply imported preferences
          if (prefsData.theme) {
            const importedTheme = allThemes.find(t => t.name === prefsData.theme);
            if (importedTheme) {
              setCurrentTheme(importedTheme);
            }
          }
          
          if (prefsData.notifications) {
            setNotificationPreferences(prefsData.notifications);
          }
          
          if (prefsData.profile) {
            setProfileData(prev => ({
              ...prev,
              preferences: {
                ...prev.preferences,
                ...prefsData.profile
              }
            }));
          }
          
          // Save imported preferences
          await handleSavePreferences();
          setSaveMessage('User preferences imported successfully!');
        } catch (error) {
          setSaveMessage('Invalid preferences file format');
        }
      };
      reader.readAsText(file);
    }
    // Reset the input
    event.target.value = '';
  };// Update profile data when user changes
  React.useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        preferences: {
          theme: user.preferences?.theme || 'light',
          notifications: user.preferences?.notifications || true,
          language: user.preferences?.language || 'en',
          timezone: user.preferences?.timezone || 'UTC'
        }
      });      setNotificationPreferences({
        email: user.preferences?.notifications || false,
        push: user.preferences?.notifications || false,
        sms: user.preferences?.notifications || false
      });
    }
  }, [user]);

  // Update organization data when current organization changes
  React.useEffect(() => {
    if (currentOrganization) {
      setOrganizationData({
        name: currentOrganization.name || '',
        timezone: currentOrganization.settings?.operational?.timezone || 'America/Chicago',
        dateFormat: currentOrganization.settings?.operational?.dateFormat || 'MM/DD/YYYY',
        currency: currentOrganization.settings?.operational?.currency || 'USD'
      });
    }
  }, [currentOrganization]);

  const renderTabContent = () => {
    switch (activeTab) {      case 'appearance':
        return (
          <div className="space-y-6">
            {showCustomThemeEditor ? (              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[var(--theme-primary)]">
                    {editingThemeId ? 'Edit Custom Theme' : 'Create Custom Theme'}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomThemeEditor(false)}
                  >
                    Back to Themes
                  </Button>
                </div>                <CustomThemeEditor 
                  onSave={(theme) => {
                    if (editingThemeId) {
                      updateCustomTheme(editingThemeId, theme);
                    } else {
                      addCustomTheme(theme);
                    }
                    setShowCustomThemeEditor(false);
                  }}
                  onCancel={() => setShowCustomThemeEditor(false)}
                  theme={editingThemeId ? customThemes.find(t => t.id === editingThemeId) : undefined}
                />
              </div>
            ) : (
              <>
                <Card>
                  <Card.Header>
                    <Card.Title className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Theme Gallery
                    </Card.Title>
                    <Card.Description>
                      Choose from our curated collection of professional themes or create your own
                    </Card.Description>
                  </Card.Header>
                  <Card.Content className="space-y-6">
                    {/* Theme Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleCreateCustomTheme}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create Custom Theme
                      </Button>
                      <label className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--theme-neutral)]/30 rounded-lg cursor-pointer hover:bg-[var(--theme-background)] transition-colors">
                        <UploadIcon className="w-4 h-4" />
                        Import Theme
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportTheme}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Business Themes */}
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--theme-primary)] mb-4">
                        Business Themes
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {themeCategories.business.map((theme) => (
                          <ThemeCard
                            key={theme.id}
                            theme={theme}
                            isActive={currentTheme.id === theme.id}
                            onSelect={() => handleThemeSelect(theme)}
                            onDuplicate={() => handleDuplicateTheme(theme)}
                            onExport={() => handleExportTheme(theme)}
                            showActions={!theme.isCustom}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Modern Themes */}
                    {themeCategories.modern.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--theme-primary)] mb-4">
                          Modern Themes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {themeCategories.modern.map((theme) => (
                            <ThemeCard
                              key={theme.id}
                              theme={theme}
                              isActive={currentTheme.id === theme.id}
                              onSelect={() => handleThemeSelect(theme)}
                              onDuplicate={() => handleDuplicateTheme(theme)}
                              onExport={() => handleExportTheme(theme)}
                              showActions={!theme.isCustom}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Creative Themes */}
                    {themeCategories.creative.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--theme-primary)] mb-4">
                          Creative Themes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {themeCategories.creative.map((theme) => (
                            <ThemeCard
                              key={theme.id}
                              theme={theme}
                              isActive={currentTheme.id === theme.id}
                              onSelect={() => handleThemeSelect(theme)}
                              onDuplicate={() => handleDuplicateTheme(theme)}
                              onExport={() => handleExportTheme(theme)}
                              showActions={!theme.isCustom}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Custom Themes */}
                    {themeCategories.custom.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--theme-primary)] mb-4">
                          Your Custom Themes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {themeCategories.custom.map((theme) => (
                            <ThemeCard
                              key={theme.id}
                              theme={theme}
                              isActive={currentTheme.id === theme.id}
                              onSelect={() => handleThemeSelect(theme)}
                              onEdit={() => handleEditCustomTheme(theme.id)}
                              onDelete={() => handleDeleteCustomTheme(theme.id)}
                              onDuplicate={() => handleDuplicateTheme(theme)}
                              onExport={() => handleExportTheme(theme)}
                              showActions={true}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {themeCategories.custom.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-[var(--theme-neutral)]/30 rounded-lg">
                        <Palette className="w-12 h-12 mx-auto text-[var(--theme-neutral)]/50 mb-4" />
                        <h3 className="text-lg font-medium text-[var(--theme-primary)] mb-2">
                          No Custom Themes Yet
                        </h3>
                        <p className="text-[var(--theme-neutral)] mb-4">
                          Create your own custom theme to match your brand and preferences
                        </p>
                        <Button onClick={handleCreateCustomTheme}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Theme
                        </Button>                      </div>
                    )}
                  </Card.Content>
                </Card>

                {/* Theme Mode Settings */}
                <Card>
                  <Card.Header>
                    <Card.Title className="flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      Display Preferences
                    </Card.Title>
                    <Card.Description>
                      Configure how themes appear across different modes
                    </Card.Description>
                  </Card.Header>
                  <Card.Content className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                        Theme Mode
                      </label>
                      <div className="flex gap-3">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'system', label: 'System', icon: Monitor },
                        ].map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => handleThemeChange(value as any)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                              currentTheme.isDark && value === 'dark'
                                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </>
            )}
          </div>
        );

      case 'ui-ux':
        return (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Mobile Interface
                </Card.Title>
                <Card.Description>
                  Configure mobile-specific interface preferences
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    &ldquo;More&rdquo; Menu Layout
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'list', label: 'List View', icon: List },
                      { value: 'grid', label: 'Grid View', icon: Grid3X3 },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => handleMobileMenuLayoutChange(value as any)}                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                          preferences.mobileMenuLayout === value
                            ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Controls how additional menu items are displayed on mobile devices
                  </p>
                </div>
              </Card.Content>
            </Card>
          </div>
        );      case 'account':
        return (
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </Card.Title>
                <Card.Description>
                  Manage your account details and contact information
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-6">
                <div className="flex items-start gap-4">
                  {/* Avatar placeholder */}
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                  </div>
                  
                  {/* Basic Info */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          First Name
                        </label>                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Last Name
                        </label>                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Username
                        </label>
                        <input
                          type="text"
                          defaultValue={currentUser?.username || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          placeholder="Enter username"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Phone Number
                        </label>
                        <input                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Email Addresses */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Addresses</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Primary Email
                      </label>
                      <input                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        placeholder="Enter primary email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Company Email
                      </label>
                      <input
                        type="email"
                        defaultValue={`${currentUser?.firstName?.toLowerCase()}.${currentUser?.lastName?.toLowerCase()}@launchtransport.com` || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        placeholder="Enter company email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Backup Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        placeholder="Enter backup email (optional)"
                      />
                    </div>
                  </div>                </div>
                
                {/* Save button and feedback */}
                <div className="space-y-2">
                  <Button 
                    variant="primary" 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Profile Changes'}
                  </Button>
                  {saveMessage && (
                    <p className={`text-sm ${saveMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                      {saveMessage}
                    </p>
                  )}
                </div>
              </Card.Content>
            </Card>

            {/* Roles & Permissions Card */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Roles & Permissions
                </Card.Title>
                <Card.Description>
                  Your current access levels and organizational assignments
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-6">
                {/* Organization Access */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Organization Access</h4>
                  <div className="space-y-3">
                    {currentUser?.organizationAccess?.map((access) => {
                      const org = organizationHierarchy.find(o => o.id === access.organizationId);
                      const getOrgIcon = (type: OrganizationType) => {
                        switch (type) {
                          case OrganizationType.COMPANY:
                            return <Building className="w-4 h-4 text-blue-500" />;
                          case OrganizationType.DIVISION:
                            return <Building className="w-4 h-4 text-green-500" />;
                          case OrganizationType.DEPARTMENT:
                            return <Building className="w-4 h-4 text-orange-500" />;
                          case OrganizationType.TERMINAL:
                            return <MapPin className="w-4 h-4 text-purple-500" />;
                          default:
                            return <Building className="w-4 h-4 text-gray-500" />;
                        }
                      };

                      return (
                        <div key={access.organizationId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getOrgIcon(access.organizationType)}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {org?.name || access.organizationId}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                {access.organizationType.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {access.roles.map((role) => (
                              <Badge key={role.id} variant="default" className="text-xs">
                                {role.name}
                              </Badge>
                            ))}
                            {access.isDefault && (
                              <Badge variant="status" status="active" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Active Permissions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Active Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentUser?.organizationAccess?.[0]?.roles?.[0]?.permissions?.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                          {permission.name}
                        </span>
                        <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                          {permission.scope}
                        </Badge>
                      </div>
                    )) || (
                      <p className="text-sm text-gray-500 dark:text-gray-400 col-span-2">
                        No specific permissions assigned. Contact your administrator for access.
                      </p>
                    )}
                  </div>
                </div>

                {/* Account Details */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Account Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                      <span className="font-medium">
                        {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Last login:</span>
                      <span className="font-medium">
                        {currentUser?.lastLogin ? new Date(currentUser.lastLogin).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        );      case 'organization':
        const companies = getOrganizationsByType(OrganizationType.COMPANY);
        const divisions = getOrganizationsByType(OrganizationType.DIVISION);
        const departments = getOrganizationsByType(OrganizationType.DEPARTMENT);
        const terminals = getOrganizationsByType(OrganizationType.TERMINAL);

        const getOrgIcon = (type: OrganizationType) => {
          switch (type) {
            case OrganizationType.COMPANY:
              return <Building className="w-5 h-5 text-blue-600" />;
            case OrganizationType.DIVISION:
              return <Building className="w-5 h-5 text-green-600" />;
            case OrganizationType.DEPARTMENT:
              return <Building className="w-5 h-5 text-orange-600" />;
            case OrganizationType.TERMINAL:
              return <MapPin className="w-5 h-5 text-purple-600" />;
            default:
              return <Building className="w-5 h-5 text-gray-600" />;
          }
        };

        return (
          <div className="space-y-6">
            {/* Current Organization Context */}
            {currentOrganization && (
              <Card>
                <Card.Header>
                  <Card.Title className="flex items-center gap-2">
                    {getOrgIcon(currentOrganization.type)}
                    Current Organization
                  </Card.Title>
                  <Card.Description>
                    Your active organizational context
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      {getOrgIcon(currentOrganization.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {currentOrganization.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {currentOrganization.type.charAt(0).toUpperCase() + currentOrganization.type.slice(1)} • {currentOrganization.code}
                      </p>
                      
                      {currentOrganization.contactInfo && (
                        <div className="space-y-1 text-sm">
                          {currentOrganization.contactInfo.email && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Mail className="w-4 h-4" />
                              {currentOrganization.contactInfo.email}
                            </div>
                          )}
                          {currentOrganization.contactInfo.phone && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4" />
                              {currentOrganization.contactInfo.phone}
                            </div>
                          )}
                          {currentOrganization.address && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4" />
                              {currentOrganization.address.address}, {currentOrganization.address.city}, {currentOrganization.address.state} {currentOrganization.address.zipCode}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Badge variant="status" status={currentOrganization.isActive ? 'active' : 'inactive'}>
                      {currentOrganization.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </Card.Content>
              </Card>
            )}

            {/* Organization Hierarchy */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Organization Hierarchy
                </Card.Title>
                <Card.Description>
                  Browse and manage your organizational structure
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-6">
                {/* Companies */}
                {companies.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <Building className="w-4 h-4 text-blue-600" />
                      Companies ({companies.length})
                    </h4>
                    <div className="grid gap-2">
                      {companies.map((company) => (
                        <div key={company.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Building className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{company.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{company.code}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">{getChildOrganizations(company.id).length} divisions</Badge>
                            {currentOrganization?.id === company.id && (
                              <Badge variant="status" status="active">Current</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Divisions */}
                {divisions.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <Building className="w-4 h-4 text-green-600" />
                      Divisions ({divisions.length})
                    </h4>
                    <div className="grid gap-2">
                      {divisions.map((division) => {
                        const parentCompany = organizationHierarchy.find(org => org.id === division.parentId);
                        return (
                          <div key={division.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Building className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{division.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {parentCompany?.name} • {division.code}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="default">{getChildOrganizations(division.id).length} departments</Badge>
                              {currentOrganization?.id === division.id && (
                                <Badge variant="status" status="active">Current</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Departments */}
                {departments.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <Building className="w-4 h-4 text-orange-600" />
                      Departments ({departments.length})
                    </h4>
                    <div className="grid gap-2">
                      {departments.map((department) => {
                        const parentDivision = organizationHierarchy.find(org => org.id === department.parentId);
                        return (
                          <div key={department.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Building className="w-4 h-4 text-orange-600" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{department.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {parentDivision?.name} • {department.code}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="default">{getChildOrganizations(department.id).length} terminals</Badge>
                              {currentOrganization?.id === department.id && (
                                <Badge variant="status" status="active">Current</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Terminals */}
                {terminals.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      Terminals ({terminals.length})
                    </h4>
                    <div className="grid gap-2 max-h-60 overflow-y-auto">
                      {terminals.slice(0, 10).map((terminal) => {
                        const parentDepartment = organizationHierarchy.find(org => org.id === terminal.parentId);
                        return (
                          <div key={terminal.id} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                              <MapPin className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{terminal.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {parentDepartment?.name} • {terminal.code}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {terminal.address?.city && (
                                <Badge variant="default">{terminal.address.city}, {terminal.address.state}</Badge>
                              )}
                              {currentOrganization?.id === terminal.id && (
                                <Badge variant="status" status="active">Current</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {terminals.length > 10 && (
                        <div className="text-center py-3 text-sm text-gray-500 dark:text-gray-400">
                          ... and {terminals.length - 10} more terminals
                        </div>
                      )}
                    </div>
                  </div>
                )}                {/* Link to full organization management */}
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Need to manage organizational structure? All organization management features are available in this Settings panel under the Organization tab.
                  </p>
                </div>
              </Card.Content>
            </Card>

            {/* Organization Settings */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Organization Settings
                </Card.Title>
                <Card.Description>
                  Configure organization-wide preferences and policies
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={organizationData.name}
                    onChange={(e) => setOrganizationData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Time Zone
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    value={organizationData.timezone}
                    onChange={(e) => setOrganizationData(prev => ({ ...prev, timezone: e.target.value }))}
                    title="Select time zone"
                  >
                    <option value="America/Los_Angeles">UTC-8 (Pacific Time)</option>
                    <option value="America/Denver">UTC-7 (Mountain Time)</option>
                    <option value="America/Chicago">UTC-6 (Central Time)</option>
                    <option value="America/New_York">UTC-5 (Eastern Time)</option>
                  </select>                </div>
                
                {/* Save button and feedback */}
                <div className="space-y-2">
                  <Button 
                    variant="primary" 
                    onClick={handleSaveOrganizationSettings}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Update Organization Settings'}
                  </Button>
                  {saveMessage && (
                    <p className={`text-sm ${saveMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                      {saveMessage}
                    </p>
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </Card.Title>
                <Card.Description>
                  Control how and when you receive notifications
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">                {[
                  { id: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                  { id: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                  { id: 'sms', label: 'SMS Notifications', description: 'Text message alerts for critical updates' },
                ].map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{notification.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{notification.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationPreferences[notification.id as keyof typeof notificationPreferences]}
                      onChange={(e) => setNotificationPreferences(prev => ({ 
                        ...prev, 
                        [notification.id]: e.target.checked 
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      aria-label={`Enable ${notification.label}`}
                    />
                  </div>
                ))}
                
                {/* Save button and feedback */}
                <div className="space-y-2">
                  <Button 
                    variant="primary" 
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                  {saveMessage && (
                    <p className={`text-sm ${saveMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                      {saveMessage}
                    </p>
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </Card.Title>
                <Card.Description>
                  Manage your account security and access controls
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    API Key
                  </label>
                  <div className="flex gap-2">                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value="sk-1234567890abcdef"
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      aria-label="API Key (read-only)"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline">Enable Two-Factor Authentication</Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </Card.Title>
                <Card.Description>
                  Import, export, and manage your application data
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="flex gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import Data
                  </Button>
                </div>                <div className="space-y-2">
                  <Button variant="outline" onClick={handleExportUserPreferences}>
                    Export User Preferences
                  </Button>
                  <label className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--theme-neutral)]/30 rounded-lg cursor-pointer hover:bg-[var(--theme-background)] transition-colors">
                    Import User Preferences
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportUserPreferences}
                      className="hidden"
                    />
                  </label>
                </div>
              </Card.Content>
            </Card>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  System Information
                </Card.Title>
                <Card.Description>
                  Application version and system details
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Version</p>
                    <p className="font-medium">2.1.0</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Build</p>
                    <p className="font-medium">build-2024-01-15</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Environment</p>
                    <Badge variant="status" status="success">Production</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                    <p className="font-medium">Jan 15, 2024</p>
                  </div>
                </div>
                <Button variant="outline">Check for Updates</Button>
              </Card.Content>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Settings</h1>
          <p className="mt-2 text-[var(--color-neutral)]">
            Manage your application preferences and configuration
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs Navigation */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20'
                        : 'text-[var(--color-neutral)] hover:bg-[var(--color-neutral)]/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>          {/* Tab Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>        {/* Logout Section */}
        <div className="mt-12 pt-8 border-t border-[var(--color-neutral)]/10">
          <Card className="bg-red-50 border-red-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <Card.Content className="py-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <LogOut className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-semibold text-red-900">
                      Sign Out
                    </h3>
                  </div>
                  <p className="text-red-700 text-base leading-relaxed">
                    Sign out of your account and end your current session. You&apos;ll need to log in again to access the application.
                  </p>
                </div><Button 
                  variant="danger" 
                  onClick={() => logout()}
                  className="w-full sm:w-auto min-w-[140px] bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 text-base flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md focus:shadow-lg"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
