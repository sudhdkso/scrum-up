"use client";

import User from "../../models/user";
import { createUser } from "../../lib/user";
import React, { useState } from "react";

export default function CreateUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [kakaoId, setKakaoId] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await createUser(name, email, kakaoId);
      setMessage(`User created with ID: ${data.user._id}`);
      setName("");
      setEmail("");
      setKakaoId("");
    } catch (error) {
      setMessage("Error creating user");
    }
  }
  return (
    <div>
      <h1>Create User</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <button type="submit">Create</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
