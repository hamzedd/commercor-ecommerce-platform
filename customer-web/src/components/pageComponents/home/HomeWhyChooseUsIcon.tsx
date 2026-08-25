"use client";

import {
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";

const icons = {
  Fast: ThunderboltOutlined,
  Secure: SafetyCertificateOutlined,
  Quality: StarOutlined,
  Support: CustomerServiceOutlined,
} as const;

export type BenefitIconKey = keyof typeof icons;

interface Props {
  name: BenefitIconKey;
}

function HomeWhyChooseUsIcon({ name }: Props) {
  const Icon = icons[name];
  return <Icon aria-hidden />;
}

export default HomeWhyChooseUsIcon;
