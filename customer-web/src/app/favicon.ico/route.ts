const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#1c1917"/><path d="M45 20a18 18 0 1 0 0 24l-7-7a8 8 0 1 1 0-10z" fill="#f59e0b"/></svg>`;

export function GET() {
  return new Response(icon, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
