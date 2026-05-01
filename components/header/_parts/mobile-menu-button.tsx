import { FiMenu, FiX } from 'react-icons/fi';

interface IMobileMenuButtonProps {
  menuOpen: boolean;
  isLight: boolean;
  onToggle: () => void;
}

export default function MobileMenuButton({
  menuOpen,
  isLight,
  onToggle,
}: IMobileMenuButtonProps) {
  return (
    <button
      className={`md:hidden p-2 rounded-md transition-colors duration-150 ${
        isLight
          ? 'hover:bg-gray-100 text-gray-800'
          : 'hover:bg-white/10 text-white'
      }`}
      onClick={onToggle}
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
    >
      {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
    </button>
  );
}
