'use client';

export default function Footer() {
  const links = [
    { label: 'Website', href: 'https://www.atarico.dev' },
    { label: 'GitHub', href: 'https://github.com/Harsh-Nainuji' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harsh-n-58991425b/' },
    { label: 'Instagram', href: 'https://www.instagram.com/atarico.dev' },
  ];

  return (
    <footer className="border-t border-ledger-text mt-10">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <p className="font-serif text-lg md:text-xl text-ledger-text leading-relaxed mb-8">
          Developed by Harsh.
        </p>
        <p className="font-serif text-sm md:text-base text-ledger-text leading-relaxed mb-8 max-w-2xl">
          I am a freelance full-stack developer and the technical force behind Atarico. I build high-performance web applications, offline-first tools, and digital infrastructure for modern businesses. Need a custom system built with precision? Contact me below.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-ledger-text hover:text-ledger-oxblood transition-all duration-300 hover:-translate-y-0.5"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mt-8">
          Your data never leaves this browser. No tracking. No cloud. Total privacy.
        </p>
      </div>
    </footer>
  );
}
