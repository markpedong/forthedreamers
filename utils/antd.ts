import { FileType } from "@/constants/types";
import { addToast } from "@heroui/react";

export const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    addToast({ title: 'You can only upload JPG/PNG file!' });
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    addToast({ title: 'Image must smaller than 2MB!' });
  }
  return isJpgOrPng && isLt2M;
};