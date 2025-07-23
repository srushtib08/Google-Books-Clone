import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Library = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchSavedBooks = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const colRef = collection(db, "users", user.uid, "books");
      const snapshot = await getDocs(colRef);
      setBooks(snapshot.docs.map((doc) => doc.data()));
    };

    fetchSavedBooks();
  }, []);

  return (
    <div>
      <h2>Your Library</h2>
      {books.map((book, i) => (
        <div key={i}>
          <h4>{book.title}</h4>
          <p>{book.authors.join(", ")}</p>
          <img src={book.thumbnail} alt={book.title} />
        </div>
      ))}
    </div>
  );
};

export default Library;
