"use client"
import Image from "next/image";
import Todo from "../Components/Todo";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

export default function Home() {

  const [formData,setFormData] = useState({
    title: "",
    description:  "",
  });

  const [todoData,setToDoData] = useState([]);
  const fetchTodos = async () => {
    const response = await axios('/api');
    setToDoData(response.data.todos);
  }

  const deleteTodo = async (id) => {
      const response = await axios.delete('/api',{
        params: {
          mongoId: id
        }
      });
      toast.success(response.data.msg);
      fetchTodos();
  }

  const completeTodo = async (id) => {
      const response = await axios.put('/api',{},{
        params: {
          mongoId: id
        }
      })
      toast.success(response.data.msg);
      fetchTodos(); 
  }

  const undoTodo = async (id) => {
    try {
        const response = await axios.put('/api', {}, {
            params: { mongoId: id, action: 'undo' }
        });
        toast.success(response.data.msg);
        fetchTodos();
    } catch (error) {
        toast.error('Error undoing todo');
    }
};





  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(form => ({...form,[name]:value}));
  }

  useEffect(() => {
    fetchTodos();
  },[])

  useEffect(() => {
    console.log(formData)
  }, [formData]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post('/api',formData);


      toast.success(response.data.msg);
      setFormData({
        title: "",
        description: "",
      });
      await fetchTodos();
    } catch (error) {
      toast.error('Error');
    }
  };

  return (
    <>
      <ToastContainer theme="dark"/>
      <form onSubmit={onSubmitHandler} className="flex items-start flex-col gap-2 w-[80%] max-w-[600px] mt-24 px-2 mx-auto">
        <input value = {formData.title} onChange={onChangeHandler} type="text" name="title" placeholder="Enter Title" className="px-3 py-2 border-2 w-full" />
        <textarea value={formData.description} onChange={onChangeHandler} name="description" placeholder="Enter Description" className="px-3 py-2 border-2 w-full"></textarea>
        <div className="w-full flex justify-end">
          <button type="submit" className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Add Todo
          </button>
        </div>
      </form>
      <div className="relative overflow-x-auto mt-24 w-[60%] mx-auto">
    <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3">
                    ID
                </th>
                <th scope="col" className="px-6 py-3">
                    Title
                </th>
                <th scope="col" className="px-6 py-3">
                    Description
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            {todoData.map((item,index) => {
              return <Todo key={index} id={index} title={item.title} description={item.description} complete={item.isCompleted} mongoId={item._id} deleteTodo = {deleteTodo} completeTodo ={completeTodo} undoTodo={undoTodo}/>
            })}
        </tbody>
    </table>
</div>

    </>
  );
}
