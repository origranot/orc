'use client';

import Link from 'next/link';
import { marketingConfig } from '@orc/web/config/marketing';

const { footerNavs } = marketingConfig.footer;

export function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto w-full max-w-screen-xl xl:pb-2">
        <div className="md:flex md:justify-between px-8 p-4 py-16 sm:pb-16 gap-4">
          <div className="mb-12 flex-col flex gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="https://magicui.design/icon.png" className="h-8 w-8 text-primary" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ORC</span>
            </Link>
            <p className="max-w-xs">All-in-one platform to manage your k8s resources.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-3">
            {footerNavs.map((nav) => (
              <div key={nav.label}>
                <h2 className="mb-6 text-sm tracking-tighter font-medium text-gray-900 uppercase dark:text-white">{nav.label}</h2>
                <ul className="gap-2 grid">
                  {nav.items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="cursor-pointer text-gray-400 hover:text-gray-200 duration-200 font-[450] text-sm">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
