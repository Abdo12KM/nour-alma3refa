export default function LettersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6">
      {children}
    </div>
  );
}
