import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/dsgoLogo.png'; 

export function Cadastro() {
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        mode: "onBlur" 
    });

    const onSubmit = async (data) => {
        setMessage('');
        setIsError(false);

        const treatedData = {
            ...data,
            nome: data.nome.trim(),
            email: data.email.trim(),
            endereco: data.endereco.trim(),
            numero_endereco: data.numero_endereco.trim(),
            complemento: data.complemento ? data.complemento.trim() : null,
            pokemon_favorito: data.pokemon_favorito ? data.pokemon_favorito.trim() : null,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/users/', treatedData);
            
            setIsError(false);
            setMessage(`Usuário "${response.data.nome}" cadastrado com sucesso! Redirecionando para o login...`);
            reset();
            setTimeout(() => { navigate('/'); }, 2000);

        } catch (error) {
            setIsError(true);
            if (error.response?.data?.detail) {
                setMessage(error.response.data.detail);
            } else {
                setMessage("Ocorreu um erro ao tentar cadastrar o usuário.");
            }
        }
    };

    return (
        <main className="flex flex-col items-center justify-center bg-gray-100">
            <h1 className='mb-20 opacity-0'>.</h1>

            <Link to="/">
                <img src={logo} alt="Logo da plataforma DSGO" className="mb-6 w-48" />
            </Link>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl"
                noValidate
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Criar nova conta
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="md:col-span-2">
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input type="text" id="nome"
                            {...register("nome", { 
                                required: "O nome é obrigatório.",
                                minLength: { value: 3, message: "O nome deve ter no mínimo 3 caracteres." },
                                maxLength: { value: 100, message: "O nome é longo demais." },
                                validate: (value) => value.trim() !== "" || "O nome não pode ser apenas espaços.",
                                pattern: {
                                    value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, 
                                    message: "O nome deve conter apenas letras."
                                }
                            })}
                            className={`mt-1 block w-full p-2 border ${errors.nome ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                        />
                        {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email"
                            {...register("email", {
                                required: "O e-mail é obrigatório.",
                                pattern: { 
                                    value: /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/,
                                    message: "Informe um e-mail válido." 
                                },
                                maxLength: {
                                    value: 254,
                                    message: "O e-mail é longo demais."
                                },
                                validate: (value) => value.trim() !== "" || "O e-mail não pode conter apenas espaços."
                            })}
                            className={`mt-1 block w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" id="senha"
                            {...register("senha", {
                                required: "A senha é obrigatória.",
                                minLength: { value: 6, message: "A senha deve ter no mínimo 6 caracteres." },
                                validate: (value) => value.trim() !== "" || "A senha não pode conter apenas espaços."
                            })}
                            className={`mt-1 block w-full p-2 border ${errors.senha ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                        />
                        {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                        <input type="date" id="data_nascimento"
                            {...register("data_nascimento", { 
                                required: "A data é obrigatória.",
                                validate: (value) => {
                                    const today = new Date();
                                    const inputDate = new Date(value);
                                    today.setHours(0, 0, 0, 0); 
                                    return inputDate <= today || "A data de nascimento não pode ser no futuro.";
                                }
                            })}
                            className={`mt-1 block w-full p-2 border ${errors.data_nascimento ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                        />
                        {errors.data_nascimento && <p className="text-red-500 text-sm mt-1">{errors.data_nascimento.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">Endereço (Rua, Av.)</label>
                        <input type="text" id="endereco"
                            {...register("endereco", { 
                                required: "O endereço é obrigatório.",
                                minLength: { value: 5, message: "O endereço parece curto demais." },
                                maxLength: { value: 200, message: "O endereço é longo demais (máx 200)." },
                                validate: (value) => value.trim() !== "" || "O endereço não pode ser apenas espaços."
                            })}
                            className={`mt-1 block w-full p-2 border ${errors.endereco ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                        />
                        {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="numero_endereco" className="block text-sm font-medium text-gray-700">Número</label>
                        <input type="text" id="numero_endereco"
                            {...register("numero_endereco", { 
                                required: "O número é obrigatório.",
                                maxLength: { value: 20, message: "O número é longo demais (máx 20)." },
                                validate: (value) => value.trim() !== "" || "O número não pode ser apenas espaços."
                            })}
                            className={`mt-1 block w-full p-2 border ${errors.numero_endereco ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                        />
                        {errors.numero_endereco && <p className="text-red-500 text-sm mt-1">{errors.numero_endereco.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">Complemento (Opcional)</label>
                        <input type="text" id="complemento"
                            {...register("complemento", {
                                maxLength: { value: 100, message: "O complemento é longo demais (máx 100)." }
                            })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.complemento && <p className="text-red-500 text-sm mt-1">{errors.complemento.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="pokemon_favorito" className="block text-sm font-medium text-gray-700">Pokémon Favorito (Opcional)</label>
                        <input type="text" id="pokemon_favorito"
                            {...register("pokemon_favorito", {
                                maxLength: { value: 50, message: "O nome é longo demais (máx 50)." }
                            })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.pokemon_favorito && <p className="text-red-500 text-sm mt-1">{errors.pokemon_favorito.message}</p>}
                    </div>
                </div>

                {message && (
                    <div className={`mt-6 text-center p-3 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <button type="submit"
                    disabled={isSubmitting} 
                    className="mt-6 bg-gradient-to-b from-[#00B4D8] to-[#0096C7] text-white p-3 text-lg w-full flex items-center justify-center rounded-md hover:shadow-xl transition-all duration-200 hover:to-[#00B4D8] hover:from-[#0096C7] disabled:opacity-70 disabled:cursor-not-allowed" // Estilos de desabilitado
                >
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                </button>

                <p className="text-center mt-6 text-sm">
                    Já tem uma conta?
                    <Link to="/" className="ml-1 font-medium text-[#0096C7] hover:text-[#00B4D8]">
                        Faça login
                    </Link>
                </p>
            </form>
            <h1 className='mb-20 opacity-0'>.</h1>
        </main>
    );
}