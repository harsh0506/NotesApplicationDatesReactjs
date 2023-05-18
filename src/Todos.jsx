import React, { useEffect, useState } from 'react';
import Dexie from 'dexie';
import { Firestore, getFirestore } from 'firebase/firestore';
import { collection, addDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { Button, Modal } from 'antd';
import moment from 'moment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Fuse from 'fuse.js';

async function fetchDataByCondition(condition) {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'todos'), where("userId", "==", "1234")));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Return the retrieved data
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error
        throw error;
    }
}

function TodoList({ date, userId }) {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [DatE, setDate] = useState()
    const [value, setValue] = React.useState();
    const [searchQuery, setSearchQuery] = useState('');
    let filteredTodos
    const [FT , setFT] = useState()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        addTodo()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Initialize Fuse.js with your todo data

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                setDate(date)

                const todoExistsInIndexedDB = await checkIfTodoExistsInIndexedDB();

                if (todoExistsInIndexedDB) {
                    const indexedDBTodos = await getTodosFromIndexedDB();
                    console.log('Todos fetched from IndexedDB:', indexedDBTodos);
                    setTodos(indexedDBTodos);
                } else {
                    const firestoreTodos = await fetchTodosFromFirestore();
                    console.log('Todos fetched from Firestore:', firestoreTodos);
                    setTodos(firestoreTodos);
                    saveTodosToIndexedDB(firestoreTodos);
                    console.log('Todos saved to IndexedDB.');
                }

            }
            catch (err) { console.log(err) }

        };

        fetchTodos();
    }, []);


    // Perform search and filtering when the search query or selected date changes
    const performSearchAndFilter = () => {

        const fuse = new Fuse(todos, {
            keys: ['todo'],
            threshold: 0.3,
        });
        const searchResults = fuse.search(searchQuery);
        setFT(searchResults.map((result) => result.item))
    };

    const checkIfTodoExistsInIndexedDB = async () => {
        const db = new Dexie('TodoDB');
        db.version(1).stores({ todos: '++id' });

        const todos = await db.todos.toArray();
        return todos.length > 0;
    };

    const getTodosFromIndexedDB = async () => {
        const db = new Dexie('TodoDB');
        db.version(1).stores({ todos: '++id' });

        const todos = await db.todos.toArray();

        return todos;
    };

    const fetchTodosFromFirestore = async () => {

        try {
            const querySnapshot = await getDocs(query(collection(db, 'todos'), where("userId", "==", userId)));
            const todos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            // Return the retrieved data
            return todos;
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle the error
            throw error;
        }
    };

    const saveTodosToIndexedDB = async (todos) => {
        const db = new Dexie('TodoDB');
        db.version(1).stores({ todos: '++id' });
        try {
            if (Array.isArray(todos)) {
                await db.todos.bulkAdd(todos);
                console.log('Todos saved to IndexedDB:', todos);
            } else {
                await db.todos.add(todos);
                console.log('Todo saved to IndexedDB:', todos);
            }
        } catch (error) {
            console.error('Error saving todo to IndexedDB:', error);
            // Handle the error
        }
    };

    const deleteTodo = async (id) => {
        try {
            // Delete the todo from Firestore
            await deleteDoc(doc(db, 'todos', id));

            // Remove the todo from the state
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

            // Remove the todo from IndexedDB
            await deleteTodoFromIndexedDB(id);

            console.log('Todo deleted:', id);
        } catch (error) {
            console.error('Error deleting todo:', error);
            // Handle the error
        }
    };

    const deleteTodoFromIndexedDB = async (id) => {
        const db = new Dexie('TodoDB');
        db.version(1).stores({ todos: '++id' });

        try {
            await db.todos.delete(id);
            console.log('Todo deleted from IndexedDB:', id);
        } catch (error) {
            console.error('Error deleting todo from IndexedDB:', error);
            // Handle the error
        }
    };


    const addTodo = async () => {
        const newTodoObj = {
            todo: newTodo,
            status: 'pending',
            createdAt: new Date().toISOString(),
            dateOfSubmission: new Date(value).toISOString(),
            sentiment: '',
            userId: userId,
        };

        try {
            const docRef = await addDoc(collection(db, 'todos'), newTodoObj);
            const addedTodo = { ...newTodoObj, id: docRef.id };
            await saveTodosToIndexedDB(addedTodo);

            setTodos((prevTodos) => [...prevTodos, addedTodo]);
            setNewTodo('');
        } catch (error) {
            console.log(error)
        }


    };

    filteredTodos = date
        ? todos.filter((todo) => {
            const todoDate = new Date(todo.dateOfSubmission);
            const selectedDate = new Date(date);

            return (
                todoDate.getFullYear() === selectedDate.getFullYear() &&
                todoDate.getMonth() === selectedDate.getMonth() &&
                todoDate.getDate() - 1 === selectedDate.getDate()
            );
        })
        : todos.filter((todo) => {
            const todoDate = new Date(todo.dateOfSubmission);
            const selectedDate = new Date();

            return (
                todoDate.getFullYear() === selectedDate.getFullYear() &&
                todoDate.getMonth() === selectedDate.getMonth() &&
                todoDate.getDate() - 1 === selectedDate.getDate()
            );
        })

    // Rest of your component code

    return (
        <div class="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
            <div style={{ maxWidth: "40vw" }} class="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
                <div class="mb-4">
                    <h1 class="text-[#063c76]">Todo List</h1>
                    <div class="flex mt-4">
                        <input onChange={(e) => setSearchQuery(e.target.value)} class="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker" style={{ background: "#1a1a1a" }} placeholder="Search Todo" />
                        <button onClick={() => performSearchAndFilter(searchQuery)} style={{ marginRight: 15 }} class="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>

                        <button onClick={showModal} style={{ marginRight: 15 }} class="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>

                    </div>
                </div>
                <div >

                    {filteredTodos && filteredTodos.length > 0 ? (
                        filteredTodos.map((todo) => (
                            <div key={todo.id} class="flex mb-4 items-center">

                                <p style={{ fontSize: 20, fontWeight: 400 }} class="w-full text-[#063c76]">{todo.todo}</p>
                                <button class="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green border-green hover:bg-green">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                                <button onClick={() => deleteTodo(todo.id)} class="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        ))
                        
                    ) : (
                        <p>No todos found</p>
                    )}
                   
                    <Modal style={{ color: "#3b82f680" }} title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <div style={{ flexDirection: "column" }} class="flex mb-4 items-center">
                            <input
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                style={{ background: "#3b82f680", padding: 18, marginTop: 10, marginBottom: 20, minWidth: "68vh" }}
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                            />
                            <DateTimePicker
                                label="Choose Submission Date"
                                value={value}
                                onChange={(newValue) => setValue(newValue._d)}
                            />
                        </div>

                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default TodoList;