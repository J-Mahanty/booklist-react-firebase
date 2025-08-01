import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';


function Notes({bookId}) {
  
  const handleEraseNote = async(id) => {
    if(confirm('Are you sure you want to erase this note?')) {
      try {
        await deleteDoc(doc(db, "notes", id));
        setNotes(notes.filter(note => note.id != id));  
      } catch (error) {
        alert("Error deleting note. Please try again later");
      }
    }
  }

  const handleAddNote = async(e) => {
    e.preventDefault();

    const newNote = {
      book_id: bookId,
      title: document.querySelector('input[name=title]').value,
      text: document.querySelector('textarea[name=note]').value
    }

    if (newNote.title && newNote.text) {
      try{
        const docRef = await addDoc(collection(db, "notes"), newNote);
        newNote.id = docRef.id;
        setNotes([...notes, newNote]);
        document.querySelector('input[name=title]').value = "";
        document.querySelector('textarea[name=note]').value = "";
      } catch (error) {
        alert("Error adding note");
      }
    } else {
        alert('Please fill the mandatory fields.');
    }

  }

  const fetchNotes = async(book_id) =>{
      try {
        const q = query(collection(db,"notes"), where("book_id", "==", book_id));
        const querySnapshot = await getDocs(q);
        let notesList = [];
        querySnapshot.forEach((doc) => {
          notesList.push({...doc.data(), id: doc.id})
        });

        setNotes(notesList);
        setFetchStatus("success");
  
      } catch (err) {
        console.log(err);
      }
  }

  useEffect(() => {
    if(fetchStatus =='idle'){
      fetchNotes(bookId); 
    }
  }, []);

  const [notes, setNotes] = useState("");
  const [fetchStatus, setFetchStatus] = useState('idle');
  
  return (
    <>

      <div className="notes-wrapper">

        <h2>Reader's Notes</h2>

        {notes.length ?

          <div className="notes">
            {notes.map(note => 
              <div key={note.id} className="note">
                <div onClick={()=>handleEraseNote(note.id)} className="erase-note">Erase note</div>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
              </div>
            )}
          </div>

          : fetchStatus == 'success' ?
        
          <div>
            <p>This books doesn't have notes yet. Use the form below to add a note.</p>
          </div>

          : fetchStatus == 'failed' ?

          <div>
            <p>Error fetching the Notes</p>
          </div>

          :

          <div>
            <p>Loading...</p>
          </div>
        }
        

        <details>
          <summary>Add a note</summary>
          <form className="add-note">
            <div className="form-control">
              <label>Title *</label>
              <input type="text" name="title" placeholder="Add a note title" />
            </div>
            <div className="form-control">
              <label>Note *</label>
              <textarea type="text" name="note" placeholder="Add note" />
            </div>
            
            <button onClick={(e)=>{handleAddNote(e)}}className="btn btn-block">Add Note</button>
          </form>
        </details>

      </div>

    </>
  )
}

export default Notes
  