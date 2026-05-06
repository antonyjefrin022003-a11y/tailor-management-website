
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-tailor-700">404</h1>
        <p className="text-xl text-gray-600 mt-4 mb-8">Oops! The page you are looking for does not exist.</p>
        <Button asChild>
          <Link to="/" className="inline-flex items-center">
            <Home className="mr-2 h-4 w-4" /> Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
