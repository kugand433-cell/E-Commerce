import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="mt-12 bg-nest-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <h4 className="mb-3 font-semibold">Get to Know Us</h4>
          <ul className="space-y-1.5 text-sm text-white/70">
            <li><Link to="/" className="hover:text-white">About ShopNest</Link></li>
            <li><Link to="/" className="hover:text-white">Careers</Link></li>
            <li><Link to="/" className="hover:text-white">Press</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Make Money with Us</h4>
          <ul className="space-y-1.5 text-sm text-white/70">
            <li><Link to="/register" className="hover:text-white">Sell on ShopNest</Link></li>
            <li><Link to="/" className="hover:text-white">Become an Affiliate</Link></li>
            <li><Link to="/" className="hover:text-white">Advertise</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Customer Service</h4>
          <ul className="space-y-1.5 text-sm text-white/70">
            <li><Link to="/orders" className="hover:text-white">Your Orders</Link></li>
            <li><Link to="/" className="hover:text-white">Returns & Replacements</Link></li>
            <li><Link to="/" className="hover:text-white">Help Center</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Stay Connected</h4>
          <p className="mb-3 text-sm text-white/70">Get deals & updates in your inbox.</p>
          <form className="flex overflow-hidden rounded-md">
            <input className="flex-1 bg-white px-3 py-2 text-sm text-foreground" placeholder="Email address" />
            <button className="bg-nest-orange px-4 text-sm font-semibold text-nest-navy">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} ShopNest. Built as an internship project.
      </div>
    </footer>
  );
}
