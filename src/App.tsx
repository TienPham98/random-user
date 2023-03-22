import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store/store";
import { fetchUsers } from "./features/userSlice";
import UserTable from "./components/UserTable";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { users, isLoading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUsers(1));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="ring">
        Loading
        <span className="loading"></span>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <UserTable users={users} />;
}

export default App;
