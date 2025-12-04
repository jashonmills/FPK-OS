
import { MuseumItem } from './types';

export const FALLBACK_ITEMS: MuseumItem[] = [
  {
    id: 'fallback-1',
    title: 'Ancient Greek Amphora',
    description: 'A beautifully preserved ancient Greek amphora featuring intricate geometric patterns and mythological scenes.',
    thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/248010/796108/main-image',
    source: 'met',
    isThreeD: false,
    metadata: {
      artist: 'Unknown',
      date: '5th century BCE',
      medium: 'Terracotta',
      culture: 'Greek'
    }
  },
  {
    id: 'fallback-2',
    title: 'Roman Marble Sculpture',
    description: 'A classical Roman marble sculpture depicting a figure from mythology, showcasing the mastery of ancient sculptors.',
    thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/248008/796104/main-image',
    source: 'smithsonian',
    isThreeD: true,
    metadata: {
      artist: 'Unknown Roman Artist',
      date: '2nd century CE',
      medium: 'Marble'
    }
  },
  {
    id: 'fallback-3',
    title: 'Egyptian Canopic Jar',
    description: 'An ancient Egyptian canopic jar used in the mummification process, decorated with hieroglyphic inscriptions.',
    thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/544697/1080113/main-image',
    source: 'met',
    isThreeD: false,
    metadata: {
      date: 'New Kingdom Period',
      medium: 'Limestone',
      culture: 'Egyptian'
    }
  },
  {
    id: 'fallback-4',
    title: 'Medieval Illuminated Manuscript',
    description: 'A page from a medieval illuminated manuscript featuring gold leaf and vibrant pigments.',
    thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/464206/851002/main-image',
    source: 'smithsonian',
    isThreeD: false,
    metadata: {
      date: '13th century',
      medium: 'Parchment, gold leaf, tempera',
      culture: 'European'
    }
  },
  {
    id: 'fallback-5',
    title: 'Chinese Porcelain Vase',
    description: 'An exquisite porcelain vase from the Ming Dynasty, featuring delicate blue and white patterns.',
    thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/39933/395923/main-image',
    source: 'met',
    isThreeD: true,
    metadata: {
      date: 'Ming Dynasty (1368-1644)',
      medium: 'Porcelain',
      culture: 'Chinese'
    }
  },
  {
    id: 'fallback-6',
    title: 'Native American Pottery',
    description: 'Traditional Native American pottery featuring geometric designs and natural earth tones.',
    thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/313595/818006/main-image',
    source: 'smithsonian',
    isThreeD: false,
    metadata: {
      date: '19th century',
      medium: 'Clay',
      culture: 'Native American'
    }
  },
  {
    id: 'fallback-7',
    title: 'Renaissance Bronze Medallion',
    description: 'A detailed Renaissance bronze medallion commemorating a historical figure, showcasing the artistry of the period.',
    thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/207785/758828/main-image',
    source: 'met',
    isThreeD: true,
    metadata: {
      date: '16th century',
      medium: 'Bronze',
      culture: 'Italian Renaissance'
    }
  }
];
