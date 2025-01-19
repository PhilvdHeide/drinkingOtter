# 🦦 Drinking Otter

Eine niedliche Wasser-Tracking App mit einem Otter, der sich füllt, wenn du trinkst! 

## 🌟 Features

- Tracking verschiedener Getränkearten (Wasser, Tee, Kakao)
- Visuelles Feedback durch einen sich füllenden Otter
- Tägliches Hydrationsziel
- Chronologische Aufzeichnung der Getränke
- Erfolgsmeldungen beim Erreichen des Tagesziels
- Persistente Datenspeicherung mit Supabase
- Individuelle Tracking für mehrere Benutzer
- Dark Mode Unterstützung

## 🚀 Installation

1. Repository klonen:
```bash
git clone https://github.com/PhilvdHeide/drinkingOtter.git
cd drinkingOtter
```

2. Umgebungsvariablen einrichten:
- Erstelle eine `.env` Datei basierend auf `.env.example`
- Füge deine Supabase URL und API Keys hinzu

3. Abhängigkeiten installieren:
```bash
npm install
```

4. Datenbank einrichten:
- Führe das Setup-Skript aus:
```bash
node scripts/setupDatabase.js
```

5. Entwicklungsserver starten:
```bash
npm run dev
```

## 💻 Technologien

- React
- Tailwind CSS
- Lucide Icons
- Vite
- Supabase (Database)

## 🤝 Beitragen

Fühl dich frei, Issues zu erstellen oder Pull Requests einzureichen!

## 📜 Versionshistorie

### v0.5.0
- Dark Mode Unterstützung
- Verbesserte UI-Komponenten für bessere Dark Mode Darstellung

### v0.4.0
- Supabase Integration für persistente Datenspeicherung
- Multi-User Support
- Datenbank-Migrationsskripte

### v0.3.0
- Neues verbessertes Otter-Design
- Panda als zusätzliches Tier hinzugefügt
- Tier-Auswahl in Burger-Menü verschoben
- Verbesserte Füllungsanimation für beide Tiere

### v0.2.0
- Mehrere Otter-Designs zur Auswahl
- Neuer "Otter wechseln" Button
- Verbesserte Füllungsanimation für beide Otter-Designs

### v0.1.0
- Erste Version der App
- Grundlegende Tracking-Funktionalität
- Füllbarer Otter für visuelles Feedback
- Unterstützung für verschiedene Getränkearten
- Tägliches Hydrationsziel
- Erfolgsmeldungen

## 📝 Lizenz

MIT
