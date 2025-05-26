import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-800">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Not Found</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Could not find the requested resource.</p>
        <Link href="/" className="mt-6 inline-block rounded-md bg-sky-400 px-4 py-2 text-white hover:bg-sky-500">
          Return Home
        </Link>
      </div>
    </div>
  );
}
