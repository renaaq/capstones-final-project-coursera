import React, { useState } from 'react';
import { urlConfig } from '../../config';  // Task 1: importar urlConfig
import { useAppContext } from '../../context/AuthContext'; // Task 2: importar useAppContext
import { useNavigate } from 'react-router-dom'; // Task 3: importar useNavigate
import './RegisterPage.css';

function RegisterPage() {
    // Estados para los inputs del formulario
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Task 4: estado para mensaje de error
    const [showerr, setShowerr] = useState('');

    // Task 5: variables locales para navigate y setIsLoggedIn
    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();

    const handleRegister = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST', // Task 6: método POST
                headers: {
                    'content-type': 'application/json', // Task 7: encabezados
                },
                body: JSON.stringify({  // Task 8: cuerpo con detalles del usuario
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                }),
            });

            const json = await response.json();

            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);
                setIsLoggedIn(true);
                setUserName(firstName);
                setShowerr('');
                navigate('/app'); // Navegar a MainPage después de registro
            } else if (json.error) {
                setShowerr(json.error); // Mostrar error si falla el registro
            }
        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setShowerr("Error de conexión con el servidor");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>
                            Register
                        </button>

                        {/* Mostrar mensaje de error si hay */}
                        {showerr && <div className="text-danger text-center">{showerr}</div>}

                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
