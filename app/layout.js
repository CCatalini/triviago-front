import './globals.css'

export const metadata = {
  title: 'Triviago',
  description: 'Plataforma de quizzes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

