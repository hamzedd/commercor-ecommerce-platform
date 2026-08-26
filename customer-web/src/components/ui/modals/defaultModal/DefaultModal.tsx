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
          <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
            {title}
          </p>
          <button
            type={"button"}
            onClick={onClose}
            className="btn-press flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-violet-50 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
          >
            <CloseOutlined style={{ fontSize: 20 }} />
          </button>
        </div>
        {children}
      </div>
    </Modal>
  );
}

export default DefaultModal;
