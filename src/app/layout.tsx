import Providers from "./providers";

export const metadata = {
  title: "Rick and Morty App",
  description: "Rick and Morty GraphQL App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
