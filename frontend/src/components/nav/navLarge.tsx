import NavProfile from './navProfile';
import NavLink from './navLink';

export default function NavLarge() {
  return (
    <nav className="items-center justify-end flex-1 hidden md:flex">
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/contact">Contact</NavLink>
      <NavProfile />
    </nav>
  );
}
