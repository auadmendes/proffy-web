import { FormEvent, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Input } from "../../components/Input";
import { PageHeader } from "../../components/PageHeader";
import { Select } from "../../components/Select";
import warningIcon from '../../assets/icons/warning.svg';
import api from "../../services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/Button";

type ClassProps = {
    id: number;
    subject: string;
}

interface AvailabilityFormDataProps {
    subject: string;
    email: string;
    password: string;
    avatar: string;
    whatsapp: string;
    instagram?: string;
    youtube?: string;
    bio: string;
}

interface UserDataProps {
    userId: string;
    name: string;
    avatar: string;
    whatsapp: string;
    bio: string;
    email: string;
    instagram: string | null;
    facebook: string | null;
    youtube: string | null;
}

const createAvailabilitySchema = z.object({
    subject: z.string().min(1, "Nome completo é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    avatar: z.string().url("Avatar deve ser uma URL válida"),
    whatsapp: z.string().min(10, "WhatsApp é obrigatório"),
    instagram: z.string().url("Instagram deve ser uma URL válida").optional(),
    youtube: z.string().url("YouTube deve ser uma URL válida").optional(),
    bio: z
        .string()
        .min(1, { message: "Biografia é obrigatória" }) 
        .min(50, { message: "Biografia deve ter pelo menos 50 caracteres" }), 
});

export function TeacherForm() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserDataProps>({
        userId: "",
        name: "",
        avatar: "",
        whatsapp: "",
        bio: "",
        email: "",
        instagram: null,
        facebook: "",
        youtube: "",
    })
    const [classSubject, setClassSubject] = useState<ClassProps[]>([])
    const [subjectId, setSubjectId] = useState('')
    const [hourlyCost, setHourlyCost] = useState<string>('') // Renamed state to avoid conflict
    const [scheduleItems, setScheduleItems] = useState([
        { week_day: 0, from: '8:00', to: '4:00'}
    ])

    function addNewScheduleItem() {
        setScheduleItems(
            [...scheduleItems,
            { week_day:  0, from: '', to: ''}
        ])
    }

    const methods = useForm<AvailabilityFormDataProps>({
        resolver: zodResolver(createAvailabilitySchema)
    });

    function setScheduleItemValue(position: number, field: string, value: string) {
        const updatedScheduleItems = scheduleItems.map((scheduleItem, index) => {
            if(index === position) {
                return {...scheduleItem, [field]: value}
            }
            return scheduleItem;
        });
        setScheduleItems(updatedScheduleItems)
        console.log(updatedScheduleItems)
    }

    async function handleCreateAvailability(e: FormEvent) {
        e.preventDefault();
    
        const userId = user.userId;
        const classId = Number(subjectId);
        const cost = parseFloat(hourlyCost); // Renamed variable to avoid conflict
    
        // Convert times to HH:mm format
        const formattedScheduleItems = scheduleItems.map(item => {
            const from = convertTimeToMinutes(item.from);
            const to = convertTimeToMinutes(item.to);
            return {
                week_day: Number(item.week_day),
                from,
                to
            };
        });
    
        const data = {
            userId,
            classId,
            cost,
            scheduleItems: formattedScheduleItems
        };

        console.log('>>>>>> ', data)
    
        try {
            await api.post('/availability', data);
            console.log("Availability created successfully:", data);
            navigate('/study')
        } catch (error) {
            console.error("Error creating availability:", error);
        }
    }

    function convertTimeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    
    // function convertTo24HourFormat(time: string): string {
    //     const [timePart, modifier] = time.split(' ');
    //     let [hours, minutes] = timePart.split(':');
    
    //     if (hours === '12') {
    //         hours = '00';
    //     }
    
    //     if (modifier === 'PM') {
    //         hours = String(parseInt(hours, 10) + 12);
    //     }
    
    //     return `${hours}:${minutes}`;
    // }

    useEffect(() => {
        api.get('/classes')
            .then(response => {
                const classes  = response.data;
                setClassSubject(classes);
            })
            .catch(error => {
                console.error("There was an error fetching the classes:", error);
            });
    }, []);

    useEffect(() => {
        const userData = localStorage.getItem('proffy:user')
        if(userData) {
            setUser(JSON.parse(userData))
            console.log(user.userId)
        } else {
            navigate('/login')
        }
    },[user.userId])

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col h-full w-full items-center justify-center">
            <PageHeader
                title='Vamos cadastrar as suas matérias!'
                user={user.name}
                description={`Agora ${user.name} informe as suas matérias e seus melhores horários`}
            />

            <main className="bg-box_base w-full max-w-4xl  -mt-14 mb-14 rounded-sm overflow-hidden">
                <form onSubmit={handleCreateAvailability}>
                    <fieldset className="border-0 py-0 px-10 mt-24 mb-24">
                        <legend className="font-semibold text-4xl font-archivo text-text_title mb-9 flex items-center 
                            justify-between w-full pb-6 border-b border-solid border-line_in_white">
                            Sobre a aula
                        </legend>
                        <Select
                            name="subject" 
                            label="Matéria" 
                            color="text-text_complement"
                            value={subjectId}
                            onChange={(e) => { setSubjectId(e.target.value) }}
                            options={classSubject?.map(item => ({
                                key: item.id,
                                value: item.id.toString(),
                                label: item.subject,
                            })) || []}
                        />
                    </fieldset>

                    <fieldset className="border-0 py-0 px-10 mt-24 mb-24">
                        <Input 
                            name="cost" 
                            label="Custo da sua hora/aula" 
                            color="text-text_complement"
                            value={hourlyCost}
                            onChange={(e) => { setHourlyCost(e.target.value) }} // Use updated state variable
                        />

                        <legend className="font-semibold text-4xl font-archivo text-text_title mb-9 flex items-center 
                            justify-between w-full pb-6 border-b border-solid border-line_in_white">
                            Horários disponíveis
                            
                            <button
                                className="text-xl text-primary font-semibold transition-all hover:text-primary_dark"
                                type="button"
                                onClick={addNewScheduleItem}
                                >
                                + Novo horário
                            </button>
                        </legend>

                            {scheduleItems.map((scheduleItem, index) => {
                                return (
                                    <div key={scheduleItem.week_day} id="schedule-item" className="w-full flex flex-col gap-2 md:flex md:flex-row md:w-full">
                                    <Select 
                                        name="week_day" 
                                        label="Dia"
                                        color="text-text_complement"
                                        value={scheduleItem.week_day}
                                        onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
                                        options={[
                                            {value: '0', label: 'Domingo'},
                                            {value: '1', label: 'Segunda'},
                                            {value: '2', label: 'Terça'},
                                            {value: '3', label: 'Quarta'},
                                            {value: '4', label: 'Quinta'},
                                            {value: '5', label: 'Sexta'},
                                            {value: '6', label: 'Sábado'},
                                        ]}
                                    />
                                    <Input 
                                        name="from" 
                                        label="Das" 
                                        type="time" 
                                        color="text-text_complement"
                                        value={scheduleItem.from}
                                        onChange={e => setScheduleItemValue(index, 'from', e.target.value)}
                                    />
                                    <Input 
                                        name="to" 
                                        label="Até" 
                                        type="time" 
                                        color="text-text_complement"
                                        value={scheduleItem.to}
                                        onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
                                    />
                                    </div>
                                )
                            })}
                    </fieldset>

                    <footer className="bg-line_in_white w-full h-56 flex items-center justify-between px-10">
                        <p className="flex items-center gap-6 text-xl text-text_complement font-semibold">
                            <img src={warningIcon} alt="Aviso Importante" />
                            Importante!
                            <br />
                            Preencha todos os dados
                        </p>
                        <Button
                            label="Salvar cadastro"
                            type="submit" 
                            title="Salvar cadastro"
                            onClick={() => {console.log('test')}} 
                        />
                    </footer>
                </form>
            </main>
            </div>
        </FormProvider>
    )
}

