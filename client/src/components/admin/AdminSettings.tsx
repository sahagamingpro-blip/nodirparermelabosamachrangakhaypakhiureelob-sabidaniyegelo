import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Settings, Upload, Image } from 'lucide-react';

interface WebsiteSettings {
  usdt_address: string;
  usdt_qr_code_path: string;
  game_price_inr: string;
  usdt_rate_inr: string;
}

export default function AdminSettings() {
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/settings', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      return response.json() as Promise<WebsiteSettings>;
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      alert('Settings updated successfully!');
      setQrFile(null);
      setPreviewUrl('');
    },
    onError: (error: Error) => {
      alert(`Error updating settings: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    // Add QR file if selected
    if (qrFile) {
      formData.append('qr_code', qrFile);
    }
    
    console.log('🔧 Submitting settings:', {
      usdt_address: formData.get('usdt_address'),
      game_price_inr: formData.get('game_price_inr'),
      usdt_rate_inr: formData.get('usdt_rate_inr'),
      hasQrFile: !!qrFile
    });
    
    updateSettingsMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Website Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="usdt_address">USDT TRC20 Address</Label>
              <Input
                id="usdt_address"
                name="usdt_address"
                defaultValue={settings?.usdt_address || ''}
                placeholder="Enter USDT TRC20 wallet address"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                This address will be shown to customers for payment
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="game_price_inr">Game Price (INR)</Label>
                <Input
                  id="game_price_inr"
                  name="game_price_inr"
                  type="number"
                  defaultValue={settings?.game_price_inr || '130000'}
                  placeholder="130000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="usdt_rate_inr">USDT Rate (INR)</Label>
                <Input
                  id="usdt_rate_inr"
                  name="usdt_rate_inr"
                  type="number"
                  step="0.01"
                  defaultValue={settings?.usdt_rate_inr || '89'}
                  placeholder="89.00"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  1 USDT = X INR
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Settings */}
        <Card>
          <CardHeader>
            <CardTitle>USDT QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="qr_code">Upload New QR Code</Label>
              <Input
                id="qr_code"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/80"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload PNG, JPG, or JPEG. File will be saved as 'usdt_qr.png'
              </p>
            </div>

            {/* Current QR Code Preview */}
            <div className="grid grid-cols-2 gap-4">
              {settings?.usdt_qr_code_path && (
                <div>
                  <Label>Current QR Code</Label>
                  <div className="border rounded-md p-2 bg-gray-50">
                    <img
                      src={settings.usdt_qr_code_path}
                      alt="Current USDT QR Code"
                      className="w-32 h-32 object-contain mx-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/placeholder-qr.png';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* New QR Code Preview */}
              {previewUrl && (
                <div>
                  <Label>New QR Code Preview</Label>
                  <div className="border rounded-md p-2 bg-gray-50">
                    <img
                      src={previewUrl}
                      alt="New USDT QR Code"
                      className="w-32 h-32 object-contain mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="min-w-32"
          >
            {updateSettingsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}