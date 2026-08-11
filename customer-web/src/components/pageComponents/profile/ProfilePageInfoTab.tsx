"use client";

import ProfileForm from "@/src/components/ui/forms/ProfileForm";
import { Form } from "antd";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { useEffect, useState } from "react";
import { updateCustomerProfileService } from "@/src/service/apiServices/customer.service";
import { UpdateCustomerProfileRequestType } from "@/src/utils/types/customer.type";

function ProfilePageInfoTab() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { data: userData } = useCurrentUserQuery();

  useEffect(() => {
    if (userData?.id) {
      form.setFieldsValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
      });
    }
  }, [userData?.id, form]);

  const handleSubmit = async (values: UpdateCustomerProfileRequestType) => {
    try {
      setLoading(true);
      await updateCustomerProfileService(values);
    } finally {
      setLoading(false);
    }
  };
  return <ProfileForm form={form} disabled={loading} onFinish={handleSubmit} />;
}

export default ProfilePageInfoTab;
