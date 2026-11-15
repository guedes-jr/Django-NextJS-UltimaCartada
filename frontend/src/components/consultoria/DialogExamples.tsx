"use client";

import { useId, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import styles from "./DialogExamples.module.css";

export function DialogExamples() {
  const [open, setOpen] = useState(false);
  const [nested, setNested] = useState(false);
  const [locked, setLocked] = useState(false);
  const fieldId = useId();
  return <div className={styles.example}>
    <button type="button" onClick={() => setOpen(true)}>Abrir demonstração de diálogo</button>
    <p>Exemplo sem cadastro, envio de dados ou conteúdo de participantes. Confira Tab, Shift+Tab, Escape e o retorno ao botão que abriu o diálogo.</p>
    <Modal title="Demonstração de acessibilidade" isOpen={open} closeDisabled={locked} closeOnBackdrop onClose={() => { if (!locked) { setOpen(false); setNested(false); } }}>
      <div className={styles.content}>
        <p>Este diálogo usa o mesmo componente da aplicação. O campo abaixo é apenas local e não é enviado ou armazenado.</p>
        <label htmlFor={fieldId}>Campo de teste</label><input id={fieldId} placeholder="Teste a navegação por teclado" />
        <label className={styles.checkbox}><input type="checkbox" checked={locked} onChange={(event) => setLocked(event.target.checked)} />Bloquear fechamento para testar o estado ocupado</label>
        <p>{locked ? "Fechamento bloqueado. Desmarque a opção para fechar." : "O diálogo pode ser fechado por Escape, pelo botão ou pelo fundo."}</p>
        <button type="button" onClick={() => setNested(true)}>Abrir segundo diálogo</button>
        <button type="button" disabled={locked} onClick={() => setOpen(false)}>Fechar demonstração</button>
      </div>
    </Modal>
    <Modal title="Segundo diálogo de demonstração" isOpen={nested} onClose={() => setNested(false)}>
      <div className={styles.content}><p>Ao fechar este diálogo, confira se o foco retorna ao primeiro e se a página ao fundo continua sem rolagem.</p><button type="button" onClick={() => setNested(false)}>Voltar ao primeiro diálogo</button></div>
    </Modal>
  </div>;
}
