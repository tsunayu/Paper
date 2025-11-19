"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle } from "lucide-react";
import { UserProfile } from "@/lib/types";
import { loadUserProfile, saveUserProfile } from "@/lib/localStorageService";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    affiliation: "",
    researchInterests: "",
    defaultKeywords: [],
  });
  const [keywordsInput, setKeywordsInput] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load profile from localStorage
    const loadedProfile = loadUserProfile();
    if (loadedProfile) {
      setProfile(loadedProfile);
      if (loadedProfile.defaultKeywords) {
        setKeywordsInput(loadedProfile.defaultKeywords.join(", "));
      }
    }
  }, []);

  const handleSave = () => {
    // Parse keywords from comma-separated input
    const keywords = keywordsInput
      .split(",")
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const updatedProfile: UserProfile = {
      ...profile,
      defaultKeywords: keywords,
    };

    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    setSaved(true);

    // Reset saved indicator after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              User Profile
            </h1>
            <p className="text-gray-600">
              Manage your personal information and research preferences
            </p>
          </div>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your information is stored locally in your browser only
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full"
                />
              </div>

              {/* Affiliation */}
              <div className="space-y-2">
                <label htmlFor="affiliation" className="text-sm font-medium text-gray-700">
                  Affiliation
                </label>
                <Input
                  id="affiliation"
                  type="text"
                  value={profile.affiliation || ""}
                  onChange={(e) => setProfile({ ...profile, affiliation: e.target.value })}
                  placeholder="University or organization"
                  className="w-full"
                />
              </div>

              {/* Research Interests */}
              <div className="space-y-2">
                <label htmlFor="interests" className="text-sm font-medium text-gray-700">
                  Research Interests
                </label>
                <Textarea
                  id="interests"
                  value={profile.researchInterests || ""}
                  onChange={(e) => setProfile({ ...profile, researchInterests: e.target.value })}
                  placeholder="Describe your research interests and areas of focus..."
                  className="w-full min-h-[100px]"
                />
              </div>

              {/* Default Keywords */}
              <div className="space-y-2">
                <label htmlFor="keywords" className="text-sm font-medium text-gray-700">
                  Default Search Keywords
                </label>
                <Input
                  id="keywords"
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="machine learning, computer vision, NLP (comma-separated)"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Comma-separated keywords for quick searching
                </p>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="gap-2"
                  disabled={!profile.name || !profile.email}
                >
                  <Save className="h-4 w-4" />
                  Save Profile
                </Button>

                {saved && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Profile saved!</span>
                  </div>
                )}
              </div>

              {/* Required field note */}
              <p className="text-xs text-gray-500 pt-2">
                <span className="text-red-500">*</span> Required fields
              </p>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="py-4">
              <p className="text-sm text-blue-800">
                <strong>Privacy Notice:</strong> All your data is stored locally in your
                browser&apos;s localStorage. No information is sent to any server or third party.
                Clearing your browser data will remove this information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
