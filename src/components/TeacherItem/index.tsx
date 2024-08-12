import { useState } from 'react';
import whatsAppIcon from '../../assets/icons/whatsapp.svg';
import api from '../../services/api';

type TeacherItemProps = {
    avatar: string;
    teacherName: string;
    classSubject: string | null;
    bio: string;
    whatsApp: string;
    cost: number;
    connectionsCount: number | null;
    startTime: number | null;
    userId: string;
}

type UserCountProps = {
    connectionsCount: number | null
}

export function TeacherItem({
    avatar,
    teacherName, 
    classSubject,
    bio,
    whatsApp,
    connectionsCount, 
    cost,
    startTime,
    userId
}: TeacherItemProps) {

    const [userConnectionsCount, setUserConnectionsCount] = useState<UserCountProps>({
        connectionsCount: connectionsCount 
    });


    async function handleNewConnection(id: string) {
        try {
            const response = await api.post('/connections', { userId: id });

            const userCountData = response.data;

            setUserConnectionsCount(userCountData); 

        } catch (error) {
            console.error("There was an error creating the connection:", error);
        }
    }


    return (
        <article 
            className="bg-box_base border border-solid border-line_in_white 
            rounded-r-md mt-12 overflow-hidden lg:w-[900px] md:max-w-4xl">
                <header className="py-12 px-8 flex items-center gap-8">
                    <img
                    className="w-20 h-20 rounded-full" 
                    src={avatar} 
                    alt=""
                    />
                    <div>
                        <strong className="font-archivo font-semibold block text-text_title">
                            {teacherName}
                        </strong>
                        <span className="text-sm block font-thin"> 
                            {classSubject}
                        </span>
                    </div>
                </header>
                <p className="py-3 px-8 text-lg font-normal font-archivo">
                    {bio} 
                </p>
                    <footer className="py-12 px-4 gap-1 bg-box_footer border-t border-t-solid 
                    border-t-line_in_white flex flex-col  justify-between">
                        
                        <div className="py-12 px-4 gap-1 flex items-center justify-between">

                        
                        <p className="text-sm md:text-lg transition-all">
                            Preço/hora
                            <strong className="tex-lg block text-primary md:inline md:ml-1">
                                R$ {cost}
                            </strong>
                        </p>
                        <button 
                            className="flex items-center justify-evenly gap-2 text-sm md:text-lg
                            h-14 p-6 bg-secondary text-button_text border-0 rounded-md cursor-pointer 
                            font-archivo transition-all hover:bg-secondary_dark"
                            type="button">
                            <img src={whatsAppIcon} alt="WhatsApp" />
                            <a 
                                target='_BLANK'
                                
                                href={`https://whatsa.me/${whatsApp}/?t=Ol%C3%A1,%20estou%20vindo%20do%20Proffy!`}
                                onClick={() => handleNewConnection(userId)}
                            >
                                Entrar em contato
                            </a>
                        </button>
                        </div>

                        <div className='flex justify-between w-full'>
                            <span className="text-sm md:text-lg transition-all">{userConnectionsCount.connectionsCount} conecções</span>
                            <div>
                            <span className="text-sm md:text-lg transition-all">Horário {startTime?.toString()}</span>
                            </div>
                        </div>

                    </footer>
            </article>
    )
}