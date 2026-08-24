// `ERR_CACHE_READ_FAILURE` et autres ratés réseau ponctuels laissent une
// <img> cassée pour de bon sans jamais retenter — on force une unique
// requête réseau fraîche (qui contourne l'entrée de cache fautive) avant
// d'abandonner définitivement.
export function retryImageOnError(e) {
  const img = e.target;
  if (img.dataset.retried) return;
  img.dataset.retried = 'true';
  const src = img.src;
  img.src = `${src}${src.includes('?') ? '&' : '?'}retry=${Date.now()}`;
}
