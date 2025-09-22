import { useState } from 'react';

export function MissaoModal({ id, titulo, descricao, opcaoA, opcaoB, opcaoC, opcaoD, respostaCorreta, onClose, onResponder }) {
    const [respostaDada, setRespostaDada] = useState(null);
    const [feedbackAcessivel, setFeedbackAcessivel] = useState('');

    const handleEscolherOpcao = (opcaoEscolhida) => {
        if (respostaDada) return;

        setRespostaDada(opcaoEscolhida);
        onResponder(id, opcaoEscolhida);

        if (opcaoEscolhida === respostaCorreta) {
            setFeedbackAcessivel('Resposta Correta!');
        } else {
            setFeedbackAcessivel('Resposta Incorreta.');
        }
    };

    const getButtonClass = (opcao) => {
        if (!respostaDada) {
            return "bg-blue-600 hover:bg-blue-700";
        }
        if (opcao === respostaCorreta) {
            return "bg-green-500";
        }
        if (opcao === respostaDada && opcao !== respostaCorreta) {
            return "bg-red-500";
        }
        return "bg-gray-500 opacity-50";
    };

    const opcoes = { A: opcaoA, B: opcaoB, C: opcaoC, D: opcaoD };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-titulo" aria-describedby="modal-descricao"
                className="relative text-white bg-gray-900 bg-opacity-90 border-2 border-yellow-500 p-8 rounded-lg w-11/12 max-w-2xl text-center"
            >
                <button onClick={onClose} disabled={respostaDada} aria-label="Fechar modal"
                    className="absolute top-4 right-4 text-2xl font-bold hover:text-yellow-400 disabled:text-gray-600"
                >
                    <span aria-hidden="true">&times;</span>
                </button>

                <h1 id="modal-titulo" className="text-3xl font-bold mb-4 text-yellow-400">{titulo}</h1>
                <p id="modal-descricao" className="text-lg mb-6">{descricao}</p>
                
                <div role="group" aria-labelledby="modal-descricao" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(opcoes).map(([letra, texto]) => (
                        <button key={letra} onClick={() => handleEscolherOpcao(letra)} disabled={respostaDada}
                            className={`${getButtonClass(letra)} p-3 rounded-md transition-colors text-white font-semibold disabled:cursor-not-allowed`}
                        >
                            {texto}
                        </button>
                    ))}
                </div>
                
                {feedbackAcessivel && (
                    <div role="alert" className="sr-only">
                        {feedbackAcessivel}
                    </div>
                )}
            </div>
        </div>
    );
}