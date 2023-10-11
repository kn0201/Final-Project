// Buffer Line
export type NotificationChoices = "success" | "warning" | "danger" | "info";

type CommonParameters = {
  backgroundColor?: string;
  autoClose?: number;
};

export type ShowToastParams = CommonParameters & {
  type: NotificationChoices;
  title: string;
};

export type ShowDialogParams = CommonParameters & {
  type?: NotificationChoices;
  title?: string;
} & {
  component?: () => JSX.Element;
  message?: string;
  dialogHeight?: number;
  firstButtonColor?: string;
  firstButtonText?: string;
  firstButtonVisible?: boolean;
  firstButtonFunction?: () => void;
  secondButtonColor?: string;
  secondButtonText?: string;
  secondButtonVisible?: boolean;
  secondButtonFunction?: () => void;
};

export type NotificationContextInfo = {
  IonNeverToast: { show: (toastParams: ShowToastParams) => void };
  IonNeverDialog: {
    show: (dialogParams: ShowDialogParams) => void;
    dismiss: () => void;
  };
};
