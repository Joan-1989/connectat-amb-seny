// data/guides.ts
import type { Guide } from '../types';

export const GUIDES: Guide[] = [
  {
    id: 'senyals-alerta',
    title: 'Senyals d’alerta (quan una conducta preocupa?)',
    summary:
      'Checklist ràpida per detectar possibles problemes amb pantalles, joc, compres, xarxes… i què fer a continuació.',
    hero: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop',
      alt: 'Persona pensant davant d’una finestra',
    },
    sections: [
      {
        title: 'Senyals en el dia a dia',
        bullets: [
          'Pèrdua de control: “dic 10 minuts i acabo fent 2 hores”.',
          'Interferència: baixa el rendiment a classe o feina.',
          'Mentides o ocultacions sobre el temps i els diners.',
          'Aïllament social, canvis d’humor, irritabilitat.',
          'Tolerància (cada cop “cal més”) i malestar si no ho fas (abstinència).',
        ],
      },
      {
        title: 'Què fer si reconec aquests senyals?',
        bullets: [
          'Parlar-ne sense jutjar; escolta activa i curiositat.',
          'Acordar límits concrets i visibles (temps, llocs, diners).',
          'Introduir alternatives gratificants fora de pantalles.',
          'Fer seguiment sostingut (setmanal), no una xerrada puntual.',
          'Buscar ajuda professional si el malestar persisteix.',
        ],
        image: {
          type: 'image',
          url: 'https://unsplash.com/es/fotos/una-mujer-sentada-en-una-mesa-escribiendo-en-un-pedazo-de-papel-jqVJK5On_ec',
          alt: 'Checklists i retoladors sobre una taula',
        },
      },
    ],
  },
  {
    id: 'autoregulacio-eines',
    title: 'Eines d’autoregulació (pràctiques i ràpides)',
    summary:
      'Respiració 4–6, pausa STOP, plans “si… aleshores…”, micro-hàbits i recordatoris visuals.',
    hero: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop',
      alt: 'Persona respirant a l’aire lliure',
    },
    sections: [
      {
        title: 'Respiració 4–6',
        bullets: [
          'Inspira 4 segons, espira 6 segons (2–3 minuts).',
          'Ajuda a baixar la freqüència cardíaca i la urgència.',
          'Fes-ho abans d’obrir una app “enganxosa”.',
        ],
      },
      {
        title: 'Pausa STOP',
        bullets: [
          'S – Stop: atura’t uns segons.',
          'T – Take a breath: respira profund 2–3 vegades.',
          'O – Observe: què penso? què sento? què vull aconseguir?',
          'P – Proceed: continua amb una acció alineada amb els teus valors.',
        ],
      },
      {
        title: 'Si… aleshores…',
        bullets: [
          '“Si em ve craving d’scroll, aleshores m’aixeco i bec un got d’aigua.”',
          '“Si passo 20’ concentrat, aleshores em prenc 5’ de descans conscient.”',
        ],
        image: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
          alt: 'Post-its de plans i objectius',
        },
      },
    ],
  },
  {
    id: 'parlar-a-casa',
    title: 'Com parlar-ne a casa (sense baralles)',
    summary:
      'Guia per obrir conversa, validar emocions i acordar límits realistes que es compleixin.',
    hero: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop',
      alt: 'Família parlant al menjador',
    },
    sections: [
      {
        title: 'Iniciar la conversa',
        bullets: [
          'Tria un moment tranquil (no en calent).',
          'Fes preguntes obertes: “Com t’has sentit…?”',
          'Reflecteix: “Et noto saturat quan… és així?”',
        ],
      },
      {
        title: 'Acordar límits que funcionin',
        bullets: [
          'Concrets i visibles: temps, llocs, contingut.',
          'Inclou alternatives (esport, amistats, creativitat).',
          'Revisió setmanal: què ha funcionat? què ajustem?',
        ],
      },
    ],
  },
  {
    id: 'satisfaccio-diferida',
    title: 'Reduir la satisfacció immediata',
    summary:
      'Trucs per trencar el bucle d’immediatesa: franges sense pantalla, premis diferits, pre-commitment i bloquejadors.',
    hero: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop',
      alt: 'Rellotge de sorra',
    },
    sections: [
      {
        title: 'Franges sense pantalla',
        bullets: [
          'Primera hora del dia i darrera hora: sense mòbil.',
          'Àpats i habitació: zones “lliures de pantalles”.',
        ],
      },
      {
        title: 'Pre-commitment',
        bullets: [
          'Temporitzadors/llindars (ex.: 30 min/dia xarxes).',
          'Bloquejadors d’apps en horari d’estudi/son.',
        ],
      },
    ],
  },
  {
    id: 'empatia-compassio',
    title: 'Empatia i compassió (per a tu i pels altres)',
    summary:
      'Perspectiva de l’altre, auto-compassió breu i gestos amables que reforcen el vincle.',
    hero: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1478476868527-002ae3f3e159?q=80&w=1600&auto=format&fit=crop',
      alt: 'Mans donant suport',
    },
    sections: [
      {
        title: 'Canvi de perspectiva',
        bullets: [
          '“Si fos el/la meu/va amic/ga… què li diria?”',
          'Detecta necessitats darrere del comportament.',
        ],
      },
      {
        title: 'Moment amable',
        bullets: [
          'Mà sobre el pit, respiració profunda i una frase amable per a tu mateix/a.',
          'Trenca el bucle d’autocrítica i impulsa el canvi realista.',
        ],
      },
    ],
  },
  {
    id: 'escolta-activa',
    title: 'Escolta activa: OARS en català',
    summary:
      'Preguntes obertes, validacions, reflexions i resums breus que baixen defenses i obren possibilitats.',
    hero: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop',
      alt: 'Dues persones conversant',
    },
    sections: [
      {
        title: 'O (Open questions)',
        bullets: [
          '“Com t’ha anat avui amb…?” “Què t’ajudaria…?”',
        ],
      },
      {
        title: 'A (Affirmations)',
        bullets: [
          '“Valoro que ho expliquis.” “Has fet un pas difícil.”',
        ],
      },
      {
        title: 'R (Reflections)',
        bullets: [
          '“Et sents frustrat quan… perquè…”',
        ],
      },
      {
        title: 'S (Summaries)',
        bullets: [
          '“En resum, vols millorar X i proposem provar Y aquesta setmana.”',
        ],
      },
    ],
  },
];
