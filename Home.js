import React, { useState } from "react";
import axios from "axios";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const Home = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);

  const handleSearch = async () => {
    const res = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );
    setBooks(res.data.items || []);
  };

  const saveBook = async (book) => {
    const user = auth.currentUser;
    if (!user) return alert("Login first!");

    const bookRef = doc(db, "users", user.uid, "books", book.id);
    await setDoc(bookRef, {
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
    });
    alert("Book saved!");
  };

  return (
    <div>
      <h1>Google Books Clone</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books..."
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {books.map((book) => (
          <div key={book.id}>
            <h3>{book.volumeInfo.title}</h3>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
            />
            <button onClick={() => saveBook(book)}>Save</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
