import { Nav } from "@/components/Nav";

// List your supported locales here
export const supportedLocales = ["en", "de", "es"];

// This function tells Next.js to statically generate pages for each locale
export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}


interface PageProps {
  params: Promise<{ locale: string }>;
}


export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <Nav currentLocale={locale} />
      <main>
        <div className="container mx-auto px-4">
          <h1>Welcome to the Wedding Landing Page!</h1>
        </div>
      </main>
    </>
  );
}
