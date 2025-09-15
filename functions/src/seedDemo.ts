// functions/src/seedDemo.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const DEMO_ARTICLES = [
  {
    id: 'que-es-addiccio-comportamental',
    title: 'Què és una addicció comportamental?',
    summary:
      'Quan una conducta passa de costum a problema? Senyals clau i per què és una malaltia (no una feblesa).',
    content:
      'Una addicció comportamental és un patró compulsiu amb pèrdua de control, que ocupa molt temps i perjudica àrees de la vida. Sovint apareixen tolerància (cal fer-ne més per sentir el mateix) i abstinència (malestar si no es fa). El focus útil és entendre que hi ha canvis al cervell i cal tractament i habilitats per gestionar emocions i impulsos.',
    category: 'Bases',
    mediaType: 'image',
    mediaUrl: '',
  },
  {
    id: 'fomo-nomofobia-xarxes',
    title: 'FOMO, nomofòbia i xarxes: què hi ha al darrere?',
    summary:
      'El mòbil no “crea” addicció sol; el problema és el contingut i l’ús. Claus per fer-ne un ús conscient.',
    content:
      'Conceptes com FOMO (por a perdre’s coses) o nomofòbia descriuen ansietats associades a xarxes i mòbil. El risc real és quan busquem alleujar el malestar amb scroll infinit. Prevenció: objectius clars d’ús, franges sense pantalla, i activitats alternatives gratificants perquè la dopamina no provingui només del mòbil.',
    category: 'Xarxes i pantalles',
    mediaType: 'image',
    mediaUrl: '',
  },
  {
    id: 'familia-limits-afecte',
    title: 'A casa: límits clars + afecte = protecció',
    summary:
      'Combinació de normes consistents i clima de confiança. Idees pràctiques per a famílies.',
    content:
      'La prevenció funciona millor amb límits clars (temps, llocs i contingut), rutines i diàleg sense judicis. Planifiqueu alternatives saludables, eviteu mòbil al llit, i parleu d’emocions. Si hi ha senyals d’alarma, busqueu ajuda professional i coordineu-vos amb l’escola. Les intervencions sostingudes canvien hàbits.',
    category: 'Família',
    mediaType: 'image',
    mediaUrl: '',
  },
];

const DEMO_MYTHS = [
  {
    id: 'mobil-crea-addiccio',
    title: '“El mòbil, per si sol, crea addicció”',
    myth: 'El dispositiu és el problema principal.',
    reality:
      'El risc és com i per què l’utilitzem (contingut dissenyat per captar atenció, alleujar malestars). Cal treballar límits i regulació emocional, no només prohibicions.',
    isMyth: true,
  },
  {
    id: 'ludopatia-nomes-adults',
    title: '“La ludopatia només afecta adults”',
    myth: 'Els adolescents no hi cauen.',
    reality:
      'També afecta joves. Senyals: temps i diners creixents, mentides, baixada de rendiment, aïllament. Cal cribratge i límits clars.',
    isMyth: true,
  },
  {
    id: 'sense-substancies-sense-addiccio',
    title: '“Si no consumeixo substàncies, no puc tenir addicció”',
    myth: 'Les addiccions són només a drogues.',
    reality:
      'Les conductuals (joc, videojocs, compres, sexe, xarxes) també mostren pèrdua de control, tolerància i abstinència.',
    isMyth: true,
  },
  {
    id: 'parlar-ne-incita',
    title: '“Parlar-ne a classe anima a provar-ho”',
    myth: 'Millor no tocar el tema.',
    reality:
      'La informació objectiva + tallers interactius redueixen risc. L’efectiu és la durada i la pràctica sostinguda, no la xerrada puntual.',
    isMyth: true,
  },
  {
    id: 'nomes-voluntat',
    title: '“Només cal força de voluntat”',
    myth: 'És un tema de caràcter.',
    reality:
      'És una malaltia amb factors biològics i psicosocials. Ajuda professional, grups i habilitats d’afrontament marquen la diferència.',
    isMyth: true,
  },
  {
    id: 'sexting-inofensiu',
    title: '“El sexting és inofensiu si hi ha confiança”',
    myth: 'No passa res.',
    reality:
      'Hi ha risc de difusió, assetjament o xantatge. Educar en límits, consentiment i seguretat és clau.',
    isMyth: true,
  },
];

export const seedDemoContent = functions
  .region('europe-west1')
  .https.onCall(async (_data, _context) => {
    const db = admin.firestore();
    const articlesCol = db.collection('articles');
    const mythsCol = db.collection('myths');

    const [aSnap, mSnap] = await Promise.all([
      articlesCol.limit(1).get(),
      mythsCol.limit(1).get(),
    ]);

    let articles = 0;
    let myths = 0;
    const batch = db.batch();

    if (aSnap.empty) {
      for (const a of DEMO_ARTICLES) {
        const ref = articlesCol.doc(a.id);
        const { id, ...rest } = a;
        batch.set(
          ref,
          { ...rest, createdAt: admin.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        );
        articles++;
      }
    }

    if (mSnap.empty) {
      for (const m of DEMO_MYTHS) {
        const ref = mythsCol.doc(m.id);
        const { id, ...rest } = m;
        batch.set(
          ref,
          { ...rest, createdAt: admin.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        );
        myths++;
      }
    }

    if (articles + myths === 0) {
      return { articles, myths, skipped: true };
    }

    await batch.commit();
    return { articles, myths, skipped: false };
  });
