export function MissaoCard({ missao, onCardClick }) {
  const concluida = missao.status === 'concluida';
  const cardId = `missao-card-${missao.id}`;
  const tituloId = `missao-titulo-${missao.id}`;

  const handleKeyDown = (event) => {
    if (!concluida && (event.key === 'Enter' || event.key === ' ')) {
      onCardClick(missao);
    }
  };

  return (
    <article id={cardId} onClick={() => !concluida && onCardClick(missao)} onKeyDown={handleKeyDown} role="button" tabIndex={concluida ? -1 : 0} aria-labelledby={tituloId} aria-describedby={`${tituloId} status-missao-${missao.id}`} aria-disabled={concluida}
      className={`bg-gray-800 bg-opacity-70 text-white p-6 rounded-lg w-80 h-48 flex flex-col items-center 
                 justify-between border-2 transition-all duration-300
                 ${concluida
          ? 'border-green-500 cursor-not-allowed opacity-70'
          : 'border-transparent hover:border-yellow-400 cursor-pointer'}`
      }
    >
      <h3 id={tituloId} className={`text-xl font-bold ${concluida ? 'text-green-400' : 'text-yellow-300'}`} >
        {`Missão ${missao.id}: ${missao.titulo}`}
      </h3>

      <div id={`status-missao-${missao.id}`}
        className={`mt-4 w-full py-2 rounded-md font-semibold transition-colors text-center
                   ${concluida ? 'bg-green-600' : 'bg-blue-600'}`
        } >
        {concluida ? "Missão Concluída ✔️" : "Iniciar Missão"}
      </div>
    </article>
  )
}