import { Alert } from "./_component/alert"
import { Footer } from "./_component/footer"
import { Header } from "./_component/header"
import Main from "./_component/main"

export default async function Landing(){
    return (
        <div className="flex flex-col min-h-screen">
            <Alert/>
            <Header/>
            <main className="flex-grow flex items-center justify-center">
                <Main/>
            </main>
            <Footer/>
        </div>
    )
}