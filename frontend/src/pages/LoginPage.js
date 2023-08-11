import Login from '../components/Login'

export default function LoginPage({onLogin}) {
    return (
        <>
            <Login onLogin={onLogin}/>
        </>
    )
}