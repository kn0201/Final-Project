// Buffer Line
export type NotificationChoices = "success" | "warning" | "danger" | "info";

type CommonParameters = {
  type: NotificationChoices;
  title: string;
  backgroundColor?: string;
  autoClose?: number;
};

export type ShowToastParams = CommonParameters;

export type ShowDialogParams = CommonParameters & {
  component?: () => JSX.Element;
  message?: string;
  leftButtonColor?: string;
  leftButtonText?: string;
  leftButtonVisible?: boolean;
  leftButtonFunction?: () => void;
  rightButtonColor?: string;
  rightButtonText?: string;
  rightButtonVisible?: boolean;
  rightButtonFunction?: () => void;
};

export type NotificationContextInfo = {
  IonNeverToast: { show: (toastParams: ShowToastParams) => void };
  IonNeverDialog: {
    show: (dialogParams: ShowDialogParams) => void;
    dismiss: () => void;
  };
};
