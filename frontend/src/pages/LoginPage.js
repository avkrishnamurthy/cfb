import Login from '../components/Login'

export default function LoginPage({onLogin}) {
    return (
        <>
            <Login onLogin={onLogin}/>
            <h2>Login Page</h2>
        </>
    )
}