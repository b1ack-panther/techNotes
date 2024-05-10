import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { selectNoteById } from './notesApiSlice';
import { selectAllUsers } from '../users/usersApiSlice';
import EditNoteForm from './EditNoteForm';

const EditNote = () => {
  const { id } = useParams();

  const note = useSelector(state => selectNoteById(state, id));
  const users = useSelector(selectAllUsers);

  const content = users && note ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>
  return content;
}

export default EditNote
