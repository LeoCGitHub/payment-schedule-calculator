# Payment Schedule Calculator - Fonctionnalités

## ✨ Fonctionnalités principales

### 1. Formulaire dynamique masquable
- **Formulaire horizontal** avec 4 colonnes en résolution HD
- **Masquage automatique** après soumission pour maximiser l'espace du tableau
- **Bouton toggle** pour afficher/masquer le formulaire à tout moment
- **Animation fluide** lors de l'affichage/masquage

### 2. Tableau d'amortissement complet
Le tableau affiche **11 colonnes** avec toutes les informations financières :
- Période
- Date d'échéance
- Dette début période
- Nouvelle dette
- Remboursement
- Dette fin période
- Taux mensuel
- Intérêts financiers
- Loyer
- Taux annuel de référence
- Flux actualisés

### 3. Résumé financier
En haut du tableau, affichage des totaux :
- Montant total
- Principal total
- Intérêts totaux

### 4. Responsive Design
- **HD (1920px+)** : Formulaire 4 colonnes
- **Desktop (1200px)** : Formulaire 3 colonnes
- **Tablette (900px)** : Formulaire 2 colonnes
- **Mobile (768px)** : Formulaire 1 colonne

## 🎯 Workflow utilisateur

1. **Remplir le formulaire** avec les paramètres du contrat
2. **Cliquer sur "Calculer l'échéancier"**
3. Le formulaire se **masque automatiquement**
4. Le tableau d'amortissement s'affiche avec toutes les données
5. Bouton **"▼ Afficher le formulaire"** disponible pour modifier les paramètres
6. Cliquer sur le bouton pour réafficher le formulaire si nécessaire

## 🔧 Configuration backend

### Format de la requête
```json
{
  "periodicity": 3,
  "contractDuration": 48,
  "durationRevision": true,
  "termType": "Echu",
  "interestCalculationMode": true,
  "knownRightOfUse": true,
  "eoa": true,
  "assetValue": 150000,
  "purchaseOptionValue": 1500,
  "interestRate": 0,
  "firstPaymentDate": "17/09/2025",
  "rentType": "Loyer unique",
  "rentAmount": 10000
}
```

### Technologies
- **Backend** : Quarkus (Kotlin) avec Java 21
- **Frontend** : React (Vite) avec JavaScript
- **API** : REST avec CORS configuré
- **Port backend** : 9090
- **Port frontend** : 5173

## 🚀 Lancement

### Backend
```bash
cd backend
./gradlew quarkusDev
```

### Frontend
```bash
cd frontend
npm run dev
```

## 📝 Notes techniques

- **CORS** : Géré par un filtre personnalisé dans le backend
- **Calcul des dates** : Basé sur la périodicité (1=mensuel, 3=trimestriel, etc.)
- **Précision** : Tous les calculs financiers utilisent BigDecimal
- **Formatage** : Devises en EUR, pourcentages avec 2-4 décimales
