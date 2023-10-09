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
    buttonFunction: () => {
      // console.log(`Pressed ${defaultText}`);
      dismissFunction();
    },
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
    defaultLeftButtonInfo.buttonFunction
  );

  const updateButtonColor = (buttonColor?: string) => {
    if (buttonColor) setButtonColor(buttonColor);
  };

  const updateButtonText = (buttonText?: string) => {
    if (buttonText) setButtonText(buttonText);
  };

  const updateButtonVisible = (buttonVisible?: boolean) => {
    if (buttonVisible) setButtonVisible(buttonVisible);
  };

  const updateButtonFunction = (clickFunction?: () => void) => {
    if (clickFunction) setButtonFunction(clickFunction);
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
