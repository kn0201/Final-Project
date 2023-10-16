// Buffer Line
import { useState } from "react";

function useButton(
  defaultText: string,
  defaultColor: string,
  dismissFunction: () => void
) {
  const defaultLeftButtonInfo = {
    buttonColor: defaultColor,
    buttonText: defaultText,
    buttonVisible: false,
    buttonFunction: () => dismissFunction,
  };

  const [buttonColor, setButtonColor] = useState<string>(
    defaultLeftButtonInfo.buttonColor
  );

  const [buttonText, setButtonText] = useState<string>(
    defaultLeftButtonInfo.buttonText
  );

  const [buttonVisible, setButtonVisible] = useState<boolean>(
    defaultLeftButtonInfo.buttonVisible
  );

  const [buttonFunction, setButtonFunction] = useState<() => void>(
    () => defaultLeftButtonInfo.buttonFunction
  );

  const updateButtonColor = (buttonColor?: string) => {
    if (buttonColor) setButtonColor(buttonColor);
  };

  const updateButtonText = (buttonText?: string) => {
    if (buttonText) setButtonText(buttonText);
  };

  const updateButtonVisible = (buttonVisible?: boolean) => {
    setButtonVisible(buttonVisible || false);
  };

  const updateButtonFunction = (clickFunction?: () => void) => {
    const updateFunction = () => {
      if (clickFunction) clickFunction();
      dismissFunction();
      resetButton();
    };

    setButtonFunction(() => updateFunction);
  };

  const resetButton = () => {
    setButtonColor(defaultLeftButtonInfo.buttonColor);
    setButtonText(defaultLeftButtonInfo.buttonText);
    setButtonVisible(defaultLeftButtonInfo.buttonVisible);
    setButtonFunction(defaultLeftButtonInfo.buttonFunction);
  };

  return {
    buttonColor,
    buttonText,
    buttonVisible,
    buttonFunction,
    updateButtonColor,
    updateButtonText,
    updateButtonVisible,
    updateButtonFunction,
    resetButton,
  };
}

export default useButton;
