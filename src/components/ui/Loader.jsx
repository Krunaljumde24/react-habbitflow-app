import React from 'react'
import { HashLoader } from 'react-spinners';

function Loader({ enabled }) {
    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.3)" // optional
    };
    if (enabled)
        return (
            <div style={overlayStyle}>
                <HashLoader color='#7C3AED' />
            </div>
        )
}

export default Loader