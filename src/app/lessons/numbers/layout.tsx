export default function NumbersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center p-6">
      {children}
    </div>
  );
}
