import { DiscordLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';

export const marketingConfig = {
  header: {
    menuItem: [
      {
        id: 1,
        label: 'Features',
        href: '/features',
      },
      {
        id: 2,
        label: 'Pricing',
        href: '#',
      },
      {
        id: 3,
        label: 'Careers',
        href: '#',
      },
      {
        id: 4,
        label: 'Contact Us',
        href: '#',
      },
    ],
  },
  footer: {
    footerNavs: [
      {
        label: 'Product',
        items: [
          {
            href: '/',
            name: 'Home',
          },
          // {
          //   href: '/pricing',
          //   name: 'Pricing',
          // },
          // {
          //   href: '/faq',
          //   name: 'FAQ',
          // },
        ],
      },

      {
        label: 'Community',
        items: [
          {
            href: '/',
            name: 'Discord',
          },
          {
            href: '/',
            name: 'Twitter',
          },
          {
            href: 'mailto:hello@getorc.com',
            name: 'Email',
          },
        ],
      },
      {
        label: 'Legal',
        items: [
          {
            href: '/terms',
            name: 'Terms',
          },

          {
            href: '/privacy',
            name: 'Privacy',
          },
        ],
      },
    ],
    footerSocials: [
      {
        href: '',
        name: 'Discord',
        icon: <DiscordLogoIcon className="h-4 w-4" />,
      },
      {
        href: '',
        name: 'Twitter',
        icon: <TwitterLogoIcon className="h-4 w-4" />,
      },
    ],
  },
};
