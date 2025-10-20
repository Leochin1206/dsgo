import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';

import { Init } from '../pages/init';
import { Cadastro } from '../pages/cadastro';

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

const renderWithRouter = (initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<Init />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<div>Página Home</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Página de Login (Init.jsx)', () => {

  let user;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  afterEach(() => { });

  describe('Renderização Estática', () => {
    it('1. deve renderizar o logo da DSGO', () => {
      renderWithRouter();
      expect(screen.getByAltText('Logo da plataforma DSGO')).toBeInTheDocument();
    });

    it('2. deve renderizar o título "Fazer Login"', () => {
      renderWithRouter();
      expect(screen.getByRole('heading', { name: /fazer login/i })).toBeInTheDocument();
    });

    it('3. deve renderizar o campo de Email', () => {
      renderWithRouter();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('4. deve renderizar o campo de Senha', () => {
      renderWithRouter();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    });

    it('5. deve renderizar o botão "Entrar"', () => {
      renderWithRouter();
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    it('6. deve renderizar o link "Cadastre-se"', () => {
      renderWithRouter();
      expect(screen.getByRole('link', { name: /cadastre-se/i })).toBeInTheDocument();
    });
  });

  describe('Validação de Formulário', () => {
    it('7. deve mostrar erros de "obrigatório" ao submeter vazio', async () => {
      renderWithRouter();
      const entrarButton = screen.getByRole('button', { name: /entrar/i });

      await user.click(entrarButton);

      expect(await screen.findByText('O e-mail é obrigatório.')).toBeInTheDocument();
      expect(screen.getByText('A senha é obrigatória.')).toBeInTheDocument();
    });

    it('8. deve mostrar erro de padrão de e-mail (formato inválido)', async () => {
      renderWithRouter();
      const emailInput = screen.getByLabelText(/email/i);
      const entrarButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'emailinvalido.com');
      await user.click(entrarButton);

      expect(await screen.findByText('Informe um e-mail válido.')).toBeInTheDocument();
    });

    it('9. deve mostrar erro de validação de e-mail (apenas espaços)', async () => {
      renderWithRouter();
      const emailInput = screen.getByLabelText(/email/i);
      const entrarButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, '   ');
      await user.click(entrarButton);

      expect(await screen.findByText('O e-mail é obrigatório.')).toBeInTheDocument();
    });

    it('10. deve mostrar erro de senha (muito curta)', async () => {
      renderWithRouter();
      const senhaInput = screen.getByLabelText(/senha/i);
      const entrarButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(senhaInput, '12345');
      await user.click(entrarButton);

      expect(await screen.findByText('A senha deve ter no mínimo 6 caracteres.')).toBeInTheDocument();
    });

it('11. deve mostrar erro de validação de senha (apenas espaços)', async () => {
    renderWithRouter();
    const senhaInput = screen.getByLabelText(/senha/i);
    const entrarButton = screen.getByRole('button', { name: /entrar/i });
    await user.type(senhaInput, '       ');
    await user.click(entrarButton);

    expect(await screen.findByText('A senha é obrigatória.')).toBeInTheDocument();
});

    it('12. não deve mostrar erros de validação com dados corretos', async () => {
      mockedAxios.post.mockResolvedValue({ data: {} });
      renderWithRouter();

      await user.type(screen.getByLabelText(/email/i), 'teste@valido.com');
      await user.type(screen.getByLabelText(/senha/i), 'senha123');
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.queryByText('O e-mail é obrigatório.')).not.toBeInTheDocument();
      expect(screen.queryByText('A senha é obrigatória.')).not.toBeInTheDocument();
    });
  });

  describe('Submissão de Formulário (API)', () => {

    it('13. deve chamar axios.post com os dados corretos (e trim no email)', async () => {
      mockedAxios.post.mockResolvedValue({ data: {} });
      renderWithRouter();

      await user.type(screen.getByLabelText(/email/i), '  teste@valido.com  ');
      await user.type(screen.getByLabelText(/senha/i), 'senha123');
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://127.0.0.1:8000/token/',
          expect.any(URLSearchParams),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const formData = mockedAxios.post.mock.calls[0][1];
        expect(formData.get('username')).toBe('teste@valido.com');
        expect(formData.get('password')).toBe('senha123');
      });
    });

    it('14. deve mostrar mensagem de sucesso e navegar para /home (Happy Path)', async () => {
      mockedAxios.post.mockResolvedValue({ data: {} });
      renderWithRouter();

      await user.type(screen.getByLabelText(/email/i), 'teste@valido.com');
      await user.type(screen.getByLabelText(/senha/i), 'senha123');
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();
      expect(await screen.findByText('Login bem-sucedido! Redirecionando...')).toBeInTheDocument();

      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);
      expect(mockedNavigate).toHaveBeenCalledWith('/home');
      vi.useRealTimers();
    });

    it('15. deve mostrar mensagem de erro genérico se a API falhar', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Erro de rede'));
      renderWithRouter();

      await user.type(screen.getByLabelText(/email/i), 'teste@valido.com');
      await user.type(screen.getByLabelText(/senha/i), 'senha123');
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      expect(await screen.findByText('Email ou senha inválidos.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrar/i })).not.toBeDisabled();
    });

    it('16. deve mostrar a mensagem de erro específica do backend (ex: 401)', async () => {

      const apiError = {
        response: {
          data: { detail: 'Email ou senha incorretos' }
        }
      };
      mockedAxios.post.mockRejectedValue(apiError);
      renderWithRouter();

      await user.type(screen.getByLabelText(/email/i), 'errado@valido.com');
      await user.type(screen.getByLabelText(/senha/i), 'senhaErrada');
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      expect(await screen.findByText('Email ou senha incorretos')).toBeInTheDocument();
    });

    it('17. deve navegar para a página de cadastro ao clicar no link', async () => {
      renderWithRouter();
      const registerLink = screen.getByRole('link', { name: /cadastre-se/i });

      await user.click(registerLink);

      expect(screen.getByRole('heading', { name: /criar nova conta/i })).toBeInTheDocument();
    });
  });
});