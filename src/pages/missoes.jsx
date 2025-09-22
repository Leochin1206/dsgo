import { useState } from 'react';
import arena from "../assets/arenaPokemon.png";
import { NavPages } from "../components/navPages";
import { MissaoModal } from '../components/missaoModal';
import { MissaoCard } from '../components/missaoCard';
import { missoes } from "../data/data";

export function Missoes() {
    const [listaDeMissoes, setListaDeMissoes] = useState(missoes);
    const [modalAberto, setModalAberto] = useState(false);
    const [missaoSelecionada, setMissaoSelecionada] = useState(null);
    const [feedback, setFeedback] = useState('');

    const handleAbrirModal = (missao) => {
        if (missao.status === 'concluida') return;
        setMissaoSelecionada(missao);
        setModalAberto(true);
    };

    const handleFecharModal = () => {
        setModalAberto(false);
        setMissaoSelecionada(null);
    };

    const handleResponderMissao = (missaoId, respostaEscolhida) => {
        const missaoRespondida = listaDeMissoes.find(m => m.id === missaoId);

        if (missaoRespondida.respostaCorreta === respostaEscolhida) {
            setFeedback(`Missão ${missaoId} concluída com sucesso!`);
            
            const novaLista = listaDeMissoes.map(missao => {
                if (missao.id === missaoId) {
                    return { ...missao, status: 'concluida' };
                }
                return missao;
            });
            setListaDeMissoes(novaLista);
        } else {
            setFeedback('Resposta Incorreta.');
        }

        setTimeout(() => {
            handleFecharModal();
        }, 1500);
    };

    return (
        <main className="flex items-center justify-center relative min-h-screen bg-black">
            <img src={arena} alt="plano de fundo de arena pokemon" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover z-0 blur-sm" />
            
            <section aria-labelledby="titulo-missoes" className="relative z-10 p-8 pt-24">
                <h1 id="titulo-missoes" className="text-5xl font-bold text-center text-white mb-10" style={{ textShadow: '2px 2px 4px #000000' }} >
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

            {feedback && (
                <div role="alert" className="sr-only">
                    {feedback}
                </div>
            )}
        </main>
    );
}