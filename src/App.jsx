import { useState } from 'react'
import TabBar from './components/TabBar'
import Bestiary from './pages/Bestiary'
import LootGenerator from './pages/LootGenerator'
import DiceTray from './pages/DiceTray'

export default function App() {
  const [tab, setTab] = useState('bestiary')
  const [lootCR, setLootCR] = useState(1)

  // Desde el bestiario se puede enviar el CR del monstruo derrotado al generador de botín
  const goToLoot = (cr) => {
    setLootCR(cr)
    setTab('loot')
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="logo">
          <img src="/d20.svg" alt="" /> DM <span>Toolkit</span>
        </h1>
        <TabBar active={tab} onChange={setTab} />
      </header>

      <main className="container">
        {/* Se mantienen montadas para no perder el estado al cambiar de pestaña */}
        <div hidden={tab !== 'bestiary'}><Bestiary onUseForLoot={goToLoot} /></div>
        <div hidden={tab !== 'loot'}><LootGenerator cr={lootCR} onChangeCR={setLootCR} /></div>
        <div hidden={tab !== 'dice'}><DiceTray /></div>
      </main>

      <footer className="footer">
        Datos: <a href="https://www.dnd5eapi.co" target="_blank" rel="noreferrer">D&amp;D 5e API</a>
      </footer>
    </div>
  )
}
