import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import config from '../../config';   // FIXED: Use default export and correct path
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');

    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('auth-token');
    const { setIsLoggedIn } = useAppContext();

    useEffect(() => {
        if (bearerToken) {
            navigate('/app');
        }
    }, [bearerToken, navigate]);

    const handleLogin = async () => {
        try {
            const response = await fetch(`${config.baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const json = await response.json();

            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);
                setIsLoggedIn(true);
                navigate('/app');
            } else {
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
                setIncorrect("Contraseña incorrecta. Intenta de nuevo.");

                setTimeout(() => {
                    setIncorrect("");
                }, 2000);
            }

        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setIncorrect("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Iniciar Sesión</h2>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo electrónico</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Ingresa tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>
                            Iniciar sesión
                        </button>

                        {incorrect && (
                            <span style={{ color: 'red', height: '.5cm', display: 'block', fontStyle: 'italic', fontSize: '12px' }}>
                                {incorrect}
                            </span>
                        )}

                        <p className="mt-4 text-center">
                            ¿Nuevo aquí? <a href="/app/register" className="text-primary">Regístrate aquí</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;