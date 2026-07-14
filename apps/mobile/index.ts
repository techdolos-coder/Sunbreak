import { registerRootComponent } from "expo";
import { registerWidgetTaskHandler } from "react-native-android-widget";

import App from "./App";
import { widgetTaskHandler } from "./widget/handler";

// registerRootComponent registriert die App als "main"-Komponente.
registerRootComponent(App);

// Android-Widget: Headless-Task-Handler registrieren (OS-getriebene Updates).
registerWidgetTaskHandler(widgetTaskHandler);
