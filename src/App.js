import React, { useState, useEffect, useRef } from 'react';  // Adicionando useRef
import './App.css';  
import './themes.css';  

// Constantes para evitar strings "hardcoded"
const FILTROS = {
  TODOS: 'todos',
  CONCLUIDAS: 'concluidas',
  NAO_CONCLUIDAS: 'nao-concluidas',
};

// Funções auxiliares para manipular o localStorage
const salvarNoLocalStorage = (chave, valor) => {
  localStorage.setItem(chave, JSON.stringify(valor));
};

const obterDoLocalStorage = (chave, valorDefault) => {
  return JSON.parse(localStorage.getItem(chave)) || valorDefault;
};

// Funções para manipular as notas
const validarNota = (nota) => {
  return nota.trim() !== '';
};

const atualizarNotas = (notas, setNotas) => {
  salvarNoLocalStorage('notas', notas);
  setNotas(notas);
};

function App() {
  const [notas, setNotas] = useState([]);
  const [nota, setNota] = useState('');
  const [filtro, setFiltro] = useState(FILTROS.TODOS);
  const [tema, setTema] = useState('theme-default');
  const [fonte, setFonte] = useState('font-helvetica');
  
  const [usuario, setUsuario] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [idadeUsuario, setIdadeUsuario] = useState('');
  const [erroUsuario, setErroUsuario] = useState('');
  const [erroCadastro, setErroCadastro] = useState('');
  const [modoCadastro, setModoCadastro] = useState(false);

  const [showTemas, setShowTemas] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const menuRef = useRef(null);  // Criando referência para o menu lateral
  const hamburgerRef = useRef(null);  // Referência para o ícone de hambúrguer

  // Carregar dados do localStorage
  useEffect(() => {
    const notasSalvas = obterDoLocalStorage('notas', []);
    setNotas(notasSalvas);
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(usuarioSalvo);
    }

    // Fechar o menu se o clique for fora do menu lateral
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !hamburgerRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);  // Apenas na primeira renderização

  // Funções de alternar tema e fonte
  const alternarTema = (novoTema) => setTema(novoTema);
  const alterarFonte = (novaFonte) => setFonte(novaFonte);
  
  // Função para salvar nota
  const salvarNota = () => {
    if (validarNota(nota)) {
      const novasNotas = [...notas, { texto: nota, concluida: false }];
      atualizarNotas(novasNotas, setNotas);
      setNota('');
    }
  };

  // Função para concluir nota
  const concluirNota = (index) => {
    if (notas[index]) {
      const novasNotas = [...notas];
      novasNotas[index].concluida = !novasNotas[index].concluida;
      atualizarNotas(novasNotas, setNotas);
    }
  };

  // Função para deletar nota
  const deletarNota = (index) => {
    const novasNotas = notas.filter((_, i) => i !== index);
    atualizarNotas(novasNotas, setNotas);
  };

  // Função para filtrar notas
  const filtrarNotas = () => {
    switch (filtro) {
      case FILTROS.CONCLUIDAS: return notas.filter(nota => nota.concluida);
      case FILTROS.NAO_CONCLUIDAS: return notas.filter(nota => !nota.concluida);
      default: return notas;
    }
  };

  // Função de login
  const fazerLogin = () => {
    const usuariosRegistrados = obterDoLocalStorage('usuariosRegistrados', []);
    if (nomeUsuario.trim()) {
      if (usuariosRegistrados.includes(nomeUsuario)) {
        setErroUsuario('');
        setUsuario(nomeUsuario);
        localStorage.setItem('usuario', nomeUsuario);
      } else {
        setErroUsuario("Esse nome de usuário não está registrado. Por favor, crie uma conta.");
      }
    } else {
      setErroUsuario("Por favor, insira um nome de usuário.");
    }
  };

  // Função de cadastro
  const fazerCadastro = () => {
    const usuariosRegistrados = obterDoLocalStorage('usuariosRegistrados', []);
    if (nomeUsuario.trim() && idadeUsuario.trim()) {
      if (usuariosRegistrados.includes(nomeUsuario)) {
        setErroCadastro("Esse nome de usuário já está em uso. Escolha outro.");
      } else {
        usuariosRegistrados.push(nomeUsuario);
        salvarNoLocalStorage('usuariosRegistrados', usuariosRegistrados);
        localStorage.setItem('usuario', nomeUsuario);
        localStorage.setItem('idade', idadeUsuario);
        setUsuario(nomeUsuario);
        setModoCadastro(false);
        setErroCadastro('');
      }
    } else {
      setErroCadastro("Por favor, preencha o nome de usuário e idade.");
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('idade');
    setUsuario(null);
  };

  // Se o usuário não estiver logado, exibe a tela de login ou cadastro
  if (!usuario) {
    return (
      <div className="login">
        <h2>{modoCadastro ? "Cadastro" : "Login"}</h2>
        <input
          type="text"
          placeholder="Nome de usuário"
          value={nomeUsuario}
          onChange={(e) => setNomeUsuario(e.target.value)}
        />
        {modoCadastro && (
          <input
            type="number"
            placeholder="Idade"
            value={idadeUsuario}
            onChange={(e) => setIdadeUsuario(e.target.value)}
          />
        )}
        {erroUsuario && <p className="erro">{erroUsuario}</p>}
        {erroCadastro && <p className="erro">{erroCadastro}</p>}
        <button onClick={modoCadastro ? fazerCadastro : fazerLogin}>
          {modoCadastro ? "Cadastrar" : "Entrar"}
        </button>
        <button onClick={() => setModoCadastro(!modoCadastro)}>
          {modoCadastro ? "Já tenho uma conta" : "Cadastrar-se"}
        </button>
      </div>
    );
  }

  const idade = localStorage.getItem('idade');

  return (
    <div className={`App ${tema} ${fonte}`}>
      <h1>Bem-vindo, {usuario} (Idade: {idade})</h1>

      {/* Menu Hambúrguer */}
      <div className="menu-hamburger" onClick={() => setMenuAberto(!menuAberto)} ref={hamburgerRef}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <div ref={menuRef} className={`menu-lateral ${menuAberto ? 'show' : ''}`}>
        <button onClick={() => setShowTemas(!showTemas)}>
          {showTemas ? 'Fechar Tema' : 'Temas'}
        </button>
        {showTemas && (
          <div className="temas">
            <button onClick={() => alternarTema('theme-light')}>Claro</button>
            <button onClick={() => alternarTema('theme-dark')}>Escuro</button>
            <button onClick={() => alternarTema('theme-pink')}>Rosa</button>
            <button onClick={() => alternarTema('theme-red')}>Vermelho</button>
            <button onClick={() => alternarTema('theme-default')}>Padrão</button>
          </div>
        )}

        {/* Botão de Logout */}
        <button onClick={logout}>Sair</button>
      </div>

      <div className="notas-container">
        {/* Caixa de Texto para digitar a nota */}
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Digite sua nota aqui..."
        />
        <button onClick={salvarNota}>Salvar Nota</button>
      </div>

      <div className="filtros">
        <button onClick={() => setFiltro(FILTROS.TODOS)}>Todas</button>
        <button onClick={() => setFiltro(FILTROS.CONCLUIDAS)}>Concluídas</button>
        <button onClick={() => setFiltro(FILTROS.NAO_CONCLUIDAS)}>Não Concluídas</button>
      </div>

      <div className="notas-lista">
        {filtrarNotas().map((nota, index) => (
          <div key={index} className={nota.concluida ? 'nota-concluida' : ''}>
            <span>{nota.texto}</span>
            <button onClick={() => concluirNota(index)}>
              {nota.concluida ? 'Desmarcar' : 'Concluir'}
            </button>
            <button onClick={() => deletarNota(index)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
