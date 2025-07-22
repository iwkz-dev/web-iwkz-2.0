'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
} from 'react-icons/fa';

const contactItems = [
    {
        icon: <FaEnvelope className="mx-auto md:mx-0 text-2xl mb-1" />,
        title: 'Email',
        description: 'Reach out to us anytime for inquiries or support.',
        linkText: 'info@iwkzev-berlin.org',
        linkHref: 'mailto:info@iwkzev-berlin.org',
    },
    {
        icon: <FaPhoneAlt className="mx-auto md:mx-0 text-2xl mb-1" />,
        title: 'Phone',
        description: 'Call us for immediate assistance or questions.',
        linkText: '+49 30 12345678',
        linkHref: 'tel:+493012345678',
    },
    {
        icon: <FaMapMarkerAlt className="mx-auto md:mx-0 text-2xl mb-1" />,
        title: 'Office',
        description: 'Visit us at our welcoming community center.',
        linkText: '123 Sample St, Berlin, Germany',
        linkHref: 'https://maps.google.com',
    },
];


export default function ContactFooter() {

    return (
        <section className="bg-purple-50 px-6 py-20 font-questrial flex flex-col items-center">
            <div className="max-w-6xl mx-auto text-center space-y-4 mb-12">
                <h2 className="text-4xl">Get in Touch</h2>
                <p className="text-gray-600">We’d love to hear from you!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full text-center md:text-left mb-16">
                {contactItems.map((item, index) => (
                    <div key={index} className="space-y-2 flex flex-col items-center">
                        {item.icon}
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-600 text-center">{item.description}</p>
                        <Link
                            href={item.linkHref}
                            target={item.linkHref.startsWith('http') ? '_blank' : undefined}
                            className="text-sm text-blue-600 underline"
                        >
                            {item.linkText}
                        </Link>
                    </div>
                ))}
            </div>


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
                    <Link href="#">About Us</Link>
                    <Link href="#">News</Link>
                    <Link href="#">Our Services</Link>
                    <Link href="#">Upcoming Events</Link>
                </nav>

                <div className="text-sm text-gray-500">
                    © 2025 IWKZ e.V. All rights reserved.
                </div>
            </footer>
        </section>
    );
}
