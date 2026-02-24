import { Link } from "react-router-dom";
import { AudioLines, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
              <AudioLines className="h-5 w-5 text-primary" />
              ORATORS CLUB
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cultivating eloquence, critical thinking, and leadership through the art of public speaking. The premier voice of MJCET.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/events" className="hover:text-primary transition-colors">Upcoming Events</Link></li>
              <li><Link to="/podcasts" className="hover:text-primary transition-colors">Podcasts</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link to="/team" className="hover:text-primary transition-colors">Our Team</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/join" className="hover:text-primary transition-colors">Membership</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3 mb-4">
              <a
                href="https://www.instagram.com/oratorsclubmjcet?igsh=cGtnYzFjamlteDY2"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/orators-club-mjcet/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
            <a href="mailto:orators@mjcet.ac.in" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
              orators@mjcet.ac.in
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2024 MJCET Department of English. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
