import { notFound } from "next/navigation";

// Any unknown URL inside a language (e.g. /en/abc) shows the 404 page.
export default function CatchAll() {
  notFound();
}
