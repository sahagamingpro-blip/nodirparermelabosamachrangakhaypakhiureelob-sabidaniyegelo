import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      {/* Floating Card */}
      <Card className="max-w-lg w-full shadow-2xl rounded-xl border border-gray-200 overflow-hidden animate-fade-in">
        <CardContent className="text-center py-12 px-6">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-500 animate-bounce" />
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white-900 mb-4">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-white-700 mb-6">
            Oops! Page Not Found
          </h2>

          {/* Description */}
          <p className="text-yellow-600 mb-8">
            It looks like the page you’re looking for doesn’t exist. 
            Maybe go back to the homepage?
          </p>

          {/* CTA Button */}
          <Link href="/">
            <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-all font-medium text-lg">
              Go Home
            </button>
          </Link>
        </CardContent>
      </Card>

      {/* Optional Footer */}
      <p className="mt-6 text-gray-500 text-sm">
        If you think this is a mistake, contact support.
      </p>
    </div>
  );
}
