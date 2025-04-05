
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/shared/PageLayout';
import UserProfile from '@/components/Profile/UserProfile';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    bio: ''
  });
  const [tempProfile, setTempProfile] = useState({
    name: '',
    bio: ''
  });

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setUserProfile(parsedProfile);
      setTempProfile(parsedProfile);
    }
  }, []);

  const handleSaveProfile = () => {
    // Basic validation
    if (!tempProfile.name.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    // Update the profile
    setUserProfile({...tempProfile});
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(tempProfile));
    
    // Update the userData name as well (used on the dashboard)
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      parsedData.name = tempProfile.name;
      localStorage.setItem('userData', JSON.stringify(parsedData));
    } else {
      // Create userData if it doesn't exist
      localStorage.setItem('userData', JSON.stringify({
        name: tempProfile.name,
        calorieGoal: 2000,
        proteinGoal: 25,
        carbsGoal: 45,
        fatGoal: 30,
      }));
    }
    
    // Exit edit mode
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved"
    });
  };

  const handleCancel = () => {
    // Reset temporary profile to current profile values
    setTempProfile({...userProfile});
    setIsEditing(false);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Personal Information</span>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={tempProfile.name} 
                      onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})} 
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={tempProfile.bio} 
                      onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})} 
                      placeholder="Share a little about yourself" 
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                    <p className="text-lg">{userProfile.name || 'Not set'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                    <p className="text-base whitespace-pre-wrap">{userProfile.bio || 'No bio provided'}</p>
                  </div>
                </div>
              )}
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            )}
          </Card>
          
          <UserProfile />
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
