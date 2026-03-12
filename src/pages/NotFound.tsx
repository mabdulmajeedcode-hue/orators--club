import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="container max-w-lg text-center py-20">
        <h1 className="font-display text-8xl md:text-9xl font-bold gradient-text mb-4">404</h1>
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/"><Home className="h-4 w-4 mr-2" /> Back to Home</Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
