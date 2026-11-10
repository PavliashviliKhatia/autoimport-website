import Contact from "@/components/Contact";

export const metadata = { alternates: { canonical: "/contact" }, title: "Contact", description: "Call, WhatsApp, e-mail or visit AUTOUSAKHATIA." };

export default function ContactPage() {
  return <main style={{ paddingTop: 30 }}><Contact /></main>;
}
