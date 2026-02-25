import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

const navLinks = [
{ label: "Home", path: "/" },
{ label: "About", path: "/about" },
{ label: "Events", path: "/events" },
{ label: "Podcasts", path: "/podcasts" },
{ label: "Gallery", path: "/gallery" },
{ label: "Team", path: "/team" },
{ label: "Contact", path: "/contact" }];


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [isLight, setIsLight] = useState(document.documentElement.classList.contains('light'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <img
            src={isLight ? logoLight : logoDark}
            alt="Orators' Club Logo"
            className="h-12 w-auto" />

          <span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === link.path ? "text-primary" : "text-muted-foreground"}`
              }>

              {link.label}
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link to="/join">Join Now</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open &&
      <div className="md:hidden bg-background border-b border-border">
          <div className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) =>
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
            location.pathname === link.path ? "text-primary" : "text-muted-foreground"}`
            }
            onClick={() => setOpen(false)}>

                {link.label}
              </Link>
          )}
            <Button asChild size="sm" className="w-fit mt-2">
              <Link to="/join" onClick={() => setOpen(false)}>Join Now</Link>
            </Button>
          </div>
        </div>
      }
    </nav>);

};

export default Navbar;