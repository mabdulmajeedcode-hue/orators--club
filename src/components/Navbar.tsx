import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

const navLinks = [
{ label: "Home", path: "/" },
{ label: "About", path: "/about" },
{ label: "Events", path: "/events" },
{ label: "Content", path: "/podcasts" },
{ label: "Gallery", path: "/gallery" },
{ label: "Team", path: "/team" },
{ label: "Contact", path: "/contact" }];


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [isLight, setIsLight] = useState(document.documentElement.classList.contains('light'));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/85 backdrop-blur-xl border-b border-border shadow-lg shadow-background/40' : 'bg-background/40 backdrop-blur-md border-b border-transparent'}`}>
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <img
            src={logo}
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
            <a href="https://forms.gle/8CvC8bcG8fSY2t4p6" target="_blank" rel="noopener noreferrer">Join Now</a>
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
              <a href="https://forms.gle/8CvC8bcG8fSY2t4p6" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Join Now</a>
            </Button>
          </div>
        </div>
      }
    </nav>);

};

export default Navbar;