"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import DefaultHeaderSearch from "@/src/components/ui/layouts/defaultLayout/components/DefaultHeaderSearch";
import LoginModal from "@/src/components/ui/modals/loginModal/LoginModal";
import RegisterModal from "@/src/components/ui/modals/registerModal/RegisterModal";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { Link } from "@/src/i18n/navigation";
import { useModalStore } from "@/src/components/providers/modalStoreProvider";
import { CompanyDetailType } from "@/src/utils/types/companyDetail.type";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import {
  CART_UPDATED_EVENT,
  getCartItemsCount,
} from "@/src/utils/cart/cartStorage";

interface Props {
  logo: CompanyDetailType;
}

function DefaultHeader({ logo }: Props) {
  const t = useTranslations();
  const { data: userData } = useCurrentUserQuery();

  const toggleLogin = useModalStore((state) => state.toggleLogin);

  const [registerModal, setRegisterModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartItemsCount());
    };

    updateCartCount();

    window.addEventListener(CART_UPDATED_EVENT, updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleOpenRegisterModal = () => {
    toggleLogin();
    setRegisterModal(true);
  };

  const handleOpenLoginModal = () => {
    setRegisterModal(false);
    toggleLogin();
  };

  const cartBadge = cartCount > 0 && (
    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
      {cartCount > 99 ? "99+" : cartCount}
    </span>
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white shadow-sm">
        <div className="my-container flex flex-row flex-wrap items-center justify-between gap-2 py-2 md:flex-nowrap md:gap-4 md:py-3">
          {/* Brand */}
          <Link
            href="/"
            className="flex min-w-0 shrink items-center gap-2 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none md:shrink-0 md:gap-3"
          >
            {logo?.image ? (
              <Image
                src={getImageSrcByBucketAndFileNames({
                  bucketName: "commercor",
                  fileName: logo.image,
                })}
                alt={logo.value || "Store logo"}
                className="h-9 max-w-32 object-contain md:h-11 md:max-w-none"
                width={140}
                height={44}
                priority
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-base font-bold text-white md:h-10 md:w-10 md:text-lg">
                  C
                </div>

                <div className="hidden sm:block">
                  <p className="text-xl font-bold tracking-tight text-gray-950">
                    {logo?.value || "Commercor"}
                  </p>

                  <p className="text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase">
                    Online Store
                  </p>
                </div>
              </div>
            )}
          </Link>

          {/* Search */}
          <div className="order-3 w-full md:order-none md:max-w-[600px] md:flex-1 lg:max-w-[800px]">
            <DefaultHeaderSearch />
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center justify-end gap-2 md:gap-4">
            {/* Cart */}
            {userData?.id ? (
              <Link
                href="/cart"
                className="group relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white transition-all hover:border-black hover:bg-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label={t("cart")}
              >
                <ShoppingCartOutlined className="text-base text-gray-700 transition-colors group-hover:text-white md:text-lg" />
                {cartBadge}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => toggleLogin()}
                className="group relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white transition-all hover:border-black hover:bg-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label={t("cart")}
              >
                <ShoppingCartOutlined className="text-base text-gray-700 transition-colors group-hover:text-white md:text-lg" />
                {cartBadge}
              </button>
            )}

            {/* User */}
            {userData?.id ? (
              <Link
                href="/profile"
                className="group flex h-11 w-11 items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white transition-all hover:border-black hover:bg-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none md:w-auto md:px-4"
              >
                <UserOutlined className="text-base text-gray-700 transition-colors group-hover:text-white md:text-lg" />

                <span className="hidden text-sm font-medium text-gray-700 transition-colors group-hover:text-white md:inline">
                  {userData.firstName}
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => toggleLogin()}
                className="group flex h-11 w-11 items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white transition-all hover:border-black hover:bg-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none md:w-auto md:px-4"
                aria-label={t("login")}
              >
                <UserOutlined className="text-base text-gray-700 transition-colors group-hover:text-white md:text-lg" />

                <span className="hidden text-sm font-medium text-gray-700 transition-colors group-hover:text-white md:inline">
                  {t("login")}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal handleOpenRegisterModal={handleOpenRegisterModal} />

      <RegisterModal
        show={registerModal}
        setShow={setRegisterModal}
        handleOpenLoginModal={handleOpenLoginModal}
      />
    </>
  );
}

export default DefaultHeader;
