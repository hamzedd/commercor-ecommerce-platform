import { Link } from "@/src/i18n/navigation";
import React from "react";

function DefaultFooter() {
  return (
    <div className={"flex w-full justify-center bg-white py-6 md:py-8"}>
      <div className="my-container grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
        <div className="flex flex-col gap-3 md:gap-5">
          <Link href={"/"} className="hover:underline">
            Home
          </Link>
          <Link href={"/"} className="hover:underline">
            About Us
          </Link>
          <Link href={"/"} className="hover:underline">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DefaultFooter;
