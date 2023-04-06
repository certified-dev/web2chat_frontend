import { createPortal } from 'react-dom'
import React, { useEffect } from 'react'

// @ts-ignore
export default function Modal({ title, open, onClose, children }) {

    // @ts-ignore
    function escHandler({ key }) {

        if (key === 'Escape') {
            onClose()
        }

    }


    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', escHandler);
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('keydown', escHandler);
            }

        };

    }, []);



    if (typeof document !== 'undefined') {
        return createPortal((
            <div className={`fixed inset-0 ${open ? '' : 'pointer-events-none'}`}>

                <div
                    className={`fixed inset-0 bg-black ${open ? 'opacity-50' : 'pointer-events-none opacity-0'} transition-opacity duration-300 ease-in-out`}
                    onClick={onClose}
                />

                <div className={`top-10 left-0 z-[1055] relative w-auto translate-y-[-50px] min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px] rounded bg-white shadow-lg p-4 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'} transition-opacity duration-300 ease-in-out`}>

                    <h1 className="text-xl justify-between flex bg-gray-800 p-3 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 ml-2 text-white">
                            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                        </svg>

                        {title}

                        <button type="button" className="" aria-label="Close" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth="1.5"
                                 stroke="currentColor"
                                 className="h-6 w-6">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </h1>

                    { children }

                </div>

            </div>

        ), document.body)

    } else {
        return null
    }

}

