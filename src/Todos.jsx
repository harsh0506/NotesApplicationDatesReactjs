import React, { useEffect, useState } from 'react';
import Dexie from 'dexie';
import { Firestore, getFirestore } from 'firebase/firestore';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { Button, Modal } from 'antd';
import moment from 'moment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

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

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [value, setValue] = React.useState(moment('2022-04-17T15:30'));


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

    useEffect(() => {
        const fetchTodos = async () => {
            fetchDataByCondition().then(res => console.log(res)).catch(err => console.log(err))

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

        };

        fetchTodos();
    }, []);

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
        const querySnapshot = await getDocs(collection(db, 'todos'));
        const todos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return todos;
    };

    const saveTodosToIndexedDB = async (todos) => {
        const db = new Dexie('TodoDB');
        db.version(1).stores({ todos: '++id' });
        try {
            await db.todos.add(todos);
            console.log('Todo saved to IndexedDB:', todos);
        } catch (error) {
            console.error('Error saving todo to IndexedDB:', error);
            // Handle the error
        }
    };

    const addTodo = async () => {
        const newTodoObj = {
            todo: newTodo,
            status: 'pending',
            createdAt: new Date().toISOString(),
            dateOfSubmission: new Date(value),
            sentiment: '',
            userId: "1234",
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

    // Rest of your component code

    return (
        <div>
            {/* Render input field and button for adding new todos */}

            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <DateTimePicker
                    label="Controlled picker"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                />


            </Modal>

            {/* Render todos */}
            {todos && todos.length > 0 ? (
                todos.map((todo) => (
                    <div key={todo.id}>
                        <p>{todo.todo}</p>
                        <p>{todo.createdAt}</p>
                    </div>
                ))
            ) : (
                <p>No todos found</p>
            )}
        </div>
    );
}

export default TodoList;
