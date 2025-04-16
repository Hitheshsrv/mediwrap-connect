import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, User, ShoppingCart, Moon, Sun, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    toast({
      title: isDarkMode ? "Light mode activated" : "Dark mode activated",
      duration: 2000,
    });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Navigation items based on user role
  const navigationItems = [
    {
      to: "/consultation",
      label: "Consultation",
      show: true, // Always show
    },
    {
      to: "/pharmacy",
      label: "Pharmacy",
      show: true, // Always show
    },
    {
      to: "/blood-donation",
      label: "Blood Donation",
      show: true, // Always show
    },
    {
      to: "/community",
      label: "Community",
      show: true, // Always show
    },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-mediwrap-blue dark:text-mediwrap-blue-light font-bold text-2xl">Medi</span>
              <span className="text-mediwrap-green dark:text-mediwrap-green-light font-bold text-2xl">Wrap</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) =>
              item.show && (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.to
                      ? 'text-mediwrap-blue dark:text-mediwrap-blue-light'
                      : 'text-gray-700 dark:text-gray-300 hover:text-mediwrap-blue dark:hover:text-mediwrap-blue-light'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-300">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-700 dark:text-gray-300">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-mediwrap-red rounded-full">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to={user?.role === 'doctor' ? '/doctor' : '/profile'}>
                <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="default" className="bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/doctor-registration" className="text-sm text-gray-600 hover:text-mediwrap-blue">
                  For Doctors
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-300">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-700 dark:text-gray-300">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-mediwrap-red rounded-full">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-gray-700 dark:text-gray-300">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-card shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) =>
              item.show && (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.to
                      ? 'text-mediwrap-blue dark:text-mediwrap-blue-light bg-gray-50 dark:bg-gray-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            {!isAuthenticated && (
              <Link
                to="/doctor-registration"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>For Doctors</span>
                </div>
              </Link>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-mediwrap-blue dark:text-mediwrap-blue-light"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to={user?.role === 'doctor' ? '/doctor' : '/profile'}
                className="block px-3 py-2 rounded-md text-base font-medium text-mediwrap-blue dark:text-mediwrap-blue-light"
                onClick={() => setIsOpen(false)}
              >
                My Profile
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
