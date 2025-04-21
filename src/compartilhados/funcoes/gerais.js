/**
 * Gera um UUID que deve ser único
 */
export const gerarUid = () => {
  if (crypto?.randomUUID) {
    /**
     * Isso é a versão ideal, que deve ser suportada por todos navegadores modernos
     */
    const newUid = crypto.randomUUID();

    return newUid;
  }

  console.warn("Por algum motivo o navegador não está suportando a api crypto\nTem chance do UUID não ser tão único assim");

  /**
   * Versão alternativa caso a principal não funcione no navegador
   */
  const newUid =
    Date.now().toString(36) + Math.random().toString(36).substring(2);

  return newUid;
};