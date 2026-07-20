"use client"
import Link from 'next/link'
import { FiInfo, FiMail, FiPhone, FiHeart, FiHome, FiPlus, FiMapPin } from 'react-icons/fi'

const quickLinks = [
  { label: "Browse Properties", href: "/properties", icon: <FiHome size={14} /> },
  { label: "Post a Property", href: "/properties/new", icon: <FiPlus size={14} /> },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface-subtle border-t border-border-light">
      <div className="h-[3px] w-full grad-threshold" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 rounded-xl grad-logo-icon flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 21V11a6 6 0 0 1 12 0v10" />
                  <path d="M4 21h16" />
                </svg>
              </div>
              <span className="font-serif text-xl font-semibold text-primary-dark tracking-tight">
                Estatio
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Finding the right address, made simple — browse, list, and connect with confidence.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-[0.2em] text-text-muted uppercase">
              Explore
            </h3>
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2.5 text-sm text-text hover:text-primary-dark transition-colors duration-150 w-fit"
                >
                  <span className="text-accent">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-[0.2em] text-text-muted uppercase">
              Get in Touch
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@estatio.com"
                className="flex items-center gap-2.5 text-sm text-text hover:text-primary-dark transition-colors duration-150 w-fit"
              >
                <FiMail size={14} className="text-accent" />
                info@estatio.com
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center gap-2.5 text-sm text-text hover:text-primary-dark transition-colors duration-150 w-fit"
              >
                <FiPhone size={14} className="text-accent" />
                +91 12345 67890
              </a>
              <div className="flex items-center gap-2.5 text-sm text-text-muted">
                <FiMapPin size={14} className="text-accent" />
                India
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="mailto:info@estatio.com"
                className="footer-icon-btn w-9 h-9 rounded-full bg-accent-subtle flex items-center justify-center hover:bg-accent transition-all duration-200 group"
              >
                <FiMail size={15} className="text-accent group-hover:text-white transition-colors duration-200" />
              </a>
              <a
                href="tel:+911234567890"
                className="footer-icon-btn w-9 h-9 rounded-full bg-accent-subtle flex items-center justify-center hover:bg-accent transition-all duration-200 group"
              >
                <FiPhone size={15} className="text-accent group-hover:text-white transition-colors duration-200" />
              </a>
            </div>
          </div >
        </div >

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-10 pt-6 border-t border-border-light" >
          <p className="text-sm text-text-muted">
            &copy; {currentYear} Estatio Real Estate. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span>Made with</span>
            <FiHeart size={13} className="text-accent" />
            <span>in India</span>
          </div>
        </div>
      </div >
    </footer >
  )
}

export default Footer