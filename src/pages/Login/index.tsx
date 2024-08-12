import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/logo.svg';

import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { AxiosError } from "axios";



const getUserSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type getUserProps = z.infer<typeof getUserSchema> 

export function Login() {
    const navigate = useNavigate()

    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<getUserProps>({
        resolver: zodResolver(getUserSchema)
    });

    async function handleLogin(data: getUserProps) {
        try {
            const response = await api.post('/get-user', {
                email: data.email,
                password: data.password,
            });

            const user = response.data.userData;

            localStorage.setItem('proffy:user', JSON.stringify(user))
            navigate('/give-classes')

        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Unknown error occurred';
                alert(errorMessage);
            } else {
                console.error("There was an error creating the connection:", error);
            }
        }
    }

    return (
        
            <div className='w-screen h-screen flex items-center justify-center text-text_in_primary bg-primary px-6'>
                <div className='max-w-[400px] w-full flex flex-col items-center justify-center'>
                    <div className='logo_container text-center mb-8 flex flex-col items-center justify-center'>
                        <img className='h-36' src={logoImage} alt="Logo" />
                        <h2 className='font-semibold text-xl leading-loose mt-3'>Bem-vindo de volta</h2>
                    </div>

                    <form className='w-full flex flex-col gap-4' onSubmit={handleSubmit(handleLogin)}>
                        <div className="w-full flex flex-col">
                            <input 
                                type='email' 
                                placeholder='E-mail' 
                                className='px-4 py-3 rounded-sm text-text_base bg-input_background placeholder-text_complement focus:outline-none focus:ring-2 focus:ring-primary_light'
                                {...register('email')}
                            />
                            <span>
                                {errors.email && <span className="text-line_in_white text-sm">{errors.email?.message}</span>}
                            </span>
                        </div>

                        <div className="w-full flex flex-col">
                        <input 
                            type='password' 
                            placeholder='Senha' 
                            className='px-4 py-3 rounded-sm text-text_base bg-input_background placeholder-text_complement focus:outline-none focus:ring-2 focus:ring-primary_light'
                            {...register('password')}
                        />
                            <span>
                                {errors.password && <span className="text-line_in_white text-sm">{errors.password?.message}</span>}
                            </span>
                        </div>
                            
                        

                        <button 
                            type='submit' 
                            className='px-4 py-3 rounded-sm font-bold text-button_text bg-primary_lighter hover:bg-primary_light transition-all'
                        >
                            Entrar
                        </button>
                    </form>

                    <div className='flex flex-col gap-2 mt-6 w-full'>
                        <button className='px-4 py-3 rounded-sm font-bold text-button_text bg-[#DB4437] hover:bg-[#C33D2E] transition-all'>
                            Entrar com Google
                        </button>
                        <button className='px-4 py-3 rounded-sm font-bold text-button_text bg-[#0A66C2] hover:bg-[#004182] transition-all'>
                            Entrar com LinkedIn
                        </button>
                        <button className='px-4 py-3 rounded-sm font-bold text-button_text bg-[#000000] hover:bg-[#333333] transition-all'>
                            Entrar com Apple
                        </button>
                    </div>

                    <div className='mt-6'>
                        <Link to="/sign-up" className='text-sm text-proffy hover:text-text_in_primary'>
                            Não tem uma conta? Cadastre-se
                        </Link>
                    </div>
                </div>
            </div>
    );
}
