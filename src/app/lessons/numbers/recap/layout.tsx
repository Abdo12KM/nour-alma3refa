import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مراجعة الأرقام | نور المعرفة",
  description: "مراجعة شاملة للأرقام من ١ إلى ١٠",
};

export default function RecapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
