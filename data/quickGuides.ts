// data/quickGuides.ts
export interface QuickGuide {
  id: string;
  title: string;
  summary: string;
  category: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  bullets: string[];
}

export const QUICK_GUIDES: QuickGuide[] = [
  {
    id: 'assertivitat-dir-no',
    title: 'Assertivitat: dir “no” sense culpa',
    summary: 'Plantilles simples per posar límits amb respecte i cuidar la relació.',
    category: 'Habilitats socials',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1600&auto=format&fit=crop',
    bullets: [
      'Model DESO: Descriu – Expressa – Solució – Outcome.',
      'Ex.: “Quan m’escrius a la nit, em poso nerviós. Preferiria parlar demà. Així dormiré millor i estaré més atent.”',
      'Reforça amb llenguatge corporal obert i to ferm però amable.',
    ],
  },
  {
    id: 'fomo-nomofobia',
    title: 'FOMO i nomofòbia',
    summary: 'Claus per reduir l’ansietat lligada a la hiperconnexió.',
    category: 'Xarxes i pantalles',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop',
    bullets: [
      'Defineix franges sense pantalles i pacta-les amb amics/família.',
      'Substitueix l’scroll per activitats socials/actives/creatives.',
      'Practica “micro-mindfulness” (3 respiracions profundes abans d’obrir una app).',
    ],
  },
  {
    id: 'neuro-habits-video',
    title: 'Vídeo: hàbits digitals i cervell',
    summary: 'Reforç intermitent i novetat: per què costa aturar-se.',
    category: 'Neuroeducació',
    mediaType: 'video',
    mediaUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g',
    bullets: [
      'Crea friccions: treu notificacions que no aportin.',
      'Dissenya cues positives: recordatoris de descans i d’aigua.',
      'Premia’t per períodes de focus sostingut (no amb pantalles).',
    ],
  },
  {
    id: 'desintoxicacio-suau',
    title: 'Desintoxicació suau (4 setmanes)',
    summary: 'Protocol gradual per reduir gratificació immediata.',
    category: 'Plans',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1496302662116-25d14f2f1e17?q=80&w=1600&auto=format&fit=crop',
    bullets: [
      'Setm 1: audita usos i elimina apps trampa a la pantalla inicial.',
      'Setm 2: franges “screen-free” (àpats, 1h abans de dormir).',
      'Setm 3: alternatives socials/actives/creatives.',
      'Setm 4: consolida hàbits i planifica manteniment.',
    ],
  },
  {
    id: 'respiracio-4-6',
    title: 'Respiració 4-6 per gestionar impulsos',
    summary: 'Calmar el sistema nerviós en 60-90 segons.',
    category: 'Regulació emocional',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop',
    bullets: [
      'Inspira 4 segons pel nas, expira 6 pel nas o la boca.',
      'Fes 6-10 cicles: notaràs el baixó d’arousal.',
      'Combina-ho amb etiquetar l’emoció (“estic frustrat/da”).',
    ],
  },
  {
    id: 'empatia-compassio',
    title: 'Empatia i compassió digital',
    summary: 'Evita malentesos i repara danys a converses online.',
    category: 'Relacions',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1600&auto=format&fit=crop',
    bullets: [
      'Comprova intencions: demana aclariments abans de reaccionar.',
      'Evita respondre en calent; fes una pausa curta.',
      'Si et passes, repara aviat. Importa el temps de resposta.',
    ],
  },
];
