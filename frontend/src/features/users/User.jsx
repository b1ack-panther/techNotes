import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserById, useGetUsersQuery } from "./usersApiSlice";

const User = ({ userId }) => {
	// const user = useSelector((state) => selectUserById(state, userId));
	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[userId]
		})
	})
	const navigate = useNavigate();

	if (user) {
		const handleEdit = () => navigate(`/dash/users/${userId}`);

		const userRolesString = user.roles.toString().replaceAll(",", ", ");
		const cellStatus = user.status ? "" : "table__cell--inactive";
		return (
			<tr className="table__row user">
				<td className={`table__cell ${cellStatus}`}>{user.userName}</td>
				<td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
				<td className={`table__cell ${cellStatus}`}>
					<button className={`icon-button table__button`} onClick={handleEdit}>
						<FontAwesomeIcon icon={faPenToSquare} />
					</button>
				</td>
			</tr>
		);
  }
  else {
		return null;
	}
};

export default User;
