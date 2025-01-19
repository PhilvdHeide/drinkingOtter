import { useState } from 'react';
import { Button } from './ui/button';
import PropTypes from 'prop-types';
import { Moon, Sun, LogOut, Menu, Minus } from 'lucide-react';

const MobileNav = ({ user, onAvatarChange, onLogout, onRemoveLastDrink, loading, drinksCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setDarkMode(!darkMode);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full"
        variant="outline"
      >
        <Menu className="w-6 h-6" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-dark-200 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Button
              variant="outline"
              onClick={onAvatarChange}
              className="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
            >
              Switch to Panda
            </Button>
            <Button
              variant="outline"
              onClick={toggleDarkMode}
              className="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
            >
              {darkMode ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark Mode
                </>
              )}
            </Button>
            {user && (
              <>
                <Button
                  variant="outline"
                  onClick={onRemoveLastDrink}
                  disabled={loading || drinksCount === 0}
                  className="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                >
                  <Minus className="mr-2 h-4 w-4" />
                  Remove Last Drink
                </Button>
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

MobileNav.propTypes = {
  user: PropTypes.object,
  onAvatarChange: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onRemoveLastDrink: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  drinksCount: PropTypes.number.isRequired
};

export default MobileNav;
