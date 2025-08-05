import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
    // Estados del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Función de login (por ahora solo muestra en consola)
    const handleLogin = async () => {
        console.log("Dentro de handleLogin");
        console.log({ email, password });
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
