import { useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Input } from "../../components/Input";
import { PageHeader } from "../../components/PageHeader";
import { TextArea } from "../../components/TextArea";
import warningIcon from '../../assets/icons/warning.svg';
import { Button } from "../../components/Button";

import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

import api from "../../services/api";

import { AxiosError } from 'axios';


interface TeacherFormData {
    name: string;
    email: string;
    password: string;
    avatar: string;
    whatsapp: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
    bio: string;
}

const createUserSchema = z.object({
    name: z.string().min(1, "Nome completo é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    avatar: z.string().url("Avatar deve ser uma URL válida"),
    whatsapp: z.string().min(10, "WhatsApp é obrigatório"),
    instagram: z.string().url("Instagram deve ser uma URL válida").optional(),
    facebook: z.string().optional(),
    youtube: z.string().optional(),
    bio: z
        .string()
        .min(1, { message: "Biografia é obrigatória" }) 
        .min(150, { message: "Biografia deve ter pelo menos 50 caracteres"}), 
});

export function SignUp() {
    const navigate = useNavigate(); 
    const [emailAlreadyRegistered, setEmailAlreadyRegistered] = useState('')
    const methods = useForm<TeacherFormData>({
        resolver: zodResolver(createUserSchema)
    });

    const onSubmit: SubmitHandler<TeacherFormData> = async (data) => {
        try {
            const response = await api.post('/create-user', {
                name: data.name,
                avatar: data.avatar,
                whatsapp: data.whatsapp,
                bio: data.bio,
                email: data.email,
                password: data.password,
                instagram: data.instagram || null,
                facebook: data.facebook || null, 
                youtube: data.youtube || null,
            });
    
            const user = response.data.userData;

            setEmailAlreadyRegistered('')

            saveUserOnAsyncStorage(user)

            console.log('Usuário cadastrado com sucesso user id: ' + JSON.stringify(user));
    
        } catch (error) {
            
            if (error instanceof AxiosError) {
                
                const errorMessage = error.response?.data?.message || 'Unknown error occurred';
                setEmailAlreadyRegistered(errorMessage)
                //console.error("There was an error creating the connection:", errorMessage);
            } else {
                
                console.error("There was an error creating the connection:", error);
            }
        }
    };

    async function saveUserOnAsyncStorage(data: TeacherFormData) {
        try {
            const userData = JSON.stringify(data)
            localStorage.setItem('proffy:user', userData)
            navigate('/give-classes')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const userData = localStorage.getItem('proffy:user')
        if(userData) {
            
            navigate('/give-classes')
        }
    },[])

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col h-full w-full items-center justify-center">
                <PageHeader
                    title='Que íncrivel que você quer dar aula!'
                    description="O primeiro passo, é criar seu perfil"
                />
                <main className="bg-box_base w-full max-w-4xl -mt-14 mb-14 rounded-sm overflow-hidden">
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <fieldset className="border-0 py-0 px-10">
                            <legend className="font-semibold text-4xl font-archivo text-text_title flex items-center 
                                justify-between w-full pb-6 border-b border-solid border-line_in_white pt-14 p-10">
                                Seus dados
                            </legend>
                            <Input
                                label="Nome completo"
                                name="name"
                                color="text-text_complement"
                                error={emailAlreadyRegistered}
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                color="text-text_complement"
                                
                            />
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                color="text-text_complement"
                            />
                            <Input
                                label="Avatar"
                                name="avatar"
                                type="url"
                                color="text-text_complement"
                            />
                            <Input
                                label="WhatsApp"
                                name="whatsapp"
                                type="tel"
                                color="text-text_complement"
                            />
                            <Input
                                label="Instagram"
                                name="instagram"
                                type="url"
                                color="text-text_complement"
                            />
                            <Input
                                label="YouTube"
                                name="youtube"
                                type="url"
                                color="text-text_complement"
                            />
                            <TextArea
                                label="Biografia"
                                name="bio"
                                color="text-text_complement"
                            />
                        </fieldset>
                        <footer className="py-16 px-8 bg-box_footer border-t border-solid border-line_in_white 
                            w-full md:flex md:justify-center md:items-center">
                            <p className="flex items-center justify-center text-xl 
                            leading-8 text-text_complement w-full md:flex">
                                <img src={warningIcon} alt="Aviso importante" className="mr-4"/>
                                Importante <br/>
                                Preencha todos os dados
                            </p>
                            <Button label="Salvar cadastro" type="submit"/>
                        </footer>
                    </form>
                </main>
            </div>
        </FormProvider>
    );
}
