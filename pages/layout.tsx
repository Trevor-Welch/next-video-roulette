export const metadata = {
  title: "Video Roulette",
  description: "Random YouTube videos curated over the years.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
