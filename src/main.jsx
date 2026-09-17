import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import QRCode from 'qrcode'
import { toPng } from 'html-to-image'
import './styles.css'

const initial = {
  name: 'KARIM AZEGGOUAR',
  className: 'DEVOWFS202',
  year: '2026 / 2027',
  link: 'https://mon-portfolio.dev'
}

function App() {
  const [data, setData] = useState(initial)
  const [photo, setPhoto] = useState('')
  const [qr, setQr] = useState('')
  const [notice, setNotice] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    QRCode.toDataURL(data.link || 'https://example.com', { width: 260, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#101827', light: '#ffffff' } })
      .then(setQr)
  }, [data.link])

  const update = (key) => (event) => setData({ ...data, [key]: event.target.value })
  const handlePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // A data URL can be safely embedded by html-to-image during PNG export.
    // Temporary blob URLs often cause the export to fail in browsers.
    const reader = new FileReader()
    reader.onload = () => setPhoto(String(reader.result))
    reader.onerror = () => setNotice('Cette image ne peut pas être lue. Essayez une image JPG, PNG ou WebP.')
    reader.readAsDataURL(file)
  }
  const download = async () => {
    if (!cardRef.current) return
    setIsDownloading(true)
    setNotice('Préparation du fichier…')
    try {
      const image = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true, skipFonts: true })
      const a = document.createElement('a')
      a.href = image
      a.download = `badge-${data.name.toLowerCase().replaceAll(' ', '-') || 'portfolio'}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setNotice('Badge téléchargé avec succès.')
    } catch (error) {
      console.error('Erreur pendant l’export du badge :', error)
      setNotice('Impossible de créer le PNG. Essayez une image JPG, PNG ou WebP moins volumineuse.')
    } finally {
      setIsDownloading(false)
    }
  }

  return <main className="app-shell">
    <section className="intro">
      <div className="brand"><img className="brand-logo" src="/logo.png" alt="Logo OFPPT"/><span>PORTFOLIO<br/><b>BADGE</b></span></div>
      <p className="eyebrow">GÉNÉRATEUR DE BADGE</p>
      <h1>Votre portfolio<br/><em>en un scan.</em></h1>
      <p className="lead">Créez un badge personnel avec votre photo et un QR code qui redirige directement vers votre portfolio.</p>
      <div className="steps"><span>01 <b>Personnalisez</b></span><i></i><span>02 <b>Téléchargez</b></span><i></i><span>03 <b>Imprimez</b></span></div>
    </section>

    <section className="workspace">
      <div className="form-panel">
        <div className="panel-title"><div><p className="eyebrow">VOS INFORMATIONS</p><h2>Personnalisez votre badge</h2></div><span className="live"><i></i> Aperçu en direct</span></div>
        <div className="form-grid">
          <label>Nom complet<input value={data.name} onChange={update('name')} placeholder="Ex. AMINA DIALLO" /></label>
          <label>Groupe<input value={data.className} onChange={update('className')} placeholder="Ex. DEVOWFS203" /></label>
          <label>Année de formation<input value={data.year} onChange={update('year')} placeholder="Ex. 2025 / 2026" /></label>
          <label className="photo-field">Photo de profil<input type="file" accept="image/*" onChange={handlePhoto}/><span>{photo ? 'Photo ajoutée ✓' : 'Choisir une photo'}</span></label>
          <label className="wide">Lien vers votre portfolio<input type="url" value={data.link} onChange={update('link')} placeholder="https://monportfolio.com" /></label>
        </div>
        <button type="button" className="download" onClick={download} disabled={isDownloading}>{isDownloading ? 'Préparation du badge…' : <>↓ Télécharger le badge <span>PNG haute qualité</span></>}</button>
        {notice && <p className="notice">{notice}</p>}
      </div>

      <div className="preview-zone">
        <p className="eyebrow">APERÇU DU BADGE</p>
        <div className="badge-shadow">
          <article className="badge" ref={cardRef}>
            <div className="badge-top"><img className="ofppt-logo" src="/logo.png" alt="Logo OFPPT"/><span className="badge-year">ISTA NTIC-TANGER</span></div>
            <div className="photo-wrap">{photo ? <img src={photo} alt="Profil"/> : <div className="avatar">{(data.name.trim()[0] || 'P').toUpperCase()}</div>}</div>
            <h3>{data.name || 'VOTRE NOM'}</h3><div className="accent"></div>
            <div className="meta"><span>GROUPE</span><b>{data.className || '—'}</b></div>
            <div className="meta"><span>ANNÉE DE FORMATION</span><b>{data.year || '—'}</b></div>
            <div className="qr-wrap">{qr && <img src={qr} alt="QR code du portfolio"/>}</div>
            <p className="scan">SCANNEZ POUR DÉCOUVRIR<br/>MON PORTFOLIO</p>
          </article>
        </div>
        <p className="print-tip">Format badge · Prêt à imprimer</p>
      </div>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
