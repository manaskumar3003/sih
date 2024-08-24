"use client";
import Input from "../components/Input";
import { useContext, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IData {
  name: string;
  username: string;
  email:string;
  password: string;
}

const defaultData: IData = { name: "", username: "",email: "", password: "" };

const Register: React.FC = () => {
  const [data, setData] = useState<IData>(defaultData);
  const [error,setError]=useState<string>("");

  const router = useRouter();

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.username || !data.password || !data.name || !data.email) {
      alert("Please fill all mandatory parameters");
      return;
    }

    try {
      const response = await axios.post('/api/users/register', data);
      setData(defaultData);

      if (response.status === 200) {
        router.push('/login');
      }
    } catch (error:any) {
      if(error.response){
        setError(error.response.data.message);
      }
      else{
        setError(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded px-16 pt-8 pb-12 mb-4">
        <h1 className="text-3xl mb-4 text-center">Register</h1>
        <form className="space-y-4" onSubmit={onRegister}>
          <Input
            label="Name"
            id="name"
            type="text"
            value={data.name}
            onChange={onValueChange}
          />
          <Input
            label="Username"
            id="username"
            type="text"
            value={data.username}
            onChange={onValueChange}
          />
          <Input
            label="email"
            id="email"
            type="email"
            value={data.email}
            onChange={onValueChange}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={data.password}
            onChange={onValueChange}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full mb-3"
            type="submit"
          >
            Submit
          </button>
          {error && <div className="text-center text-red-700">{error}</div>}        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;