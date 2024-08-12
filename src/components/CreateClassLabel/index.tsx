
import { Select } from "../Select";


type ClassProp = {
    id: string;
    subject: string;
    onSubjectChange?: (selectedSubject: string) => void;
}

type CreateClassLabelProps = {
    classObject: ClassProp[];
}

export function CreateClassLabel({ classObject }: CreateClassLabelProps) {
    

    return (
        <fieldset className="border-0 py-0 px-10 mt-24 mb-24">
            <legend className="font-semibold text-4xl font-archivo text-text_title mb-9 flex items-center 
                justify-between w-full pb-6 border-b border-solid border-line_in_white">
                Sobre a aula
            </legend>
            <Select
                name="subject" 
                label="Matéria" 
                color="text-text_complement"
                
                options={classObject?.map(cls => ({
                    key: cls.id,
                    value: cls.id,
                    label: cls.subject,
                })) || []}
            />
            
        </fieldset>
    );
}
