"use client";

import Image from 'next/image'

export default function Logo({ transparent = false }: { transparent?: boolean }) {
  return (
    <div className="flex items-center">
      <div className="mr-2">
        <Image
          src={transparent ? '/images/autonobee-logo-transparent.png' : '/images/autonobee-logo.png'}
          alt="AutonoBee Logo"
          width={40}
          height={40}
          priority
          className="object-contain"
        />
      </div>
      <div className="font-display text-2xl text-primary tracking-wider">
        AutonoBee
      </div>
    </div>
  );
} 