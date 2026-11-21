import { Dialog } from 'quasar';

interface ConfirmOptions {
  title: string;
  message: string;
  okLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

/** Promise-based wrapper around Quasar's confirm dialog. Resolves true on OK. */
export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    Dialog.create({
      title: options.title,
      message: options.message,
      persistent: true,
      ok: {
        label: options.okLabel || 'ยืนยัน',
        color: options.danger ? 'negative' : 'primary',
        unelevated: true,
        noCaps: true,
      },
      cancel: {
        label: options.cancelLabel || 'ยกเลิก',
        flat: true,
        color: 'grey-8',
        noCaps: true,
      },
    })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false))
      .onDismiss(() => resolve(false));
  });
}

export function confirmDiscardChanges(): Promise<boolean> {
  return confirmAction({
    title: 'มีการแก้ไขที่ยังไม่ได้บันทึก',
    message: 'หากดำเนินการต่อ การแก้ไขที่ยังไม่ได้บันทึกจะหายไป ต้องการดำเนินการต่อหรือไม่?',
    okLabel: 'ทิ้งการแก้ไข',
    cancelLabel: 'กลับไปแก้ไขต่อ',
    danger: true,
  });
}
