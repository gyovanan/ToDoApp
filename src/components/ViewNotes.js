import React, { useState, useEffect } from 'react';
import NoteItem from './NoteItem';

function ViewNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Recupera as notas salvas no localStorage ao carregar o componente
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes)); // Converte as notas de volta para objetos
    }
  }, []);

  // Função para alternar o estado de conclusão da nota
  const toggleComplete = (id) => {
    const newNotes = notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes)); // Atualiza no localStorage
  };

  // Função para deletar uma nota
  const deleteNote = (id) => {
    const newNotes = notes.filter(note => note.id !== id); // Filtra a nota com o id correspondente
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes)); // Atualiza no localStorage
  };

  return (
    <div>
      <h2>Visualizar Notas Salvas</h2>
      <ul>
        {notes.length > 0 ? (
          notes.map(note => {
            const isOverdue = new Date(note.dueDate) < new Date() && !note.completed;
            return (
              <NoteItem 
                key={note.id} 
                note={note} 
                toggleComplete={() => toggleComplete(note.id)} 
                deleteNote={() => deleteNote(note.id)} 
                isOverdue={isOverdue} // Passa se a nota está vencida
              />
            );
          })
        ) : (
          <li>Nenhuma nota salva</li>
        )}
      </ul>
    </div>
  );
}

export default ViewNotes;
