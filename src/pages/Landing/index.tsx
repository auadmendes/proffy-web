import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import logoImage from '../../assets/images/logo.svg';
import landingImage from '../../assets/images/landing.svg';

import studyIcon from '../../assets/icons/study.svg';
import giveClassIcon from '../../assets/icons/give-classes.svg';
import purpleHeartIcon from '../../assets/icons/purple-heart.svg';
import api from '../../services/api';

export function Landing() {
    const [totalConnections, setTotalConnections] = useState(0)

    useEffect(() => {
        api.get('/connections/count')
        .then(response => {
            const { count } = response.data;
            setTotalConnections(count)
        })
    },[])

    return (
        <div className='w-screen h-screen flex items-center justify-center text-text_in_primary bg-primary px-6'>
            
            <div className='max-w[1100px] md:grid md:grid-rows-1 md:grid-cols-2 md:items-center'>
                
                <div className='logo_container page_landing_content text-center mb-14 flex flex-col items-center justify-center md:gap-2'>
                    <img className='h-36' src={logoImage} alt="" />
                    <h2 className='font-semibold text-1xl leading-loose mt-3'>Sua plataforma de estudos online</h2>
                </div>

                <img 
                    src={landingImage} 
                    alt="Plataforma de estudos" 
                    className='hero_image w-full self-end'
                />

                <div className='buttons_container flex justify-between my-12 mx-0 gap-1 md:mx-10 md:justify-start md:gap-2'>

                    <Link
                        className='px-12 py-8 rounded-sm font-bold font-archivo 
                        flex items-center gap-4 no-underline text-button_text bg-primary_lighter 
                        hover:bg-primary_light transition-all' 
                        to={'./study'}
                    >
                        <img 
                        src={studyIcon} 
                        alt="Estudar" 
                        className='hero_mage'
                        />
                        Estudar
                    </Link>

                    <Link
                    className='px-12 py-8 rounded-sm font-bold font-archivo 
                    flex items-center gap-4 no-underline text-button_text bg-secondary hover:bg-secondary_dark transition-all'
                    to={"/login"}
                    >
                        <img 
                        className='give_classes'
                        src={giveClassIcon} 
                        alt="Dar aula" 
                        />
                        Dar aulas
                    </Link>

                </div>

                <span
                className='total_connections text-sm flex justify-center gap-4 md:justify-end md:pr-10'
                >
                    Total de {totalConnections} conecções realizadas <img className='w-6' src={purpleHeartIcon} alt="Coração roxo" />
                </span>
            </div>
        </div>
    )
}