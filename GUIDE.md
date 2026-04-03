# 🚀 Guide de déploiement — Al-Qurʾân PWA Premium

## Contenu du package

```
quran-premium/
├── index.html        ← Application complète (tout-en-un)
├── manifest.json     ← Configuration PWA
├── sw.js             ← Service Worker (cache hors-ligne)
├── icons/            ← Icônes de l'application
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-192.png
│   └── icon-512.png
└── GUIDE.md          ← Ce fichier
```

---

## ✅ Fonctionnalités incluses

| Fonctionnalité | Détail |
|---|---|
| 📖 Liste 114 sourates | Style colonne : N° · Nom + Traduction + 🕋/🕌 · Arabe |
| 🎨 Tajweed coloré | 13 règles colorées selon convention internationale |
| 🎧 Audio 4 récitateurs | Al-Afasy, As-Sudais, Al-Husary, Al-Minshawi |
| 🕌 Basmala séparée | Affichée en grand à chaque début de sourate |
| 📋 Page info sourate | Lieu, type, versets, description avant lecture |
| 🔍 Recherche globale | Dans les 6 236 versets français (Hamidullah) |
| 📚 Tafsir Ibn Kathir | Chargé depuis l'API (anglais, FR en cours) |
| 🖱️ Mot par mot | Cliquez sur un mot arabe pour l'analyser |
| 🎓 Mode Hifz | Mots masqués, révélation au toucher |
| 🔖 Signets | Sauvegardés en local, persistants |
| 📊 Statistiques | Versets lus, série de jours, graphique hebdo |
| 📅 Plan 30 jours | Khatma complète avec suivi quotidien |
| 🤲 Compteur Dhikr | 4 types avec barre de progression |
| 🔢 Notation Hizb | Séparateurs tous les 60 versets |
| ✓ Feedback verset | Indicateur visuel après chaque verset écouté |
| 📲 PWA installable | Android (Chrome) + iOS (Safari) |
| 📵 Mode hors-ligne | Juz Amma + sourates essentielles précachées |
| 🔔 Onboarding | 3 écrans de présentation au premier lancement |
| 📳 Retour haptique | Vibration légère sur Android |
| 🎯 Barre de progression | Cliquable pour naviguer dans l'audio |

---

## 🚀 Mise en ligne sur GitHub Pages (gratuit)

### Étape 1 — Créer un compte GitHub
→ https://github.com/signup

### Étape 2 — Créer un dépôt public
- Cliquez "+" → "New repository"
- Nom : `quran-app` (sans espaces)
- Cochez **Public**
- Cliquez "Create repository"

### Étape 3 — Uploader les fichiers
- Cliquez "uploading an existing file"
- Glissez-déposez **tout le contenu** du dossier `quran-premium/`
  (index.html, manifest.json, sw.js, dossier icons/)
- Cliquez "Commit changes"

### Étape 4 — Activer GitHub Pages
- Allez dans **Settings** → **Pages**
- Source : **Deploy from a branch**
- Branch : **main** → **(root)**
- Cliquez **Save**
- ⏳ Attendez 2–3 minutes

### Étape 5 — Accéder à votre app
```
https://VOTRE_PSEUDO.github.io/quran-app/
```

---

## 📲 Installation sur téléphone

### Android (Chrome)
1. Ouvrir l'URL dans Chrome
2. Menu ⋮ → "Ajouter à l'écran d'accueil"
3. Ou : la bannière apparaît automatiquement

### iPhone/iPad (Safari)
1. Ouvrir l'URL dans **Safari** (pas Chrome !)
2. Icône Partager ↑ → "Sur l'écran d'accueil"
3. "Ajouter"

---

## 🔄 Mettre à jour l'application

1. Modifier `const V = 'quran-premium-v3'` → `v4` dans `sw.js`
2. Mettre à jour `index.html`
3. Uploader sur GitHub → mise à jour automatique en 1–2 min

---

## 🌐 Prochaines étapes recommandées

- Ajouter un nom de domaine personnalisé (ex: alquran.havredesavoir.fr)
- Intégrer le Tafsir Al-Jalalayn en français (fichier JSON local)
- Activer les notifications Push pour rappels de lecture
- Ajouter les 99 Noms d'Allah

---

*Développé pour Havre De Savoir (HDS) · Le Havre, Normandie*
