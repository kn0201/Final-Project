import { Component } from "react";
import { Switch, TextInput, View } from "react-native";
import ModalSelector from "react-native-modal-selector";

export class SampleApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textInputValue: "",
    };
  }

  render() {
    let index = 0;
    const data = [
      { key: index++, section: true, label: "Fruits" },
      { key: index++, label: "Red Apples" },
      { key: index++, label: "Cherries" },
      {
        key: index++,
        label: "Cranberries",
        accessibilityLabel: "Tap here for cranberries",
      },
      // etc...
      // Can also add additional custom keys which are passed to the onChange callback
      { key: index++, label: "Vegetable", customKey: "Not a fruit" },
    ];

    return (
      <View style={{ flex: 1, justifyContent: "space-around", padding: 50 }}>
        // Default mode
        <ModalSelector
          data={data}
          initValue="Select something yummy!"
          onChange={(option) => {
            alert(`${option.label} (${option.key}) nom nom nom`);
          }}
        />
        // Wrapper
        <ModalSelector
          data={data}
          initValue="Select something yummy!"
          supportedOrientations={["landscape"]}
          accessible={true}
          scrollViewAccessibilityLabel={"Scrollable options"}
          cancelButtonAccessibilityLabel={"Cancel Button"}
          onChange={(option) => {
            this.setState({ textInputValue: option.label });
          }}
        >
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              height: 30,
            }}
            editable={false}
            placeholder="Select something yummy!"
            value={this.state.textInputValue}
          />
        </ModalSelector>
        // Custom component
        <ModalSelector
          data={data}
          ref={(selector) => {
            this.selector = selector;
          }}
          customSelector={<Switch onValueChange={() => this.selector.open()} />}
        />
      </View>
    );
  }
}

export let birthdayModal = new SampleApp();
