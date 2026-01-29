import Link from "next/link";

export default function Footer() {
  const footerLinks = {
    shop: [
      { name: "Women", href: "/category/women" },
      { name: "Men", href: "/category/men" },
      { name: "Kids", href: "/category/kids" },
      { name: "Sale", href: "/sale" },
    ],
    help: [
      { name: "Contact Us", href: "/contact" },
      { name: "Shipping", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "FAQ", href: "/faq" },
    ],
    about: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Sustainability", href: "/sustainability" },
      { name: "Press", href: "/press" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Apparel Store</h3>
            <p className="text-gray-400">
              Your destination for the latest fashion trends and quality apparel.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Apparel Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
