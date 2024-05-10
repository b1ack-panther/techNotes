import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login.jsx";
import DashLayout from "./components/DashLayout.jsx";
import Welcome from "./features/auth/Welcome.jsx";
import UsersList from "./features/users/UsersList.jsx";
import NotesList from "./features/notes/NotesList.jsx";
import EditNote from "./features/notes/EditNote.jsx";
import NewNote from "./features/notes/NewNote.jsx";
import EditUser from "./features/users/EditUser.jsx";
import NewUserForm from "./features/users/NewUserForm.jsx";
import Prefetch from "./features/auth/Prefetch.jsx";
import PersistLogin from "./features/auth/PersistLogin.jsx";
import RequireAuth from "./features/auth/RequireAuth.jsx";
import { ROLES } from "./config/roles.js";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />} />

				<Route path="login" element={<Login />} />

				<Route element={<PersistLogin />}>
					<Route
						element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
					>
						<Route element={<Prefetch />}>
							<Route path="dash" element={<DashLayout />}>
								<Route index element={<Welcome />} />
								<Route path="notes">
									<Route index element={<NotesList />} />
									<Route path=":id" element={<EditNote />} />
									<Route path="new" element={<NewNote />} />
								</Route>

								<Route
									element={
										<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />
									}
								>
									<Route path="users">
										<Route index element={<UsersList />} />
										<Route path=":id" element={<EditUser />} />
										<Route path="new" element={<NewUserForm />} />
									</Route>
								</Route>
							</Route>
						</Route>
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
