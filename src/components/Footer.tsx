export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t p-4">
      <p className="text-center">
        &copy; {year} AceGrid. All rights reserved.
      </p>
    </footer>
  )
}
