import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { selectNoteById, useGetNotesQuery } from './notesApiSlice';
import { selectAllUsers, useGetUsersQuery } from '../users/usersApiSlice';
import EditNoteForm from './EditNoteForm';
import { PulseLoader } from 'react-spinners';
import useAuth from '../../hooks/useAuth';

const EditNote = () => {
  const { id } = useParams();
  const { username, isManager, isAdmin } = useAuth();

  const {note} = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id]
    })
  })
  const {users} = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id=>data?.entities[id])
    })
  })

  // console.log("users", users)

  if (!users.length || !note) {
		return <PulseLoader color="#fff" />;
	}

  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return <p className='errmsg'>No Access!</p>
    }
  }

  const content =  <EditNoteForm note={note} users={users} /> 
  return content;
}

export default EditNote
