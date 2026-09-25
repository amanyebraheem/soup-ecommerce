import "./globals.css";
import Provider from "../app/components/Provider";
import Navbar from "../app/components/Navbar";
import Footer from "../app/components/Footer";

export const metadata = {
title: "Glowé | Skincare & Beauty",
description:
"Discover premium skincare products, creams, serums, and beauty essentials for healthy, radiant-looking skin.",
keywords: [
"skincare",
"beauty",
"face cream",
"serum",
"moisturizer",
"skin care products",
"beauty products",
],
openGraph: {
title: "Glowé | Skincare & Beauty",
description:
"Premium skincare products, creams, serums, and beauty essentials.",
type: "website",
},
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body>
<Provider>
<Navbar />
{children}
<Footer />
</Provider>
</body>
</html>
);
}