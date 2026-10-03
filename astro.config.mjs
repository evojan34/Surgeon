import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://evojan34.github.io',
  base: '/Surgeon',
  integrations: [
    starlight({
      title: 'Board Surgery Suite | Bailey & Love 28th',
      defaultLocale: 'ar',
      locales: {
        ar: {
          label: 'العربية',
          dir: 'rtl',
        },
      },
      sidebar: [
        {
          label: 'الجناح السريري',
          items: [
            { label: 'الصفحة الرئيسية والمنهج', link: '/' },
          ],
        },
        {
          label: 'Hepatobiliary & Pancreas',
          items: [
            { label: 'Ch 60: Gallbladder & CVS Criteria', link: '/hpb/acute-cholecystitis/' },
          ],
        },
      ],
    }),
    react(),
  ],
});
