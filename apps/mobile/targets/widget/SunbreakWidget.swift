import WidgetKit
import SwiftUI

// Artefakt D — iOS-Homescreen-Widget: EIN Vorschlag, groß. Erbt die
// Kartensprache (Signalblock, sicher/wackelig via Sättigung). Liest den
// aktuellen Vorschlag aus der App-Group, die die App via SharedGroupPreferences
// befüllt (Schlüssel "topSuggestion", JSON-String).

private let appGroup = "group.hamburg.sonnenfenster.sunbreak"

// MARK: - Datenmodell

struct Suggestion: Codable {
  let condition: String
  let ort: String
  let bereich: String
  let sonneBisZeit: String
  let gehzeit: String
  let wackeligGrund: String?

  static let fallback = Suggestion(
    condition: "sicher", ort: "Hammer Park", bereich: "Nordwiese",
    sonneBisZeit: "15:47", gehzeit: "6 Min", wackeligGrund: nil
  )

  var isSicher: Bool { condition == "sicher" }
}

// Farbpalette aus dem Handoff (eine Signalfarbe, Zustand über Sättigung).
struct Palette {
  let hero: Color
  let footer: Color
  let inkMax: Color
  let inkStrong: Color
  let inkFooter: Color

  static func forCondition(_ sicher: Bool) -> Palette {
    sicher
      ? Palette(hero: Color(hex: 0xE8A23A), footer: Color(hex: 0xD98F27),
                inkMax: Color(hex: 0x20180A), inkStrong: Color(hex: 0x3A2A08),
                inkFooter: Color(hex: 0x2A1E08))
      : Palette(hero: Color(hex: 0xC7BEAC), footer: Color(hex: 0xB4AB98),
                inkMax: Color(hex: 0x35301F), inkStrong: Color(hex: 0x4a4230),
                inkFooter: Color(hex: 0x332e20))
  }
}

extension Color {
  init(hex: UInt32) {
    self.init(
      .sRGB,
      red: Double((hex >> 16) & 0xFF) / 255,
      green: Double((hex >> 8) & 0xFF) / 255,
      blue: Double(hex & 0xFF) / 255,
      opacity: 1
    )
  }
}

// MARK: - Timeline

struct SunbreakEntry: TimelineEntry {
  let date: Date
  let suggestion: Suggestion
}

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> SunbreakEntry {
    SunbreakEntry(date: Date(), suggestion: .fallback)
  }

  func getSnapshot(in context: Context, completion: @escaping (SunbreakEntry) -> Void) {
    completion(SunbreakEntry(date: Date(), suggestion: readSuggestion()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<SunbreakEntry>) -> Void) {
    let entry = SunbreakEntry(date: Date(), suggestion: readSuggestion())
    // In ~30 Min erneut aktualisieren (kurzer Horizont des Produkts).
    let next = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
    completion(Timeline(entries: [entry], policy: .after(next)))
  }

  private func readSuggestion() -> Suggestion {
    guard
      let defaults = UserDefaults(suiteName: appGroup),
      let raw = defaults.string(forKey: "topSuggestion"),
      let data = raw.data(using: .utf8),
      let decoded = try? JSONDecoder().decode(Suggestion.self, from: data)
    else { return .fallback }
    return decoded
  }
}

// MARK: - View

struct SunbreakWidgetView: View {
  let entry: SunbreakEntry

  var body: some View {
    let s = entry.suggestion
    let p = Palette.forCondition(s.isSicher)
    let kicker = s.isSicher ? "☀ SONNE BIS" : "⛅ WACKELIG"
    let meta: String = {
      if !s.isSicher, let g = s.wackeligGrund { return "\(s.gehzeit) zu Fuß · \(g)" }
      return "\(s.gehzeit) zu Fuß"
    }()

    VStack(spacing: 0) {
      VStack(alignment: .leading, spacing: 2) {
        Text(kicker)
          .font(.system(size: 11, weight: .bold))
          .kerning(2).foregroundColor(p.inkStrong)
        Text(s.sonneBisZeit)
          .font(.system(size: 44, weight: .black))
          .monospacedDigit().foregroundColor(p.inkMax)
        Text("\(s.ort) · \(s.bereich)")
          .font(.system(size: 14, weight: .bold)).foregroundColor(p.inkStrong)
        Text(meta)
          .font(.system(size: 12)).foregroundColor(p.inkFooter)
          .lineLimit(1)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
      .padding(.horizontal, 16).padding(.vertical, 12)
      .background(p.hero)

      Text("Öffnen & teilen")
        .font(.system(size: 13, weight: .bold)).foregroundColor(p.inkFooter)
        .frame(maxWidth: .infinity).padding(.vertical, 8)
        .background(p.footer)
    }
    .containerBackground(for: .widget) { p.footer }
  }
}

// MARK: - Widget

struct SunbreakWidget: Widget {
  let kind = "SunbreakWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      SunbreakWidgetView(entry: entry)
    }
    .configurationDisplayName("Sunbreak")
    .description("Ein Sonnen-Vorschlag, groß.")
    .supportedFamilies([.systemMedium])
  }
}

@main
struct SunbreakWidgetBundle: WidgetBundle {
  var body: some Widget { SunbreakWidget() }
}
