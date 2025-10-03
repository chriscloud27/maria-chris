import Attire from "../../../components/Attire";
import { notFound } from "next/navigation";

export default function AttirePage({ params }: { params: { locale: string } }) {
  // basic existence check for locales could be added; for now render the page
  if (!params?.locale) return notFound();
  return (
    <div>
      <Attire />
    </div>
  );
}
