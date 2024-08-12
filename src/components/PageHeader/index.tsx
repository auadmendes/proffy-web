import { Link } from "react-router-dom";

import backIcon from '../../assets/icons/back.svg';
import logo from '../../assets/images/logo.svg';

interface HeaderProps {
    title: string;
    user?: string;
    description?: string;
    children?: React.ReactNode;
}

export function PageHeader({title, user, description, children}: HeaderProps) {

    function handleLogOff() {
        localStorage.removeItem('proffy:user')
    }

    return (
        <header className="w-full flex flex-col bg-primary">
            <div className="top-bar-container w-[90%] my-0 mx-auto flex justify-between items-center 
            text-text_in_primary p-6">
                <Link className="h-1 transition-opacity hover:opacity-60" to={'/'}>
                    <img src={backIcon} alt="voltar" />
                </Link>
                <div className="flex gap-4">
                    <img className="h-6" src={logo} alt="proffy" /> 

                    {user ? (
                        <button 
                            className="text-title_in_primary flex gap-2"
                            onClick={handleLogOff}
                        >
                            <span>{user}</span>
                            <span>Sair</span>
                        </button>
                    )
                    : (
                        <Link to={'/Login'}>
                            <span>Login</span>
                        </Link>
                    )
                    }
                </div>
            </div>
            <div className="header-content max-w-4xl relative my-12 mx-auto p-4 lg:p-0">
                <strong 
                className="font-bold font-archivo leading-snug text-5xl text-title_in_primary"
                >
                    {title}
                    { description && 
                        <p className="font-normal text-base max-w-md text-text_in_primary mt-9 mb-10">
                            {description}
                        </p>
                    }
                </strong>
                {children}
            </div>
            
        </header>
    )
}