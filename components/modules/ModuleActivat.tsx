// components/modules/ModuleActivat.tsx
import React, { useState } from 'react';
import type { UserProfile } from '../../types';

interface ModuleActivatProps {
  profile: UserProfile | null;
}

function HelpModal({ onClose }: { onClose: () => void }): React.ReactElement {
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 id="help-modal-title" className="text-xl font-bold text-brand-dark">
            Ajuda immediata
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
            aria-label="Tancar"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          Explica breument què necessites. Ens ajuda a orientar-te millor.
        </p>

        <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="help-topic" className="block text-sm font-medium text-gray-700">
              Tema
            </label>
            <select
              id="help-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">— Selecciona un tema —</option>
              <option value="assetjament">Assetjament</option>
              <option value="seguretat">Seguretat digital</option>
              <option value="benestar">Benestar emocional</option>
              <option value="altres">Altres</option>
            </select>
          </div>

          <div>
            <label htmlFor="help-message" className="block text-sm font-medium text-gray-700">
              Explica’ns què passa
            </label>
            <textarea
              id="help-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Escriu aquí…"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="rounded bg-brand-primary px-4 py-2 text-sm font-bold text-white hover:bg-brand-secondary"
              aria-label="Enviar sol·licitud d’ajuda"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FamilyEducatorSpace(): React.ReactElement {
  return (
    <section className="mt-6 rounded-lg bg-white p-4 shadow-md">
      <h3 className="text-lg font-semibold text-brand-dark">Espai per a famílies i educadors</h3>
      <p className="mt-1 text-sm text-gray-600">
        Recursos pràctics per acompanyar adolescents: guies d&apos;assertivitat, protocols bàsics de
        seguretat i dinàmiques per fer a casa o a l&apos;aula.
      </p>
      <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
        <li>Com parlar de límits digitals</li>
        <li>Com actuar davant l&apos;assetjament</li>
        <li>Idees de converses obertes i no judicatives</li>
      </ul>
    </section>
  );
}

export default function ModuleActivat({ profile }: ModuleActivatProps): React.ReactElement {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const isAdultProfile =
    profile?.type === 'Tutor' || profile?.type === 'Professional';

  return (
    <div className="animate-fade-in">
      <h2 className="mb-6 text-2xl font-bold text-brand-dark">Activa&apos;t</h2>

      <button
        type="button"
        onClick={() => setShowHelpModal(true)}
        className="w-full transform rounded-lg bg-red-500 px-4 py-4 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-red-600"
      >
        Botó d&apos;Ajuda Immediata
      </button>

      {isAdultProfile && <FamilyEducatorSpace />}

      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
    </div>
  );
}
