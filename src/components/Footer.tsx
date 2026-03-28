export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t p-4">
      <p className="text-center">
        &copy; {year} HarshitRV. All rights reserved.
      </p>
    </footer>
  )
}
