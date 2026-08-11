"use client";
import { Modal, ModalProps } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface Props extends ModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

function DefaultModal({ show, onClose, title, children, ...props }: Props) {
  return (
    <Modal
      title={null}
      footer={null}
      open={show}
      onCancel={onClose}
      centered
      closeIcon={null}
      width={600}
      {...props}
    >
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="flex w-full items-center justify-between">
          <p className={"text-xl font-bold"}>{title}</p>
          <button type={"button"} onClick={onClose}>
            <CloseOutlined style={{ fontSize: 24 }} />
          </button>
        </div>
        {children}
      </div>
    </Modal>
  );
}

export default DefaultModal;
