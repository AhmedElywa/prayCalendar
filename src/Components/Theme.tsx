import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
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

  const dark = theme === 'Dark' || (theme === 'System' && systemTheme === 'Dark');

  useEffect(() => {
    switch (theme) {
      case 'System':
        localStorage.removeItem('theme');
        break;
      default:
        localStorage.setItem('theme', theme);
    }

    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, systemTheme, dark]);

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
        <MenuButton className="flex h-8 w-8 items-center justify-center rounded-md text-gray-700 transition hover:bg-gray-100 hover:text-sky-500 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-sky-400">
          {dark ? (
            <MoonIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <SunIcon className="h-5 w-5" aria-hidden="true" />
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
        <MenuItems className="origin-top-end ring-opacity-5 absolute end-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black focus:outline-none dark:bg-zinc-800 dark:ring-zinc-700">
          {themes.map((item) => (
            <MenuItem key={item.name}>
              {({ active }) => (
                <button
                  onClick={() => setTheme(item.name)}
                  className={classNames(
                    active ? 'bg-gray-100 dark:bg-zinc-700' : '',
                    theme === item.name ? 'text-sky-500 dark:text-sky-400' : 'text-gray-700 dark:text-gray-200',
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
