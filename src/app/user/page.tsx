"use client";

import User, { IUser } from "../../models/user";
import { getUserData } from "@/lib/user";
import React, { useEffect, useState } from "react";

export default function UserPage() {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUserData();
        console.log(data);
        setUsers(data.users);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>사용자 목록</h1>
      <ul>
        {users.map((user: IUser) => (
          <li key={user._id}>
            <b>{user.name}</b> ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
