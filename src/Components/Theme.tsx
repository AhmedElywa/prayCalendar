import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { classNames } from '../utils';

type Theme = 'Dark' | 'Light' | 'System';

const ThemeMenu: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('System');
  const [systemTheme, setSystemTheme] = useState<Theme>();

  useEffect(() => {
    if (localStorage.getItem('theme')) {
      setTheme(localStorage.getItem('theme') as Theme);
    } else {
      setTheme('System');
    }
  }, []);

  useEffect(() => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setSystemTheme(systemDark ? 'Dark' : 'Light');
  }, []);

  const isLight = theme === 'Light' || (theme === 'System' && systemTheme === 'Light');

  useEffect(() => {
    switch (theme) {
      case 'System':
        localStorage.removeItem('theme');
        break;
      default:
        localStorage.setItem('theme', theme);
    }

    if (isLight) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme, isLight]);

  const themes: { name: Theme; icon: typeof ComputerDesktopIcon }[] = [
    {
      name: 'Dark',
      icon: MoonIcon,
    },
    {
      name: 'Light',
      icon: SunIcon,
    },
    {
      name: 'System',
      icon: ComputerDesktopIcon,
    },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition hover:bg-bg-elevated hover:text-gold focus:outline-none">
          {isLight ? (
            <SunIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <MoonIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute end-0 z-10 mt-2 w-48 origin-top-end rounded-[var(--radius-md)] border border-border-subtle bg-bg-card py-1 shadow-lg focus:outline-none">
          {themes.map((item) => (
            <MenuItem key={item.name}>
              {({ active }) => (
                <button
                  onClick={() => setTheme(item.name)}
                  className={classNames(
                    active ? 'bg-bg-elevated' : '',
                    theme === item.name ? 'text-gold' : 'text-text-secondary',
                    'flex w-full items-center gap-3 px-4 py-2 text-left text-sm',
                  )}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.name}</span>
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default ThemeMenu;
