import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { store } from "../../app/store.js";
import { notesApiSlice } from "../notes/notesApiSlice.js";
import { usersApiSlice } from "../users/usersApiSlice.js";

const Prefetch = () => {
	useEffect(() => {
		// console.log("subscribing");
		// const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());
		// const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

		// return () => {
		// 	console.log("Unsubscribing");
		// 	notes.unsubscribe();
		// 	users.unsubscribe();
		// };

		store.dispatch(notesApiSlice.util.prefetch("getNotes", "notesList", { force: true }))
		store.dispatch(usersApiSlice.util.prefetch("getUsers", "usersList", { force: true }))
		
	}, []);
	return <Outlet />;
};

export default Prefetch;
