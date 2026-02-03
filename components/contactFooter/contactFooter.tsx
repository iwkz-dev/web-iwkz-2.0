"use client";

import { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

import { IFooter } from "@/types/globalContent.types";
import FadeInOnScroll from "@/components/ui/fadeInScroll";

interface IContactFooterProps {
  contactFooterContent: IFooter;
}

export default function ContactFooter({
  contactFooterContent,
}: IContactFooterProps) {
  const { description, internal_links, social_media_links, copyright } =
    contactFooterContent;

  const iconMap: Record<string, JSX.Element> = {
    Facebook: <FaFacebook className="text-xl text-blue-600" />,
    Instagram: <FaInstagram className="text-xl text-pink-500" />,
    Youtube: <FaYoutube className="text-xl text-red-600" />,
  };

  // Helper: Parse description lines into structured blocks
  const parsedLines = description.split("\n").filter(Boolean);

  const orgName = parsedLines[0]?.replace(/\*\*/g, "") || "";
  const address = parsedLines.slice(1, 3).join(", ");
  const emailLine = parsedLines.find((line) =>
    line.toLowerCase().includes("email"),
  );
  const email = emailLine?.split(":")[1]?.trim() || "";

  return (
    <section
      id="contact"
      className="bg-purple-50 px-6 py-20 font-questrial flex flex-col items-center"
    >
      <FadeInOnScroll>
        <div className="max-w-6xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-4xl">Get in Touch</h2>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full mx-auto text-center mb-6">
          <div className="space-y-2 flex flex-col items-center">
            <FaMapMarkerAlt className="text-2xl mb-3" />
            <h3 className="text-lg font-semibold">Alamat</h3>
            <p className="text-sm text-gray-600">{orgName}</p>
            <p className="text-sm text-gray-600">{address}</p>
          </div>

          <div className="space-y-2 flex flex-col items-center">
            <FaEnvelope className="text-2xl mb-3" />
            <h3 className="text-lg font-semibold">Email</h3>
            <p className="text-sm text-gray-600">
              Untuk pertanyaan atau informasi:
            </p>
            <Link
              href={`mailto:${email}`}
              className="text-sm text-blue-600 underline"
            >
              {email}
            </Link>
          </div>

          <div className="space-y-2 flex flex-col items-center">
            <FiExternalLink className="text-2xl mb-3" />
            <h3 className="text-lg font-semibold">Sosial Media</h3>
            {social_media_links.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target={link.target || "_blank"}
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                {iconMap[link.text] || <FiExternalLink />} {link.text}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Links + Copyright */}
        <footer className="border-t border-gray-200 pt-10 text-center space-y-6 w-full">
          <div className="relative w-8 h-8 mx-auto">
            <Image
              src="/iwkz-logo.svg"
              alt="IWKZ Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 text-sm font-medium text-gray-700">
            {internal_links.map((link) => (
              <Link
                key={link.id}
                href={`/${link.url}`}
                target={link.target || "_self"}
                className="hover:underline"
              >
                {link.text}
              </Link>
            ))}
          </nav>

          <div className="text-sm text-gray-500">{copyright}</div>
        </footer>
      </FadeInOnScroll>
    </section>
  );
}
