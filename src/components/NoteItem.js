import React from 'react';

function NoteItem({ note, toggleComplete, deleteNote, isOverdue }) {
  return (
    <li style={{ margin: '10px 0' }}>
      <span style={{ textDecoration: note.completed ? 'line-through' : 'none' }}>
        {note.text}
      </span>
      <span style={{ marginLeft: '10px', fontStyle: 'italic' }}>
        {/* Exibe a data de vencimento */}
        {new Date(note.dueDate).toLocaleDateString()}
      </span>
      {isOverdue && !note.completed && (
        <span style={{ color: 'red', fontWeight: 'bold', marginLeft: '10px' }}>
          Vencido
        </span>
      )}
      <button onClick={toggleComplete}>
        {note.completed ? 'Desmarcar' : 'Completar'}
      </button>
      <button onClick={deleteNote}>Deletar</button>
    </li>
  );
}

export default NoteItem;
