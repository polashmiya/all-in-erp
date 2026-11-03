import {
  CloseOutlined,
  CloudUploadOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { Button, Upload, type UploadFile, type UploadProps } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '../data-display/BarList';

export interface DropzoneProps {
  value?: UploadFile[];
  onChange?: (files: UploadFile[]) => void;
  accept?: string;
  hint?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export function Dropzone({
  value = [],
  onChange,
  accept,
  hint,
  multiple = true,
  disabled,
}: DropzoneProps) {
  const { t } = useTranslation();
  const props: UploadProps = {
    accept,
    multiple,
    disabled,
    fileList: value,
    showUploadList: false,
    beforeUpload: () => false,
    onChange: ({ fileList }) => onChange?.(fileList),
  };

  return (
    <div className="erp-stack">
      <Upload.Dragger {...props} className="erp-dropzone">
        <span className="erp-dropzone__icon">
          <CloudUploadOutlined />
        </span>
        <span className="erp-dropzone__title">
          {t('upload.drop')} <span className="erp-dropzone__link">{t('upload.browse')}</span>
        </span>
        {hint && <span className="erp-dropzone__hint">{hint}</span>}
      </Upload.Dragger>
      {value.map((file) => (
        <FileItem
          key={file.uid}
          file={file}
          onRemove={
            disabled ? undefined : () => onChange?.(value.filter((f) => f.uid !== file.uid))
          }
        />
      ))}
    </div>
  );
}

function fileIcon(name: string) {
  if (/\.pdf$/i.test(name)) return { icon: <FilePdfOutlined />, tone: 'danger' };
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(name))
    return { icon: <FileImageOutlined />, tone: 'info' };
  return { icon: <FileOutlined />, tone: 'neutral' };
}

function fileSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function FileItem({ file, onRemove }: { file: UploadFile; onRemove?: () => void }) {
  const { t } = useTranslation();
  const { icon, tone } = fileIcon(file.name);
  const uploading = file.status === 'uploading';

  return (
    <div className="erp-file">
      <span className={`erp-file__icon erp-file__icon--${tone}`}>{icon}</span>
      <div className="erp-file__body">
        <span className="erp-file__name">{file.name}</span>
        {uploading ? (
          <ProgressBar percent={file.percent ?? 0} label={file.name} />
        ) : (
          <span className="erp-file__meta">
            {[fileSize(file.size), t('upload.ready')].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>
      {onRemove && (
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          aria-label={t('upload.remove', { name: file.name })}
          onClick={onRemove}
        />
      )}
    </div>
  );
}

export function ImageDrop({
  value,
  onChange,
  hint,
  disabled,
}: {
  value?: UploadFile[];
  onChange?: (files: UploadFile[]) => void;
  hint?: string;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const file = value?.[0];
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const blob = file?.originFileObj;
    if (!blob) {
      setPreview(file?.url ?? null);
      return;
    }
    const url = URL.createObjectURL(blob);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="erp-imagedrop">
      <Upload.Dragger
        accept="image/*"
        multiple={false}
        disabled={disabled}
        showUploadList={false}
        beforeUpload={() => false}
        fileList={value ?? []}
        onChange={({ fileList }) => onChange?.(fileList.slice(-1))}
      >
        {preview ? (
          <img src={preview} alt={file?.name ?? ''} className="erp-imagedrop__img" />
        ) : (
          <span className="erp-imagedrop__empty">
            <PictureOutlined className="erp-imagedrop__icon" />
            <span className="erp-imagedrop__title">{t('upload.dropImage')}</span>
            {hint && <span className="erp-imagedrop__hint">{hint}</span>}
          </span>
        )}
      </Upload.Dragger>
      {file && !disabled && (
        <Button
          type="link"
          size="small"
          onClick={() => onChange?.([])}
          className="erp-linkbtn-plain"
        >
          {t('upload.removeImage')}
        </Button>
      )}
    </div>
  );
}
