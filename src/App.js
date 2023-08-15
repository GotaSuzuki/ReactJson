import './App.css';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3001/todos');
      const datum = await res.json();
      setTodos(datum);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };


  const handleDelete = async (id) => {
    try {
      const response = await fetch('http://localhost:3001/todos/' + id, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Todoが削除されました。');
        await fetchData(); // データを再取得
      } else {
        console.error('Todoの削除に失敗しました。');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  const handleAdd = async () => {
    const newTodo = {
      text: inputValue,
      id: uuidv4(),
    };

    try {
      const response = await fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        console.log('Todoが追加されました。');
        await fetchData(); // データを再取得
      } else {
        console.error('Todoの追加に失敗しました。');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }

    setInputValue('');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button onClick={handleAdd}>追加</button>
      </div>
      <div>
        {todos.map((todo) => (
          <div key={todo.id}>
            <p>{todo.text}</p>
            <button onClick={() => handleDelete(todo.id)}>削除</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
