# 🐉 DM Toolkit – Asistente para Dungeon Masters (D&D 5e)

Aplicación web y móvil para apoyar al Dungeon Master durante sus partidas de Dungeons & Dragons 5e. Consume la [API pública de D&D 5e](https://www.dnd5eapi.co/api/) y se empaqueta para Android con CapacitorJS.

**Autor:** Juan Esteban Tibamoso Sanchez – Ingeniería Multimedia, Universidad de San Buenaventura
**Curso:** Desarrollo de Aplicaciones Multiplataforma

## 🔗 Enlaces

- **App web (Vercel):** https://dnd-dm-toolkit-black.vercel.app
- **APK Android:** [Releases → v1.0.0](../../releases/tag/v1.0.0)

## ⚔️ Módulos

### 1. Bestiario
- Consume `/api/monsters` y `/api/monsters/{index}`.
- Búsqueda por nombre y filtro por Nivel de Desafío (consultando la API con `?challenge_rating=`).
- Tarjeta genérica reutilizable (`Card`) con Nombre, CA, PG y CR.
- Paginación: solo se piden los detalles de los monstruos visibles (con caché).
- Al tocar un monstruo se ve su ficha completa y se puede enviar su CR al generador de botín.

### 2. Generador de botín
- Se elige el CR del monstruo derrotado (o llega directo desde el Bestiario).
- 4 niveles de recompensa basados en la tabla *Individual Treasure* de la DMG: a mayor CR, más monedas (cp, sp, gp, pp) y objetos de mayor rareza.
- Objetos reales desde `/api/magic-items` (filtrados por rareza según el nivel) y `/api/equipment`.

### 3. Bandeja de dados
- Dados d4, d6, d8, d10, d12, d20 y d100.
- Cantidad de dados (1–10) y modificador (−20 a +20).
- Resultado animado, detección de crítico / pifia en d20 e historial de las últimas 10 tiradas.

## 🛠️ Tecnologías

React · Vite · JavaScript · CSS (Mobile-First) · Fetch API · CapacitorJS · Android Studio · Vercel

## 📁 Estructura

```
src/
├── components/   # Card, Modal, Loader, ErrorMessage, Pagination, TabBar, MonsterDetail
├── pages/        # Bestiary, LootGenerator, DiceTray
├── services/     # api.js (consumo de la API con caché)
├── utils/        # dice.js, loot.js, format.js
├── App.jsx
└── index.css
```

## ▶️ Ejecutar en local

```bash
npm install
npm run dev
```

## 📱 Generar el APK

```bash
npm run build
npx cap add android     # solo la primera vez
npx cap sync android
npx cap open android    # Build > Build APK(s) en Android Studio
```
