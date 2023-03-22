import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, setCurrentPage } from "../features/userSlice";
import { RootState, AppDispatch } from "../store/store";
import { User } from "../types/userTypes";

type UserTableProps = {
  users: User[];
};

const UserTable = ({ users }: UserTableProps) => {
  const dispatch: AppDispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state.user.currentPage);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const error = useSelector((state: RootState) => state.user.error);
  const [sortKey, setSortKey] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);

  useEffect(() => {
    if (sortKey) {
      const sorted = [...users].sort((a, b) => {
        if (sortKey === "name") {
          const nameA = `${a.name.title} ${a.name.first} ${a.name.last}`;
          const nameB = `${b.name.title} ${b.name.first} ${b.name.last}`;
          return sortOrder === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        } else if (sortKey === "username") {
          return sortOrder === "asc"
            ? a.login.username.localeCompare(b.login.username)
            : b.login.username.localeCompare(a.login.username);
        }
        return 0;
      });
      setSortedUsers(sorted);
    } else {
      setSortedUsers(users);
    }
  }, [users, sortKey, sortOrder]);

  const handleFetchUsers = (page: number) => {
    dispatch(fetchUsers(page));
    dispatch(setCurrentPage(page));
  };

  const handleSortBy = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const key = event.target.value as keyof User;
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {users.length > 0 && (
        <div className="table-container">
          <select value={sortKey ?? ""} onChange={handleSortBy}>
            <option value="">Sort by</option>
            <option value="name">Full name</option>
            <option value="username">User name</option>
          </select>
          <table>
            <thead>
              <tr>
                <th>
                  Full Name{" "}
                  {sortKey === "name" ? (
                    sortOrder === "asc" ? (
                      <span>&uarr;</span>
                    ) : (
                      <span>&darr;</span>
                    )
                  ) : null}
                </th>
                <th>
                  Username{" "}
                  {sortKey === "username" ? (
                    sortOrder === "asc" ? (
                      <span>&uarr;</span>
                    ) : (
                      <span>&darr;</span>
                    )
                  ) : null}
                </th>
                <th>Thumbnail Icon</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.login.uuid}>
                  <td>
                    {user.name.title} {user.name.first} {user.name.last}
                  </td>
                  <td>{user.login.username}</td>
                  <td>
                    <img src={user.picture.thumbnail} alt="Thumbnail Icon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="button-container">
        <button
          className="previous-button"
          onClick={() => handleFetchUsers(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          className="next-button"
          onClick={() => handleFetchUsers(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;
