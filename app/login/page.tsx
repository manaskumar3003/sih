"use client";
import Input from "../components/Input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

interface IData {
  email: string;
  password: string;
}

const defaultData: IData = { email: "", password: "" };

const Login: React.FC = () => {
  const [data, setData] = useState<IData>(defaultData);
  const [error,setError]=useState<string>("");

  const router = useRouter();

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      alert("Please fill all mandatory parameters");
      return;
    }

    try {
      const response = await axios.post('/api/users/login', data);
      setData(defaultData);

      if (response.status === 200) {
        router.push('/profile');
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
        <h1 className="text-3xl mb-4 text-center">Login</h1>
        <form className="space-y-4" onSubmit={onLogin}>
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
            type="submit"
          >
            Sign In
          </button>
          {error && <div className="text-center text-red-700">{error}</div>}
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;