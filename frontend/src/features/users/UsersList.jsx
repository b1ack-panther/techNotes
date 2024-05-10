import User from "./User.jsx";
import { useGetUsersQuery } from "./usersApiSlice.js";

const UsersList = () => {
	const {
		data: users,
		isLoading,
		isError,
		error,
		isSuccess,
	} = useGetUsersQuery("usersList", {
		refetchOnFocus: true,
		pollingInterval: 60000,
		refetchOnMountOrArgChange: true,
	});

	let content;
	if (isLoading) {
		content = <p>Loading...</p>;
	} else if (isError) {
		content = <p className="errmsg">{error?.data?.message}</p>;
	} else if (isSuccess) {
		const tableContent = users.ids?.length
			? users.ids.map((userId) => <User key={userId} userId={userId} />)
			: null;

		content = (
			<table className="table table--users">
				<thead className="table__thead">
					<tr>
						<th scope="col" className="table__th user__username">
							Username
						</th>
						<th scope="col" className="table__th user__roles">
							Role
						</th>
						<th scope="col" className="table__th user__edit">
							Edit
						</th>
					</tr>
				</thead>
				<tbody>{tableContent}</tbody>
			</table>
		);
	}

	return content;
};

export default UsersList;
