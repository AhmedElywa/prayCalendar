import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { classNames } from 'utils';

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
        <MenuButton className="rounded-md p-2 hover:bg-gray-500/50">
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
        <MenuItems className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-700">
          <div className="py-1">
            {themes.map((item) => (
              <MenuItem key={item.name}>
                {({ focus }) => (
                  <a
                    onClick={() => setTheme(item.name)}
                    className={classNames(
                      focus ? 'bg-gray-100/50 dark:bg-gray-100/10' : '',
                      theme === item.name ? 'text-sky-400' : 'text-gray-800 dark:text-gray-50',
                      'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm',
                    )}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    <span>{item.name}</span>
                  </a>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default ThemeMenu;
