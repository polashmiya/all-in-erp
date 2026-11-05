import { App } from 'antd';
import { useTranslation } from 'react-i18next';

let nextKey = 0;

export function useUndoMessage() {
  const { t } = useTranslation();
  const { message } = App.useApp();

  return (text: string, undo: () => void) => {
    const key = `undo-${nextKey++}`;
    void message.success({
      key,
      duration: 6,
      content: (
        <span className="erp-undo">
          {text}
          <button
            type="button"
            className="erp-linkbtn"
            onClick={() => {
              message.destroy(key);
              undo();
            }}
          >
            {t('common.undo')}
          </button>
        </span>
      ),
    });
  };
}
