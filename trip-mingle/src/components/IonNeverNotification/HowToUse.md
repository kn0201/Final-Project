/-> How to Use IonNeverNotification <-/

Step 1 : Wrap Provider around the main App with the IonNeverNotificationRoot

(App.tsx)

Before :

        function App(){
            <All your Components>
        }

        export default App;

After :

        function RootApp(){
          <All your Components>
        }

        function App(){
            <IonNeverNotificationRoot>
                <RootApp/>
            </IonNeverNotificationRoot>
        }

        export default App;

Step 2: Call IonNeverToast / IonNeverDialog with the useIonNeverNotification function

(anywhere.tsx)

        const {IonNeverToast, IonNeverDialog} = useIonNeverNotification()

Step 3: Call the show and dismiss (dialog only) function when needed

eg. IonNeverToast.show({ object with necessary params })
eg. IonNeverDialog.dismiss()
