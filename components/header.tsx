import Image from "next/image";
import Link from "next/link";
import NavItems from "@/components/nav-items";
import UserDropdown from "@/components/user-dropdown";

const Header = ({ user }: { user: User }) => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt={process.env.NEXT_PUBLIC_APP_NAME as string}
            width={140}
            height={32}
            className="cursor-pointer h-8 w-auto"
          />
        </Link>
        <nav className="hidden sm:block">
          <NavItems />
        </nav>
        <UserDropdown user={user} />
      </div>
    </header>
  );
};

export default Header;
