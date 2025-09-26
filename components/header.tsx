import Image from "next/image";
import Link from "next/link";
import NavItems from "@/components/nav-items";
import UserDropdown from "@/components/user-dropdown";

const Header = () => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="Signalist"
            width={140}
            height={32}
            className="cursor-pointer h-8 w-auto"
          />
        </Link>
        <nav className="hidden sm:block">
          <NavItems />
        </nav>
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;
