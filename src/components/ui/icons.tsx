import type { SVGProps } from 'react';

/**
 * Set ikon garis (stroke) ringan untuk Gerai Jasa — konsisten, bukan emoji.
 * Semua memakai stroke `currentColor` sehingga warna ikut teks.
 */
function Base({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      {children}
    </svg>
  );
}

export const Icons = {
  dashboard: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z" /></Base>
  ),
  store: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="M4 9V5h16v4M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" /></Base>
  ),
  calendar: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /></Base>
  ),
  category: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></Base>
  ),
  users: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM22 19v-1a4 4 0 0 0-3-3.87M16 4.13A4 4 0 0 1 16 11.5" /></Base>
  ),
  bell: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 21a2 2 0 0 0 4 0" /></Base>
  ),
  clock: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" /></Base>
  ),
  star: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9L12 3Z" /></Base>
  ),
  wallet: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2M3 7v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-3m0-4v4m0-4h-4a2 2 0 0 0 0 4h4" /></Base>
  ),
  menu: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="M4 6h16M4 12h16M4 18h16" /></Base>
  ),
  close: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="M6 6l12 12M18 6 6 18" /></Base>
  ),
  logout: (p: SVGProps<SVGSVGElement>) => (
    <Base {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></Base>
  ),
};

export type IconName = keyof typeof Icons;
