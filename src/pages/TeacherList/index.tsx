import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { Input } from "../../components/Input";
import { PageHeader } from "../../components/PageHeader";
import { Select } from "../../components/Select";

import { TeacherItem } from "../../components/TeacherItem";
import api from "../../services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


type ClassProps = {
    id: number;
    subject: string;
}

type AvailabilityProps = {
    id: string;
    day: number;
    startTime: number;
    endTime: number;
    cost: number;
    user: {
        id: string;
        name: string;
        bio: string;
        avatar: string;
        whatsapp: string;
        email: string;
        connectionsCount: number | null;
    },
    class: {
        id: number | null;
        subject: string | null;
    }
}

interface searchDataProps {
    subject: string;
    week_day: string;
    time: string;
}

const searchClassSchema = z.object({
    subject: z.string().nullable(),
    week_day: z.string().nullable(),
    time: z.string().nullable(),
});

export function TeacherList() {
    const [classSubject, setClassSubject] = useState<ClassProps[]>([])
    const [classId, setClassId] = useState('')
    const [weekDay, setWeekDay] = useState('')
    const [startTime, setStartTime] = useState('')
    const [availabilities, setAvailabilities] = useState<AvailabilityProps[]>([])

    const methods = useForm<searchDataProps>({
        resolver: zodResolver(searchClassSchema)
    });

    function convertTimeToMinutes(time: string) {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours * 60) + minutes;
    }

    function convertMinutesToTime(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

  

    async function getAvailabilities() {
        const params = new URLSearchParams();
    
        if (classId) params.append('classId', classId);
        if (weekDay) params.append('weekDay', weekDay);
        
        if (startTime) {
            const startTimeInMinutes = convertTimeToMinutes(startTime);
            params.append('classTime', startTimeInMinutes.toString());
        }
    
        const queryString = params.toString();
        const url = `/availability?${queryString}`;
    
        // Reflect the parameters in the browser URL
        window.history.pushState({}, '', `${window.location.pathname}?${queryString}`);
    
        try {
            const response = await api.get(url);
            const responseData = response.data;
    
            const processedData = responseData.map((item: AvailabilityProps) => ({
                ...item,
                startTime: convertMinutesToTime(item.startTime),
                endTime: convertMinutesToTime(item.endTime),
            }));
    
            setAvailabilities(processedData);
        } catch (error) {
            console.error("There was an error fetching the availabilities:", error);
        }
    }

    useEffect(() => {
        getAvailabilities();
    },[classId, weekDay, startTime])


    useEffect(() => {
        api.get('/classes')
            .then(response => {
                const classes  = response.data;
                //console.log(classes)
                setClassSubject(classes);
            })
            .catch(error => {
                console.error("There was an error fetching the classes:", error);
            });
    }, []);


    return (
        <FormProvider {...methods}>
            <div className="flex flex-col h-full w-full items-center justify-center">
            <PageHeader title='Estes são os proffys disponíveis.'>
        

                <form className="justify-center my-auto w-full
                md:-bottom-20 relative md:flex md:items-center">
                    <div className="md:max-w-4xl md:flex md:justify-between md:gap-2">
                    <Select 
                        name="subject" 
                        label="Matéria" 
                        color="text-text_complement"
                        value={classId}
                        options={classSubject?.map(cls => ({
                            key: cls.id,
                            value: cls.id.toString(),
                            label: cls.subject,
                        })) || []}
                        onChange={(e) => setClassId(e.target.value)}
                    />
                    <Select 
                        name="week_day" 
                        label="Dia da semana"
                        value={weekDay}
                        options={[
                            {value: '0', label: 'Domingo'},
                            {value: '1', label: 'Segunda'},
                            {value: '2', label: 'Terça'},
                            {value: '3', label: 'Quarta'},
                            {value: '4', label: 'Quinta'},
                            {value: '5', label: 'Sexta'},
                            {value: '6', label: 'Sábado'},
                        ]}
                        onChange={(e) => setWeekDay(e.target.value)}
                    />
                        <Input 
                            type="time" 
                            name="time" 
                            label="Horário"
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                </form>
            </PageHeader>

            <main className="flex flex-col items-center justify-center p-4">
                {availabilities.map(item => (
                    <TeacherItem
                        key={item.id}
                        avatar={item.user.avatar}
                        bio={item.user.bio}
                        classSubject={item.class.subject}
                        teacherName={item.user.name}
                        whatsApp={item.user.whatsapp}
                        cost={item.cost}
                        connectionsCount={item.user.connectionsCount}
                        startTime={item.startTime}
                        userId={item.user.id}
                    />
                ))}
                
            </main>
            </div>
        </FormProvider>
    )
}