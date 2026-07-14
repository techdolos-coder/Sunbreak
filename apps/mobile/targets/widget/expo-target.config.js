/** @type {import('@bacons/apple-targets').Config} */
// iOS-Homescreen-Widget (Artefakt D). @bacons/apple-targets erzeugt daraus ein
// echtes WidgetKit-Extension-Target im generierten Xcode-Projekt (expo prebuild).
// Die App-Group teilt den aktuellen Vorschlag zwischen App und Widget.
module.exports = {
  type: "widget",
  name: "SunbreakWidget",
  icon: "../../assets/icon.png",
  entitlements: {
    "com.apple.security.application-groups": [
      "group.hamburg.sonnenfenster.sunbreak",
    ],
  },
};
