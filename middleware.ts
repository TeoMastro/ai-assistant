export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/llama2-70b', '/app/:path*', '/other/:path*', '/help/:path*']
}