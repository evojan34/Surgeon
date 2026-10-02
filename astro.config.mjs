import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
  // إذا كان اسم مستودعك مختلفاً عن surgical-board-suite غيّر المسار هنا
  base: '/surgical-board-suite',
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

