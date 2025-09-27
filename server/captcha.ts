import { randomInt } from 'crypto';

export interface CaptchaResult {
  code: string;
  image: Buffer;
}

// Simple SVG-based captcha as fallback
function generateSVGCaptcha(code: string): string {
  const width = 160;
  const height = 40;
  
  // Generate random colors and positions
  const colors = ['#2563eb', '#dc2626', '#059669', '#7c3aed', '#ea580c'];
  const bgColor = '#f3f4f6';
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="100%" height="100%" fill="${bgColor}"/>`;
  
  // Add noise lines
  for (let i = 0; i < 3; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    const color = colors[Math.floor(Math.random() * colors.length)];
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" opacity="0.3"/>`;
  }
  
  // Add text
  for (let i = 0; i < code.length; i++) {
    const x = 15 + i * 22;
    const y = 25;
    const rotation = (Math.random() - 0.5) * 20; // Random rotation
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    svg += `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${color}" transform="rotate(${rotation} ${x} ${y})">${code[i]}</text>`;
  }
  
  svg += '</svg>';
  return svg;
}

export function generateCaptcha(): CaptchaResult {
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    // Try to use canvas if available
    const { createCanvas } = require('canvas');
    
    // Create canvas
    const width = 160;
    const height = 40;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `hsl(${randomInt(360)}, 50%, 70%)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(randomInt(width), randomInt(height));
      ctx.lineTo(randomInt(width), randomInt(height));
      ctx.stroke();
    }

    // Add noise dots
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `hsl(${randomInt(360)}, 50%, 60%)`;
      ctx.beginPath();
      ctx.arc(randomInt(width), randomInt(height), 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw text
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw each digit with slight rotation and color variation
    for (let i = 0; i < code.length; i++) {
      const x = 20 + i * 25;
      const y = height / 2;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.3); // Random rotation
      ctx.fillStyle = `hsl(${randomInt(360)}, 70%, 30%)`;
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }

    // Convert to buffer
    const buffer = canvas.toBuffer('image/png');

    return {
      code,
      image: buffer
    };
  } catch (error) {
    console.warn('Canvas not available, using SVG fallback:', error.message);
    
    // Fallback to SVG
    const svgString = generateSVGCaptcha(code);
    const buffer = Buffer.from(svgString, 'utf-8');

    return {
      code,
      image: buffer
    };
  }
}
