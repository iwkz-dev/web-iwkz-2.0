'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getTranslations } from '@/lib/translations';
import Header from '@/components/header/header';
import ContactFooter from '@/components/contactFooter/contactFooter';
import LoadingPage from '@/components/loadingPage/loadingPage';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function JadwalShalatPage() {
    const params = useParams();
    const locale = (params.locale as string) || 'id';

    if (locale !== 'id') {
        notFound();
    }

    const t = getTranslations(locale);

    const [month, setMonth] = useState<string>(new Date().getMonth() + 1 + '');
    const [year, setYear] = useState<string>(new Date().getFullYear() + '');
    const [loading, setLoading] = useState(false);

    const { data: globalContent, error } = useSWR(
        `/api/global?locale=${locale}`,
        fetcher
    );

    if (error) return <div>Failed to load</div>;
    if (!globalContent) return <LoadingPage />;

    const navbarContent = globalContent.data?.navbar;
    const footerContent = globalContent.data?.footer;

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 + i);
    const months = [
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/generate-jadwal-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ month, year }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jadwal-shalat-${month}-${year}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert(t.jadwalShalatPage.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header headerContent={navbarContent} />

            <main className="flex-grow pt-32 pb-16 px-4  flex flex-col items-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gray-800">{t.jadwalShalatPage.title}</h1>
                        <p className="text-gray-500">{t.jadwalShalatPage.description}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">{t.jadwalShalatPage.month}</label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            >
                                {months.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label} ({m.value})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">{t.jadwalShalatPage.year}</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            >
                                {years.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-xl text-white font-medium shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] 
                ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t.jadwalShalatPage.loading}
                                </span>
                            ) : (
                                t.jadwalShalatPage.generate
                            )}
                        </button>

                        {process.env.NEXT_PUBLIC_JADWAL_SHALAT_RAMADAN_URL && (
                            <>
                                <div className="relative flex py-2 items-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                <a
                                    href={process.env.NEXT_PUBLIC_JADWAL_SHALAT_RAMADAN_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full block text-center py-3 px-4 rounded-xl text-teal-700 bg-teal-50 border border-teal-200 font-medium hover:bg-teal-100 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {t.jadwalShalatPage.downloadRamadan}
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <ContactFooter contactFooterContent={footerContent} />
        </div>
    );
}
