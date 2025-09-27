import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { RefreshCw, Shield } from 'lucide-react';

interface CaptchaProps {
  onCaptchaChange: (sessionId: string, code: string) => void;
  error?: string;
}

export function Captcha({ onCaptchaChange, error }: CaptchaProps) {
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [userCode, setUserCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const loadCaptcha = async () => {
    setLoading(true);
    try {
      console.log('Loading captcha...');
      const response = await fetch('/api/captcha', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Captcha response status:', response.status);
      console.log('Captcha response headers:', response.headers.get('content-type'));
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Captcha data received:', { 
            sessionId: data.sessionId, 
            hasImage: !!data.image,
            imageStart: data.image ? data.image.substring(0, 50) + '...' : 'no image'
          });
          setCaptchaImage(data.image);
          setSessionId(data.sessionId);
          setUserCode('');
        } else {
          const text = await response.text();
          console.error('Expected JSON but got:', contentType, text.substring(0, 200));
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to load captcha:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error loading captcha:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  useEffect(() => {
    onCaptchaChange(sessionId, userCode);
  }, [sessionId, userCode, onCaptchaChange]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
    setUserCode(value);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="captcha">Security Verification *</Label>
      
      {/* Captcha Image - Full Width */}
      <div className="w-full">
        <div className="relative w-full">
          {captchaImage ? (
            <img 
              src={captchaImage} 
              alt="Captcha" 
              className="w-full border rounded-md bg-white"
              style={{ height: '60px', objectFit: 'contain' }}
              onError={(e) => {
                console.error('Captcha image failed to load');
                console.error('Image src:', e.currentTarget.src);
                console.error('Image src length:', e.currentTarget.src.length);
                console.error('Image src start:', e.currentTarget.src.substring(0, 100));
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div 
            className={`w-full border rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-sm ${captchaImage ? 'hidden' : ''}`}
            style={{ height: '60px' }}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                <span>Loading Captcha...</span>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-sm">Captcha Failed to Load</div>
                <div className="text-xs text-gray-400">Click refresh to try again</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Refresh Button - Full Width */}
      <Button
        type="button"
        variant="outline"
        onClick={loadCaptcha}
        disabled={loading}
        className="w-full"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''} mr-2`} />
        {loading ? 'Loading...' : 'Refresh Captcha'}
      </Button>
      
      {/* Input Field - Full Width */}
      <div className="space-y-2">
        <Input
          id="captcha"
          type="text"
          placeholder="Enter 6-digit code"
          value={userCode}
          onChange={handleCodeChange}
          maxLength={6}
          className="w-full text-center text-lg tracking-widest font-mono"
          data-testid="input-captcha"
        />
        <p className="text-xs text-muted-foreground text-center">
          Enter the 6-digit code shown in the image above
        </p>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
