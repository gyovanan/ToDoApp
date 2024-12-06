import React, { useState } from 'react';

function AddNote() {
  const [note, setNote] = useState('');
  const [dueDate, setDueDate] = useState(''); // Estado para armazenar a data de vencimento
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const addNote = () => {
    if (note.trim() && dueDate.trim()) {
      const newNote = {
        text: note,
        completed: false,
        id: Date.now(),
        dueDate: new Date(dueDate), // Armazena a data como um objeto Date
      };
      const newNotes = [...notes, newNote];
      setNotes(newNotes);
      localStorage.setItem('notes', JSON.stringify(newNotes));
      setNote('');
      setDueDate('');
    }
  };

  return (
    <div>
      <h2>Adicionar Nova Anotação</h2>
      <input 
        type="text" 
        value={note} 
        onChange={(e) => setNote(e.target.value)} 
        placeholder="Escreva sua nota aqui..."
      />
      <input 
        type="date" 
        value={dueDate} 
        onChange={(e) => setDueDate(e.target.value)} 
        placeholder="Data de vencimento"
      />
      <button onClick={addNote}>Adicionar</button>
    </div>
  );
}

export default AddNote;
