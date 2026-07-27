"use client";
import DefaultHeaderSearch from "@/src/components/ui/layouts/defaultLayout/components/DefaultHeaderSearch";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import LoginModal from "@/src/components/ui/modals/loginModal/LoginModal";
import RegisterModal from "@/src/components/ui/modals/registerModal/RegisterModal";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { Link } from "@/src/i18n/navigation";
import { useModalStore } from "@/src/components/providers/modalStoreProvider";
import { useTranslations } from "next-intl";
import { CompanyDetailType } from "@/src/utils/types/companyDetail.type";
import Image from "next/image";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";

interface Props {
  logo: CompanyDetailType;
}
function DefaultHeader({ logo }: Props) {
  const t = useTranslations();
  const { data: userData } = useCurrentUserQuery();
  const toggleLogin = useModalStore((state) => state.toggleLogin);
  const [registerModal, setRegisterModal] = useState(false);

  const handleOpenRegisterModal = () => {
    toggleLogin();
    setRegisterModal(true);
  };

  const handleOpenLoginModal = () => {
    setRegisterModal(false);
    toggleLogin();
  };

  return (
    <div
      className={
        "sticky top-0 z-40 flex w-full justify-center border-b border-gray-100 bg-white shadow-sm"
      }
    >
      <div className="my-container py-3 md:py-4">
        <div className="flex w-full flex-col items-center gap-3 md:flex-row md:justify-between md:gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 self-start md:self-auto">
            {logo?.image ? (
              <Image
                src={getImageSrcByBucketAndFileNames({
                  bucketName: "commercor",
                  fileName: logo?.image,
                })}
                alt={logo.value}
                className={"max-h-[50px] object-contain"}
                width={100}
                height={50}
              />
            ) : (
              <h1 className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
                Logo
              </h1>
            )}
          </Link>

          {/* Search - full width on mobile, limited width on desktop */}
          <div className="w-full md:max-w-[600px] md:flex-1 lg:max-w-[800px]">
            <DefaultHeaderSearch />
          </div>

          {/* Icons */}
          <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-end md:gap-4">
            {/* Cart Button */}
            {userData?.id ? (
              <Link
                href={"/checkout"}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white transition-all hover:border-black hover:bg-black md:h-11 md:w-11"
                aria-label={t("cart")}
              >
                <ShoppingCartOutlined className="text-base text-gray-700 transition-colors group-hover:text-white md:text-lg" />
              </Link>
            ) : (
              <button
                onClick={() => toggleLogin()}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white transition-all hover:border-black hover:bg-black md:h-11 md:w-11"
                aria-label={t("cart")}
              >
                <ShoppingCartOutlined className="text-base text-gray-700 transition-colors group-hover:text-white md:text-lg" />
              </button>
            )}

            {/* User Button */}
            {userData?.id ? (
              <Link
                href={"/profile"}
                className="group flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-3 py-2 transition-all hover:border-black hover:bg-black md:px-4"
              >
                <UserOutlined className="text-base text-gray-700 transition-colors group-hover:text-white md:text-lg" />
                <span className="text-sm font-medium text-gray-700 transition-colors group-hover:text-white">
                  {userData.firstName}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => toggleLogin()}
                className="group flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-3 py-2 transition-all hover:border-black hover:bg-black md:px-4"
              >
                <UserOutlined className="text-base text-gray-700 transition-colors group-hover:text-white md:text-lg" />
                <span className="text-sm font-medium text-gray-700 transition-colors group-hover:text-white">
                  {t("login")}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      <LoginModal handleOpenRegisterModal={handleOpenRegisterModal} />
      <RegisterModal
        show={registerModal}
        setShow={setRegisterModal}
        handleOpenLoginModal={handleOpenLoginModal}
      />
    </div>
  );
}

export default DefaultHeader;
