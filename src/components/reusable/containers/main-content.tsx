export default function MainContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex h-full flex-col items-center justify-evenly">
      {children}
    </main>
  )
}
