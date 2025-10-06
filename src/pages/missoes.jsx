import { useState, useEffect, useRef } from 'react'; 
import arena from "../assets/arenaPokemon.png";
import { NavPages } from "../components/navPages";
import { MissaoModal } from '../components/missaoModal';
import { MissaoCard } from '../components/missaoCard';
import { missoes } from "../data/data";

export function Missoes() {
    const [listaDeMissoes, setListaDeMissoes] = useState(() => {
        const missoesConcluidasIds = JSON.parse(localStorage.getItem('missoesConcluidas')) || [];
        return missoes.map(missao => 
            missoesConcluidasIds.includes(missao.id) 
                ? { ...missao, status: 'concluida' } 
                : missao
        );
    });

    const [modalAberto, setModalAberto] = useState(false);
    const [missaoSelecionada, setMissaoSelecionada] = useState(null);
    const [feedback, setFeedback] = useState('');
    const triggerRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleFecharModal();
            }
        };

        if (modalAberto) {
            window.addEventListener('keydown', handleKeyDown);

            setTimeout(() => {
                const modalElement = document.querySelector('[role="dialog"]');
                if (modalElement) {
                    const firstFocusableElement = modalElement.querySelector('button');
                    if (firstFocusableElement) firstFocusableElement.focus();
                }
            }, 100);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [modalAberto]);

    const handleAbrirModal = (missao) => {
        if (missao.status === 'concluida') return;
        triggerRef.current = document.activeElement;
        setMissaoSelecionada(missao);
        setModalAberto(true);
    };

    const handleFecharModal = () => {
        setModalAberto(false);
        setMissaoSelecionada(null);
        if (triggerRef.current) {
            triggerRef.current.focus();
        }
    };

    const handleResponderMissao = (missaoId, respostaEscolhida) => {
        const missaoRespondida = listaDeMissoes.find(m => m.id === missaoId);

        if (missaoRespondida.respostaCorreta === respostaEscolhida) {
            let feedbackMsg = `Missão ${missaoId} concluída com sucesso!`;
            
            const novaLista = listaDeMissoes.map(missao => {
                if (missao.id === missaoId) return { ...missao, status: 'concluida' };
                return missao;
            });
            setListaDeMissoes(novaLista);

            const missoesConcluidasIds = novaLista.filter(m => m.status === 'concluida').map(m => m.id);
            localStorage.setItem('missoesConcluidas', JSON.stringify(missoesConcluidasIds));
            
            const totalConcluidas = missoesConcluidasIds.length;
            const insigniasAtuais = JSON.parse(localStorage.getItem('insigniasGanhas')) || [];
            const novasInsigniasCount = Math.floor(totalConcluidas / 3);

            if (novasInsigniasCount > insigniasAtuais.length) {
                const novasInsignias = Array.from({ length: novasInsigniasCount }, (_, i) => i + 1);
                localStorage.setItem('insigniasGanhas', JSON.stringify(novasInsignias));
                feedbackMsg += ' Você ganhou uma nova insígnia!'; 
            }

            setFeedback(feedbackMsg);
        } else {
            setFeedback('Resposta Incorreta.');
        }

        setTimeout(() => {
            handleFecharModal();
            setTimeout(() => setFeedback(''), 500);
        }, 1500);
    };

    return (
        <main className="flex items-center justify-center relative min-h-screen bg-black">
            <img src={arena} alt="plano de fundo de arena pokemon" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover z-0 blur-sm" />
            
            <section aria-labelledby="titulo-missoes" className="relative z-10 p-8 pt-24">
                <h1 id="titulo-missoes" className="text-5xl font-bold text-center text-white mb-10" style={{ textShadow: '2px 2px 4px #000000' }}>
                    Missões Disponíveis
                </h1>
                
                <ul className="flex flex-wrap justify-center gap-8 mb-40">
                    {listaDeMissoes.map((missao) => (
                        <li key={missao.id}>
                            <MissaoCard
                                missao={missao}
                                onCardClick={handleAbrirModal}
                            />
                        </li>
                    ))}
                </ul>
                <NavPages />
            </section>

            {modalAberto && missaoSelecionada && (
                <MissaoModal
                    {...missaoSelecionada} 
                    onClose={handleFecharModal}
                    onResponder={handleResponderMissao} 
                />
            )}

            <div 
                role="alert" 
                aria-live="assertive"
                className={`fixed bottom-5 left-1/2 -translate-x-1/2 p-4 rounded-lg text-white font-bold shadow-lg transition-all duration-300
                    ${feedback ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
                    ${feedback.includes('sucesso') ? 'bg-green-600' : 'bg-red-600'}`}
            >
                {feedback}
            </div>
        </main>
    );
}