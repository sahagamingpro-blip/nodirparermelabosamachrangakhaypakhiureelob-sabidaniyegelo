import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import jili_1 from '@assets/api_providers_logo/1.png';
import jdb_2 from '@assets/api_providers_logo/2.png';
import spribe_3 from '@assets/api_providers_logo/3.png';
import evo_4 from '@assets/api_providers_logo/4.png';
import ag_5 from '@assets/api_providers_logo/5.png';
import mg_6 from '@assets/api_providers_logo/6.png';
import pg_7 from '@assets/api_providers_logo/7.png';
import _365_8 from '@assets/api_providers_logo/8.png';
import tb_9 from '@assets/api_providers_logo/9.png';
import _9g_10 from '@assets/api_providers_logo/10.png';
import boat_11 from '@assets/api_providers_logo/11.png';
import tada from '@assets/api_providers_logo/12.png';

const logos = [
  jili_1,
  jdb_2,
  spribe_3,
  evo_4,
  ag_5,
  mg_6,
  pg_7,
  _365_8,
  tb_9,
  _9g_10,
  boat_11,
  tada,
];

export default function ApiPartners() {
  return (
    <section className="py-16 bg-background-900" data-testid="api-partners-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent">
            API Partners
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our API Partners
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our trusted API partners include leading providers such as Jili, JDB, Evo, AG, MG, PG, 365 Gaming, Spribe, 9G, TB, CQ9, and many more, delivering high-quality and reliable gaming solutions for our platform.
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
          {logos.map((logo, index) => {
            const delay = (Math.random() * 2).toFixed(2); // random delay
            const floatDelay = (Math.random() * 3).toFixed(2); // random float delay
            return (
              <Card
                key={index}
                className="relative flex items-center justify-center p-4 bg-white rounded-md shadow-lg overflow-hidden w-full h-28 animate-float hover:animate-pulse"
                style={{ animationDelay: `${floatDelay}s` }}
              >
                {/* Continuous animated overlay */}
                <div
                  className="absolute inset-0 rounded-md pointer-events-none animate-glow"
                  style={{ animationDelay: `${delay}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/30 via-purple-200/20 to-cyan-200/30 opacity-40 blur-xl animate-shimmer"></div>
                </div>

                {/* Rotating border effect */}
                <div
                  className="absolute inset-0 rounded-md pointer-events-none animate-rotate-border"
                  style={{ animationDelay: `${(index * 0.5).toFixed(2)}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent animate-spin-slow"></div>
                </div>

                <CardContent className="flex items-center justify-center p-0 relative z-10 animate-bounce-subtle">
                  <img
                    src={logo}
                    alt={`API Partner ${index + 1}`}
                    className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-110 animate-pulse-subtle"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        /* Continuous pulse glow */
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(59,130,246,0.4), 0 0 25px rgba(147,51,234,0.3), 0 0 35px rgba(6,182,212,0.2); 
            transform: scale(1); 
          }
          50% { 
            box-shadow: 0 0 25px rgba(59,130,246,0.6), 0 0 35px rgba(147,51,234,0.5), 0 0 45px rgba(6,182,212,0.4); 
            transform: scale(1.02); 
          }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        /* Enhanced shimmer effect */
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200%) translateY(200%) rotate(45deg); opacity: 0; }
        }
        .animate-shimmer {
          animation: shimmer 4s linear infinite;
        }

        /* Floating animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(-4px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Subtle bounce for images */
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }

        /* Subtle pulse for images */
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 5s ease-in-out infinite;
        }

        /* Rotating border effect */
        @keyframes rotate-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-rotate-border {
          animation: rotate-border 8s linear infinite;
        }

        /* Slow spin */
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </section>
  );
}
