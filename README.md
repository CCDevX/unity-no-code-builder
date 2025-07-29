# ⚡ Unity Plugin Builder

<div align="center">

![Unity Plugin Builder](https://img.shields.io/badge/Unity-Plugin%20Builder-007acc?style=for-the-badge&logo=unity&logoColor=white)
![Version](https://img.shields.io/badge/version-2.1.0-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Netlify Status](https://img.shields.io/netlify/6c4c9c4e-12a3-4c3d-9f4d-1234567890ab?style=for-the-badge)

**Un générateur de plugins Unity moderne et intuitif**

[🚀 Demo Live](https://unity-plugin-builder-ccdevx.netlify.app/) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/CCDevX/unity-plugin-builder/issues) • [💡 Feature Request](https://github.com/CCDevX/unity-plugin-builder/issues)

</div>

---

## 🌟 Aperçu

Unity Plugin Builder est une application web moderne qui permet de créer des plugins Unity EditorWindow sans écrire une seule ligne de code. Grâce à une interface intuitive de glisser-déposer, vous pouvez concevoir visuellement votre plugin et l'exporter directement en C#.

### ✨ Fonctionnalités principales

- 🎨 **Interface moderne** avec glassmorphism et animations fluides
- 🖱️ **Glisser-déposer** pour placer les composants UI
- 🎯 **Aperçu en temps réel** de votre plugin
- 📝 **Composants Unity** : Texte, Boutons, Inputs, HelpBox
- ⚙️ **Actions configurables** : Debug.Log, OpenURL, Code C# personnalisé
- 🤖 **Génération AI** de code C# avec Groq
- 💾 **Sauvegarde locale** de vos projets
- 📱 **Design responsive** pour tous les appareils
- 🌙 **Thème sombre** premium

## 🛠️ Technologies utilisées

<div align="center">

![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![SCSS](https://img.shields.io/badge/SCSS-Modern-CF649A?style=flat-square&logo=sass&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=flat-square&logo=html5&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-Deployment-00C7B7?style=flat-square&logo=netlify&logoColor=white)

</div>

- **Frontend** : Vanilla JavaScript ES6+ avec modules
- **Styling** : SCSS avec architecture modulaire
- **Build Tool** : Vite pour un développement rapide
- **Déploiement** : Netlify avec déploiement continu
- **AI Integration** : Groq API pour la génération de code
- **Storage** : LocalStorage pour la persistance côté client

## 🚀 Installation & Développement

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/CCDevX/unity-plugin-builder.git

# Naviguer dans le dossier
cd unity-plugin-builder

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Build pour la production
npm run preview      # Prévisualise le build de production

# Utilitaires
npm run lint         # Lint du code
npm run format       # Formate le code avec Prettier
```

## 📖 Documentation

### Structure du projet

```
src/
├── common/
│   ├── javascript/
│   │   ├── config/          # Configuration de l'app
│   │   └── helper/          # Fonctions utilitaires
│   └── scss/
│       ├── _variables.scss  # Variables de design
│       ├── _base.scss       # Styles de base
│       ├── _buttons.scss    # Composants boutons
│       └── ...
├── pages/
│   ├── home/               # Page d'accueil
│   ├── projects/           # Gestion des projets
│   ├── project-builder/    # Éditeur visuel
│   └── settings/           # Configuration
└── index.html              # Point d'entrée
```

### Architecture

L'application suit une architecture modulaire avec :

- **Navigation SPA** : Chargement dynamique des pages
- **State Management** : LocalStorage pour la persistance
- **Component System** : Composants UI réutilisables
- **Event System** : Gestion centralisée des événements

### Utilisation

1. **Créer un projet** : Commencez par créer un nouveau projet ou ouvrir l'exemple
2. **Ajouter des composants** : Glissez les composants depuis le panneau gauche
3. **Configurer les propriétés** : Modifiez le texte, styles et actions
4. **Exporter** : Téléchargez le fichier C# généré pour Unity

## 🎯 Fonctionnalités actuelles

### Composants UI
- ✅ **Text** : Affichage de texte avec options de formatage
- ✅ **Button** : Boutons avec actions configurables
- ✅ **Input Field** : Champs de saisie texte
- ✅ **Help Box** : Messages d'information Unity

### Actions
- ✅ **Debug.Log** : Affichage de messages dans la console
- ✅ **Open URL** : Ouverture d'URLs externes
- ✅ **Custom C#** : Code C# personnalisé avec génération AI

### Gestion de projets
- ✅ **Création/suppression** de projets
- ✅ **Sauvegarde automatique**
- ✅ **Export C# EditorWindow**
- ✅ **Projet d'exemple inclus**

## 🗺️ Roadmap

### Version 2.2.0 (À venir)
- 🔄 **Nouveaux composants** : Slider, Dropdown, Toggle, Image
- 🎨 **Thèmes personnalisables**
- 📊 **Analytics d'utilisation**
- 🔗 **Partage de projets par URL**

### Version 3.0.0 (Planifié)
- 🗄️ **Base de données** : Sauvegarde cloud avec authentification
- 👥 **Collaboration** : Partage et travail en équipe
- 🎮 **Templates avancés** : Bibliothèque de templates prêts à l'emploi
- 🔧 **API REST** : Intégration avec Unity Package Manager
- 📱 **App mobile** : Version mobile native

### Améliorations continues
- 🎯 **UX/UI** : Amélioration continue de l'interface
- ⚡ **Performance** : Optimisations et mise en cache
- 🌍 **i18n** : Support multilingue
- ♿ **Accessibilité** : Conformité WCAG 2.1

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment vous pouvez aider :

1. 🍴 Fork le projet
2. 🌿 Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. 💻 Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push vers la branche (`git push origin feature/AmazingFeature`)
5. 🔄 Ouvrez une Pull Request

### Guidelines de contribution

- Suivez le style de code existant
- Ajoutez des tests pour les nouvelles fonctionnalités
- Documentez les changements dans le README
- Utilisez des commits conventionnels

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- 🎨 **Design** : Inspiré par les meilleures pratiques UI/UX modernes
- 🤖 **AI** : Intégration Groq pour la génération de code
- 🎮 **Unity** : Pour leur incroyable moteur de jeu
- 🌐 **Community** : Tous les développeurs qui utilisent et contribuent

## 📊 Statistiques

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/CCDevX/unity-plugin-builder?style=social)
![GitHub forks](https://img.shields.io/github/forks/CCDevX/unity-plugin-builder?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/CCDevX/unity-plugin-builder?style=social)

</div>

## 📱 Screenshots

### Interface principale
*[Ajouter capture d'écran de l'interface principale]*

### Éditeur visuel
*[Ajouter capture d'écran de l'éditeur avec drag & drop]*

### Export C#
*[Ajouter capture d'écran du code généré]*

---

<div align="center">

**Développé avec par [CCDevX](https://github.com/CCDevX)**

[⬆ Retour en haut](#-unity-plugin-builder)

</div>
