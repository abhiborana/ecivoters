import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="w-full p-2 border-b">
      <Link href={"/"} className="flex items-center gap-2">
        <Image src={"/logo.svg"} alt="ECI Voters" width={40} height={40} />
        <span className="font-bold text-lg">ECI Voters Finder</span>
      </Link>
    </header>
  );
};

export default Navbar;
