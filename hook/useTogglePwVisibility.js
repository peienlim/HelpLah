import {useState} from 'react';

export const useTogglePwVisibility = () => {
    const [pwVisibility, setPwVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState('eye');

    const handlePwVisibility = () => {
        if (rightIcon === 'eye') {
            setRightIcon('eye-off');
            setPwVisibility(!pwVisibility);
        } else if (rightIcon === 'eye-off') {
            setRightIcon('eye');
            setPwVisibility(!pwVisibility); 
        }
    };

    return {
        pwVisibility,
        rightIcon,
        handlePwVisibility
    };
}; 