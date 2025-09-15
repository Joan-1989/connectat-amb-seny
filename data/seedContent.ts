// data/seedContent.ts
import type { Article, Myth } from '../types';

export const SEED_ARTICLES: Article[] = [
  {
    id: 'que-es-addiccio-comportamental',
    title: 'Què és una addicció comportamental?',
    summary:
      'Quan una conducta passa de costum a problema? Senyals clau i per què és una malaltia (no una feblesa).',
    content:
      'Una addicció comportamental és un patró compulsiu amb pèrdua de control que impacta àrees de la vida. Sovint hi ha tolerància (cal fer-ne més) i abstinència (malestar si no es fa). Calen habilitats d’afrontament, suport i, si cal, tractament.',
    category: 'Bases',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'fomo-nomofobia-xarxes',
    title: 'FOMO i nomofòbia: què hi ha al darrere?',
    summary:
      'El risc real no és el mòbil sinó l’ús que en fem. Claus per a un ús conscient i saludable.',
    content:
      'FOMO i nomofòbia descriuen ansietats lligades a la hiperconnexió. L’alleujament curt del “scroll” manté el problema. Estratègies: objectius d’ús, franges sense pantalla, activitats alternatives i entrenament d’habilitats (mindfulness, assertivitat, planificació).',
    category: 'Xarxes i pantalles',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'video-explicatiu-habits',
    title: 'Vídeo: hàbits digitals i cervell',
    summary:
      'Com afecta el reforç intermitent i la novetat al cervell? 3 idees clau i 3 hàbits.',
    content:
      'El reforç intermitent i la novetat constant capten atenció i dificulten aturades voluntàries. Cues/friccions, franges sense pantalles i alternatives gratificants (social/actiu/creatiu).',
    category: 'Neuroeducació',
    mediaType: 'video',
    mediaUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g',
  },
  {
    id: 'familia-limits-afecte',
    title: 'A casa: límits clars + afecte = protecció',
    summary:
      'Combinació de normes consistents i clima de confiança. Idees pràctiques per a famílies.',
    content:
      'Límits clars (temps, llocs, contingut), rutines i diàleg sense judicis. Alternatives saludables, evitar mòbil al llit, parlar d’emocions. Si hi ha senyals d’alarma, busca ajuda i coordina’t amb l’escola.',
    category: 'Família',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'joc-risc-senyals',
    title: 'Joc de risc: senyals d’alerta',
    summary:
      'Augment de temps/diners, mentides, irritabilitat si no juga… què observar i com actuar.',
    content:
      'Senyals: tolerància, pèrdua de control, problemes acadèmics/laborals, aïllament i deutes. Actua: parlar des del “jo”, pactar límits, reduir accessos, buscar suport professional i social.',
    category: 'Joc',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'impulsivitat-regulacio',
    title: 'Impulsivitat i regulació emocional',
    summary:
      'Del “fer sense pensar” al “pensa-sent-actua”: microestratègies per a adolescents.',
    content:
      'Pausa 10s, respiració 4-6, etiquetar emocions, postergar 15’, canviar context, autorecompenses tardanes. Practica primer en situacions fàcils.',
    category: 'Habilitats',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'assertivitat-dir-no',
    title: 'Assertivitat: dir “no” sense culpa',
    summary:
      'Plantilles simples per posar límits amb respecte i cuidar la relació.',
    content:
      'Model DESO: Descriu, Expressa, Solució, Outcome. Ex.: “Quan m’escrius a la nit (Descric), em poso nerviós (Expresso). Preferiria parlar demà al matí (Solució). Així dormiré millor i estaré més atent (Outcome)”.',
    category: 'Habilitats',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'empatia-compassio',
    title: 'Empatia i compassió digital',
    summary:
      'Llegir el context, evitar malentesos i reparar danys en converses online.',
    content:
      'Comprova intenció abans de reaccionar, evita respostes en calent, demana aclariments, usa to amable i emoticones amb mesura. Si et passes, repara aviat.',
    category: 'Relacions',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'desintoxicacio-suau',
    title: 'Desintoxicació suau de pantalles',
    summary:
      'Protocol en 4 setmanes per reduir gratificació immediata i recuperar el focus.',
    content:
      'Setm 1: audita usos; Setm 2: franges sense pantalles; Setm 3: substitucions (social/actiu/creatiu); Setm 4: consolidar i premiar esforç. Ajusta’l a la teva realitat.',
    category: 'Plans',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1496302662116-25d14f2f1e17?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'red flags',
    title: 'Senyals d’alerta a xarxes i jocs',
    summary:
      'Checklist ràpida per detectar problemes en tu o en algú proper.',
    content:
      'Mentides sobre temps/diners, irritabilitat si no es connecta, pensaments constants sobre jugar/publicar, aïllament, baixada de notes, pèrdua d’interès en altres activitats.',
    category: 'Cribratge',
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
  },
];

export const SEED_MYTHS: Myth[] = [
  {
    id: 'mobil-crea-addiccio',
    title: '“El mòbil, per si sol, crea addicció”',
    myth: 'El dispositiu és el problema principal.',
    reality:
      'El risc és com i per què l’utilitzem. Cal límits i regulació emocional, no només prohibicions.',
    isMyth: true,
  },
  {
    id: 'ludopatia-nomes-adults',
    title: '“La ludopatia només afecta adults”',
    myth: 'Els adolescents no hi cauen.',
    reality:
      'També pot afectar joves. Senyals: temps/diners, mentides, baixada de rendiment, aïllament.',
    isMyth: true,
  },
  {
    id: 'sense-substancies-sense-addiccio',
    title: '“Sense substàncies no hi ha addicció”',
    myth: 'Les addiccions són només a drogues.',
    reality:
      'Les conductuals (joc, videojocs, compres, sexe, xarxes) també comporten pèrdua de control.',
    isMyth: true,
  },
  {
    id: 'parlar-ne-incita',
    title: '“Parlar-ne anima a provar-ho”',
    myth: 'Millor no tocar el tema.',
    reality:
      'La informació objectiva + tallers interactius redueixen el risc. La clau és la pràctica sostinguda.',
    isMyth: true,
  },
  {
    id: 'nomes-voluntat',
    title: '“Només cal voluntat”',
    myth: 'És un tema de caràcter.',
    reality:
      'És una malaltia amb factors biològics i psicosocials. Suport professional i habilitats ajuden.',
    isMyth: true,
  },
  {
    id: 'sexting-inofensiu',
    title: '“El sexting és inofensiu si hi ha confiança”',
    myth: 'No passa res.',
    reality:
      'Risc de difusió, assetjament o xantatge. Educar en límits, consentiment i seguretat és clau.',
    isMyth: true,
  },
  {
    id: 'videojocs-millers-nens',
    title: '“Els videojocs sempre són dolents”',
    myth: 'Tots tenen efectes negatius.',
    reality:
      'L’ús moderat i curat pot aportar socialització, coordinació i creativitat. El problema és l’abús.',
    isMyth: true,
  },
  {
    id: 'apps-control-total',
    title: '“Amb apps de control ja n’hi ha prou”',
    myth: 'Instal·lar una app és la solució definitiva.',
    reality:
      'Ajuda, però sense hàbits i diàleg no funciona. Cal educació digital i límits consensuats.',
    isMyth: true,
  },
];
