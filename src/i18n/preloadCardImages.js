import pairsData from '../data/pairs.json';

// Construit la liste des URLs de cartes (inspiration/innovation/glow) pour
// une langue donnée, à partir de pairs.json — seule source de vérité.
function collectImageUrls(lang) {
  const urls = [];
  pairsData.pairs.forEach(pair => {
    const t = lang === 'en' ? pair.translations?.en : null;
    const inspiration = t?.inspiration?.image ?? pair.inspiration.image;
    const innovation  = t?.innovation?.image  ?? pair.innovation.image;
    urls.push(inspiration, innovation);

    const num = String(pair.id).padStart(2, '0');
    const folder = lang === 'en' ? 'english' : 'french';
    urls.push(
      `/assets/cards/${folder}/glow/card-inspiration-glow-${num}.webp`,
      `/assets/cards/${folder}/glow/card-innovation-glow-${num}.webp`,
    );
  });
  return urls;
}

// Précharge les images d'une langue en arrière-plan (simple warm-up du cache
// navigateur — on ne garde même pas de référence aux objets Image).
export function preloadCardImages(lang) {
  if (typeof window === 'undefined') return;
  collectImageUrls(lang).forEach(url => {
    const img = new Image();
    img.src = url;
  });
}
