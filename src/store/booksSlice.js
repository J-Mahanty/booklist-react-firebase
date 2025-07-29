import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db, auth } from '../firebase/config.js';
import { collection, query, where, getDocs, doc, updateDoc} from 'firebase/firestore';

export const booksSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    status: 'idle'
  },
  reducers: {
    addBook: (books, action) => {
      let newBook = action.payload;
      newBook.id = books.length ? Math.max(...books.map(book => book.id)) + 1 : 1;
      books.push(newBook);
    },
    eraseBook: (books, action) => {
        return books.filter(book => book.id != action.payload);
    },
    // toggleRead: (books, action) => {
    //     books.map(book => {
    //       if (book.id == action.payload) {
    //         book.isRead = !book.isRead;
    //       }
    //     });
    // }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBooks.pending, (state, action) => {
        state.status = 'idle'
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed'
        console.log("failed")
      })
      .addCase(toggleRead.fulfilled, (state, action) => {
        state.books.map(book => {
          if(book.id == action.payload) {
            book.isRead = !book.isRead
          }
        })
      })
      .addCase(toggleRead.rejected, (state, action) => {
        state.status = 'failed'
        console.log("failed")
      })
  }
})

export const { addBook, eraseBook } = booksSlice.actions;
export const selectBooks = state => state.books;

export default booksSlice.reducer;

export const fetchBooks = createAsyncThunk('books/fetchBooks' , async() =>{
  const q = query(collection(db,"books"), where("user_id", "==", auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  let bookList = [];
  querySnapshot.forEach((doc) => {
    bookList.push({id: doc.id, ...doc.data()})
  });
  
  return bookList;
});

export const toggleRead = createAsyncThunk('books/toggleRead' , async(payload) =>{
  const bookRef = doc(db, "books", payload.id);
  await updateDoc(bookRef,{
    isRead: !payload.isRead
  });
  return payload.id;
});