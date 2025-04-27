import { getAbsoluteUrl } from '@/utils/url';

export const metadata = {
  title: 'Guardian Solana Shield',
  description: 'Secure your Solana transactions with Guardian Shield',
  openGraph: {
    title: 'Guardian Solana Shield',
    description: 'Secure your Solana transactions with Guardian Shield',
    images: [
      {
        url: getAbsoluteUrl('/og-image.png'), // Path to your OG image in the public folder
        width: 1200,
        height: 630,
        alt: 'Guardian Solana Shield',
      },
    ],
    siteName: 'Guardian Solana Shield',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guardian Solana Shield',
    description: 'Secure your Solana transactions with Guardian Shield',
    images: ['/og-image.png'],
    creator: '@yourtwitterhandle',
  },
};

// ... existing code ...