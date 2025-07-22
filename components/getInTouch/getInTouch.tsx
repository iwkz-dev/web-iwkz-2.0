'use client';

import Link from 'next/link';
import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
} from 'react-icons/fa';

export default function ContactFooter() {
    return (
        <section className="bg-purple-50 px-6 py-20 font-questrial flex flex-col items-center">
            <div className="max-w-6xl mx-auto text-center space-y-4 mb-12">
                <p className="text-sm uppercase font-medium">Connect</p>
                <h2 className="text-4xl">Get in Touch</h2>
                <p className="text-gray-600">We’d love to hear from you!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full text-center md:text-left mb-16">
                <div className="space-y-2 flex flex-col items-center">
                    <FaEnvelope className="mx-auto md:mx-0 text-2xl mb-1" />
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p className="text-sm text-gray-600 ">
                        Reach out to us anytime for inquiries or support.
                    </p>
                    <Link
                        href="mailto:info@iwkzev-berlin.org"
                        className="text-sm text-blue-600 underline"
                    >
                        info@iwkzev-berlin.org
                    </Link>
                </div>

                <div className="space-y-2 flex flex-col items-center">
                    <FaPhoneAlt className="mx-auto md:mx-0 text-2xl mb-1" />
                    <h3 className="text-lg font-semibold">Phone</h3>
                    <p className="text-sm text-gray-600">
                        Call us for immediate assistance or questions.
                    </p>
                    <Link href="tel:+493012345678" className="text-sm text-blue-600 underline">
                        +49 30 12345678
                    </Link>
                </div>

                <div className="space-y-2 flex flex-col items-center">
                    <FaMapMarkerAlt className="mx-auto md:mx-0 text-2xl mb-1" />
                    <h3 className="text-lg font-semibold">Office</h3>
                    <p className="text-sm text-gray-600">
                        Visit us at our welcoming community center.
                    </p>
                    <Link
                        href="https://maps.google.com"
                        target="_blank"
                        className="text-sm text-blue-600 underline"
                    >
                        123 Sample St, Berlin, Germany
                    </Link>
                </div>
            </div>

            <footer className="border-t border-gray-200 pt-10 text-center space-y-6 w-full">
                <div className="font-logo text-2xl">Logo</div>

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
