import Attire from "../../../components/Attire";
import { notFound } from "next/navigation";

export default function AttirePage({ params }: { params?: unknown }) {
  // basic existence check for locales; ensure params has a locale string
  const locale = params && typeof params === 'object' && (params as Record<string, unknown>).locale;
  if (!locale || typeof locale !== 'string') return notFound();
  return (
    <div>
      <Attire />
    </div>
  );
}
