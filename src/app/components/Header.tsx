"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href ? "text-sky-500" : "text-[#001f3f]";
  };

  return (
    <header className="h-[82px] px-6 p-1 bg-white fixed w-full z-50  rounded-bl-lg rounded-br-lg shadow-md">
      <div className="flex items-center space-x-4 w-full justify-between text-end">
        <div className="flex space-x-6">
          <div className="">
            <Image
              src="/images/blueLogo.png"
              alt="logo"
              width={80}
              height={80}
              className="rounded-br-[50%] rounded-bl-[50%] p-2"
              priority
            />
          </div>
        </div>

        <nav className="px-4 space-x-8 py-4 sticky top-0 w-full "> {/* z-50 shadow-md  */}
          <Link
            href="/ReservationPage"
            className={`font-semibold ${isActive("/ReservationPage")} hover:text-sky-500`}
          >
            RESERVATIONS
          </Link>
          <Link
            href="/#Home"
            className={`font-semibold ${isActive("/")} hover:text-sky-500`}
          >
            HOME
          </Link>
          <Link
            href="/CarsPage"
            className={`font-semibold ${isActive(
              "/CarsPage"
            )} hover:text-sky-500`}
          >
            OUR CARS
          </Link>
          <Link
            href="/AboutPage"
            className={`font-semibold ${isActive(
              "/AboutPage"
            )} hover:text-sky-500`}
          >
            ABOUT US
          </Link>
          <Link
            href="/#LocationPage"
            className={`font-semibold ${isActive(
              "/LocationPage"
            )} hover:text-sky-500`}
          >
            LOCATION
          </Link>
          <Link
            href="/ContactPage"
            className={`font-semibold ${isActive(
              "/ContactPage"
            )} hover:text-sky-500`}
          >
            CONTACT US
          </Link>
        </nav>
      </div>
    </header>
  );
}
