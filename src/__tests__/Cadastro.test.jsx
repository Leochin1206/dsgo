import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';

import { Cadastro } from '../pages/cadastro';
import { Init } from '../pages/init';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const renderWithRouter = (initialPath = '/cadastro') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<Init />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Página de Cadastro (Cadastro.jsx)', () => {

  let user;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  afterEach(() => { });

  describe('Renderização Estática', () => {
    it('1. deve renderizar o título "Criar nova conta"', () => {
      renderWithRouter();
      expect(screen.getByRole('heading', { name: /criar nova conta/i })).toBeInTheDocument();
    });

    it('2. deve renderizar todos os 8 campos de input', () => {
      renderWithRouter();
      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/número/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/complemento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/pokémon favorito/i)).toBeInTheDocument();
    });

    it('3. deve renderizar o botão "Cadastrar"', () => {
      renderWithRouter();
      expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
    });

    it('4. deve renderizar o link "Faça login"', () => {
      renderWithRouter();
      expect(screen.getByRole('link', { name: /faça login/i })).toBeInTheDocument();
    });

    it('5. o botão "Cadastrar" deve estar habilitado inicialmente', () => {
      renderWithRouter();
      expect(screen.getByRole('button', { name: /cadastrar/i })).not.toBeDisabled();
    });
  });

  describe('Validação de Formulário', () => {

    it('6. deve mostrar erros "obrigatório" para todos os campos obrigatórios', async () => {
      renderWithRouter();

      await user.click(screen.getByRole('button', { name: /cadastrar/i }));
      expect(await screen.findByText('O nome é obrigatório.')).toBeInTheDocument();
      expect(screen.getByText('O e-mail é obrigatório.')).toBeInTheDocument();
      expect(screen.getByText('A senha é obrigatória.')).toBeInTheDocument();
      expect(screen.getByText('A data é obrigatória.')).toBeInTheDocument();
      expect(screen.getByText('O endereço é obrigatório.')).toBeInTheDocument();
      expect(screen.getByText('O número é obrigatório.')).toBeInTheDocument();
    });

    it('7. deve mostrar erro de padrão no "Nome" (números inválidos)', async () => {
      renderWithRouter();
      await user.type(screen.getByLabelText(/nome completo/i), 'Nome123');
      await user.click(screen.getByRole('button', { name: /cadastrar/i }));

      expect(await screen.findByText('O nome deve conter apenas letras.')).toBeInTheDocument();
    });

    it('8. deve mostrar erro de "minLength" no "Nome"', async () => {
      renderWithRouter();
      await user.type(screen.getByLabelText(/nome completo/i), 'Ab');
      await user.click(screen.getByRole('button', { name: /cadastrar/i }));

      expect(await screen.findByText('O nome deve ter no mínimo 3 caracteres.')).toBeInTheDocument();
    });

    it('9. deve mostrar erro de "pattern" no "Email"', async () => {
      renderWithRouter();
      await user.type(screen.getByLabelText(/email/i), 'email-invalido');
      await user.click(screen.getByRole('button', { name: /cadastrar/i }));

      expect(await screen.findByText('Informe um e-mail válido.')).toBeInTheDocument();
    });

    it('10. deve mostrar erro de "minLength" na "Senha"', async () => {
      renderWithRouter();
      await user.type(screen.getByLabelText(/senha/i), '12345');
      await user.click(screen.getByRole('button', { name: /cadastrar/i }));

      expect(await screen.findByText('A senha deve ter no mínimo 6 caracteres.')).toBeInTheDocument();
    });

    it('11. deve mostrar erro de validação na "Data de Nascimento" (data futura)', async () => {
      renderWithRouter();

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      const dateInput = screen.getByLabelText(/data de nascimento/i);
      await user.clear(dateInput);
      await user.type(dateInput, tomorrowString);
      await user.click(screen.getByLabelText(/nome completo/i));

      expect(await screen.findByText('A data de nascimento não pode ser no futuro.')).toBeInTheDocument();
    });

    it('12. deve mostrar erro de validação "apenas espaços" no "Endereço"', async () => {
      renderWithRouter();
      await user.type(screen.getByLabelText(/endereço/i), '     ');
      await user.click(screen.getByRole('button', { name: /cadastrar/i }));

      expect(await screen.findByText('O endereço não pode ser apenas espaços.')).toBeInTheDocument();
    });
  });

  describe('Submissão de Formulário (API)', () => {

    it('13. deve submeter com sucesso, mostrar msg, desabilitar botão e redirecionar', async () => {
      const mockResponse = { data: { nome: 'Usuário Teste' } };
      mockedAxios.post.mockResolvedValue(mockResponse);
      renderWithRouter();

      await user.type(screen.getByLabelText(/nome completo/i), '  Usuário Teste  ');
      await user.type(screen.getByLabelText(/número/i), '123');

      const cadastrarButton = screen.getByRole('button', { name: /cadastrar/i });
      await user.click(cadastrarButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cadastrando/i })).toBeDisabled();
      });
      
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      });

      expect(await screen.findByText(/Usuário "Usuário Teste" cadastrado com sucesso!/i)).toBeInTheDocument();

      vi.useFakeTimers();
      vi.advanceTimersByTime(2000);
      expect(mockedNavigate).toHaveBeenCalledWith('/');
      vi.useRealTimers();
    });

    it('14. deve mostrar mensagem de sucesso e navegar para /home (Happy Path)', async () => {
      mockedAxios.post.mockResolvedValue({ data: {} });
      renderWithRouter();

      await user.type(screen.getByLabelText(/email/i), 'teste@valido.com');
      await user.type(screen.getByLabelText(/senha/i), 'senha123');
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();
      });

      expect(await screen.findByText('Login bem-sucedido! Redirecionando...')).toBeInTheDocument();

      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);
      expect(mockedNavigate).toHaveBeenCalledWith('/home');
      vi.useRealTimers();
    });

    it('15. deve mostrar a mensagem de erro específica do backend (ex: E-mail já cadastrado)', async () => {
      const apiError = {
        response: {
          data: { detail: 'Este e-mail já está cadastrado.' }
        }
      };
      mockedAxios.post.mockRejectedValue(apiError);
      renderWithRouter();

      await user.type(screen.getByLabelText(/nome completo/i), 'Usuário Teste');
      await user.type(screen.getByLabelText(/email/i), 'teste@valido.com');
      await user.type(screen.getByLabelText(/senha/i), 'senha123');
      await user.type(screen.getByLabelText(/data de nascimento/i), '2000-01-01');
      await user.type(screen.getByLabelText(/endereço/i), 'Rua dos Testes');
      await user.type(screen.getByLabelText(/número/i), '123');
      await user.click(screen.getByRole('button', { name: /cadastrar/i }));

      expect(await screen.findByText('Este e-mail já está cadastrado.')).toBeInTheDocument();
    });

    it('16. deve navegar para a página de login ao clicar no link "Faça login"', async () => {
      renderWithRouter();
      await user.click(screen.getByRole('link', { name: /faça login/i }));
      expect(screen.getByRole('heading', { name: /fazer login/i })).toBeInTheDocument();
    });

  });
});