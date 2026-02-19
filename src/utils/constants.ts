export const SITE_URL = 'https://doitz.fr';
export const SITE_NAME = 'Doitz';
export const SITE_DESCRIPTION = 'Courtier automobile spécialisé dans le sourcing de véhicules européens. Accompagnement personnalisé de A à Z. Économisez jusqu\'à 40%.';
export const PHONE = '+33781727689';
export const PHONE_DISPLAY = '07 81 72 76 89';
export const EMAIL = 'matthieu+doitz-auto@zennest.io';
export const WHATSAPP_URL = `https://wa.me/33781727689?text=${encodeURIComponent('Bonjour, je souhaite en savoir plus sur vos services de courtage automobile.')}`;
export const INSTAGRAM_URL = 'https://www.instagram.com/doitz/';
export const GUIDE_LINK = 'https://mattae.notion.site/Guide-complet-de-l-importation-de-v-hicules-trangers-2b32d6e3004d802aa702f83dac365ac1?source=copy_link';

export const BLOG_CATEGORIES = [
  { id: 'all', label: 'Tous', icon: '📋' },
  { id: 'import', label: 'Import', icon: '🚗' },
  { id: 'accompagnement', label: 'Accompagnement', icon: '🤝' },
  { id: 'fiscalite', label: 'Fiscalité', icon: '💰' },
  { id: 'comparatif', label: 'Comparatifs', icon: '📊' },
  { id: 'occasion', label: 'Occasion', icon: '🔍' },
  { id: 'financement', label: 'Financement', icon: '🏦' },
] as const;
