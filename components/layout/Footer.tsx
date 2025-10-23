'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { siteConfigAPI } from '@/lib/api';

interface SocialLinks {
  github_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  email?: string | null;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await siteConfigAPI.get();
      setSocialLinks({
        github_url: response.data.github_url,
        linkedin_url: response.data.linkedin_url,
        twitter_url: response.data.twitter_url,
        email: response.data.email,
      });
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 mt-20 transition-colors duration-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-4">Portfolio Othmane Chaikhi</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              Ingénieur en Informatique et Réseaux. Portfolio et blog personnel construit avec Next.js et Django REST Framework.
            </p>
            <div className="flex space-x-4">
              {socialLinks.github_url && (
                <a href={socialLinks.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="GitHub">
                  <FiGithub size={20} />
                </a>
              )}
              {socialLinks.linkedin_url && (
                <a href={socialLinks.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="LinkedIn">
                  <FiLinkedin size={20} />
                </a>
              )}
              {socialLinks.twitter_url && (
                <a href={socialLinks.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="Twitter">
                  <FiTwitter size={20} />
                </a>
              )}
              {socialLinks.email && (
                <a href={`mailto:${socialLinks.email}`} className="hover:text-white transition" aria-label="Email">
                  <FiMail size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

