import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/dsgoLogo.png';

export function Init() {
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm({
        mode: "onBlur" 
    });
    
    const navigate = useNavigate(); 

    const onSubmit = async (data) => {
        setMessage('');
        setIsError(false);
        
        const formData = new URLSearchParams();
        formData.append('username', data.email.trim()); 
        formData.append('password', data.senha);

        try {
            const response = await axios.post('http://127.0.0.1:8000/token/', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            setIsError(false);
            setMessage('Login bem-sucedido! Redirecionando...');
            setTimeout(() => {navigate('/home');}, 1000);

        } catch (error) {
            setIsError(true);
            if (error.response?.data?.detail) {
                setMessage(error.response.data.detail);
            } else {
                setMessage('Email ou senha inválidos.');
            }
        }
    };

    return (
        <main className="w-screen min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4">
            <Link to="/">
                <img src={logo} alt="Logo da plataforma DSGO" className="mb-6 w-48" />
            </Link>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
                noValidate
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Fazer Login
                </h2>

                <div className="flex flex-col gap-4">
                    <div>
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
                                validate: (value) => 
                                    value.trim() !== "" || "O e-mail não pode conter apenas espaços."
                            })}
                            className={`mt-1 block w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" id="senha"
                            {...register("senha", {
                                required: "A senha é obrigatória.",
                                minLength: {
                                    value: 6, 
                                    message: "A senha deve ter no mínimo 6 caracteres."
                                },
                                validate: (value) => 
                                    value.trim() !== "" || "A senha não pode conter apenas espaços."
                            })}
                            className={`mt-1 block w-full p-2 border ${errors.senha ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                        />
                        {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
                    </div>
                </div>

                {message && (
                    <div className={`mt-6 text-center p-3 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="mt-6 bg-gradient-to-b from-[#00B4D8] to-[#0096C7] text-white p-3 text-lg w-full flex items-center justify-center rounded-md hover:shadow-xl transition-all duration-200 hover:to-[#00B4D8] hover:from-[#0096C7] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                </button>

                <p className="text-center mt-6 text-sm">
                    Não tem uma conta?
                    <Link to="/cadastro" className="ml-1 font-medium text-[#0096C7] hover:text-[#00B4D8]">
                        Cadastre-se
                    </Link>
                </p>
            </form>
        </main>
    );
}